import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Play, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onClick, onDelete }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Cast to handle Supabase fields not in Replit schema
  const supabaseRecipe = recipe as any;
  const isVeg = supabaseRecipe.type === "veg" || recipe.category === "veg";

  return (
    <motion.div
      className="relative flex-shrink-0 w-full group cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      data-testid={`card-recipe-${recipe.id}`}
    >
      <div className={cn(
        "relative rounded-2xl overflow-hidden glass theme-transition",
        isVeg ? "glow-sage" : "glow-terracotta"
      )}>
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50">
          {recipe.thumbnailUrl || supabaseRecipe.image_query ? (
            <img
              src={recipe.thumbnailUrl || (supabaseRecipe.image_query?.startsWith('http') ? supabaseRecipe.image_query : `https://image.pollinations.ai/prompt/${encodeURIComponent(supabaseRecipe.image_query || recipe.title)}?width=600&height=400&nologo=true`)}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-serif text-muted-foreground/30">
                {recipe.title.charAt(0)}
              </span>
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isHovered ? 1 : 0.8 }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </motion.div>

          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={cn(
                "backdrop-blur-sm border-none",
                isVeg
                  ? "bg-[#718355]/90 text-white"
                  : "bg-[#A44A3F]/90 text-white"
              )}
            >
              {isVeg ? "Veg" : "Non-Veg"}
            </Badge>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            data-testid={`button-delete-recipe-${recipe.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold line-clamp-1 mb-2">
            {recipe.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {recipe.cookTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookTime}</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
