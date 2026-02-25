import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, HeartPulse, Stethoscope, Users, BarChart3 } from 'lucide-react';
import { Card } from '../components/UI/Card';

const highlights = [
    {
        icon: <Stethoscope className="w-5 h-5 text-primary" />,
        title: 'Clinical Expertise',
        description: 'Evidence-led guidance designed with metabolic health, recovery nutrition, and sustainable habits in mind.'
    },
    {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        title: 'Privacy First',
        description: 'Secure sessions, minimal data exposure, and a platform built for responsible health insights.'
    },
    {
        icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
        title: 'Whole-Body Focus',
        description: 'Nutrition guidance that respects lifestyle, preferences, and long-term outcomes.'
    }
];

const stats = [
    { label: 'Active users', value: '42K+' },
    { label: 'Guided sessions', value: '310K+' },
    { label: 'Nutrition insights', value: '1.2M+' }
];

const pillars = [
    {
        title: 'Precision Guidance',
        detail: 'We translate complex nutrition science into clear, actionable steps tailored to your day.'
    },
    {
        title: 'Human-Centered Design',
        detail: 'Every workflow is tuned to feel calming, premium, and effortless while you focus on your health.'
    },
    {
        title: 'Continuous Improvement',
        detail: 'Models, workflows, and insights evolve with clinician feedback and user outcomes.'
    }
];

export const About = () => {
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
                            About HealthScan Pro
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Premium nutrition intelligence, built around you.</h1>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                            HealthScan Pro blends clinical nutrition rigor with elegant product design, helping you make confident
                            decisions about meals, ingredients, and daily health habits.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm shadow-slate-200/30">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-sm font-black text-slate-800 mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
                <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            <BarChart3 className="w-3.5 h-3.5 text-secondary" />
                            Our Pillars
                        </div>
                        <div className="space-y-3">
                            {pillars.map((pillar) => (
                                <div key={pillar.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                    <h3 className="text-sm font-black text-slate-800">{pillar.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{pillar.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="rounded-3xl border-white/80 bg-white/75 backdrop-blur-xl shadow-md shadow-slate-200/40">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            Designed For
                        </div>
                        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <p>Patients seeking clarity on ingredients and nutrition trade-offs.</p>
                            <p>Clinicians who need a modern companion for nutrition coaching.</p>
                            <p>Wellness-focused teams delivering premium, compliant guidance.</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-xs text-emerald-700 font-semibold">
                            Built with responsible AI guardrails and human-centered workflows.
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.07 }}
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
