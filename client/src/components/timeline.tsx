import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimelineNote } from "@shared/schema";

interface TimelineProps {
  notes: TimelineNote[];
  onDelete: (id: number) => void;
}

function TimelineItem({ 
  note, 
  index, 
  onDelete 
}: { 
  note: TimelineNote; 
  index: number; 
  onDelete: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 sm:gap-8",
        isEven ? "flex-row" : "flex-row-reverse"
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn("flex-1", isEven ? "text-right" : "text-left")}
      >
        <div
          className={cn(
            "glass rounded-2xl p-5 inline-block max-w-md group relative",
            "hover:shadow-lg transition-shadow duration-300"
          )}
          data-testid={`card-timeline-${note.id}`}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            data-testid={`button-delete-timeline-${note.id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-semibold text-primary">
              {note.year}
            </span>
          </div>
          
          <p className={cn(
            "text-base leading-relaxed",
            isEven ? "text-right" : "text-left"
          )}>
            {note.content}
          </p>

          {note.imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={note.imageUrl}
                alt={`Memory from ${note.year}`}
                className="w-full h-32 object-cover"
              />
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-4 h-4 rounded-full bg-primary glow-gold z-10"
        />
        {index > 0 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="absolute bottom-full w-0.5 h-24 bg-gradient-to-b from-transparent via-primary/50 to-primary origin-bottom"
          />
        )}
      </div>

      <div className="flex-1" />
    </div>
  );
}

export function Timeline({ notes, onDelete }: TimelineProps) {
  const sortedNotes = [...notes].sort((a, b) => a.year - b.year);

  if (sortedNotes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="font-serif text-xl mb-2">No Timeline Notes Yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Add memories and milestones to create a beautiful timeline of life's journey.
        </p>
      </div>
    );
  }

  return (
    <div className="relative py-8 space-y-8">
      {sortedNotes.map((note, index) => (
        <TimelineItem
          key={note.id}
          note={note}
          index={index}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}
