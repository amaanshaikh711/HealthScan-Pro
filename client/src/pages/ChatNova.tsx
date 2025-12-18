import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Send, Bot, User, Loader2, Sparkles, Apple, Flame, Activity, Zap, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// It's recommended to move this to an environment variable in production
const API_KEY = "AIzaSyDYYNbXJ6td2y0I-izcS1QGyAZ2g_ltQE0";
const genAI = new GoogleGenerativeAI(API_KEY);

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

const QUICK_QUERIES = [
    { label: "Weight Loss", icon: <Flame className="w-3 h-3" />, prompt: "Can you suggest a healthy 1500 calorie meal plan for weight loss?" },
    { label: "Muscle Gain", icon: <Zap className="w-3 h-3" />, prompt: "What are the best high-protein snacks for muscle recovery?" },
    { label: "Heart Health", icon: <Activity className="w-3 h-3" />, prompt: "What is an ideal DASH diet breakfast for heart health?" },
    { label: "High Fiber", icon: <Apple className="w-3 h-3" />, prompt: "Suggest some high-fiber foods to improve my digestion." }
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatSession, setChatSession] = useState<any>(null);

    // Initialize chat session on mount
    useEffect(() => {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });
        setChatSession(chat);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (userPrompt?: string) => {
        const query = userPrompt || input;
        if (!query.trim() || isLoading || !chatSession) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatSession.sendMessage(query);
            const response = await result.response;
            const text = response.text();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            let errorMessage = "I apologize, but I'm having trouble accessing my medical database. ";

            if (error.message?.includes("404")) {
                errorMessage += "There seems to be an issue with my system connection (404). Please ensure the API service is active.";
            } else if (error.message?.includes("403")) {
                errorMessage += "My access key seems to be restricted. Please verify your API key permissions.";
            } else {
                errorMessage += "Please try again in a moment.";
            }

            const botErrorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botErrorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearHistory = () => {
        setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: "History cleared. I'm ready for new questions, Dr. Nova at your service!",
            timestamp: new Date()
        }]);
        // Re-init chat session
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });
        setChatSession(model.startChat({ history: [] }));
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            {/* Header Area */}
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
                {/* Chat Display */}
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
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user'
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-gradient-to-br from-primary to-secondary text-white'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    <div className={`p-4 rounded-[24px] shadow-sm relative ${msg.role === 'user'
                                            ? 'bg-slate-800 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                                            {/* Simple Markdown-like replacement for Bold (**) and Bullet Points (-) */}
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={line.startsWith('- ') ? 'ml-2 mb-1 pl-4 relative before:content-["•"] before:absolute before:left-0' : 'mb-2 last:mb-0'}>
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

                {/* Input Area */}
                <div className="p-6 bg-white/60 border-t border-white/80">
                    {/* Quick Queries */}
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
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask Dr. Nova anything about your health..."
                            className="w-full pl-6 pr-14 py-4 bg-white border-2 border-slate-50 focus:border-primary/30 rounded-2xl transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className={`absolute right-2 p-3 rounded-xl transition-all ${input.trim()
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95'
                                    : 'bg-slate-100 text-slate-300'
                                }`}
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

