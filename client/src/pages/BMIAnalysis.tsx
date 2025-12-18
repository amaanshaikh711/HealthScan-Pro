import { useState } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplets, Flame, BrainCircuit, ChevronRight, BarChart, Zap, PieChart as PieChartIcon } from 'lucide-react';

export const BMIAnalysis = () => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        activity: '1.375'
    });
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateHealth = () => {
        setIsLoading(true);
        // Simulate AI processing time
        setTimeout(() => {
            const weight = parseFloat(formData.weight);
            const height = parseFloat(formData.height);
            const age = parseFloat(formData.age);
            const gender = formData.gender;
            const activity = parseFloat(formData.activity);

            if (!weight || !height || !age) {
                setIsLoading(false);
                return;
            }

            // BMI Calculation
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            let status = 'Normal';
            let color = 'text-green-500';

            if (bmi < 18.5) { status = 'Underweight'; color = 'text-blue-500'; }
            else if (bmi >= 25 && bmi < 29.9) { status = 'Overweight'; color = 'text-yellow-500'; }
            else if (bmi >= 30) { status = 'Obese'; color = 'text-red-500'; }

            // Normal Weight Range calculation (BMI 18.5 - 24.9)
            const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
            const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);

            // BMR (Mifflin-St Jeor)
            let bmr = 10 * weight + 6.25 * height - 5 * age;
            bmr += gender === 'male' ? 5 : -161;

            // TDEE
            const tdee = Math.round(bmr * activity);

            // Water (approx 35ml per kg)
            const water = (weight * 0.033).toFixed(1);
            // Better formula: 0.033 is widely used. Or 30-40ml. 
            // Converting L to ensure proper formatting

            // Macros (Standard balanced: 40% C, 30% P, 30% F)
            const proteinGrams = Math.round((tdee * 0.3) / 4);
            const carbsGrams = Math.round((tdee * 0.4) / 4);
            const fatGrams = Math.round((tdee * 0.3) / 9);

            const prompt = `Create a diet plan based on:\n- Daily Calories: ${tdee} kcal\n- Protein: ${proteinGrams} g\n- Carbs: ${carbsGrams} g\n- Fats: ${fatGrams} g\n- Water Intake: ${water} L/day\nProvide meal-wise breakdown (Breakfast, Lunch, Dinner).`;

            setResult({
                bmi: bmi.toFixed(1),
                status,
                statusColor: color,
                calories: tdee,
                water,
                normalWeightRange: `${minWeight} kg - ${maxWeight} kg`,
                macros: {
                    protein: { value: proteinGrams, percentage: 30, color: 'bg-blue-500', textColor: 'text-blue-500' },
                    carbs: { value: carbsGrams, percentage: 40, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
                    fats: { value: fatGrams, percentage: 30, color: 'bg-green-500', textColor: 'text-green-500' }
                },
                prompt
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Card className="w-full max-w-2xl mx-auto relative overflow-hidden bg-white/80 backdrop-blur-xl shadow-xl border-gray-100">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-2">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Activity className="w-8 h-8" />
                                    </div>
                                    Health Analysis
                                </h2>
                                <p className="text-gray-500 text-lg">Enter your details for a personalized AI assessment.</p>
                            </div>

                            <div className="space-y-6 px-4 pb-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 ml-1">Gender</label>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setFormData({ ...formData, gender: 'male' })}
                                                className={`flex-1 py-3.5 rounded-2xl border-2 transition-all font-semibold ${formData.gender === 'male' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                Male
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, gender: 'female' })}
                                                className={`flex-1 py-3.5 rounded-2xl border-2 transition-all font-semibold ${formData.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' : 'bg-white border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                Female
                                            </button>
                                        </div>
                                    </div>
                                    <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="Height (cm)" type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 175" />
                                    <Input label="Weight (kg)" type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 70" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 ml-1">Activity Level</label>
                                    <div className="relative">
                                        <select
                                            name="activity"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-4 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none transition-all shadow-sm font-medium"
                                            value={formData.activity}
                                            onChange={handleChange}
                                        >
                                            <option value="1.2">Sedentary (Office job, little exercise)</option>
                                            <option value="1.375">Light Activity (1-3 days/week)</option>
                                            <option value="1.55">Moderate Activity (3-5 days/week)</option>
                                            <option value="1.725">Very Active (6-7 days/week)</option>
                                            <option value="1.9">Extra Active (Physical job)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-6 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-2xl"
                                    size="lg"
                                    onClick={calculateHealth}
                                    isLoading={isLoading}
                                    icon={<BrainCircuit className="w-6 h-6" />}
                                >
                                    Generate AI Health Plan
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                        className="w-full space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setResult(null)}
                                className="text-gray-500 hover:text-gray-800 border-gray-200"
                            >
                                ← Recalculate
                            </Button>
                            <h2 className="text-2xl font-bold text-gray-800">Your Personal Analysis</h2>
                            <div className="w-24"></div> {/* Spacer for centering */}
                        </div>

                        {/* Result Section */}
                        <div className="space-y-4">
                            {/* Daily Calories Card */}
                            <Card className="flex flex-col items-center justify-center p-8 bg-white border-0 shadow-lg shadow-orange-500/5 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Flame className="w-24 h-24 rotate-12" />
                                </div>
                                <div className="flex flex-col items-center gap-3 mb-2 relative z-10">
                                    <div className="flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full text-orange-600 mb-1">
                                        <Flame className="w-5 h-5 fill-orange-500" />
                                        <span className="font-bold text-sm uppercase tracking-wide">Daily Target</span>
                                    </div>
                                    <h3 className="text-5xl font-black text-gray-900 tracking-tight">{result.calories} <span className="text-2xl text-gray-400 font-bold">kcal</span></h3>
                                </div>
                                <p className="text-sm font-medium text-gray-500">Recommended daily intake</p>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* BMI Analysis Card */}
                                <Card className="flex flex-col items-center justify-center p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart className="w-5 h-5 text-blue-500" />
                                        <span className="font-bold text-gray-700">BMI Score</span>
                                    </div>
                                    <div className="text-center mb-2">
                                        <span className="text-4xl font-extrabold text-gray-900 block mb-1">{result.bmi}</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full bg-opacity-10 ${result.statusColor.replace('text-', 'bg-')} ${result.statusColor}`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2">
                                        Ideal Range: <span className="text-gray-600 font-semibold">{result.normalWeightRange}</span>
                                    </p>
                                </Card>

                                {/* Water Intake Card */}
                                <Card className="flex flex-col items-center justify-center p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Droplets className="w-5 h-5 text-cyan-500 fill-cyan-500" />
                                        <span className="font-bold text-gray-700">Hydration</span>
                                    </div>
                                    <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{result.water} <span className="text-xl text-gray-400">L</span></h3>
                                    <p className="text-xs text-gray-400">Daily water requirement</p>
                                </Card>
                            </div>

                            {/* Macro Split Card */}
                            <Card className="p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <PieChartIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Macro Distribution</h4>
                                        <p className="text-xs text-gray-500">Balanced nutrient split for your goals</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Bar Visual */}
                                    <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.macros.protein.percentage}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-blue-500 relative group"><div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div></motion.div>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.macros.carbs.percentage}%` }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-yellow-500 relative group"><div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div></motion.div>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.macros.fats.percentage}%` }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-green-500 relative group"><div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div></motion.div>
                                    </div>

                                    {/* Detailed breakdown */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Protein</p>
                                            <p className="text-xl font-bold text-blue-700">{result.macros.protein.value}g</p>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Carbs</p>
                                            <p className="text-xl font-bold text-yellow-700">{result.macros.carbs.value}g</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-2xl border border-green-100">
                                            <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Fats</p>
                                            <p className="text-xl font-bold text-green-700">{result.macros.fats.value}g</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* AI Diet Prompt Card */}
                            <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-0 shadow-lg text-white">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg">AI Diet Generator</span>
                                            <p className="text-xs text-gray-400">Generate your personalized plan</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className={`${copied ? 'bg-green-500 text-white' : 'bg-white text-gray-900'} hover:bg-gray-100 border-0 font-bold transition-all`}
                                        onClick={handleCopy}
                                    >
                                        {copied ? 'Copied!' : 'Copy Prompt'}
                                    </Button>
                                </div>

                                <div className="bg-black/30 p-4 rounded-xl text-xs text-gray-300 font-mono leading-relaxed border border-white/10 whitespace-pre-wrap">
                                    {result.prompt}
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
