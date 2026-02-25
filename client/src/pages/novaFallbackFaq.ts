export type NovaFallbackItem = {
    question: string;
    answer: string;
};

const SAFETY_DISCLAIMER =
    'Safety disclaimer: This is general nutrition guidance and not a medical diagnosis or treatment. Please consult your doctor or a registered dietitian for personalized care.';

export const NOVA_FALLBACK_QA: NovaFallbackItem[] = [
    {
        question: 'Can you suggest a healthy 1500 calorie meal plan for weight loss?',
        answer: `A 1500-calorie meal plan for weight loss should focus on high protein, adequate fiber, healthy fats, and minimal processed foods to keep you full and energized.

Sample 1500 kcal Day Plan:

Breakfast (350 kcal)
- Vegetable omelette (2 eggs + spinach + onion)
- 1 slice whole-grain toast
- 1 small fruit (apple or berries)

Mid-morning Snack (150 kcal)
- Greek yogurt (unsweetened) or a handful of roasted chana

Lunch (450 kcal)
- Grilled chicken or paneer (120-150 g)
- 1 cup brown rice or quinoa
- Mixed vegetable salad with olive oil and lemon

Evening Snack (150 kcal)
- Fruit + 10-12 almonds
or protein smoothie with water

Dinner (400 kcal)
- Baked fish or dal or tofu
- Steamed vegetables
- 1 small roti or millet serving

Why this works:
- Keeps blood sugar stable
- High protein preserves muscle
- Fiber improves digestion and satiety

Consistency matters more than perfection.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are the best high-protein snacks for muscle recovery?',
        answer: `For muscle recovery, snacks should provide 20-30 g protein, plus some carbs to refill muscle glycogen.

Top High-Protein Snack Options:
- Greek yogurt with seeds (20-25 g protein)
- Boiled eggs (2 eggs about 12-14 g protein)
- Cottage cheese or paneer cubes
- Protein smoothie (whey or plant protein + banana)
- Roasted chickpeas or soy nuts
- Peanut butter on whole-grain toast

When to eat:
- Within 30-60 minutes post-workout for best recovery.

Pro tip:
- Protein works best when spread evenly across the day, not eaten all at once.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What is an ideal DASH diet breakfast for heart health?',
        answer: `The DASH diet focuses on low sodium, high potassium, and fiber-rich heart-friendly foods.

Ideal DASH Breakfast Options:
- Oats cooked in low-fat milk plus fruits
- Vegetable upma made with less salt
- Whole-grain toast with avocado
- Fruit bowl with nuts and seeds
- Low-fat yogurt with berries

What to avoid:
- Fried foods
- Butter-heavy parathas
- Processed cereals with added sugar

Why this helps the heart:
- Reduces blood pressure
- Improves cholesterol profile
- Supports long-term cardiovascular health

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Suggest some high-fiber foods to improve my digestion.',
        answer: `Fiber improves digestion by supporting gut bacteria, bowel movement, and blood sugar control.

High-Fiber Foods to Include:

Fruits:
- Apples (with peel)
- Pears
- Berries
- Papaya

Vegetables:
- Broccoli
- Carrots
- Spinach
- Beans and lentils

Whole grains:
- Oats
- Brown rice
- Whole wheat roti
- Millets (ragi, jowar)

Seeds:
- Chia seeds
- Flaxseeds
- Pumpkin seeds

Increase fiber gradually and drink enough water to avoid bloating.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can you suggest a healthy 1200 calorie Indian vegetarian meal plan for weight loss?',
        answer: `A 1200 kcal plan can work short-term for selected adults, but quality and protein balance are essential.

Sample Day:
- Breakfast: Moong chilla + mint curd
- Snack: 1 fruit
- Lunch: Mixed dal + 1 roti + sabzi + salad
- Snack: Roasted chana or buttermilk
- Dinner: Paneer bhurji or tofu sabzi + cooked vegetables + 1 small roti

Keep protein around 65-80 g/day, fiber 20-25 g/day, and hydration consistent. If hunger is severe, move to a slightly higher calorie target for sustainability.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can you suggest an 1800 calorie plan for active fat loss?',
        answer: `For active people, 1800 kcal can support fat loss while preserving workout performance.

Example structure:
- Breakfast: Oats + milk + nuts + fruit
- Snack: Curd + seeds
- Lunch: Chicken or paneer + rice/millet + dal + vegetables
- Pre-workout snack: Banana + peanut butter
- Dinner: Fish or tofu + roti + vegetables

Target protein: around 100-130 g/day. Keep carbs around training windows for recovery and energy.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How much protein do I need daily to build muscle?',
        answer: `Most active adults do well with about 1.6-2.2 g protein per kg body weight per day. During fat loss, stay in the higher range to preserve lean mass.

Practical approach:
- Split protein across 3-5 meals
- Aim around 25-35 g protein per main meal
- Use foods like eggs, fish, chicken, paneer, tofu, curd, dal, soy

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What should I eat before a workout?',
        answer: `Eat a light meal 60-120 minutes before training: mostly carbs plus moderate protein, low fat.

Options:
- Banana + curd
- Oats + milk
- Peanut butter toast
- Poha + peanuts
- Idli + sambar

For early morning workouts, a small carb snack 20-30 minutes before (banana or dates) can help.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What should I eat after a workout?',
        answer: `Post-workout, combine protein plus carbohydrate to support muscle repair and glycogen recovery.

Options:
- Whey shake + fruit
- Paneer sandwich + salad
- Eggs + roti
- Dal rice + vegetables
- Greek yogurt + fruit + seeds

Try to eat within 30-90 minutes after training.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How can I reduce sodium in my Indian diet?',
        answer: `Use flavor from lemon, ginger, garlic, jeera, black pepper, curry leaves, and herbs instead of extra salt.

Reduce:
- Pickles and papad
- Instant soups/noodles
- Packaged namkeen/chips
- High-sodium sauces

Practical tip: Measure salt while cooking and avoid adding extra table salt.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Is fruit safe for people with diabetes?',
        answer: `Yes, whole fruit can be included in diabetes-friendly eating.

Best practices:
- Prefer whole fruit over juice
- Pair fruit with protein/fat (apple + nuts, guava + curd)
- Keep portions moderate
- Spread fruit across the day instead of large single servings

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What is a diabetes-friendly Indian breakfast?',
        answer: `A diabetes-friendly breakfast should include protein, fiber, and controlled carbs.

Good options:
- Moong chilla + curd
- Vegetable omelette + 1 roti
- Oats + nuts + seeds
- Besan chilla + vegetables
- Idli + extra sambar

Avoid sugary tea-biscuit breakfasts as a daily pattern.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How do I prevent post-meal blood sugar spikes?',
        answer: `Use meal order and balance:
- Start with salad/vegetables
- Add lean protein
- Then measured carbs

Also:
- Avoid sugary drinks with meals
- Walk 10-15 minutes after meals
- Keep meal timing regular
- Avoid very large portions after long fasting

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are healthy snacks for diabetes in the evening?',
        answer: `Evening snack options:
- Roasted chana
- Unsweetened Greek yogurt
- Paneer cubes + cucumber
- Boiled eggs
- Small nuts portion
- Sprouts chaat

Focus on protein + fiber and avoid frequent sugary or fried snacks.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can I eat sweets occasionally if I have diabetes?',
        answer: `Yes, occasional sweets can fit if planned.

How to do it safely:
- Keep portion small
- Have it after a balanced meal, not empty stomach
- Reduce carbs elsewhere in that meal
- Avoid daily sweet intake

Track your glucose response and adjust accordingly.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What should I eat if I am constipated frequently?',
        answer: `Build each day with fiber + fluids + movement.

Include:
- Oats/whole grains
- Dal/legumes
- Cooked vegetables + salad
- Fruits like papaya, guava, pear
- Chia/flax seeds

Add a short walk after meals and increase fiber gradually with hydration.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'I feel bloated when I increase fiber. What should I do?',
        answer: `Increase fiber slowly over 2-3 weeks instead of suddenly.

Tips:
- Add one change at a time
- Drink enough water
- Start with cooked vegetables
- Soak and cook legumes well
- Eat slowly and avoid large fizzy drinks

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How much fiber should I eat every day?',
        answer: `Most adults benefit from around 25-35 g fiber/day.

Practical way:
- 2 fruits/day
- 3 or more cups vegetables/day
- 1-2 servings legumes/day
- Whole grains over refined grains

Increase gradually and hydrate well.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are gut-friendly Indian breakfast options?',
        answer: `Good options:
- Idli + sambar
- Vegetable daliya
- Oats upma
- Moong chilla + curd
- Poha + peanuts + vegetables

Add fermented food (curd/buttermilk) if tolerated and maintain regular meal timing.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How much water should I drink daily?',
        answer: `A practical baseline for many adults is around 2-3 liters/day, adjusted for heat, activity, and body size.

Hydration checks:
- Pale yellow urine usually indicates good hydration
- Increase intake during workouts/hot weather
- Spread fluids through the day

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'When do I need electrolytes instead of plain water?',
        answer: `Electrolytes are useful when losses are high:
- Heavy sweating
- Long workouts (about 60+ minutes)
- Vomiting/diarrhea
- Fever or hot outdoor work

For regular low-intensity days, plain water is usually enough.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are signs of dehydration?',
        answer: `Common signs:
- Dry mouth
- Dark urine
- Headache
- Dizziness
- Fatigue
- Muscle cramps

Increase fluids early and seek urgent medical care for severe weakness, confusion, fainting, or persistent vomiting.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What can I eat late at night without harming my goals?',
        answer: `Choose a small, easy-to-digest snack:
- Warm milk
- Greek yogurt
- Paneer cubes
- Dal soup
- Fruit + few nuts

Avoid heavy fried, sugary, and very spicy meals close to bedtime.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Does eating late at night always cause weight gain?',
        answer: `Not always. Total daily calorie balance matters most, but late-night eating can increase overeating and poor food choices.

If hungry at night:
- Keep snack planned and small
- Prefer protein-rich options
- Avoid mindless snacking from packets

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What foods help improve sleep quality?',
        answer: `Sleep-supportive foods include:
- Warm milk or curd
- Oats
- Banana
- Nuts and seeds
- Light dal-based dinner

Keep dinner moderate and avoid heavy caffeine, alcohol, or very sugary foods late evening.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What is BMI and should I rely on it fully?',
        answer: `BMI is a screening tool based on height and weight. It is useful for risk screening, but it does not directly measure body fat distribution or muscle mass.

Use BMI with:
- Waist circumference
- Activity levels
- Lab markers
- Clinical history

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What is BMR and how is it different from TDEE?',
        answer: `BMR is the energy your body needs at complete rest.
TDEE is your total daily energy expenditure (BMR + activity + exercise + digestion).

For meal planning, TDEE is usually more practical than BMR.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How do I set a safe calorie deficit?',
        answer: `A moderate deficit of about 300-500 kcal/day is commonly sustainable for fat loss.

Protect results by:
- Keeping protein high
- Doing resistance training
- Sleeping adequately
- Making small adjustments every 2-3 weeks if needed

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can very low calorie diets slow my metabolism?',
        answer: `Very aggressive long-term calorie restriction can reduce energy expenditure and increase hunger signals.

A better strategy is:
- Moderate deficit
- Adequate protein
- Strength training
- Consistent routine

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are the best vegetarian and vegan protein sources?',
        answer: `Top options:
- Soy chunks, tofu, tempeh
- Lentils, chana, rajma, peas
- Paneer and curd (if vegetarian, not vegan)
- Nuts and seeds
- Protein supplements if targets are hard to meet

Combine legumes with grains for better amino acid coverage.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How can I build complete protein meals as a vegetarian?',
        answer: `Use combinations across meals:
- Dal + rice
- Roti + chana/rajma
- Paneer + millet
- Tofu + quinoa
- Curd + nuts/seeds

Focus on total daily protein and meal distribution.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are healthy snack options to control cravings?',
        answer: `Try protein + fiber snacks:
- Fruit + nuts
- Curd + seeds
- Roasted chana
- Boiled eggs
- Hummus + vegetables
- Buttermilk + peanuts

Pre-portion snacks and avoid eating from large packets.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How do I stop sugar cravings after dinner?',
        answer: `Improve dinner composition first:
- Include protein and fiber
- Avoid under-eating in daytime
- Keep one planned sweet alternative (fruit + curd, small dark chocolate portion)

Also improve sleep and stress habits, as both affect cravings.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are better alternatives to chips and namkeen?',
        answer: `Try:
- Roasted chana
- Makhana (lightly roasted)
- Unsalted nuts
- Sprouts chaat
- Vegetable sticks + hummus
- Air-popped popcorn

Keep portions measured to avoid accidental overeating.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Is paneer good for muscle gain?',
        answer: `Yes, paneer can support muscle gain, especially for vegetarians.

Key points:
- Great protein and calcium source
- Higher fat than lean meats, so manage portions
- Use low-fat paneer if calorie targets are strict

Daily total protein and training consistency matter most.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Should I avoid rice completely for weight loss?',
        answer: `No, you do not need to eliminate rice completely.

What matters:
- Portion size
- Pairing with protein + vegetables
- Total daily calories

Measured rice in a balanced plate can fit fat-loss goals.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How can I eat out while staying heart healthy?',
        answer: `Choose grilled, steamed, or tandoori foods. Ask for less salt and sauce on the side.

Better picks:
- Dal, grilled fish/chicken, paneer tikka
- Plain roti + vegetables + salad

Limit fried starters, pickles, papad, and sugary drinks.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can I take whey protein every day?',
        answer: `For many healthy adults, daily whey can be used safely as a supplement when total protein targets are not met from food.

Tips:
- Use tested brands
- Do not replace all whole-food protein
- Keep hydration adequate
- Choose isolate if lactose sensitive

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How do I handle weight-loss plateaus?',
        answer: `Plateaus are common.

Action steps:
- Recheck portions and liquid calories
- Keep protein adequate
- Add steps or strength progression
- Track waist and energy, not only scale
- Adjust calories slightly (about 100-150 kcal) if needed

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How can I manage weekend overeating?',
        answer: `Use a flexible strategy:
- Keep breakfast/lunch lighter but protein-rich
- Decide portion before social meals
- Choose one indulgence, not many
- Return to routine next meal/day

Weekly consistency matters more than one perfect day.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are practical portion control tips for Indian meals?',
        answer: `Useful methods:
- Use smaller plates
- Measure oil with teaspoons
- Serve one roti at a time
- Start meals with salad/soup
- Keep serving bowls away from table

Pair all meals with protein to control hunger.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can intermittent fasting help with weight loss?',
        answer: `Intermittent fasting can help some people by reducing eating windows, but it is not mandatory.

Fat loss depends on sustained calorie deficit and adherence.

If fasting causes headaches, overeating later, poor sleep, or low training quality, switch to regular balanced meal timing.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are signs that my calorie intake is too low?',
        answer: `Possible signs:
- Constant fatigue
- Poor sleep
- Irritability
- Strong cravings
- Training performance drop
- Menstrual irregularity in women

Consider increasing calories modestly and improving protein and micronutrient quality.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How can I improve cholesterol naturally through food?',
        answer: `Focus on:
- Soluble fiber (oats, beans, fruit)
- Better fats (nuts, seeds, fish, olive/mustard oil)
- Less fried and processed foods
- Better weight and activity routine

Consistent changes over months are more effective than short extreme diets.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are low sodium swaps for everyday foods?',
        answer: `Try these swaps:
- Chips to roasted chana
- Instant noodles to homemade vegetable sevai
- Packaged sauces to homemade chutney
- Flavored oats to plain oats with spices

Read labels and choose lower sodium per serving.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What are potassium rich foods for blood pressure support?',
        answer: `High-potassium foods include:
- Banana
- Coconut water
- Spinach
- Sweet potato
- Tomato
- Lentils and beans
- Curd

Use food-first sources and keep sodium controlled for best BP support.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'What should I eat on rest days for muscle recovery?',
        answer: `Keep protein intake similar to workout days.

You may slightly reduce carbs if activity is lower, but do not cut them fully.

Include anti-inflammatory foods:
- Vegetables and fruits
- Nuts and seeds
- Omega-3 rich choices

Recovery also depends strongly on sleep quality.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'How do I meal prep for fat loss with a busy schedule?',
        answer: `Meal prep in batches 2 times per week:
- One grain base (rice/millet)
- One protein base (dal/chana/chicken/paneer/tofu)
- Two vegetable preparations
- Ready snack boxes (fruit, curd, roasted chana, nuts)

Simple repeatable meals improve consistency better than complex plans.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'I have high blood pressure. What should I avoid first?',
        answer: `First reduce:
- Processed salty snacks
- Pickles, papad, packaged soups
- High-sodium sauces
- Frequent fried restaurant foods

Then increase:
- Vegetables, fruits, legumes, whole grains, and hydration.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Can I drink coconut water daily?',
        answer: `Coconut water can support hydration and potassium intake, especially in hot weather or after sweating.

Keep portions moderate and account for natural sugars, especially if you have diabetes.

Use plain water as primary hydration, with coconut water as a supportive option.

${SAFETY_DISCLAIMER}`
    },
    {
        question: 'Is skipping breakfast bad for metabolism?',
        answer: `Skipping breakfast is not automatically harmful, but it can increase later overeating in some people.

If you skip breakfast and feel low energy or intense cravings, a balanced morning meal may help.

Choose the routine that supports your appetite control, energy, and consistency.

${SAFETY_DISCLAIMER}`
    }
];

const STOP_WORDS = new Set([
    'the', 'is', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'with', 'my',
    'i', 'me', 'you', 'your', 'can', 'what', 'how', 'should', 'do', 'does', 'it', 'if',
    'are', 'be', 'at', 'by', 'from', 'this', 'that'
]);

const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const tokenize = (value: string): string[] =>
    normalizeText(value)
        .split(' ')
        .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const INDEXED_FAQ = NOVA_FALLBACK_QA.map((item) => {
    const normalizedQuestion = normalizeText(item.question);
    const tokens = tokenize(item.question);
    return {
        ...item,
        normalizedQuestion,
        tokens,
        tokenSet: new Set(tokens)
    };
});

export const findBestFallbackAnswer = (query: string): string | null => {
    const normalizedQuery = normalizeText(query);
    const queryTokens = tokenize(query);

    if (!normalizedQuery) {
        return null;
    }

    let bestScore = -1;
    let bestAnswer: string | null = null;

    for (const item of INDEXED_FAQ) {
        let score = 0;

        if (normalizedQuery === item.normalizedQuestion) {
            score += 120;
        }

        if (normalizedQuery.includes(item.normalizedQuestion) || item.normalizedQuestion.includes(normalizedQuery)) {
            score += 40;
        }

        let overlap = 0;
        for (const token of queryTokens) {
            if (item.tokenSet.has(token)) {
                overlap += 1;
            }
        }

        const union = new Set([...queryTokens, ...item.tokens]).size || 1;
        score += (overlap / union) * 70;

        if (overlap >= 3) {
            score += 10;
        }

        if (queryTokens.length <= 4 && overlap >= 2) {
            score += 12;
        }

        if (score > bestScore) {
            bestScore = score;
            bestAnswer = item.answer;
        }
    }

    return bestScore >= 24 ? bestAnswer : null;
};
