import { useEffect, useRef, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Send, Bot, User, Apple, Flame, Activity, Zap, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findBestFallbackAnswer } from './novaFallbackFaq';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

type DeepSeekRole = 'system' | 'user' | 'assistant';

type DeepSeekMessage = {
    role: DeepSeekRole;
    content: string;
};

type DeepSeekResponse = {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
    error?: {
        message?: string;
        type?: string;
        code?: string | number;
    };
};

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_CHAT_URL = `${DEEPSEEK_BASE_URL.replace(/\/$/, '')}/v1/chat/completions`;
const REQUEST_TIMEOUT_MS = 30000;
const CHAT_PAGE_BACKGROUND = 'linear-gradient(135deg, #F8FBFD 0%, #F1FAF9 40%, #ECF7F6 70%, #FFFFFF 100%)';

const QUICK_QUERIES = [
    { label: 'Weight Loss', icon: <Flame className="w-3 h-3" />, prompt: 'Can you suggest a healthy 1500 calorie meal plan for weight loss?' },
    { label: 'Muscle Gain', icon: <Zap className="w-3 h-3" />, prompt: 'What are the best high-protein snacks for muscle recovery?' },
    { label: 'Heart Health', icon: <Activity className="w-3 h-3" />, prompt: 'What is an ideal DASH diet breakfast for heart health?' },
    { label: 'High Fiber', icon: <Apple className="w-3 h-3" />, prompt: 'Suggest some high-fiber foods to improve my digestion.' }
];

const SYSTEM_INSTRUCTION = `You are Dr. Nova, a world-class AI Nutritionist and Medical Dietitian with a specialization in preventive medicine. 
Your goal is to provide evidence-based, professional, and highly personalized nutritional guidance.

Core Principles:
1. MEDICAL AUTHORITY: Speak with the precision of a doctor but the warmth of a coach. Use terms like 'macronutrients', 'glycemic index', and 'metabolic rate' where appropriate, but explain them simply.
2. SCIENCE-BACKED: Reference nutritional science (e.g., USDA guidelines, WHO standards) when making recommendations.
3. PERSONALIZATION: Always ask follow-up questions about the user's activity levels, allergies, or health goals if their query is vague.
4. SAFETY FIRST: If a user mentions chest pain, severe allergies, or extreme symptoms, immediately include a disclaimer: "As an AI, I cannot provide an official medical diagnosis. Please consult a physician immediately for these symptoms."
5. FORMATTING: Use bold text for key terms, bullet points for meal lists, and keep paragraphs short.

Prohibitions:
- DO NOT answer questions unrelated to health, nutrition, fitness, or biology.
- DO NOT recommend extreme 'fad' diets or unsafe weight loss products.
- DO NOT provide toxic or harmful health advice.

Character:
- Warm, professional, empathetic, and clinical.
- You celebrate user wins and provide constructive adjustments for challenges.`;

const getHttpErrorMessage = (status: number): string => {
    if (status === 400) return 'Bad request (400). Please adjust your query and retry.';
    if (status === 401) return 'Authentication failed (401). Verify your DeepSeek API key.';
    if (status === 402) return 'Insufficient balance (402). Please top up your DeepSeek credits and try again.';
    if (status === 403) return 'Access denied (403). Your key may not have permission for this API.';
    if (status === 404) return 'Endpoint or model not found (404). Check model name and base URL.';
    if (status === 408) return 'Request timeout (408). Please try again.';
    if (status === 422) return 'Request validation failed (422).';
    if (status === 429) return 'Rate limit reached (429). Please wait and retry.';
    if (status >= 500) return 'DeepSeek service is temporarily unavailable (5xx).';
    return `Unexpected API error (HTTP ${status}).`;
};

const mapMessagesToDeepSeek = (history: Message[], latestUserInput: string): DeepSeekMessage[] => [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...history.map((msg) => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: latestUserInput }
];

const createLocalNovaResponse = (query: string): string => {
    const matchedAnswer = findBestFallbackAnswer(query);
    if (matchedAnswer) {
        return matchedAnswer;
    }

    const q = query.toLowerCase();

    if (q.includes('chest pain') || q.includes('severe allergy') || q.includes('anaphylaxis') || q.includes('fainting')) {
        return `As an AI, I cannot provide an official medical diagnosis. Please consult a physician immediately for these symptoms.

While waiting for care:
- Avoid new foods/supplements.
- Stay hydrated with small sips of water.
- Keep a list of recent foods/medications for your doctor.`;
    }

    if (q.includes('weight loss') || q.includes('fat loss') || q.includes('lose weight')) {
        return `**Weight Loss Framework (Clinical Safe)**
- Target a moderate calorie deficit: ~300-500 kcal/day.
- Protein goal: 1.6-2.0 g/kg body weight daily.
- Fiber goal: 25-35 g/day to improve satiety.

**Sample Day**
- Breakfast: Greek yogurt + berries + oats
- Lunch: Grilled chicken/quinoa salad
- Dinner: Paneer/tofu + vegetables + millet
- Snack: Apple + nuts

If you share age, weight, height, and activity level, I can give exact macro targets.`;
    }

    if (q.includes('muscle') || q.includes('protein') || q.includes('bulk') || q.includes('gain')) {
        return `**Muscle Gain Nutrition Plan**
- Protein: 1.8-2.2 g/kg body weight.
- Calories: mild surplus of 200-300 kcal/day.
- Distribute protein across 4-5 feedings.

**High-Quality Protein Options**
- Eggs, chicken, fish, paneer, tofu, Greek yogurt, whey.

**Post-Workout Plate**
- 25-35 g protein + 40-80 g carbs + fluids/electrolytes.`;
    }

    if (q.includes('heart') || q.includes('cholesterol') || q.includes('bp') || q.includes('blood pressure')) {
        return `**Heart-Healthy Guidance**
- Follow DASH-style pattern: high vegetables, fruit, legumes, whole grains.
- Limit sodium to ~1500-2000 mg/day when BP is elevated.
- Prefer unsaturated fats (nuts, seeds, olive oil, fish).
- Reduce ultra-processed and high-trans-fat foods.

If you share your BP and lipid profile, I can tailor meal choices.`;
    }

    if (q.includes('fiber') || q.includes('digestion') || q.includes('constipation') || q.includes('gut')) {
        return `**Digestive Health Plan**
- Fiber: add gradually toward 25-35 g/day.
- Hydration: 2-3 L/day depending on activity/heat.
- Include fermented foods: yogurt, kefir, kimchi (if tolerated).

**Easy Fiber Upgrades**
- Add chia/flax to breakfast.
- Replace refined grains with whole grains.
- Add 1 fruit + 1 salad daily.`;
    }

    if (q.includes('diabetes') || q.includes('blood sugar') || q.includes('glucose')) {
        return `**Blood Sugar Stabilization**
- Pair carbs with protein/fat at each meal.
- Prefer low-glycemic carbs and high-fiber foods.
- Keep meal timing consistent and avoid large sugar loads.

**Practical Meal Structure**
- 1/2 plate non-starchy vegetables
- 1/4 lean protein
- 1/4 whole-grain or legume carbs`;
    }

    return `**Personalized Nutrition Guidance**
- Focus on high-protein, high-fiber whole foods.
- Keep hydration consistent across the day.
- Reduce refined sugars and highly processed snacks.

Share your goal (fat loss, muscle gain, gut health, heart health), and I will create a complete meal plan with calories and macros.`;
};

const isInsufficientBalanceError = (message: string): boolean =>
    message.toLowerCase().includes('insufficient balance') || message.includes('402');

export const ChatNova = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Welcome to HealthScan Pro. I'm **Dr. Nova**, your AI Nutritionist. Whether you're looking to optimize your diet, manage a health condition, or just eat better, I'm here to provide professional, data-driven advice. \n\nHow can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocalMode, setIsLocalMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!DEEPSEEK_API_KEY) {
            setIsLocalMode(true);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: 'DeepSeek key is missing, so Nova switched to **Local Guidance Mode**. You can still ask nutrition questions and get actionable guidance.',
                    timestamp: new Date()
                }
            ]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (userPrompt?: string) => {
        const query = (userPrompt || input).trim();
        if (!query || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date()
        };

        const conversationForModel = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (!DEEPSEEK_API_KEY || isLocalMode) {
            const localResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `${!DEEPSEEK_API_KEY ? 'Using **Local Guidance Mode** because API key is not configured.\n\n' : ''}${createLocalNovaResponse(query)}`,
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, localResponse]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const payload = {
                model: 'deepseek-chat',
                messages: mapMessagesToDeepSeek(conversationForModel, query),
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            };

            const response = await fetch(DEEPSEEK_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            const requestId = response.headers.get('x-request-id') || response.headers.get('request-id');

            if (!response.ok) {
                let detail = '';
                try {
                    const errorData = (await response.json()) as DeepSeekResponse;
                    detail = errorData?.error?.message || '';
                } catch {
                    try {
                        detail = await response.text();
                    } catch {
                        detail = '';
                    }
                }

                const friendly = getHttpErrorMessage(response.status);
                const supportHint = requestId ? ` Request ID: ${requestId}.` : '';
                const detailText = detail ? ` Details: ${detail}` : '';
                throw new Error(`${friendly}${supportHint}${detailText}`);
            }

            const data = (await response.json()) as DeepSeekResponse;
            const text = data?.choices?.[0]?.message?.content?.trim();

            if (!text) {
                throw new Error('Received an empty response from DeepSeek.');
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: text,
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('DeepSeek API error:', error);
            let errorMessage = "I switched to **Local Guidance Mode** so you can continue without interruption.\n\n";
            const rawMessage = error instanceof Error ? error.message : '';

            if (isInsufficientBalanceError(rawMessage)) {
                setIsLocalMode(true);
            }

            if (error instanceof DOMException && error.name === 'AbortError') {
                errorMessage += 'DeepSeek request timed out.\n\n';
            } else if (error instanceof TypeError) {
                errorMessage += 'DeepSeek network error detected.\n\n';
            } else if (error instanceof Error) {
                errorMessage += `${error.message}\n\n`;
            } else {
                errorMessage += 'Temporary API issue.\n\n';
            }

            const botErrorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `${errorMessage}${createLocalNovaResponse(query)}`,
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botErrorMessage]);
        } finally {
            clearTimeout(timeout);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const clearHistory = () => {
        setMessages([
            {
                id: Date.now().toString(),
                role: 'assistant',
                content: "History cleared. I'm ready for new questions, Dr. Nova at your service!",
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div
            className="h-[calc(100vh-8rem)] flex flex-col gap-4"
            style={{ background: CHAT_PAGE_BACKGROUND }}
        >
            <div className="flex items-center justify-between py-2 px-1">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ask Nova</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pro Expert</span>
                            <span className="text-[10px] text-slate-400 font-medium">Available 24/7</span>
                            {isLocalMode && <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Local Guidance Mode</span>}
                        </div>
                    </div>
                </div>
                <button
                    onClick={clearHistory}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Clear Chat"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-white/60 bg-white/40 backdrop-blur-3xl shadow-2xl shadow-slate-200/50 rounded-[32px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    <div className={`p-4 rounded-[24px] shadow-sm relative ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={line.startsWith('- ') ? "ml-2 mb-1 pl-4 relative before:content-['-'] before:absolute before:left-0" : 'mb-2 last:mb-0'}>
                                                    {line.replace(/^- /, '').split('**').map((part, j) => (
                                                        j % 2 === 1 ? <strong key={j} className="font-black">{part}</strong> : part
                                                    ))}
                                                </p>
                                            ))}
                                        </div>
                                        <div className={`text-[9px] mt-2 font-bold opacity-40 uppercase tracking-tighter ${msg.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-3 items-center ml-12">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nova is analyzing...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-white/60 border-t border-white/80">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none no-scrollbar">
                        {QUICK_QUERIES.map((q) => (
                            <button
                                key={q.label}
                                onClick={() => handleSend(q.prompt)}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-100 rounded-full text-xs font-bold text-slate-600 hover:border-primary hover:text-primary hover:bg-white transition-all shadow-sm"
                            >
                                {q.icon}
                                {q.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask Dr. Nova anything about your health..."
                            className="w-full pl-6 pr-14 py-4 bg-white border-2 border-slate-50 focus:border-primary/30 rounded-2xl transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className={`absolute right-2 p-3 rounded-xl transition-all ${input.trim() ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 opacity-50">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">AI advice should be cross-verified with laboratory results and physical exams.</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
