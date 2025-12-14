import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Cookie, LayoutGrid, UtensilsCrossed, Candy, GlassWater, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoryType = "all" | "breakfast" | "lunch" | "dinner" | "snacks";

interface CategoryRailProps {
    selectedCategory: CategoryType;
    onSelectCategory: (category: CategoryType) => void;
}

const categories = [
    { id: "all", label: "All", icon: LayoutGrid },
    { id: "breakfast", label: "Breakfast", icon: Coffee },
    { id: "lunch", label: "Lunch", icon: Sun },
    { id: "dinner", label: "Dinner", icon: Moon },
    { id: "snacks", label: "Snacks", icon: Cookie }, // Handles Snacks & Pickles
    { id: "appetizers", label: "Appetizers", icon: UtensilsCrossed },
    { id: "desserts", label: "Desserts", icon: Candy },
    { id: "beverages", label: "Beverages", icon: GlassWater },
    { id: "healthy", label: "Healthy Corner", icon: Leaf },
] as const;

export function CategoryRail({ selectedCategory, onSelectCategory }: CategoryRailProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar">
            {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                    <motion.button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id as CategoryType)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all",
                            isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background/50 border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{category.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
