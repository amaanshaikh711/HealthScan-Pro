
import { motion } from 'framer-motion';
import { Button } from '../components/UI/Button';
import { ArrowRight, Activity, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import '@lottiefiles/dotlottie-wc';

// Add custom element type definition to avoid TS error
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { src: string; autoplay?: boolean; loop?: boolean }, HTMLElement>;
        }
    }
}

export const LandingPage = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden flex flex-col">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

            {/* Navbar */}
            <nav className="w-full p-6 z-50 flex-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600">
                            HealthScan Pro
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/auth/login" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Login</Link>
                        <Link to="/dashboard">
                            <Button className="rounded-full px-6 shadow-blue-500/25">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-8 items-center justify-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 z-10"
                >
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100/50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                        #1 AI Nutrition Assistant
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                        HealthScan Pro <br />
                        <span className="text-3xl lg:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 block mt-2">
                            Your Personal Nutritionist
                        </span>
                    </h1>

                    <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                        Analyze your diet, scan food barcodes, and get personalized meal plans instantly with the power of Dr. Nova AI.
                    </p>

                    <div className="flex gap-4 pt-2">
                        <Link to="/dashboard">
                            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                                Try Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-2">
                            View Demo
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">10k+</h3>
                            <p className="text-xs text-gray-500">Users Helped</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                            <p className="text-xs text-gray-500">Accuracy</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                            <p className="text-xs text-gray-500">AI Support</p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image / 3D Robot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 hidden lg:flex justify-center items-center h-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-teal-500/20 rounded-full blur-[80px] animate-pulse scale-75" />

                    {/* 3D Lottie Animation */}
                    <div className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                        <dotlottie-wc src="https://lottie.host/8ceec309-eb73-45f5-bd2a-b66658c218ab/tISPXak6Ct.lottie" style={{ width: '450px', height: '450px' }} autoplay loop></dotlottie-wc>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
