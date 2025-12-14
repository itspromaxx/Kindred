import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KindleReaderProps {
    isOpen: boolean;
    onClose: () => void;
    story: {
        title: string;
        content: string;
        year: string;
        author?: string;
    } | null;
}

export function KindleReader({ isOpen, onClose, story }: KindleReaderProps) {
    if (!isOpen || !story) return null;

    // Extract author if present (Format: [Author: Name])
    const authorMatch = story.content.match(/\[Author:\s*(.*?)\]$/);
    const displayContent = story.content.replace(/\[Author:\s*.*?\]$/, "").trim();
    const displayAuthor = story.author || (authorMatch ? authorMatch[1] : null);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] bg-[#F3F2EA] flex flex-col animate-in fade-in duration-500">
                {/* Minimal Header */}
                <div className="absolute top-0 w-full p-6 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="font-serif italic text-muted-foreground text-sm">Kindred Reader</span>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                        <X size={20} className="text-[#2A2A2A]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto w-full max-w-3xl mx-auto px-8 py-24 sm:py-32 scrollbar-hide">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4">
                            <span className="text-xs uppercase tracking-[0.3em] text-[#A44A3F] font-bold">
                                {story.year}
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl text-[#2A2A2A] leading-tight">
                                {story.title}
                            </h1>
                            {displayAuthor && (
                                <p className="font-serif italic text-muted-foreground pt-2">
                                    Written by {displayAuthor}
                                </p>
                            )}
                        </div>

                        <div className="prose prose-lg prose-p:font-serif prose-p:text-xl md:prose-p:text-2xl prose-p:leading-[1.8] prose-p:text-[#2A2A2A]/90 mx-auto">
                            <p className="whitespace-pre-line">{displayContent}</p>
                        </div>

                        <div className="pt-20 flex justify-center opacity-40">
                            <div className="w-16 h-1 bg-[#2A2A2A] rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
