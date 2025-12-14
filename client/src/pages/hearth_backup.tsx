import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Flame, Leaf, Drumstick } from "lucide-react";
import { Layout } from "@/components/layout";
import { RecipeCard } from "@/components/recipe-card";
import { CookMode } from "@/components/cook-mode";
import { RecipeForm } from "@/components/recipe-form";
import { PinModal } from "@/components/pin-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/lib/theme-context";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

// Define local types matching Supabase structure
type Recipe = {
  id: number;
  title: string;
  category: string;
  cooking_time?: string;
  description?: string;
  image_query?: string;
  ingredients?: any;
  steps?: string;
  media_url?: string;
  created_at?: string;
  type?: string;
  status?: string;
  format?: string;
};

export default function Hearth() {
  const { foodCategory, setFoodCategory, setMode } = useTheme();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [deleteRecipeId, setDeleteRecipeId] = useState<number | null>(null);

  useEffect(() => {
    setMode("hearth");
  }, [setMode]);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Recipe[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (recipe: any) => {
      // Adapt the form data to Supabase schema
      const newRecipe = {
        title: recipe.title,
        type: recipe.category === 'veg' ? 'veg' : 'non-veg',
        category: 'Main', // Defaulting category as form doesn't strictly match our DB category list yet
        cooking_time: recipe.cookTime,
        description: recipe.instructions.join('\n'), // Storing instructions as description/steps
        steps: recipe.instructions.join('\n'),
        ingredients: recipe.ingredients.reduce((acc: any, curr: string) => ({ ...acc, [curr]: '1 unit' }), {}), // Simple mock measurement
        image_query: recipe.title + ' food',
        status: 'fresh',
        media_url: recipe.videoUrl || recipe.thumbnailUrl
      };

      const { data, error } = await supabase.from('recipes').insert([newRecipe]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setIsFormOpen(false);
      toast({
        title: "Recipe Added",
        description: "Your recipe has been saved to the family archive.",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, pin }: { id: number; pin: string }) => {
      if (pin !== "Cheerla") throw new Error("Invalid Password");
      const { error } = await supabase.from('recipes').delete().match({ id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setDeleteRecipeId(null);
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been removed from the archive.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete recipe. Check password?",
        variant: "destructive",
      });
    },
  });

  const filteredRecipes = recipes?.filter((r) => {
    const rType = r.type || (r.category === 'veg' ? 'veg' : 'non-veg'); // Handle legacy data
    return rType === foodCategory;
  }) || [];

  const isVeg = foodCategory === "veg";

  return (
    <>
      <Layout onAddClick={() => setIsFormOpen(true)} showAddButton>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isVeg ? "bg-[#718355]/20 glow-sage" : "bg-[#A44A3F]/20 glow-terracotta"
                )}>
                  <Flame className={cn(
                    "w-6 h-6",
                    isVeg ? "text-[#718355]" : "text-[#A44A3F]"
                  )} />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold">The Hearth</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-md"
              >
                Mom's kitchen archive. A collection of cherished recipes passed down through generations.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              <Button
                variant={isVeg ? "default" : "outline"}
                className={cn(
                  "gap-2 rounded-xl transition-all duration-300",
                  isVeg && "glow-sage"
                )}
                onClick={() => setFoodCategory("veg")}
                data-testid="button-veg-filter"
              >
                <Leaf className="w-4 h-4" />
                Veg
              </Button>
              <Button
                variant={!isVeg ? "default" : "outline"}
                className={cn(
                  "gap-2 rounded-xl transition-all duration-300",
                  !isVeg && "glow-terracotta"
                )}
                onClick={() => setFoodCategory("non-veg")}
                data-testid="button-non-veg-filter"
              >
                <Drumstick className="w-4 h-4" />
                Non-Veg
              </Button>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 sm:w-80">
                  <Skeleton className="h-64 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4",
                isVeg ? "bg-[#718355]/10" : "bg-[#A44A3F]/10"
              )}>
                <ChefHat className={cn(
                  "w-10 h-10",
                  isVeg ? "text-[#718355]/50" : "text-[#A44A3F]/50"
                )} />
              </div>
              <h3 className="font-serif text-xl mb-2">No Recipes Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Start building your family's culinary legacy by adding the first {isVeg ? "vegetarian" : "non-vegetarian"} recipe.
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 rounded-xl"
                data-testid="button-add-first-recipe"
              >
                <ChefHat className="w-4 h-4" />
                Add Recipe
              </Button>
            </motion.div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RecipeCard
                    recipe={recipe as any} // Cast to avoid strict schema mismatch with Replit components
                    onClick={() => setSelectedRecipe(recipe)}
                    onDelete={() => setDeleteRecipeId(recipe.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Layout>

      <AnimatePresence>
        {selectedRecipe && (
          <CookMode
            recipe={selectedRecipe as any}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>

      <RecipeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(recipe) => createMutation.mutate(recipe)}
        isPending={createMutation.isPending}
      />

      <PinModal
        isOpen={deleteRecipeId !== null}
        onClose={() => setDeleteRecipeId(null)}
        onConfirm={(pin) => {
          if (deleteRecipeId !== null) {
            deleteMutation.mutate({ id: deleteRecipeId, pin });
          }
        }}
        title="Delete Recipe"
        description="This recipe will be permanently removed from the family archive."
      />
    </>
  );
}
