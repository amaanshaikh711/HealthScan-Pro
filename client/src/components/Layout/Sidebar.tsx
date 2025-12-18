import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, ScanBarcode, Utensils, MessageCircle, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'BMI Analysis', path: '/bmi' },
    { icon: ScanBarcode, label: 'Food Scanner', path: '/scanner' },
    { icon: Utensils, label: 'Meal Planner', path: '/meal-planner' },
    { icon: MessageCircle, label: 'Ask Nova', path: '/chat' },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 hidden md:flex flex-col z-50 transition-all duration-300">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                        H
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 block">
                        HealthScan Pro
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} className="relative block">
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group",
                                    isActive
                                        ? "text-primary font-medium"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5 z-10 transition-colors", isActive && "text-primary")} />
                                <span className="z-10">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 w-full transition-colors font-medium">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
