import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertLegacyAudio } from "@shared/schema";

interface AudioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (audio: InsertLegacyAudio) => void;
  isPending?: boolean;
}

export function AudioForm({ isOpen, onClose, onSubmit, isPending }: AudioFormProps) {
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("stories");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      audioUrl: audioUrl.trim() || null,
      duration: duration.trim() || null,
      category,
      description: description.trim() || null,
    });

    setTitle("");
    setAudioUrl("");
    setDuration("");
    setCategory("stories");
    setDescription("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-background border-l border-border overflow-y-auto custom-scrollbar"
          >
            <div className="sticky top-0 z-10 glass border-b border-border/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold">Add Life Lesson</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={onClose}
                  data-testid="button-close-audio-form"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-title">Title</Label>
                  <Input
                    id="audio-title"
                    placeholder="Dad's Advice on Compound Interest"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl"
                    required
                    data-testid="input-audio-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl" data-testid="select-audio-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="stories">Stories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-duration">Duration</Label>
                  <Input
                    id="audio-duration"
                    placeholder="5:30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-audio-duration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-url">Audio URL (optional)</Label>
                  <Input
                    id="audio-url"
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-audio-url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-description">Description (optional)</Label>
                  <Textarea
                    id="audio-description"
                    placeholder="A brief description of this life lesson..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                    data-testid="input-audio-description"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 pt-4 pb-4 bg-background border-t border-border -mx-4 px-4">
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isPending || !title.trim()}
                  data-testid="button-submit-audio"
                >
                  {isPending ? "Adding..." : "Add Life Lesson"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
