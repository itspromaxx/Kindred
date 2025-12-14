import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COMMON_INGREDIENTS = [
  "Salt",
  "Turmeric",
  "Cumin",
  "Oil",
  "Chili Powder",
  "Ginger",
  "Garlic",
  "Onion",
  "Tomato",
  "Coriander",
  "Garam Masala",
  "Mustard Seeds",
  "Curry Leaves",
  "Coconut",
  "Yogurt",
  "Lemon",
  "Green Chili",
  "Rice",
  "Ghee",
  "Pepper",
];

interface SmartPantryProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  customIngredients?: string[];
  onAddCustom?: (ingredient: string) => void;
  onRemoveCustom?: (ingredient: string) => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function SmartPantry({
  selectedIngredients,
  onToggleIngredient,
  customIngredients = [],
  onAddCustom,
  onRemoveCustom,
  className,
  activeClassName,
  inactiveClassName,
}: SmartPantryProps) {
  const allIngredients = [...COMMON_INGREDIENTS, ...customIngredients];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-bold">
        <span>Smart Pantry</span>
        <span className="text-muted-foreground/70 font-normal normal-case tracking-normal ml-2">
          {selectedIngredients.length} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {allIngredients.map((ingredient, index) => {
          const isSelected = selectedIngredients.includes(ingredient);
          const isCustom = customIngredients.includes(ingredient);

          return (
            <motion.button
              key={ingredient}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onToggleIngredient(ingredient)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? cn("bg-primary text-primary-foreground border-primary", activeClassName)
                  : cn("bg-muted/50 text-foreground border-border hover:border-primary/50", inactiveClassName)
              )}
              data-testid={`chip-ingredient-${ingredient.toLowerCase().replace(/\s/g, "-")}`}
            >
              {isSelected ? (
                <X className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              {ingredient}
              {isCustom && isSelected && onRemoveCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCustom(ingredient);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { COMMON_INGREDIENTS };
