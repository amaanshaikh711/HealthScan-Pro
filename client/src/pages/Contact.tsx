import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

const contactCards = [
    {
        icon: <Mail className="w-5 h-5 text-primary" />,
        title: 'Email Support',
        detail: 'care@healthscanpro.ai',
        sub: 'Priority response within 24 hours.'
    },
    {
        icon: <Phone className="w-5 h-5 text-secondary" />,
        title: 'Concierge Line',
        detail: '+1 (415) 555-0148',
        sub: 'Mon–Fri, 8am–6pm PT.'
    },
    {
        icon: <MapPin className="w-5 h-5 text-emerald-500" />,
        title: 'Headquarters',
        detail: 'San Francisco, CA',
        sub: 'Remote-friendly care team.'
    }
];

export const Contact = () => {
    return (
        <div className="space-y-8 pb-10">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-6 sm:p-8"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(20,184,166,0.12),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.12),transparent_35%)]" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            Contact Nova Care
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Let’s design your premium nutrition experience.</h1>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                            Reach our care team for partnerships, clinical onboarding, or premium support tailored to your workflow.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-slate-500 border border-white/70 shadow-sm shadow-slate-200/40">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        Average response time: 4 hours
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.06 }}
                    >
                        <Card className="h-full border-white/80 bg-white/75 backdrop-blur-xl rounded-2xl shadow-md shadow-slate-200/40">
                            <div className="space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    {card.icon}
                                </div>
                                <h3 className="text-sm font-black text-slate-800">{card.title}</h3>
                                <p className="text-sm text-slate-600">{card.detail}</p>
                                <p className="text-xs text-slate-400">{card.sub}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
                <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                    <form
                        onSubmit={(event) => event.preventDefault()}
                        className="space-y-4"
                    >
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Send a request</p>
                            <h2 className="text-2xl font-black text-slate-900">Tell us how we can help.</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full name"
                                className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                            <input
                                type="email"
                                placeholder="Work email"
                                className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Organization"
                            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        <textarea
                            placeholder="Describe your goals, patient population, or integration needs."
                            rows={5}
                            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <p className="text-xs text-slate-400">We only use this information to respond to your request.</p>
                            <Button type="submit" icon={<Send className="w-4 h-4" />}>
                                Send Message
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Care Commitment</p>
                        <h3 className="text-xl font-black text-slate-900">Premium support coverage</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5" />
                                Dedicated success manager for enterprise clinics.
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5" />
                                Clinical onboarding with nutrition workflow audits.
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5" />
                                24/7 incident response for critical deployments.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs text-slate-500">
                            For security or compliance inquiries, contact security@healthscanpro.ai.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
