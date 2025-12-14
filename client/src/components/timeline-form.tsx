import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InsertTimelineNote } from "@shared/schema";

interface TimelineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: InsertTimelineNote) => void;
  isPending?: boolean;
}

export function TimelineForm({ isOpen, onClose, onSubmit, isPending }: TimelineFormProps) {
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !content.trim()) return;

    onSubmit({
      year: parseInt(year),
      content: content.trim(),
      imageUrl: imageUrl.trim() || null,
    });

    setYear("");
    setContent("");
    setImageUrl("");
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
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold">Add Memory</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={onClose}
                  data-testid="button-close-timeline-form"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline-year">Year</Label>
                  <Input
                    id="timeline-year"
                    type="number"
                    placeholder="1982"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="rounded-xl"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    data-testid="input-timeline-year"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline-content">Memory</Label>
                  <Textarea
                    id="timeline-content"
                    placeholder="The day I bought my first car..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                    required
                    data-testid="input-timeline-content"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline-image">Image URL (optional)</Label>
                  <Input
                    id="timeline-image"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-timeline-image"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isPending || !year || !content.trim()}
                  data-testid="button-submit-timeline"
                >
                  {isPending ? "Adding..." : "Add Memory"}
                </Button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
