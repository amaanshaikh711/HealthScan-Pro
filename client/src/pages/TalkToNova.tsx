import { Bot, Brain, CheckCircle2, Mic, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/UI/Card';
import { VoiceAgent } from '../components/VoiceAgent';

const TALK_PAGE_BACKGROUND = 'linear-gradient(135deg, #F8FBFD 0%, #F1FAF9 40%, #ECF7F6 70%, #FFFFFF 100%)';

const highlights = [
    {
        icon: <Mic className="w-5 h-5 text-primary" />,
        title: 'Natural Conversation',
        description: 'Speak directly to Nova and receive real-time responses with context-aware nutrition support.'
    },
    {
        icon: <Brain className="w-5 h-5 text-secondary" />,
        title: 'Clinical Reasoning',
        description: 'Structured guidance designed for meal planning, recovery nutrition, and everyday health decisions.'
    },
    {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        title: 'Secure Session Flow',
        description: 'Built for modern browsers with microphone consent, HTTPS safety, and clear call controls.'
    }
];

const checklist = [
    'Use Chrome, Edge, or Safari for stable microphone support.',
    'Allow microphone permission when prompted by the browser.',
    'Stay in a quiet space to improve speech recognition quality.',
    'Use short and specific prompts for better nutrition recommendations.'
];

const workflow = [
    { step: '1', title: 'Start Session', detail: 'Click Start Session and grant microphone access.' },
    { step: '2', title: 'Speak Naturally', detail: 'Describe your goals, diet pattern, and any restrictions.' },
    { step: '3', title: 'Get Guidance', detail: 'Nova responds with practical meal and lifestyle advice.' }
];

export const TalkToNova = () => {
    return (
        <div
            className="space-y-6 min-h-[calc(100vh-8rem)]"
            style={{ background: TALK_PAGE_BACKGROUND }}
        >
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl border border-white/80 bg-white/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(20,184,166,0.12),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.12),transparent_35%)]" />
                <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] text-primary bg-primary/10 border border-primary/20">
                            <Bot className="w-3.5 h-3.5" />
                            Voice Nutritionist
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800">Talk to Nova</h1>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                            Run a live voice consultation with Nova for personalized meal planning, calorie awareness,
                            macro balancing, and practical day-to-day nutrition advice.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
                        <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm shadow-slate-200/30">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Voice</p>
                            <p className="text-sm font-black text-slate-800 mt-1">Emma</p>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm shadow-slate-200/30">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Model</p>
                            <p className="text-sm font-black text-slate-800 mt-1">GPT-4.1</p>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm shadow-slate-200/30">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transcriber</p>
                            <p className="text-sm font-black text-slate-800 mt-1">Flux (Deepgram)</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8 items-stretch">
                <VoiceAgent className="h-full xl:min-h-[720px]" />

                <div className="space-y-4 xl:sticky xl:top-6">
                    <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                Before You Start
                            </div>
                            <div className="space-y-2">
                                {checklist.map((item) => (
                                    <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                <Waves className="w-3.5 h-3.5 text-secondary" />
                                Session Workflow
                            </div>
                            <div className="space-y-3">
                                {workflow.map((item) => (
                                    <div key={item.step} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-black flex items-center justify-center">
                                                {item.step}
                                            </span>
                                            <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-2">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.06 }}
                    >
                        <Card className="h-full border-white/80 bg-white/75 backdrop-blur-xl rounded-2xl shadow-md shadow-slate-200/40">
                            <div className="space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="text-sm font-black text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
