import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ScanBarcode, Camera, AlertCircle, CheckCircle, XCircle, Search, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = "AIzaSyDYYNbXJ6td2y0I-izcS1QGyAZ2g_ltQE0";
const genAI = new GoogleGenerativeAI(API_KEY);

const NOVA_SYSTEM_PROMPT = `You are Dr. Nova, a clinical nutritionist with expertise in metabolic health. 
Your task is to analyze a food product based on its name, nutrients, and ingredients.
Provide a concise 'Doctor's Verdict':
1. GRADE: Start with a clear rating (e.g., RECOMMENDED, CAUTION, or AVOID).
2. WHY: Explain the primary health impact (e.g., insulin spikes, heart health).
3. PRO TIP: Give one actionable alternative or serving suggestion.
Keep it strictly under 100 words. Use bold text for emphasis. Use professional but encouraging medical tone.`;

export const Scanner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const hasScanned = useRef(false);

    const [scanning, setScanning] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');
    const [aiVerdict, setAiVerdict] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopScan();
        };
    }, []);

    // Separated scanner startup to avoid race conditions with React rendering
    useEffect(() => {
        let isMounted = true;

        const initScanner = async () => {
            // Check for secure context (required for camera access)
            if (!window.isSecureContext && window.location.hostname !== 'localhost') {
                setError("Camera access requires a secure connection (HTTPS).");
                setScanning(false);
                return;
            }

            if (!scanning) return;

            // Wait a brief moment to ensure the video ref is populated after rendering
            if (!videoRef.current) {
                if (isMounted) {
                    console.log("Video ref not ready, retrying...");
                    setTimeout(initScanner, 100);
                }
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                setError("Your browser doesn't support camera features. Please try a modern browser like Chrome or Safari.");
                setScanning(false);
                return;
            }

            if (!codeReaderRef.current) {
                codeReaderRef.current = new BrowserMultiFormatReader();
            }

            try {
                const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (videoDevices.length === 0) {
                    throw new Error("No video input devices found.");
                }

                // Prefer back camera on mobile
                const selectedDevice = videoDevices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('rear')
                ) || videoDevices[0];

                console.log("Starting camera with device:", selectedDevice.label);

                const controls = await codeReaderRef.current.decodeFromVideoDevice(
                    selectedDevice.deviceId,
                    videoRef.current,
                    (result, _err) => {
                        if (!isMounted) return;
                        if (result && !hasScanned.current) {
                            const barcodeText = result.getText();
                            if (barcodeText) {
                                hasScanned.current = true;
                                console.log("Barcode detected:", barcodeText);
                                fetchProduct(barcodeText);
                            }
                        }
                    }
                );

                if (isMounted) {
                    controlsRef.current = controls;
                } else {
                    controls.stop();
                }
            } catch (e: any) {
                console.error("Scanner Error:", e);
                if (isMounted) {
                    let msg = "Could not access camera.";
                    if (e.name === 'NotAllowedError') msg = "Camera access denied. Please allow camera permissions in your browser.";
                    if (e.name === 'NotFoundError') msg = "No camera found on this device.";
                    if (e.name === 'NotReadableError') msg = "Camera is already in use by another application.";
                    setError(msg);
                    setScanning(false);
                }
            }
        };

        if (scanning) {
            initScanner();
        }

        return () => {
            isMounted = false;
        };
    }, [scanning]);

    const startScan = () => {
        setScanning(true);
        setError(null);
        setProduct(null);
        setManualBarcode('');
        hasScanned.current = false;
    };

    const stopScan = () => {
        setScanning(false);
        if (controlsRef.current) {
            controlsRef.current.stop();
            controlsRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const analyzeProductWithAI = async (productData: any) => {
        setIsAiLoading(true);
        setAiVerdict(null);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Product: ${productData.product_name} (${productData.brands})
Nutrients (per 100g): Calories: ${productData.nutriments?.['energy-kcal_100g']}kcal, Sugar: ${productData.nutriments?.sugars_100g}g, Fat: ${productData.nutriments?.fat_100g}g, Protein: ${productData.nutriments?.protein_100g}g.
Ingredients: ${productData.ingredients_text_en || productData.ingredients_text || 'Not listed'}
Nova Group: ${productData.nova_group}

Provide the clinical nutrition verdict according to your instructions.`;

            const result = await model.generateContent([NOVA_SYSTEM_PROMPT, prompt]);
            const response = await result.response;
            setAiVerdict(response.text());
        } catch (err) {
            console.error("AI Analysis failed:", err);
            setAiVerdict("I was unable to complete the AI analysis for this product. However, you can review the nutritional facts below.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const fetchProduct = async (barcode: string) => {
        if (!barcode) return;

        setLoading(true);
        setError(null);
        setProduct(null);
        setAiVerdict(null);

        // Stop scan immediately after detection
        stopScan();

        const tryFetch = async (url: string) => {
            console.log(`Attempting to fetch product from: ${url}`);
            return await axios.get(url, {
                headers: { 'User-Agent': 'HealthScan Pro - WebApp - https://github.com/healthscanpro' },
                timeout: 8000
            });
        };

        try {
            // Try primary domain first
            let response;
            try {
                response = await tryFetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            } catch (primaryErr) {
                console.warn("Primary API failed, trying fallback...", primaryErr);
                // Try fallback domain
                response = await tryFetch(`https://world.openfoodfacts.net/api/v0/product/${barcode}.json`);
            }

            if (response && response.data && response.data.status === 1 && response.data.product) {
                const fetchedProduct = response.data.product;
                setProduct(fetchedProduct);
                analyzeProductWithAI(fetchedProduct);
            } else {
                setError(`Product not found (Status: ${response?.data?.status || '0'}). This barcode may not be in the database yet.`);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError('Connection failed. Please check your internet or try entering the barcode manually.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.length < 8 || !/^\d+$/.test(manualBarcode)) {
            setError('Please enter a valid barcode (at least 8 digits)');
            return;
        }
        fetchProduct(manualBarcode);
    };

    const resetScanner = () => {
        setProduct(null);
        setError(null);
        setManualBarcode('');
        setAiVerdict(null);
        hasScanned.current = false;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">Food Scanner</h2>
                    <p className="text-gray-500">Scan barcodes or enter them manually for instant insights.</p>
                </div>
                <div className="flex gap-2">
                    {product && !scanning && (
                        <Button onClick={resetScanner} variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
                            New Scan
                        </Button>
                    )}
                    {!scanning ? (
                        <Button onClick={startScan} icon={<Camera className="w-5 h-5" />}>Start Camera</Button>
                    ) : (
                        <Button onClick={stopScan} variant="danger" icon={<XCircle className="w-5 h-5" />}>Stop Camera</Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Scanner & Manual Input */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Scanner View */}
                    <Card className="aspect-[3/4] p-0 relative bg-black flex items-center justify-center overflow-hidden border-teal-500/20 shadow-teal-500/10">
                        {scanning ? (
                            <>
                                <video
                                    ref={videoRef}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    muted
                                    playsInline
                                    autoPlay
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-48 border-2 border-primary/50 rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
                                        {/* Animated Scan Line */}
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 w-full h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] opacity-70"
                                        />
                                    </div>
                                </div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
                                    Align barcode within frame
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <ScanBarcode className="w-16 h-16 mx-auto mb-4 text-primary opacity-40" />
                                <p className="text-gray-400 font-medium">Camera is inactive</p>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="mt-4 text-gray-500 hover:text-primary"
                                    onClick={startScan}
                                >
                                    Enable Camera
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Manual Input */}
                    <Card className="bg-slate-50 border-slate-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" />
                            Manual Lookup
                        </h3>
                        <form onSubmit={handleManualSearch} className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter barcode number..."
                                    value={manualBarcode}
                                    onChange={(e) => setManualBarcode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                                    disabled={loading}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">E.g., 3017620422003 for Nutella</p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                variant="secondary"
                                isLoading={loading && !!manualBarcode}
                                disabled={!manualBarcode || loading}
                            >
                                Search Product
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Side: Results View */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center py-12"
                            >
                                <div className="relative w-16 h-16 mb-4">
                                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-primary font-medium animate-pulse">Analyzing Product...</p>
                            </motion.div>
                        )}

                        {error && !loading && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="bg-red-50 border-red-200 text-red-700 flex flex-col items-center gap-4 py-12 text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Product Not Found</h4>
                                        <p className="opacity-80 max-w-xs">{error}</p>
                                    </div>
                                    <Button size="sm" variant="danger" onClick={() => { setError(null); setManualBarcode(''); }}>
                                        Try Again
                                    </Button>
                                </Card>
                            </motion.div>
                        )}

                        {product && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <Card className="flex flex-col sm:flex-row gap-8 bg-white border-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                                    {/* Glassmorphic Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                                    <div className="w-40 h-40 bg-gray-50 rounded-2xl p-4 flex-shrink-0 flex items-center justify-center border border-gray-100 z-10">
                                        <img
                                            src={product.image_front_small_url || product.image_url || 'https://via.placeholder.com/150?text=No+Image'}
                                            alt={product.product_name}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800 leading-tight">{product.product_name}</h3>
                                                <p className="text-gray-500 font-medium">{product.brands || 'Unknown Brand'}</p>
                                            </div>
                                            {/* NutriScore */}
                                            {product.nutriscore_grade && (
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl uppercase shadow-sm ${product.nutriscore_grade === 'a' ? 'bg-emerald-500 text-white' :
                                                    product.nutriscore_grade === 'b' ? 'bg-lime-500 text-white' :
                                                        product.nutriscore_grade === 'c' ? 'bg-yellow-500 text-white' :
                                                            product.nutriscore_grade === 'd' ? 'bg-orange-500 text-white' :
                                                                'bg-red-500 text-white'
                                                    }`}>
                                                    {product.nutriscore_grade}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {product.allergens_tags?.map((tag: string) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100">
                                                    {tag.replace('en:', '').replace('fr:', '').replace('-', ' ')}
                                                </span>
                                            ))}
                                            {product.labels_tags?.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-teal-50 text-teal-600 rounded-lg border border-teal-100">
                                                    {tag.replace('en:', '').replace('fr:', '').replace('-', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                {/* AI Analysis Section */}
                                <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-indigo-900">Dr. Nova's AI Analysis</h4>
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Clinical Nutrition Intelligence</p>
                                        </div>
                                    </div>

                                    {isAiLoading ? (
                                        <div className="flex items-center gap-3 py-4">
                                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                                            <p className="text-sm font-medium text-indigo-600 animate-pulse">Consulting my medical database...</p>
                                        </div>
                                    ) : aiVerdict ? (
                                        <div className="text-sm leading-relaxed text-indigo-800 space-y-2 prose prose-sm max-w-none">
                                            {aiVerdict.split('\n').map((line, i) => (
                                                <p key={i}>
                                                    {line.split('**').map((part, j) => (
                                                        j % 2 === 1 ? <strong key={j} className="font-black text-indigo-950">{part}</strong> : part
                                                    ))}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-indigo-400 italic">No AI analysis available for this item.</p>
                                    )}
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-slate-100">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                            Nutrition Facts (100g)
                                        </h4>
                                        <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl">
                                            <NutrientRow label="Energy" value={product.nutriments?.['energy-kcal_100g']} unit="kcal" />
                                            <NutrientRow label="Total Fat" value={product.nutriments?.fat_100g} unit="g" score={product.nutrient_levels?.fat} />
                                            <NutrientRow label="Sat. Fat" value={product.nutriments?.['saturated-fat_100g']} unit="g" score={product.nutrient_levels?.['saturated-fat']} />
                                            <NutrientRow label="Sugars" value={product.nutriments?.sugars_100g} unit="g" score={product.nutrient_levels?.sugars} />
                                            <NutrientRow label="Salt" value={product.nutriments?.salt_100g} unit="g" score={product.nutrient_levels?.salt} />
                                        </div>
                                    </Card>

                                    <Card className="border-slate-100">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                                            Processing & Additives
                                        </h4>
                                        <div className="space-y-4">
                                            <div className={`flex items-center gap-3 p-3 rounded-xl ${product.nova_group === 4 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                }`}>
                                                {product.nova_group === 4 ? <XCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                                                <div className="text-sm font-bold">
                                                    NOVA {product.nova_group} — {product.nova_group === 4 ? 'Ultra-processed food' : 'Low processing'}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2">Eng. Ingredients</p>
                                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                                                    {product.ingredients_text_en || product.ingredients_text || "Full ingredients list not available in English."}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${product.additives_n > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        <AlertCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">Additives: {product.additives_n || 0}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-mono">CODE: {product.code}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {!product && !loading && !scanning && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <ScanBarcode className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Scan</h3>
                                <p className="text-gray-400 max-w-xs mb-8">
                                    Use your device camera to scan a product barcode or enter the digits manually to see nutritional data.
                                </p>
                                <div className="flex gap-4">
                                    <Button onClick={startScan} variant="primary" icon={<Camera className="w-5 h-5" />}>
                                        Open Camera
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const NutrientRow = ({ label, value, unit, score }: { label: string, value: number, unit: string, score?: string }) => {
    let color = 'bg-gray-200';
    if (score === 'low') color = 'bg-emerald-500';
    if (score === 'moderate') color = 'bg-yellow-500';
    if (score === 'high') color = 'bg-red-500';

    return (
        <div className="flex justify-between items-center text-sm py-2">
            <span className="text-gray-500 font-medium">{label}</span>
            <div className="flex items-center gap-3">
                <span className="font-black text-gray-800">{value !== undefined ? Math.round(value) : '--'}{unit}</span>
                <div className={`w-3 h-3 rounded-full shadow-sm ${color}`} title={score || 'unknown'} />
            </div>
        </div>
    );
};

