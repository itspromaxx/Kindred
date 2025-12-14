import { motion } from "framer-motion";
import { Play, Trash2, Clock, Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LegacyAudio } from "@shared/schema";

interface AudioCardProps {
  audio: LegacyAudio;
  isPlaying: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const categoryColors: Record<string, string> = {
  finance: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  gardening: "bg-green-500/10 text-green-600 border-green-500/30",
  stories: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

const categoryIcons: Record<string, string> = {
  finance: "Finances",
  gardening: "Garden",
  stories: "Story",
};

export function AudioCard({ audio, isPlaying, onClick, onDelete }: AudioCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "glass rounded-2xl p-5 cursor-pointer group transition-all duration-300",
        isPlaying && "ring-2 ring-primary glow-gold"
      )}
      onClick={onClick}
      data-testid={`card-audio-${audio.id}`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
            isPlaying ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
          animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-foreground rounded-full"
                  animate={{ height: [4, 16, 4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          ) : (
            <Play className="w-6 h-6 text-muted-foreground" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-semibold line-clamp-1">
                {audio.title}
              </h3>
              {audio.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {audio.description}
                </p>
              )}
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              data-testid={`button-delete-audio-${audio.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {audio.category && (
              <Badge
                variant="outline"
                size="sm"
                className={cn(
                  "capitalize",
                  categoryColors[audio.category] || "bg-muted"
                )}
              >
                {categoryIcons[audio.category] || audio.category}
              </Badge>
            )}
            {audio.duration && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {audio.duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
