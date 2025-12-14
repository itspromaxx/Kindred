import { useState } from "react";
import { X, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface StudyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function StudyModal({ isOpen, onClose, onSave }: StudyModalProps) {
    const [type, setType] = useState<"podcast" | "short">("podcast");
    const [isSaving, setIsSaving] = useState(false);

    // Data State
    const [title, setTitle] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [topic, setTopic] = useState("");
    const [year, setYear] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let finalMediaUrl = mediaUrl;

            // Upload Audio if present
            if (audioFile) {
                const fileExt = audioFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `podcasts/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('kindred-media')
                    .upload(filePath, audioFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('kindred-media')
                    .getPublicUrl(filePath);

                finalMediaUrl = publicUrl;
            }

            // Workaround: Append author to content since 'author' column might not exist
            const finalContent = type === 'short' && author
                ? `${content}\n\n[Author: ${author}]`
                : content;

            const newStory = {
                title,
                type,
                media_url: type === 'podcast' ? finalMediaUrl : null,
                duration: type === 'podcast' ? "Audio" : null, // Default
                topic: type === 'podcast' ? topic : null,
                year: type === 'short' ? year : null,
                content: type === 'short' ? finalContent : null,
                created_at: new Date().toISOString()
            };

            const { error } = await supabase.from("stories").insert([newStory]);
            if (error) {
                console.error("Supabase Insert Error:", error);
                throw error;
            }

            onSave();
            onClose();
            // Reset form
            setTitle("");
            setTopic("");
            setMediaUrl("");
            setYear("");
            setAuthor("");
            setContent("");
            setAudioFile(null);
            setType("podcast");
        } catch (err: any) {
            console.error(err);
            alert(`Error saving story: ${err.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#FDFBF7] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl scrollbar-hide"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-[#2A2A2A]"
                    >
                        <X size={24} />
                    </button>

                    <h3 className="font-serif text-3xl mb-1 text-[#2A2A2A]">New Entry</h3>
                    <p className="text-gray-500 text-sm mb-6">Archive a thought or story.</p>

                    <div className="space-y-6">
                        {/* Type Toggle */}
                        <div className="bg-[#A44A3F]/10 p-1.5 rounded-full flex relative">
                            <div
                                className={cn(
                                    "absolute inset-y-1.5 w-[48%] bg-white rounded-full shadow-sm transition-all duration-300 left-1.5",
                                    type === "short" ? "translate-x-[104%]" : "translate-x-0"
                                )}
                            />
                            <button
                                onClick={() => setType("podcast")}
                                className={cn(
                                    "relative z-10 flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2",
                                    type === "podcast" ? "text-[#A44A3F]" : "text-gray-500"
                                )}
                            >
                                <Mic size={16} />
                                The Podcast
                            </button>
                            <button
                                onClick={() => setType("short")}
                                className={cn(
                                    "relative z-10 flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2",
                                    type === "short" ? "text-[#A44A3F]" : "text-gray-500"
                                )}
                            >
                                <FileText size={16} />
                                Short Note
                            </button>
                        </div>

                        {type === "podcast" ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Episode Title"
                                    className="w-full bg-white p-3 rounded-xl border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F]"
                                />
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold px-1">Audio Source</label>
                                    <Input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full bg-white p-2 rounded-xl border-[#E5E5E0] file:bg-[#A44A3F]/10 file:text-[#A44A3F] file:border-0 file:rounded-lg file:px-2 file:py-1 file:text-xs file:font-medium file:mr-3 hover:file:bg-[#A44A3F]/20 transition-all cursor-pointer"
                                    />
                                    <div className="text-center text-xs text-muted-foreground py-1">- OR -</div>
                                    <Input
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        placeholder="Paste YouTube or MP3 Link (Optional)"
                                        className="w-full bg-white p-3 rounded-xl border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F]"
                                    />
                                </div>

                                <select
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus:outline-none focus:ring-1 focus:ring-[#A44A3F] text-gray-500 h-10 px-3 py-2 text-sm"
                                >
                                    <option value="">Select Topic</option>
                                    <option value="Finance">Finance</option>
                                    <option value="History">History</option>
                                    <option value="Life Lesson">Life Lesson</option>
                                    <option value="Story">Story</option>
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title for this thought..."
                                    className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F]"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Author (e.g. Dad)"
                                        className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F]"
                                    />
                                    <Input
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="Year"
                                        className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F]"
                                    />
                                </div>
                                <Textarea
                                    rows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your memory here..."
                                    className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#A44A3F] shadow-sm font-serif leading-relaxed"
                                />
                            </div>
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-6 rounded-2xl font-medium shadow-lg mt-4 text-lg bg-[#2A2A2A] hover:bg-[#A44A3F] text-white transition-colors"
                        >
                            {isSaving ? "Saving..." : "Save to Study"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
