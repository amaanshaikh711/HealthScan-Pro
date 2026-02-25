import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Plus, Trash2, Wand2, Flame, Beef, Clock, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FALLBACK_MEAL_IMAGE,
    MEAL_CATEGORIES,
    MealCard,
    MealCategory,
    MealPlan,
    createAiGeneratedMealPlan,
    createInitialMealPlan,
    getStoredMealPlan,
    getCategoryLabel,
    parseMinutesFromTime,
    saveMealPlan
} from './mealPlannerData';

const categoryStyles: Record<MealCategory, { color: string; accent: string }> = {
    breakfast: { color: 'from-orange-50 to-orange-100/50', accent: 'bg-orange-500' },
    lunch: { color: 'from-emerald-50 to-emerald-100/50', accent: 'bg-emerald-500' },
    dinner: { color: 'from-sky-50 to-sky-100/50', accent: 'bg-sky-500' },
    snacks: { color: 'from-pink-50 to-pink-100/50', accent: 'bg-pink-500' }
};

type MealFormState = {
    name: string;
    calories: string;
    protein: string;
    time: string;
    image: string;
};

const emptyMealForm: MealFormState = { name: '', calories: '', protein: '', time: '', image: '' };

export const MealPlanner = () => {
    const navigate = useNavigate();

    const [meals, setMeals] = useState<MealPlan>(() => {
        const stored = getStoredMealPlan();
        return stored ?? createInitialMealPlan().plan;
    });
    const [planTitle, setPlanTitle] = useState(() => createInitialMealPlan().title);
    const [planSummary, setPlanSummary] = useState(() => createInitialMealPlan().summary);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<MealCategory | null>(null);
    const [newMeal, setNewMeal] = useState<MealFormState>(emptyMealForm);

    useEffect(() => {
        saveMealPlan(meals);
    }, [meals]);

    const allMeals = useMemo(() => MEAL_CATEGORIES.flatMap((category) => meals[category]), [meals]);
    const totalCalories = useMemo(() => allMeals.reduce((sum, meal) => sum + meal.calories, 0), [allMeals]);
    const totalProtein = useMemo(() => allMeals.reduce((sum, meal) => sum + meal.protein, 0), [allMeals]);
    const totalPrepMinutes = useMemo(() => allMeals.reduce((sum, meal) => sum + parseMinutesFromTime(meal.time), 0), [allMeals]);
    const mealsRemaining = Math.max(5 - allMeals.length, 0);

    const nextMealLabel = useMemo(() => {
        const schedule: Array<{ category: MealCategory; label: string; hour: number }> = [
            { category: 'breakfast', label: 'Breakfast', hour: 8 },
            { category: 'lunch', label: 'Lunch', hour: 13 },
            { category: 'snacks', label: 'Snack', hour: 16 },
            { category: 'dinner', label: 'Dinner', hour: 20 }
        ];

        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;

        for (const slot of schedule) {
            if (meals[slot.category].length > 0 && slot.hour > currentHour) {
                const diff = Math.max(1, Math.round(slot.hour - currentHour));
                return `${slot.label} in ${diff} ${diff === 1 ? 'hour' : 'hours'}`;
            }
        }

        const firstAvailable = schedule.find((slot) => meals[slot.category].length > 0);
        return firstAvailable ? `${firstAvailable.label} tomorrow` : 'Add a meal to get started';
    }, [meals]);

    const generatePlan = () => {
        setLoading(true);
        window.setTimeout(() => {
            const generated = createAiGeneratedMealPlan(Date.now());
            setMeals(generated.plan);
            setPlanTitle(generated.title);
            setPlanSummary(generated.summary);
            setLoading(false);
        }, 1200);
    };

    const removeMeal = (category: MealCategory, id: string) => {
        setMeals((prev) => ({
            ...prev,
            [category]: prev[category].filter((meal) => meal.id !== id)
        }));
    };

    const openAddModal = (category: MealCategory) => {
        setActiveCategory(category);
        setIsModalOpen(true);
    };

    const handleAddMeal = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCategory || !newMeal.name.trim()) {
            return;
        }

        const calories = Math.max(0, Number.parseInt(newMeal.calories, 10) || 0);
        const protein = Math.max(0, Number.parseInt(newMeal.protein, 10) || 0);
        const nonProteinCalories = Math.max(calories - protein * 4, 80);
        const carbs = Math.max(5, Math.round((nonProteinCalories * 0.58) / 4));
        const fats = Math.max(3, Math.round((nonProteinCalories * 0.42) / 9));
        const fiber = Math.max(2, Math.round(carbs * 0.12));

        const mealToAdd: MealCard = {
            id: `custom-${Date.now()}`,
            name: newMeal.name.trim(),
            calories,
            protein,
            carbs,
            fats,
            fiber,
            time: newMeal.time.trim() || '15 min',
            image: newMeal.image.trim() || FALLBACK_MEAL_IMAGE,
            category: activeCategory,
            source: 'custom'
        };

        setMeals((prev) => ({
            ...prev,
            [activeCategory]: [...prev[activeCategory], mealToAdd]
        }));

        setIsModalOpen(false);
        setNewMeal(emptyMealForm);
    };

    const openMealDetails = (meal: MealCard, category: MealCategory) => {
        navigate(`/meal-planner/meal/${meal.id}`, {
            state: { meal: { ...meal, category }, category }
        });
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white/60 shadow-xl shadow-slate-200/50">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Daily Meal Planner</h2>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {nextMealLabel}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 max-w-xl">
                        <span className="font-bold text-slate-700">{planTitle}</span> - {planSummary}
                    </p>
                </div>
                <Button
                    onClick={generatePlan}
                    isLoading={loading}
                    className="h-12 px-6 bg-gradient-to-r from-primary to-secondary hover:shadow-primary/25"
                    icon={<Wand2 className="w-5 h-5" />}
                >
                    Generate AI Plan
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SimpleStat label="Daily Calories" value={totalCalories.toLocaleString()} unit="kcal" icon={<Flame className="text-orange-500" />} />
                <SimpleStat label="Total Protein" value={totalProtein.toString()} unit="g" icon={<Beef className="text-blue-500" />} />
                <SimpleStat label="Prep Time" value={(totalPrepMinutes / 60).toFixed(1)} unit="hrs" icon={<Clock className="text-teal-500" />} />
                <SimpleStat label="Meals Remaining" value={`${mealsRemaining}/5`} unit="" icon={<ChevronRight className="text-slate-400" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                {MEAL_CATEGORIES.map((category) => (
                    <MealColumn
                        key={category}
                        title={getCategoryLabel(category)}
                        meals={meals[category]}
                        color={categoryStyles[category].color}
                        accent={categoryStyles[category].accent}
                        onDelete={(id) => removeMeal(category, id)}
                        onAdd={() => openAddModal(category)}
                        onDetails={(meal) => openMealDetails(meal, category)}
                    />
                ))}
            </div>

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
                                        <h3 className="text-2xl font-black text-slate-800">Add to {activeCategory ? getCategoryLabel(activeCategory) : ''}</h3>
                                        <p className="text-slate-500 text-sm">Create a custom meal and it will appear with full details.</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddMeal} className="space-y-5">
                                    <Input label="Meal Name" placeholder="e.g. Greek Salad" required value={newMeal.name} onChange={(event) => setNewMeal({ ...newMeal, name: event.target.value })} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Calories (kcal)" type="number" placeholder="0" icon={<Flame className="w-4 h-4" />} value={newMeal.calories} onChange={(event) => setNewMeal({ ...newMeal, calories: event.target.value })} />
                                        <Input label="Protein (g)" type="number" placeholder="0" icon={<Beef className="w-4 h-4" />} value={newMeal.protein} onChange={(event) => setNewMeal({ ...newMeal, protein: event.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Prep Time" placeholder="e.g. 15 min" icon={<Clock className="w-4 h-4" />} value={newMeal.time} onChange={(event) => setNewMeal({ ...newMeal, time: event.target.value })} />
                                        <Input label="Image URL" placeholder="https://..." icon={<ImageIcon className="w-4 h-4" />} value={newMeal.image} onChange={(event) => setNewMeal({ ...newMeal, image: event.target.value })} />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" className="flex-[2] bg-gradient-to-r from-primary to-secondary">Add Meal Item</Button>
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

const SimpleStat = ({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: React.ReactNode }) => (
    <Card className="p-4 flex items-center gap-4 bg-white/70 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">{icon}</div>
        <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">{label}</p>
            <p className="text-xl font-black text-slate-800 leading-none">
                {value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
            </p>
        </div>
    </Card>
);

const MealColumn = ({
    title,
    meals,
    color,
    accent,
    onDelete,
    onAdd,
    onDetails
}: {
    title: string;
    meals: MealCard[];
    color: string;
    accent: string;
    onDelete: (id: string) => void;
    onAdd: () => void;
    onDetails: (meal: MealCard) => void;
}) => (
    <div className={`p-5 rounded-[32px] bg-gradient-to-b ${color} border border-white/80 shadow-2xl shadow-slate-200/50 min-h-[600px] flex flex-col backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><div className={`w-2 h-6 ${accent} rounded-full`} />{title}</h3>
            <span className="text-[11px] font-bold bg-white px-2.5 py-1 rounded-full text-slate-500 shadow-sm border border-slate-100">{meals.length} {meals.length === 1 ? 'MEAL' : 'MEALS'}</span>
        </div>

        <div className="space-y-5 flex-1">
            <AnimatePresence mode="popLayout">
                {meals.map((meal) => (
                    <motion.div key={meal.id} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} layout className="group relative">
                        <div
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-white cursor-pointer"
                            onClick={() => onDetails(meal)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    onDetails(meal);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Open details for ${meal.name}`}
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(event) => { (event.target as HTMLImageElement).src = FALLBACK_MEAL_IMAGE; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm"><Flame className="w-3 h-3 text-orange-500" /><span className="text-[10px] font-black text-slate-700">{meal.calories}</span></div>
                                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm"><Beef className="w-3 h-3 text-blue-500" /><span className="text-[10px] font-black text-slate-700">{meal.protein}g</span></div>
                                </div>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDelete(meal.id);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500 backdrop-blur-md text-red-500 hover:text-white rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-2 min-h-[40px]">{meal.name}</h4>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] font-bold text-slate-500">{meal.time}</span></div>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onDetails(meal);
                                        }}
                                        className="text-[10px] font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
                                    >
                                        Details <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <button onClick={onAdd} className="w-full py-6 rounded-3xl border-2 border-dashed border-slate-300/40 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-2 group mt-2">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors"><Plus className="w-5 h-5" /></div>
                <span className="text-[11px] font-black uppercase tracking-widest">Add Meal</span>
            </button>
        </div>
    </div>
);
