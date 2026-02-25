export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type MealNutrition = {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
};

export type MealIngredient = {
    item: string;
    quantity: string;
    purpose?: string;
};

export type MealDetail = {
    id: string;
    title: string;
    category: MealCategory;
    image: string;
    prepMinutes: number;
    cookMinutes: number;
    servings: number;
    difficulty: 'Easy' | 'Moderate' | 'Advanced';
    nutrition: MealNutrition;
    ingredients: MealIngredient[];
    method: string[];
    highlights: string[];
    nutritionistNote: string;
    bestFor: string[];
    cautions: string[];
    smartSwaps: string[];
    hydrationTip: string;
    platingNote: string;
};

export type MealCard = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    image: string;
    time: string;
    category: MealCategory;
    source: 'catalog' | 'custom';
};

export type MealPlan = Record<MealCategory, MealCard[]>;

export const FALLBACK_MEAL_IMAGE = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80';
export const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export const getCategoryLabel = (category: MealCategory): string => {
    const labels: Record<MealCategory, string> = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snacks: 'Snacks'
    };

    return labels[category];
};

const mealCatalog: MealDetail[] = [
    {
        id: 'breakfast-overnight-oats-berry-protein',
        title: 'Protein Overnight Oats with Chia and Berries',
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18977?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 10,
        cookMinutes: 0,
        servings: 1,
        difficulty: 'Easy',
        nutrition: { calories: 390, protein: 24, carbs: 48, fats: 11, fiber: 11, sugar: 13, sodium: 140 },
        ingredients: [
            { item: 'Rolled oats', quantity: '1/2 cup' },
            { item: 'Greek yogurt (low fat)', quantity: '1/2 cup', purpose: 'Protein density' },
            { item: 'Chia seeds', quantity: '1 tbsp', purpose: 'Fiber and omega-3 support' },
            { item: 'Mixed berries', quantity: '3/4 cup' },
            { item: 'Unsweetened almond milk', quantity: '3/4 cup' }
        ],
        method: [
            'Combine oats, yogurt, chia, and milk in a covered jar.',
            'Refrigerate for at least 6 hours to improve digestibility.',
            'Top with berries before serving.'
        ],
        highlights: [
            'Slow-digesting carbohydrates support steady morning energy.',
            'High satiety profile from protein plus fiber.',
            'Excellent option for busy mornings.'
        ],
        nutritionistNote: 'This breakfast helps reduce mid-morning cravings by improving satiety and glucose stability.',
        bestFor: ['Weight management', 'Satiety support', 'Digestive regularity'],
        cautions: ['Use lactose-free yogurt if lactose sensitive.'],
        smartSwaps: ['Add whey isolate to increase protein by 10-15 g.'],
        hydrationTip: 'Pair with 350 ml water within 20 minutes.',
        platingNote: 'Serve in a clear bowl and top with fresh mint.'
    },
    {
        id: 'breakfast-spinach-omelette-toast',
        title: 'Spinach Mushroom Omelette with Whole Grain Toast',
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 10,
        cookMinutes: 8,
        servings: 1,
        difficulty: 'Easy',
        nutrition: { calories: 420, protein: 29, carbs: 30, fats: 20, fiber: 7, sugar: 4, sodium: 360 },
        ingredients: [
            { item: 'Whole eggs', quantity: '2' },
            { item: 'Egg whites', quantity: '2' },
            { item: 'Spinach', quantity: '1 cup' },
            { item: 'Mushrooms', quantity: '1/2 cup' },
            { item: 'Whole grain toast', quantity: '1 slice' }
        ],
        method: [
            'Saute mushrooms and spinach.',
            'Whisk eggs and whites, then cook on medium heat.',
            'Serve with toasted whole grain bread.'
        ],
        highlights: [
            'High-protein breakfast for lean-mass retention.',
            'Lower glycemic load than refined breakfast options.',
            'Micronutrient-rich start to the day.'
        ],
        nutritionistNote: 'A protein-forward breakfast can improve appetite control and support body composition goals.',
        bestFor: ['Muscle gain phase', 'Blood sugar balance'],
        cautions: ['Reduce yolks if medically advised to limit cholesterol.'],
        smartSwaps: ['Use tofu scramble for a vegetarian version.'],
        hydrationTip: 'Include 250-300 ml lemon water on the side.',
        platingNote: 'Fold omelette and plate with toast strips for a clean finish.'
    },
    {
        id: 'lunch-chicken-quinoa-bowl',
        title: 'Grilled Chicken Quinoa Power Bowl',
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 15,
        cookMinutes: 18,
        servings: 1,
        difficulty: 'Moderate',
        nutrition: { calories: 560, protein: 46, carbs: 52, fats: 18, fiber: 10, sugar: 8, sodium: 460 },
        ingredients: [
            { item: 'Chicken breast', quantity: '140 g' },
            { item: 'Cooked quinoa', quantity: '3/4 cup' },
            { item: 'Mixed greens', quantity: '2 cups' },
            { item: 'Cherry tomatoes', quantity: '1/2 cup' },
            { item: 'Olive oil and lemon dressing', quantity: '1 tbsp' }
        ],
        method: [
            'Grill chicken until internal temperature reaches 74 C.',
            'Build bowl with quinoa, greens, tomatoes, and dressing.',
            'Slice chicken and place over bowl.'
        ],
        highlights: [
            'High-protein and high-fiber lunch structure.',
            'Supports satiety while preserving energy.',
            'Balanced for workday performance.'
        ],
        nutritionistNote: 'This meal supports post-lunch concentration and helps maintain protein adequacy for the day.',
        bestFor: ['Fat loss with muscle retention', 'Post-workout lunch'],
        cautions: ['Reduce dressing sodium if blood-pressure sensitive.'],
        smartSwaps: ['Replace chicken with tofu for vegetarian plans.'],
        hydrationTip: 'Take 350-400 ml water over the next hour.',
        platingNote: 'Use layered contrast between greens, grains, and protein.'
    },
    {
        id: 'lunch-lentil-brown-rice-bowl',
        title: 'Lentil and Brown Rice Buddha Bowl',
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 12,
        cookMinutes: 20,
        servings: 1,
        difficulty: 'Moderate',
        nutrition: { calories: 520, protein: 24, carbs: 73, fats: 14, fiber: 14, sugar: 9, sodium: 410 },
        ingredients: [
            { item: 'Cooked brown rice', quantity: '3/4 cup' },
            { item: 'Cooked green lentils', quantity: '3/4 cup' },
            { item: 'Roasted vegetables', quantity: '1 cup' },
            { item: 'Yogurt-tahini dressing', quantity: '1 tbsp' },
            { item: 'Pumpkin seeds', quantity: '1 tsp' }
        ],
        method: [
            'Cook lentils until tender.',
            'Assemble rice, lentils, and vegetables in a bowl.',
            'Top with dressing and seeds.'
        ],
        highlights: [
            'Fiber-rich vegetarian lunch with steady glycemic response.',
            'Supports digestive health and appetite control.',
            'Strong micronutrient density.'
        ],
        nutritionistNote: 'Ideal for high-volume eating while controlling calorie intake.',
        bestFor: ['Plant-forward eating', 'Digestive support'],
        cautions: ['Cook lentils thoroughly for better GI comfort.'],
        smartSwaps: ['Add paneer if additional protein is needed.'],
        hydrationTip: 'Increase water by 300 ml due to higher fiber load.',
        platingNote: 'Keep ingredients sectioned for visual clarity.'
    },
    {
        id: 'dinner-herb-salmon-asparagus',
        title: 'Herb Baked Salmon with Asparagus and Sweet Potato',
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 12,
        cookMinutes: 25,
        servings: 1,
        difficulty: 'Moderate',
        nutrition: { calories: 610, protein: 44, carbs: 49, fats: 26, fiber: 11, sugar: 10, sodium: 440 },
        ingredients: [
            { item: 'Salmon fillet', quantity: '160 g' },
            { item: 'Asparagus', quantity: '1 cup' },
            { item: 'Sweet potato', quantity: '180 g' },
            { item: 'Olive oil', quantity: '1.5 tsp' },
            { item: 'Garlic, dill, lemon', quantity: 'to taste' }
        ],
        method: [
            'Season salmon with garlic, dill, lemon, and olive oil.',
            'Bake salmon and asparagus at 200 C for 15-18 minutes.',
            'Roast sweet potato cubes separately until tender.'
        ],
        highlights: [
            'Recovery-supportive dinner with high protein and micronutrients.',
            'Balanced carbs for glycogen replenishment.',
            'Anti-inflammatory fat profile.'
        ],
        nutritionistNote: 'This dinner supports overnight muscle repair while avoiding a heavy refined-carbohydrate load.',
        bestFor: ['Post-training dinner', 'Heart-health support'],
        cautions: ['Use lower sodium seasoning if blood pressure sensitive.'],
        smartSwaps: ['Swap sweet potato with pumpkin for a lighter carbohydrate load.'],
        hydrationTip: 'Keep 250 ml water by bedside for post-dinner hydration continuity.',
        platingNote: 'Fan asparagus parallel to salmon and serve sweet potato on the side.'
    },
    {
        id: 'dinner-palak-tofu-quinoa',
        title: 'Palak Tofu with Quinoa',
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 15,
        cookMinutes: 18,
        servings: 1,
        difficulty: 'Moderate',
        nutrition: { calories: 500, protein: 31, carbs: 46, fats: 22, fiber: 9, sugar: 6, sodium: 430 },
        ingredients: [
            { item: 'Firm tofu', quantity: '160 g' },
            { item: 'Spinach puree', quantity: '1.5 cups' },
            { item: 'Cooked quinoa', quantity: '1/2 cup' },
            { item: 'Garlic and ginger', quantity: '1 tsp each' },
            { item: 'Olive oil', quantity: '1 tsp' }
        ],
        method: [
            'Saute garlic and ginger, then add spinach puree.',
            'Add tofu cubes and simmer for 6-8 minutes.',
            'Serve with cooked quinoa.'
        ],
        highlights: [
            'Plant-protein dinner with iron and folate support.',
            'Balanced evening meal with controlled glycemic load.',
            'Useful for vegetarian compliance.'
        ],
        nutritionistNote: 'A strong vegetarian dinner option that keeps protein coverage adequate while supporting digestion.',
        bestFor: ['Vegetarian plans', 'Micronutrient support'],
        cautions: ['Adjust spices for reflux-prone individuals.'],
        smartSwaps: ['Use paneer when higher calories are needed.'],
        hydrationTip: 'Pair with 200 ml warm water to support post-meal comfort.',
        platingNote: 'Serve palak base in a shallow bowl with quinoa molded at one side.'
    },
    {
        id: 'snack-apple-almond-butter',
        title: 'Apple Slices with Almond Butter',
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 3,
        cookMinutes: 0,
        servings: 1,
        difficulty: 'Easy',
        nutrition: { calories: 210, protein: 6, carbs: 24, fats: 11, fiber: 5, sugar: 18, sodium: 60 },
        ingredients: [
            { item: 'Apple', quantity: '1 medium' },
            { item: 'Almond butter', quantity: '1 tbsp' },
            { item: 'Cinnamon', quantity: 'optional pinch' }
        ],
        method: [
            'Slice apple into wedges.',
            'Serve with almond butter dip and cinnamon.'
        ],
        highlights: [
            'Quick whole-food snack with fiber and healthy fats.',
            'Portable option for appetite control.',
            'No-cook and low friction.'
        ],
        nutritionistNote: 'This snack offers better satiety and glycemic response than processed sweet snacks.',
        bestFor: ['Portable snacking', 'Craving control'],
        cautions: ['Keep nut butter quantity measured for calorie control.'],
        smartSwaps: ['Swap apple for pear or guava.'],
        hydrationTip: 'Drink 200 ml water with this snack.',
        platingNote: 'Arrange wedges fan-style with a central dip cup.'
    },
    {
        id: 'snack-greek-yogurt-cacao',
        title: 'Greek Yogurt Cacao Protein Cup',
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1505253216365-8c46a1e3c4a2?auto=format&fit=crop&w=1200&q=80',
        prepMinutes: 4,
        cookMinutes: 0,
        servings: 1,
        difficulty: 'Easy',
        nutrition: { calories: 190, protein: 20, carbs: 16, fats: 5, fiber: 3, sugar: 10, sodium: 95 },
        ingredients: [
            { item: 'Greek yogurt', quantity: '3/4 cup' },
            { item: 'Unsweetened cacao powder', quantity: '1 tsp' },
            { item: 'Chopped dates', quantity: '1 small' },
            { item: 'Chia seeds', quantity: '1 tsp' }
        ],
        method: [
            'Whisk yogurt with cacao until smooth.',
            'Top with dates and chia seeds.'
        ],
        highlights: [
            'High protein with moderate calories.',
            'Helps complete daily protein targets.',
            'Satisfies sweet cravings without heavy sugar loading.'
        ],
        nutritionistNote: 'Protein-rich snacks like this can reduce compensatory overeating at dinner.',
        bestFor: ['Fat-loss phases', 'Protein target completion'],
        cautions: ['Use unsweetened yogurt when sugar targets are strict.'],
        smartSwaps: ['Use berries instead of dates for lower sugar.'],
        hydrationTip: 'Take with water to improve post-snack satiety.',
        platingNote: 'Serve in a small glass cup with a chia topping ring.'
    }
];

const catalogById = mealCatalog.reduce<Record<string, MealDetail>>((acc, meal) => {
    acc[meal.id] = meal;
    return acc;
}, {});

type PlanTemplate = {
    title: string;
    summary: string;
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
};

const planTemplates: PlanTemplate[] = [
    {
        title: 'AI Plan: Metabolic Balance Day',
        summary: 'Structured to keep blood sugar stable while maintaining high satiety and strong protein coverage.',
        breakfast: ['breakfast-overnight-oats-berry-protein'],
        lunch: ['lunch-chicken-quinoa-bowl'],
        dinner: ['dinner-herb-salmon-asparagus'],
        snacks: ['snack-greek-yogurt-cacao', 'snack-apple-almond-butter']
    },
    {
        title: 'AI Plan: Clinical Vegetarian Performance',
        summary: 'Fiber-rich vegetarian structure optimized for digestive health and appetite control.',
        breakfast: ['breakfast-spinach-omelette-toast'],
        lunch: ['lunch-lentil-brown-rice-bowl'],
        dinner: ['dinner-palak-tofu-quinoa'],
        snacks: ['snack-greek-yogurt-cacao', 'snack-apple-almond-butter']
    },
    {
        title: 'AI Plan: Lean Recovery Focus',
        summary: 'Protein-forward distribution supporting recovery and stable energy through the day.',
        breakfast: ['breakfast-spinach-omelette-toast'],
        lunch: ['lunch-chicken-quinoa-bowl'],
        dinner: ['dinner-herb-salmon-asparagus'],
        snacks: ['snack-greek-yogurt-cacao', 'snack-apple-almond-butter']
    }
];

const initialTemplate: PlanTemplate = {
    title: 'Starter Structured Plan',
    summary: 'A simple starter setup with foundational meal quality and room to add custom meals.',
    breakfast: ['breakfast-overnight-oats-berry-protein'],
    lunch: ['lunch-chicken-quinoa-bowl'],
    dinner: [],
    snacks: []
};

const toMealCard = (meal: MealDetail): MealCard => {
    const totalMinutes = meal.prepMinutes + meal.cookMinutes;
    return {
        id: meal.id,
        name: meal.title,
        calories: meal.nutrition.calories,
        protein: meal.nutrition.protein,
        carbs: meal.nutrition.carbs,
        fats: meal.nutrition.fats,
        fiber: meal.nutrition.fiber,
        image: meal.image,
        time: Math.max(totalMinutes, 1) + ' min',
        category: meal.category,
        source: 'catalog'
    };
};

const buildPlanFromTemplate = (template: PlanTemplate): MealPlan => {
    const mapIds = (ids: string[], category: MealCategory): MealCard[] => ids
        .map((id) => catalogById[id])
        .filter((meal): meal is MealDetail => Boolean(meal))
        .map((meal) => ({ ...toMealCard(meal), category }));

    return {
        breakfast: mapIds(template.breakfast, 'breakfast'),
        lunch: mapIds(template.lunch, 'lunch'),
        dinner: mapIds(template.dinner, 'dinner'),
        snacks: mapIds(template.snacks, 'snacks')
    };
};

const storageKey = 'healthscan-pro-meal-plan-v2';

const sanitizeStoredMeal = (value: unknown, category: MealCategory): MealCard | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const meal = value as Partial<MealCard>;
    if (typeof meal.id !== 'string' || typeof meal.name !== 'string') {
        return null;
    }

    const numeric = (input: unknown): number => {
        const parsed = typeof input === 'number' ? input : Number(input);
        return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    };

    return {
        id: meal.id,
        name: meal.name,
        calories: numeric(meal.calories),
        protein: numeric(meal.protein),
        carbs: numeric(meal.carbs),
        fats: numeric(meal.fats),
        fiber: numeric(meal.fiber),
        image: typeof meal.image === 'string' && meal.image.trim() ? meal.image : FALLBACK_MEAL_IMAGE,
        time: typeof meal.time === 'string' && meal.time.trim() ? meal.time : '15 min',
        category,
        source: meal.source === 'custom' ? 'custom' : 'catalog'
    };
};

export const createInitialMealPlan = (): { plan: MealPlan; title: string; summary: string } => ({
    plan: buildPlanFromTemplate(initialTemplate),
    title: initialTemplate.title,
    summary: initialTemplate.summary
});

export const createAiGeneratedMealPlan = (seed: number = Date.now()): { plan: MealPlan; title: string; summary: string } => {
    const index = Math.abs(seed) % planTemplates.length;
    const template = planTemplates[index] ?? initialTemplate;

    return {
        plan: buildPlanFromTemplate(template),
        title: template.title,
        summary: template.summary
    };
};

export const getCatalogMealById = (mealId: string): MealDetail | undefined => catalogById[mealId];

export const findMealInPlanById = (plan: MealPlan, mealId: string): MealCard | null => {
    for (const category of MEAL_CATEGORIES) {
        const meal = plan[category].find((item) => item.id === mealId);
        if (meal) {
            return meal;
        }
    }

    return null;
};

export const getStoredMealPlan = (): MealPlan | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<Record<MealCategory, unknown[]>>;
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }

        const mealPlan: MealPlan = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };

        for (const category of MEAL_CATEGORIES) {
            const items = parsed[category];
            if (!Array.isArray(items)) {
                return null;
            }

            mealPlan[category] = items
                .map((item) => sanitizeStoredMeal(item, category))
                .filter((item): item is MealCard => Boolean(item));
        }

        return mealPlan;
    } catch {
        return null;
    }
};

export const saveMealPlan = (plan: MealPlan): void => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(plan));
};

export const parseMinutesFromTime = (timeLabel: string): number => {
    const match = timeLabel.match(/\d+/);
    if (!match) {
        return 15;
    }

    const minutes = Number(match[0]);
    return Number.isFinite(minutes) ? Math.max(1, minutes) : 15;
};

export const buildCustomMealDetail = (meal: MealCard): MealDetail => {
    const prepMinutes = parseMinutesFromTime(meal.time);

    const estimatedSugar = Math.round(Math.max(2, meal.carbs * 0.35));
    const estimatedSodium = Math.round(Math.max(120, meal.calories * 0.7));

    return {
        id: meal.id,
        title: meal.name,
        category: meal.category,
        image: meal.image || FALLBACK_MEAL_IMAGE,
        prepMinutes,
        cookMinutes: 0,
        servings: 1,
        difficulty: 'Easy',
        nutrition: {
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            fiber: meal.fiber,
            sugar: estimatedSugar,
            sodium: estimatedSodium
        },
        ingredients: [
            { item: 'User-entered meal', quantity: '1 serving' },
            { item: 'Whole-food pairing', quantity: 'Add vegetables or fruit', purpose: 'Micronutrient balance' }
        ],
        method: [
            'Prepare and portion your meal as entered in planner.',
            'Pair with a hydration source and a fiber-rich side for satiety.'
        ],
        highlights: [
            'Custom entry preserved from your meal planner.',
            'Macros are shown based on your logged values.',
            'Consider adding colorful vegetables for nutrient diversity.'
        ],
        nutritionistNote: 'For highest accuracy, update this meal with exact ingredient weights and preparation details.',
        bestFor: ['Flexible meal tracking', 'Personalized routines'],
        cautions: ['Macro values are user-entered and may be estimations.'],
        smartSwaps: ['Replace refined carbs with whole grains.', 'Add lean protein if satiety is low.'],
        hydrationTip: 'Take 250 ml water with this meal to support digestion.',
        platingNote: 'Use a balanced plate: half vegetables, quarter protein, quarter smart carbs.'
    };
};
