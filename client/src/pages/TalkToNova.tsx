import { Bot, Mic, ShieldCheck, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/UI/Card';
import { VoiceAgent } from '../components/VoiceAgent';

const TALK_PAGE_BACKGROUND = 'linear-gradient(135deg, #F8FBFD 0%, #F1FAF9 40%, #ECF7F6 70%, #FFFFFF 100%)';

const highlights = [
    {
        icon: <Mic className="w-5 h-5 text-primary" />,
        title: 'Natural Conversation',
        description: 'Speak directly to Nova and get real-time clinical nutrition guidance.'
    },
    {
        icon: <Waves className="w-5 h-5 text-secondary" />,
        title: 'Live Session Control',
        description: 'Start and stop your voice session instantly when you are ready.'
    },
    {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        title: 'Secure Browser Mode',
        description: 'Works best on HTTPS and modern browsers with microphone permission enabled.'
    }
];

export const TalkToNova = () => {
    return (
        <div className="space-y-6 min-h-[calc(100vh-8rem)]" style={{ background: TALK_PAGE_BACKGROUND }}>
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-primary bg-primary/10">
                            <Bot className="w-3.5 h-3.5" />
                            Voice Nutritionist
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800">Talk to Nova</h1>
                        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
                            Have a live voice session with Nova for meal planning, macro guidance, and practical nutrition recommendations.
                        </p>
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/40 p-6 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.08),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.08),transparent_35%)]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Live Session Preview</p>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">Real-time Voice Intelligence</h2>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            Nova listens, understands context, and responds naturally in one continuous voice interaction.
                        </p>
                    </div>

                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                        <motion.div
                            className="absolute w-full h-full rounded-full bg-gradient-to-br from-sky-200 via-indigo-100 to-fuchsia-200 opacity-70 blur-xl"
                            animate={{ scale: [1, 1.08, 1], rotate: [0, 22, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-[conic-gradient(from_90deg,rgba(56,189,248,0.55),rgba(167,139,250,0.55),rgba(34,197,94,0.45),rgba(56,189,248,0.55))] blur-[2px]"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white/70 border border-white/60 backdrop-blur-md"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/20"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Mic className="w-6 h-6" />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <VoiceAgent />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.map((item) => (
                    <Card
                        key={item.title}
                        className="border-white/80 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md shadow-slate-200/40"
                    >
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-sm font-black text-slate-800">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
