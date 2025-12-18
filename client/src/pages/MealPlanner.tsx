import { useState } from 'react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Plus, Trash2, Wand2, Flame, Beef, Clock, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    image?: string;
    time?: string;
};

type MealPlan = {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
};

const defaultMeals: MealPlan = {
    breakfast: [
        { id: '1', name: 'Oatmeal with Fresh Berries', calories: 350, protein: 12, time: '10 min', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18977?auto=format&fit=crop&w=600&q=80' }
    ],
    lunch: [
        { id: '2', name: 'Grilled Chicken Garden Salad', calories: 450, protein: 40, time: '20 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' }
    ],
    dinner: [],
    snacks: []
};

// Fallback image for failed loads
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80';

export const MealPlanner = () => {
    const [meals, setMeals] = useState<MealPlan>(defaultMeals);
    const [loading, setLoading] = useState(false);

    // Add Meal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<keyof MealPlan | null>(null);
    const [newMeal, setNewMeal] = useState({
        name: '',
        calories: '',
        protein: '',
        time: '',
        image: ''
    });

    const generatePlan = () => {
        setLoading(true);
        setTimeout(() => {
            setMeals({
                breakfast: [
                    { id: 'b1', name: 'Avocado Toast with Poached Egg', calories: 400, protein: 18, time: '15 min', image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=600&q=80' },
                    { id: 'b2', name: 'Greek Yogurt & Honey Parfait', calories: 300, protein: 20, time: '5 min', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' }
                ],
                lunch: [
                    { id: 'l1', name: 'Quinoa & Roasted Veggie Bowl', calories: 500, protein: 15, time: '25 min', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80' }
                ],
                dinner: [
                    { id: 'd1', name: 'Grilled Salmon with Asparagus', calories: 550, protein: 45, time: '30 min', image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=600&q=80' }
                ],
                snacks: [
                    { id: 's1', name: 'Apple & Almond Butter', calories: 200, protein: 5, time: '2 min', image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80' }
                ]
            });
            setLoading(false);
        }, 1500);
    };

    const removeMeal = (category: keyof MealPlan, id: string) => {
        setMeals(prev => ({
            ...prev,
            [category]: prev[category].filter(m => m.id !== id)
        }));
    };

    const openAddModal = (category: keyof MealPlan) => {
        setActiveCategory(category);
        setIsModalOpen(true);
    };

    const handleAddMeal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCategory || !newMeal.name) return;

        const mealToAdd: Meal = {
            id: Date.now().toString(),
            name: newMeal.name,
            calories: parseInt(newMeal.calories) || 0,
            protein: parseInt(newMeal.protein) || 0,
            time: newMeal.time || '15 min',
            image: newMeal.image || FALLBACK_IMAGE
        };

        setMeals(prev => ({
            ...prev,
            [activeCategory]: [...prev[activeCategory], mealToAdd]
        }));

        // Reset
        setIsModalOpen(false);
        setNewMeal({ name: '', calories: '', protein: '', time: '', image: '' });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white/60 shadow-xl shadow-slate-200/50">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Daily Meal Planner</h2>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Next meal in <span className="text-primary font-semibold">2 hours</span>
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        onClick={generatePlan}
                        isLoading={loading}
                        className="flex-1 md:flex-none h-12 px-6 bg-gradient-to-r from-primary to-secondary hover:shadow-primary/25"
                        icon={<Wand2 className="w-5 h-5" />}
                    >
                        Generate AI Plan
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SimpleStat label="Daily Calories" value="1,850" unit="kcal" icon={<Flame className="text-orange-500" />} />
                <SimpleStat label="Total Protein" value="128" unit="g" icon={<Beef className="text-blue-500" />} />
                <SimpleStat label="Prep Time" value="1.5" unit="hrs" icon={<Clock className="text-teal-500" />} />
                <SimpleStat label="Meals Remaining" value="3/5" unit="" icon={<ChevronRight className="text-slate-400" />} />
            </div>

            {/* Meal Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((cat) => (
                    <MealColumn
                        key={cat}
                        title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        meals={meals[cat]}
                        color={
                            cat === 'breakfast' ? "from-orange-50 to-orange-100/50" :
                                cat === 'lunch' ? "from-emerald-50 to-emerald-100/50" :
                                    cat === 'dinner' ? "from-sky-50 to-sky-100/50" :
                                        "from-pink-50 to-pink-100/50"
                        }
                        accent={
                            cat === 'breakfast' ? "bg-orange-500" :
                                cat === 'lunch' ? "bg-emerald-500" :
                                    cat === 'dinner' ? "bg-sky-500" :
                                        "bg-pink-500"
                        }
                        onDelete={(id) => removeMeal(cat, id)}
                        onAdd={() => openAddModal(cat)}
                    />
                ))}
            </div>

            {/* Add Meal Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">Add to {activeCategory}</h3>
                                        <p className="text-slate-500 text-sm">Fill in the details for your new meal.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddMeal} className="space-y-5">
                                    <Input
                                        label="Meal Name"
                                        placeholder="e.g. Greek Salad"
                                        required
                                        value={newMeal.name}
                                        onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Calories (kcal)"
                                            type="number"
                                            placeholder="0"
                                            icon={<Flame className="w-4 h-4" />}
                                            value={newMeal.calories}
                                            onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })}
                                        />
                                        <Input
                                            label="Protein (g)"
                                            type="number"
                                            placeholder="0"
                                            icon={<Beef className="w-4 h-4" />}
                                            value={newMeal.protein}
                                            onChange={e => setNewMeal({ ...newMeal, protein: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Prep Time"
                                            placeholder="e.g. 15 min"
                                            icon={<Clock className="w-4 h-4" />}
                                            value={newMeal.time}
                                            onChange={e => setNewMeal({ ...newMeal, time: e.target.value })}
                                        />
                                        <Input
                                            label="Image URL"
                                            placeholder="https://..."
                                            icon={<ImageIcon className="w-4 h-4" />}
                                            value={newMeal.image}
                                            onChange={e => setNewMeal({ ...newMeal, image: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-[2] bg-gradient-to-r from-primary to-secondary"
                                        >
                                            Add Meal Item
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SimpleStat = ({ label, value, unit, icon }: { label: string, value: string, unit: string, icon: React.ReactNode }) => (
    <Card className="p-4 flex items-center gap-4 bg-white/70 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">{label}</p>
            <p className="text-xl font-black text-slate-800 leading-none">
                {value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
            </p>
        </div>
    </Card>
);

const MealColumn = ({ title, meals, color, accent, onDelete, onAdd }: { title: string, meals: Meal[], color: string, accent: string, onDelete: (id: string) => void, onAdd: () => void }) => (
    <div className={`p-5 rounded-[32px] bg-gradient-to-b ${color} border border-white/80 shadow-2xl shadow-slate-200/50 min-h-[600px] flex flex-col backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <div className={`w-2 h-6 ${accent} rounded-full`} />
                {title}
            </h3>
            <span className="text-[11px] font-bold bg-white px-2.5 py-1 rounded-full text-slate-500 shadow-sm border border-slate-100">
                {meals.length} {meals.length === 1 ? 'MEAL' : 'MEALS'}
            </span>
        </div>

        <div className="space-y-5 flex-1">
            <AnimatePresence mode="popLayout">
                {meals.map((meal: Meal) => (
                    <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                        className="group relative"
                    >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-white">
                            {/* Image Header */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                {/* Overlay Badges */}
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Flame className="w-3 h-3 text-orange-500" />
                                        <span className="text-[10px] font-black text-slate-700">{meal.calories}</span>
                                    </div>
                                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Beef className="w-3 h-3 text-blue-500" />
                                        <span className="text-[10px] font-black text-slate-700">{meal.protein}g</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onDelete(meal.id)}
                                    className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500 backdrop-blur-md text-red-500 hover:text-white rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-2 min-h-[40px]">
                                    {meal.name}
                                </h4>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500">{meal.time || '15 min'}</span>
                                    </div>
                                    <button className="text-[10px] font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors">
                                        Details <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <button
                onClick={onAdd}
                className="w-full py-6 rounded-3xl border-2 border-dashed border-slate-300/40 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-2 group mt-2"
            >
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">Add Meal</span>
            </button>
        </div>
    </div>
);
