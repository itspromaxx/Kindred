import { useState, useEffect } from "react";
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface PodcastPlayerProps {
    isOpen: boolean;
    onClose: () => void;
    story: {
        title: string;
        media_url: string;
        topic: string;
    } | null;
}

export function PodcastPlayer({ isOpen, onClose, story }: PodcastPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) setIsPlaying(true);
        else setIsPlaying(false);
    }, [isOpen]);

    if (!isOpen || !story) return null;

    const isYouTube = story.media_url?.includes("youtube") || story.media_url?.includes("youtu.be");

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] bg-[#1A1A1A] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 text-white">

                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
                    {/* Album Art / Video */}
                    <div className="w-full aspect-video md:aspect-square md:w-[400px] bg-black rounded-3xl overflow-hidden shadow-2xl mb-12 relative group">
                        {isYouTube ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={getEmbedUrl(story.media_url)}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#111]">
                                <span className="font-serif text-8xl opacity-10 italic">Aa</span>
                            </div>
                        )}
                    </div>

                    {/* Info & Controls (Only show full controls if not YouTube, as YT has its own) */}
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="font-serif text-3xl md:text-4xl leading-tight">{story.title}</h2>
                            <p className="text-[#A44A3F] text-xs uppercase tracking-[0.2em] font-bold">{story.topic}</p>
                        </div>

                        {!isYouTube && (
                            <>
                                <div className="space-y-2">
                                    <Slider defaultValue={[33]} max={100} step={1} className="w-full h-1" />
                                    <div className="flex justify-between text-xs font-mono text-white/30">
                                        <span>14:20</span>
                                        <span>42:10</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-8">
                                    <button className="text-white/50 hover:text-white transition-colors">
                                        <SkipBack size={28} />
                                    </button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-20 h-20 rounded-full bg-[#A44A3F] flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-[#A44A3F]/20"
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <button className="text-white/50 hover:text-white transition-colors">
                                        <SkipForward size={28} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
