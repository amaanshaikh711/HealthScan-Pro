import { Card } from '../components/UI/Card';
import { Activity, Droplets, Flame, Apple, ArrowUp, ArrowDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';


// Mock data
const macroData = [
    { name: 'Protein', value: 120, color: '#14b8a6' }, // Teal-500
    { name: 'Carbs', value: 200, color: '#0ea5e9' }, // Sky-500
    { name: 'Fats', value: 60, color: '#8b5cf6' }, // Violet-500
];

const weeklyData = [
    { day: 'Mon', cal: 2100 },
    { day: 'Tue', cal: 1950 },
    { day: 'Wed', cal: 2200 },
    { day: 'Thu', cal: 1800 },
    { day: 'Fri', cal: 2400 },
    { day: 'Sat', cal: 2100 },
    { day: 'Sun', cal: 2000 },
];

export const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-500">Track your daily nutrition and health metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={Flame}
                    label="Calories"
                    value="1,250"
                    unit="kcal"
                    sub="750 kcal remaining"
                    iconColor="text-orange-500"
                    bgColor="bg-orange-500/10"
                    trend="down"
                />
                <SummaryCard
                    icon={Droplets}
                    label="Water"
                    value="1.2"
                    unit="L"
                    sub="Goal: 3.0 L"
                    iconColor="text-blue-500"
                    bgColor="bg-blue-500/10"
                    trend="up"
                />
                <SummaryCard
                    icon={Activity}
                    label="BMI"
                    value="22.4"
                    unit="Normal"
                    sub="Healthy weight"
                    iconColor="text-teal-500"
                    bgColor="bg-teal-500/10"
                />
                <SummaryCard
                    icon={Apple}
                    label="Meals"
                    value="2/4"
                    unit="Eaten"
                    sub="Next: Evening Snack"
                    iconColor="text-rose-500"
                    bgColor="bg-rose-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Weekly Calories</h3>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="cal" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Today's Macros</h3>
                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={macroData}
                                    innerRadius="60%"
                                    outerRadius="80%"
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">1,250</span>
                            <span className="text-xs text-gray-500">kcal consumed</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {macroData.map((item) => (
                            <div key={item.name} className="text-center p-2 rounded-xl bg-gray-50">
                                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                                <p className="text-xs text-gray-500 font-medium">{item.name}</p>
                                <p className="text-sm font-bold text-gray-800">{item.value}g</p>
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
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group" noPadding>
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${bgColor} ${iconColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        2.5%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <h4 className="text-3xl font-bold text-gray-800 tracking-tight">{value} <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span></h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
            </div>
        </div>
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">{sub}</p>
        </div>
    </Card>
);
