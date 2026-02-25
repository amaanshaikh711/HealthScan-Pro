import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { AlertCircle, Loader2, Mic, MicOff, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const ASSISTANT_ID = '06a3cdb1-729f-43e8-82e2-fd0ad7ced5e5';
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

type VoiceAgentProps = {
    className?: string;
};

const formatVapiError = (error: unknown): string => {
    if (typeof error === 'string' && error.trim()) return error.trim();
    if (error instanceof Error && error.message.trim()) return error.message.trim();

    if (error && typeof error === 'object') {
        const maybeError = error as { message?: string; error?: { message?: string } };
        if (typeof maybeError.message === 'string' && maybeError.message.trim()) return maybeError.message.trim();
        if (typeof maybeError.error?.message === 'string' && maybeError.error.message.trim()) return maybeError.error.message.trim();
    }

    return 'Voice session could not start. Please check microphone permissions and try again.';
};

const canUseVoiceInCurrentOrigin = (): boolean => {
    if (typeof window === 'undefined') return true;
    if (window.isSecureContext) return true;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

export const VoiceAgent = ({ className }: VoiceAgentProps) => {
    const vapiRef = useRef<Vapi | null>(null);
    const startTimeoutRef = useRef<number | null>(null);

    const [isCallActive, setIsCallActive] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasPublicKey = Boolean(VAPI_PUBLIC_KEY?.trim());
    const isSupportedOrigin = useMemo(() => canUseVoiceInCurrentOrigin(), []);
    const canUseVoice = hasPublicKey && isSupportedOrigin;

    useEffect(() => {
        if (!hasPublicKey) {
            setErrorMessage('Voice mode is unavailable because Vapi public key is missing.');
            return;
        }

        if (!isSupportedOrigin) {
            setErrorMessage('Voice mode requires HTTPS in production. Use https:// or localhost.');
            return;
        }

        if (!vapiRef.current) {
            vapiRef.current = new Vapi(VAPI_PUBLIC_KEY!.trim());
        }

        const vapi = vapiRef.current;
        setErrorMessage(null);

        const clearStartTimeout = () => {
            if (startTimeoutRef.current) {
                window.clearTimeout(startTimeoutRef.current);
                startTimeoutRef.current = null;
            }
        };

        const onCallStart = () => {
            clearStartTimeout();
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(true);
            setErrorMessage(null);
        };

        const onCallEnd = () => {
            clearStartTimeout();
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(false);
        };

        const onError = (error: unknown) => {
            clearStartTimeout();
            setIsStarting(false);
            setIsStopping(false);
            setIsCallActive(false);
            setErrorMessage(formatVapiError(error));
        };

        // Debug hooks to confirm the agent hears you
        const onSpeechStart = () => console.log('[Vapi] user speech-start');
        const onSpeechEnd = () => console.log('[Vapi] user speech-end');
        const onMessage = (msg: any) => {
            // Depending on SDK version, transcripts come through `message` events
            if (msg?.type === 'transcript' || msg?.type?.includes?.('transcript')) {
                console.log('[Vapi] transcript message:', msg);
            }
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);

        // These may or may not exist depending on SDK version; harmless to attach.
        vapi.on?.('speech-start', onSpeechStart);
        vapi.on?.('speech-end', onSpeechEnd);
        vapi.on?.('message', onMessage);

        return () => {
            clearStartTimeout();
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);

            vapi.off?.('speech-start', onSpeechStart);
            vapi.off?.('speech-end', onSpeechEnd);
            vapi.off?.('message', onMessage);
        };
    }, [hasPublicKey, isSupportedOrigin]);

    useEffect(() => {
        return () => {
            if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
            vapiRef.current?.stop();
        };
    }, []);

    const handleStart = useCallback(async () => {
        if (!canUseVoice || isCallActive || isStarting || isStopping) return;

        const vapi = vapiRef.current;
        if (!vapi) {
            setErrorMessage('Voice client is not ready yet. Refresh and try again.');
            return;
        }

        setIsStarting(true);
        setErrorMessage(null);

        // Safety: if call-start never fires, surface an actionable error.
        if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = window.setTimeout(() => {
            setIsStarting(false);
            setIsCallActive(false);
            setErrorMessage(
                'Connected, but no audio/transcription is coming through. Fix the assistant transcriber: use Deepgram "nova-2" (Flux often causes "Hello then silence" in web calls).'
            );
        }, 12000);

        try {
            await vapi.start(ASSISTANT_ID);
        } catch (error) {
            if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
            startTimeoutRef.current = null;
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

    const statusText = useMemo(() => {
        if (isStarting) return 'Connecting to Nova...';
        if (isStopping) return 'Stopping voice session...';
        if (isCallActive) return 'Live conversation is active';
        return 'Ready for voice chat';
    }, [isCallActive, isStarting, isStopping]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={twMerge(
                'rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-4 sm:p-5',
                className
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Voice Assistant</p>
                    <h3 className="text-lg sm:text-xl font-black text-slate-800">Talk to Nova</h3>
                    <p className="text-sm text-slate-500">Speak naturally and get live nutrition guidance.</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={handleStart}
                        disabled={!canUseVoice || isCallActive || isStarting || isStopping}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all hover:brightness-105"
                    >
                        {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                        Start Nova
                    </button>

                    <button
                        type="button"
                        onClick={handleStop}
                        disabled={!isCallActive || isStarting || isStopping}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
                    >
                        {isStopping ? <Loader2 className="w-4 h-4 animate-spin" /> : <MicOff className="w-4 h-4" />}
                        Stop
                    </button>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <div
                    className={twMerge(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                        isCallActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    )}
                >
                    <Radio className={twMerge('w-3.5 h-3.5', isCallActive && 'animate-pulse')} />
                    {statusText}
                </div>

                {errorMessage && (
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errorMessage}
                    </div>
                )}
            </div>
        </motion.section>
    );
};