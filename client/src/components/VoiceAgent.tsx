import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AlertCircle, CheckCircle2, Clock3, Loader2, Mic, MicOff, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const ASSISTANT_ID = '06a3cdb1-729f-43e8-82e2-fd0ad7ced5e5';
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

type VoiceAgentProps = {
    className?: string;
};

const formatVapiError = (error: unknown): string => {
    if (typeof error === 'string' && error.trim()) return error.trim();
    if (error instanceof Error && error.message.trim()) return error.message.trim();

    if (error && typeof error === 'object') {
        const maybeError = error as { message?: string; error?: { message?: string } };
        if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
            return maybeError.message.trim();
        }
        if (typeof maybeError.error?.message === 'string' && maybeError.error.message.trim()) {
            return maybeError.error.message.trim();
        }
    }

    return 'Voice session could not start. Please check microphone permissions and try again.';
};

const canUseVoiceInCurrentOrigin = (): boolean => {
    if (typeof window === 'undefined') return true;
    if (window.isSecureContext) return true;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const hasMicrophoneSupport = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return Boolean(navigator.mediaDevices?.getUserMedia);
};

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

export const VoiceAgent = ({ className }: VoiceAgentProps) => {
    const vapiRef = useRef<Vapi | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const hasPublicKey = Boolean(VAPI_PUBLIC_KEY?.trim());
    const isSupportedOrigin = useMemo(() => canUseVoiceInCurrentOrigin(), []);
    const isMicrophoneSupported = useMemo(() => hasMicrophoneSupport(), []);
    const canUseVoice = hasPublicKey && isSupportedOrigin && isMicrophoneSupported;

    useEffect(() => {
        if (!hasPublicKey) {
            setErrorMessage('Voice mode is unavailable because Vapi public key is missing.');
            return;
        }

        if (!isSupportedOrigin) {
            setErrorMessage('Voice mode requires HTTPS in production. Use https:// or localhost.');
            return;
        }

        if (!isMicrophoneSupported) {
            setErrorMessage('Microphone access is not supported in this browser.');
            return;
        }

        if (!vapiRef.current) {
            vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
        }

        const vapi = vapiRef.current;
        setErrorMessage(null);

        const onCallStart = () => {
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(true);
            setErrorMessage(null);
        };

        const onCallEnd = () => {
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(false);
        };

        const onError = (error: unknown) => {
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(false);
            setErrorMessage(formatVapiError(error));
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
        };
    }, [hasPublicKey, isSupportedOrigin, isMicrophoneSupported]);

    useEffect(() => {
        return () => {
            const vapi = vapiRef.current;
            if (!vapi) return;
            vapi.removeAllListeners();
            void vapi.stop().catch(() => undefined);
            vapiRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!isCallActive) {
            setElapsedSeconds(0);
            return;
        }

        const timer = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isCallActive]);

    const handleStart = useCallback(async () => {
        if (!canUseVoice || isCallActive || isStarting || isStopping) return;
        const vapi = vapiRef.current;
        if (!vapi) {
            setErrorMessage('Voice client is not ready yet. Refresh and try again.');
            return;
        }

        setIsStarting(true);
        setErrorMessage(null);

        try {
            await vapi.start(ASSISTANT_ID);
        } catch (error) {
            setIsStarting(false);
            setIsCallActive(false);
            setErrorMessage(formatVapiError(error));
        }
    }, [canUseVoice, isCallActive, isStarting, isStopping]);

    const handleStop = useCallback(async () => {
        if (!isCallActive || isStopping) return;
        const vapi = vapiRef.current;
        if (!vapi) return;

        setIsStopping(true);
        setErrorMessage(null);

        try {
            await vapi.stop();
        } catch (error) {
            setErrorMessage(formatVapiError(error));
        } finally {
            setIsStopping(false);
            setIsStarting(false);
            setIsCallActive(false);
        }
    }, [isCallActive, isStopping]);

    const isBusy = isStarting || isStopping;
    const statusLabel = isStarting
        ? 'Connecting to Nova...'
        : isStopping
            ? 'Ending session...'
            : isCallActive
                ? 'Live conversation is active'
                : 'Ready for voice session';

    const checks = [
        { label: 'Vapi public key configured', pass: hasPublicKey },
        { label: 'Secure context (HTTPS or localhost)', pass: isSupportedOrigin },
        { label: 'Microphone supported in browser', pass: isMicrophoneSupported }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={twMerge(
                'relative overflow-hidden rounded-3xl border border-white/10 min-h-[680px] lg:min-h-[740px] flex',
                className
            )}
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)',
            }}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className={twMerge(
                        'absolute -top-12 -left-14 w-64 h-64 rounded-full blur-3xl transition-all duration-1000',
                        isCallActive ? 'bg-emerald-500/20' : 'bg-teal-500/10'
                    )}
                />
                <div
                    className={twMerge(
                        'absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl transition-all duration-1000',
                        isCallActive ? 'bg-sky-500/20' : 'bg-indigo-500/10'
                    )}
                />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_10%_100%,rgba(20,184,166,0.12),transparent_40%)]" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-9 h-full flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] gap-8 lg:gap-12 items-center h-full">
                    <div className="relative flex items-center justify-center h-full">
                        <AnimatePresence>
                            {isCallActive && (
                                <motion.div
                                    key="pulse-ring"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-2 border-emerald-400/50"
                                />
                            )}
                        </AnimatePresence>

                        <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-slate-900/40">
                            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                                <DotLottieReact
                                    src="https://lottie.host/8ceec309-eb73-45f5-bd2a-b66658c218ab/tISPXak6Ct.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                        </div>

                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-9">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <motion.span
                                    key={index}
                                    className={twMerge(
                                        'w-1.5 rounded-full',
                                        isCallActive ? 'bg-emerald-300' : 'bg-slate-600'
                                    )}
                                    animate={{
                                        height: isCallActive ? [6, 14, 8, 16, 6] : [6, 6, 6]
                                    }}
                                    transition={{
                                        duration: 1.1,
                                        repeat: Infinity,
                                        delay: index * 0.08,
                                        ease: 'easeInOut'
                                    }}
                                />
                            ))}
                        </div>

                        <AnimatePresence>
                            {isCallActive && (
                                <motion.div
                                    key="live-badge"
                                    initial={{ opacity: 0, scale: 0.8, y: 4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30"
                                >
                                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                                    Live
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 text-center lg:text-left">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300 mb-1">
                                Voice Console
                            </p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Nova Live Session
                            </h3>
                            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto lg:mx-0">
                                Start a guided voice conversation with Nova and receive real-time clinical nutrition support.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                            <div
                                className={twMerge(
                                    'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-500 border',
                                    isCallActive
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35'
                                        : isBusy
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/35'
                                            : 'bg-white/10 text-slate-300 border-white/10'
                                )}
                            >
                                <span
                                    className={twMerge(
                                        'w-2 h-2 rounded-full',
                                        isCallActive
                                            ? 'bg-emerald-400 animate-pulse'
                                            : isBusy
                                                ? 'bg-amber-400 animate-pulse'
                                                : 'bg-slate-500'
                                    )}
                                />
                                {statusLabel}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-300 border border-white/10 bg-white/5">
                                <Clock3 className="w-3.5 h-3.5" />
                                {isCallActive ? `Session ${formatDuration(elapsedSeconds)}` : 'Session 00:00'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleStart}
                                disabled={!canUseVoice || isCallActive || isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isStarting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Mic className="w-4 h-4" />
                                )}
                                Start Session
                            </button>

                            <button
                                type="button"
                                onClick={handleStop}
                                disabled={!isCallActive || isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isStopping ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <MicOff className="w-4 h-4" />
                                )}
                                End Session
                            </button>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
                                Connection Checklist
                            </p>
                            <div className="space-y-2">
                                {checks.map((check) => (
                                    <div key={check.label} className="flex items-center justify-between gap-3 text-xs">
                                        <span className="text-slate-300">{check.label}</span>
                                        <span
                                            className={twMerge(
                                                'inline-flex items-center gap-1.5 font-semibold',
                                                check.pass ? 'text-emerald-300' : 'text-rose-300'
                                            )}
                                        >
                                            {check.pass ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            )}
                                            {check.pass ? 'Ready' : 'Issue'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                >
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
