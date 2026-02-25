import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Activity, Droplets, Flame, Apple, ArrowUp, ArrowDown, User, Scale, Ruler, Calendar, CheckCircle2, RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface Metrics {
    age: string;
    weight: string;
    height: string;
    gender: 'male' | 'female';
}

interface HealthData {
    bmi: number;
    bmiCategory: string;
    bmr: number;
    tdee: number;
    macros: { name: string; value: number; color: string }[];
    dailyCal: number;
}

export const Dashboard = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user_health_metrics');
        if (saved) {
            const parsedMetrics = JSON.parse(saved);
            setMetrics(parsedMetrics);
            calculateHealth(parsedMetrics);
        } else {
            setShowForm(true);
        }
    }, []);

    const calculateHealth = (m: Metrics) => {
        const w = parseFloat(m.weight);
        const h = parseFloat(m.height) / 100; // cm to m
        const a = parseInt(m.age);

        // BMI
        const bmi = w / (h * h);
        let bmiCat = "";
        if (bmi < 18.5) bmiCat = "Underweight";
        else if (bmi < 25) bmiCat = "Normal";
        else if (bmi < 30) bmiCat = "Overweight";
        else bmiCat = "Obese";

        // BMR (Mifflin-St Jeor)
        const bmr = 10 * w + 6.25 * (h * 100) - 5 * a + (m.gender === 'male' ? 5 : -161);

        // TDEE (Assume Sedentary 1.2x)
        const tdee = bmr * 1.2;

        // Macros (Protein: 1.8g/kg, Fats: 25%, Carbs: Remainder)
        const proteinG = Math.round(w * 1.8);
        const fatsG = Math.round((tdee * 0.25) / 9);
        const carbsG = Math.round((tdee - (proteinG * 4) - (fatsG * 9)) / 4);

        setHealthData({
            bmi: parseFloat(bmi.toFixed(1)),
            bmiCategory: bmiCat,
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            dailyCal: Math.round(tdee),
            macros: [
                { name: 'Protein', value: proteinG, color: '#14b8a6' },
                { name: 'Carbs', value: carbsG, color: '#0ea5e9' },
                { name: 'Fats', value: fatsG, color: '#8b5cf6' },
            ]
        });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newMetrics: Metrics = {
            age: formData.get('age') as string,
            weight: formData.get('weight') as string,
            height: formData.get('height') as string,
            gender: formData.get('gender') as 'male' | 'female',
        };
        localStorage.setItem('user_health_metrics', JSON.stringify(newMetrics));
        setMetrics(newMetrics);
        calculateHealth(newMetrics);
        setShowForm(false);
    };

    const weeklyData = [
        { day: 'Mon', cal: healthData ? Math.round(healthData.tdee * 0.95) : 2100 },
        { day: 'Tue', cal: healthData ? Math.round(healthData.tdee * 1.02) : 1950 },
        { day: 'Wed', cal: healthData ? Math.round(healthData.tdee * 0.88) : 2200 },
        { day: 'Thu', cal: healthData ? Math.round(healthData.tdee * 0.98) : 1800 },
        { day: 'Fri', cal: healthData ? Math.round(healthData.tdee * 1.1) : 2400 },
        { day: 'Sat', cal: healthData ? Math.round(healthData.tdee * 1.05) : 2100 },
        { day: 'Sun', cal: healthData ? Math.round(healthData.tdee * 0.9) : 2000 },
    ];

    if (showForm) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary mb-2">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800">Setup Your Health Profile</h2>
                        <p className="text-slate-500">Provide your basic information to get personalized daily nutritional targets.</p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl rounded-[32px] p-8">
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                        <Calendar className="w-4 h-4 text-primary" /> Age (years)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="age"
                                        placeholder="e.g. 25"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                        <User className="w-4 h-4 text-primary" /> Gender
                                    </label>
                                    <select
                                        name="gender"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium appearance-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                        <Scale className="w-4 h-4 text-primary" /> Weight (kg)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        step="0.1"
                                        name="weight"
                                        placeholder="e.g. 70.5"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                                        <Ruler className="w-4 h-4 text-primary" /> Height (cm)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="height"
                                        placeholder="e.g. 175"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                Generate My Dashboard
                            </button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (!healthData) return null;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Personalized Dashboard</h2>
                    <p className="text-slate-500 font-medium">Hello there! Your metabolic targets are calibrated for your active profile.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl font-bold transition-all text-sm border border-primary/10"
                >
                    <RotateCcw className="w-4 h-4" />
                    Update Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={Flame}
                    label="Daily Budget"
                    value={healthData.dailyCal.toString()}
                    unit="kcal"
                    sub="Goal for maintenance"
                    iconColor="text-orange-500"
                    bgColor="bg-orange-500/10"
                    trend="up"
                />
                <SummaryCard
                    icon={Droplets}
                    label="Hydration Goal"
                    value={(parseFloat(metrics?.weight || "70") * 0.035).toFixed(1)}
                    unit="L"
                    sub="Daily target for base fitness"
                    iconColor="text-blue-500"
                    bgColor="bg-blue-500/10"
                />
                <SummaryCard
                    icon={Activity}
                    label="BMI Index"
                    value={healthData.bmi.toString()}
                    unit={healthData.bmiCategory}
                    sub="Body Mass Index analysis"
                    iconColor="text-teal-500"
                    bgColor="bg-teal-500/10"
                />
                <SummaryCard
                    icon={Apple}
                    label="BMR Rate"
                    value={healthData.bmr.toString()}
                    unit="kcal"
                    sub="Basal Metabolic Rate"
                    iconColor="text-rose-500"
                    bgColor="bg-rose-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white/40 backdrop-blur-3xl rounded-[32px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 capitalize tracking-tight">Dynamic Calorie Curve</h3>
                            <p className="text-sm text-slate-500 font-medium">Simulated weekly distribution based on TDEE</p>
                        </div>
                        <select className="bg-white/50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none ring-primary/10 focus:ring-4 transition-all">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-80 w-full ml-[-20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 12 }}
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ fontWeight: 800, color: '#0f172a' }}
                                />
                                <Bar dataKey="cal" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={45} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex flex-col border-none shadow-xl shadow-slate-200/50 bg-white/40 backdrop-blur-3xl rounded-[32px]">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Macro Breakdown</h3>
                        <p className="text-sm text-slate-400 font-medium">Daily nutrient targets</p>
                    </div>
                    <div className="flex-1 min-h-[240px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={healthData.macros}
                                    innerRadius="70%"
                                    outerRadius="95%"
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {healthData.macros.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-800">{healthData.dailyCal}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target kcal</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {healthData.macros.map((item) => (
                            <div key={item.name} className="text-center p-3 rounded-[20px] bg-white shadow-sm border border-slate-50">
                                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.name}</p>
                                <p className="text-sm font-black text-slate-800 tracking-tight">{item.value}g</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

interface SummaryCardProps {
    icon: any;
    label: string;
    value: string;
    unit: string;
    sub: string;
    iconColor: string;
    bgColor: string;
    trend?: 'up' | 'down';
}

const SummaryCard = ({ icon: Icon, label, value, unit, sub, iconColor, bgColor, trend }: SummaryCardProps) => (
    <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group border-none shadow-lg shadow-slate-200/40 rounded-[28px] bg-white/60" noPadding>
        <div className="p-7">
            <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${bgColor} ${iconColor} shadow-inner transition-transform group-hover:rotate-6 duration-300`}>
                    <Icon className="w-7 h-7" />
                </div>
                {trend && (
                    <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} uppercase tracking-widest`}>
                        {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        Active
                    </div>
                )}
            </div>
            <div className="mt-5">
                <h4 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                    {value}
                    <span className="text-[11px] font-black text-slate-400 ml-1.5 uppercase tracking-widest">
                        {unit}
                    </span>
                </h4>
                <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-tight">{label}</p>
            </div>
        </div>
        <div className="px-7 py-4 bg-slate-50/50 border-t border-slate-100/50 group-hover:bg-primary/5 transition-colors">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{sub}</p>
        </div>
    </Card>
);
