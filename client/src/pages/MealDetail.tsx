import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Beef, ChefHat, ChevronRight, Clock, Droplets, Flame, Sparkles } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import {
    FALLBACK_MEAL_IMAGE,
    MealCard,
    MealCategory,
    buildCustomMealDetail,
    findMealInPlanById,
    getCatalogMealById,
    getCategoryLabel,
    getStoredMealPlan
} from './mealPlannerData';

type MealDetailState = {
    meal?: MealCard;
    category?: MealCategory;
};

export const MealDetailPage = () => {
    const navigate = useNavigate();
    const { mealId } = useParams<{ mealId: string }>();
    const location = useLocation();
    const state = location.state as MealDetailState | null;

    const storedPlan = getStoredMealPlan();
    const storedMeal = mealId && storedPlan ? findMealInPlanById(storedPlan, mealId) : null;
    const baseMeal = state?.meal ?? storedMeal;
    const detail = baseMeal
        ? (getCatalogMealById(baseMeal.id) ?? buildCustomMealDetail(baseMeal))
        : (mealId ? (getCatalogMealById(mealId) ?? null) : null);

    if (!detail) {
        return (
            <Card className="p-8 rounded-[30px]">
                <h2 className="text-2xl font-black text-slate-800">Meal not found</h2>
                <p className="text-slate-500 mt-2">This meal could not be loaded. Return to planner and open a meal card again.</p>
                <Button className="mt-6" onClick={() => navigate('/meal-planner')} icon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Meal Planner
                </Button>
            </Card>
        );
    }

    const macroCalories = Math.max(
        detail.nutrition.protein * 4 + detail.nutrition.carbs * 4 + detail.nutrition.fats * 9,
        1
    );
    const macroProtein = Math.round((detail.nutrition.protein * 4 * 100) / macroCalories);
    const macroCarbs = Math.round((detail.nutrition.carbs * 4 * 100) / macroCalories);
    const macroFats = Math.max(0, 100 - macroProtein - macroCarbs);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Button variant="outline" onClick={() => navigate('/meal-planner')} icon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Meal Planner
                </Button>
                <span className="text-xs uppercase tracking-[0.2em] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    {getCategoryLabel(detail.category)}
                </span>
            </div>

            <Card className="rounded-[32px] overflow-hidden p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative min-h-[280px]">
                        <img
                            src={detail.image}
                            alt={detail.title}
                            className="w-full h-full object-cover"
                            onError={(event) => {
                                (event.target as HTMLImageElement).src = FALLBACK_MEAL_IMAGE;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/15 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex gap-2 flex-wrap">
                            <DetailBadge icon={<Flame className="w-3.5 h-3.5 text-orange-500" />} label={`${detail.nutrition.calories} kcal`} />
                            <DetailBadge icon={<Beef className="w-3.5 h-3.5 text-blue-500" />} label={`${detail.nutrition.protein} g protein`} />
                            <DetailBadge icon={<Clock className="w-3.5 h-3.5 text-teal-500" />} label={`${detail.prepMinutes + detail.cookMinutes} min`} />
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">{detail.title}</h1>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{detail.difficulty}</span>
                        </div>
                        <p className="text-slate-600 mt-4 leading-relaxed">{detail.nutritionistNote}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                            <MiniStat title="Calories" value={`${detail.nutrition.calories}`} unit="kcal" />
                            <MiniStat title="Protein" value={`${detail.nutrition.protein}`} unit="g" />
                            <MiniStat title="Carbs" value={`${detail.nutrition.carbs}`} unit="g" />
                            <MiniStat title="Fats" value={`${detail.nutrition.fats}`} unit="g" />
                            <MiniStat title="Fiber" value={`${detail.nutrition.fiber}`} unit="g" />
                            <MiniStat title="Sodium" value={`${detail.nutrition.sodium}`} unit="mg" />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 rounded-[30px]">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-primary" />
                        Ingredients
                    </h2>
                    <ul className="mt-4 space-y-3">
                        {detail.ingredients.map((ingredient) => (
                            <li key={`${ingredient.item}-${ingredient.quantity}`} className="border border-slate-100 rounded-2xl p-3 bg-white/70">
                                <p className="font-semibold text-slate-700 text-sm">{ingredient.item}</p>
                                <p className="text-xs text-slate-500">{ingredient.quantity}</p>
                                {ingredient.purpose && <p className="text-xs text-primary mt-1">{ingredient.purpose}</p>}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="lg:col-span-2 rounded-[30px]">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Preparation Method
                    </h2>
                    <ol className="mt-4 space-y-3">
                        {detail.method.map((step, index) => (
                            <li key={step} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4 bg-white/70">
                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center flex-shrink-0">{index + 1}</span>
                                <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="rounded-[30px]">
                    <h2 className="text-lg font-black text-slate-800">Macro Distribution</h2>
                    <div className="space-y-3 mt-4">
                        <MacroRow label="Protein" value={macroProtein} color="bg-blue-500" />
                        <MacroRow label="Carbohydrates" value={macroCarbs} color="bg-amber-500" />
                        <MacroRow label="Fats" value={macroFats} color="bg-emerald-500" />
                    </div>
                    <div className="mt-5 p-3 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-slate-600 flex items-start gap-2">
                        <Droplets className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                        <p>{detail.hydrationTip}</p>
                    </div>
                </Card>

                <Card className="rounded-[30px]">
                    <h2 className="text-lg font-black text-slate-800">Nutritionist Guidance</h2>

                    <div className="mt-4 space-y-4">
                        <GuidanceBlock title="Clinical Highlights" items={detail.highlights} />
                        <GuidanceBlock title="Best For" items={detail.bestFor} />
                        <GuidanceBlock title="Smart Swaps" items={detail.smartSwaps} />
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-700">
                            {detail.cautions.length > 0 ? detail.cautions.join(' ') : 'No major caution flags for this meal.'}
                        </p>
                    </div>

                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <p className="font-semibold text-slate-700">Plating Note</p>
                        <p className="mt-1">{detail.platingNote}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const DetailBadge = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
        {icon}
        <span className="text-[11px] font-black text-slate-700">{label}</span>
    </div>
);

const MiniStat = ({ title, value, unit }: { title: string; value: string; unit: string }) => (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
        <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">{title}</p>
        <p className="text-lg font-black text-slate-800 leading-none mt-1">
            {value}<span className="text-xs font-semibold text-slate-400 ml-1">{unit}</span>
        </p>
    </div>
);

const MacroRow = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div>
        <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
        </div>
    </div>
);

const GuidanceBlock = ({ title, items }: { title: string; items: string[] }) => (
    <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <ul className="mt-2 space-y-1.5">
            {items.map((item) => (
                <li key={item} className="text-sm text-slate-700 flex items-start gap-1.5">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);
