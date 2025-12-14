import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Plus } from "lucide-react";
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
import { SearchBar } from "@/components/search-bar";
import { CategoryRail, CategoryType } from "@/components/category-rail";

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
  const { setMode } = useTheme();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [deleteRecipeId, setDeleteRecipeId] = useState<number | null>(null);

  // New state for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

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
        type: recipe.type, // Use the type passed directly from form
        category: recipe.category, // Use the category passed directly from form
        cooking_time: recipe.cooking_time, // Note key change from form output
        description: recipe.description,
        steps: recipe.steps, // Already a string joined by newline
        ingredients: recipe.ingredients, // Already an object
        image_query: recipe.image_query,
        status: 'fresh',
        media_url: recipe.media_url
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
      if (pin.toLowerCase() !== "cheerla") throw new Error("Invalid Password");
      const { error, count } = await supabase.from('recipes').delete().eq('id', id).select();
      if (error) throw error;
      if (count === 0) throw new Error("Recipe not found or permission denied");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
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
    // Filter by search query
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== "all") {
      // Check if recipe category matches selected category (case insensitive match)
      // Note: This matches the 'category' field in DB which might be 'Breakfast', 'Lunch' etc.
      // or 'Main' if from old form. adjusting logic to allow lenient matching if needed
      return r.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        r.type?.toLowerCase() === selectedCategory.toLowerCase(); // fallback for veg/non-veg if needed? 
      // Actually, cleaner to strict match or if the user wants 'course' to be the category. 
      // Let's assume 'category' field holds 'Breakfast' etc.
    }

    return true;
  }) || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sm:items-end">
            {/* Replaced Header with Search Bar and Category Rail */}
            <div className="w-full flex flex-col gap-6">
              <div className="flex items-center gap-4 w-full">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
                <></>
              </div>

              <CategoryRail
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
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
              "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-muted/10",
            )}>
              <ChefHat className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="font-serif text-xl mb-2">No Recipes Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? "Try adjusting your search or filters."
                : "Start building your family's culinary legacy by adding your first recipe."}
            </p>
            {(searchQuery || selectedCategory !== 'all') ? (
              <Button
                variant="ghost"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 rounded-xl"
                data-testid="button-add-first-recipe"
              >
                <ChefHat className="w-4 h-4" />
                Add Recipe
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 hidden">
              {/* Legacy horizontal scroll hidden, keeping for safe removal later if needed by user */}
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="text-center space-y-2 py-4">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2A2A2A]">What story will you tell today?</h3>
                <p className="text-muted-foreground font-light italic">Pick a dish, relive a memory.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <RecipeCard
                      recipe={recipe as any} // Cast to avoid strict schema mismatch with Replit components
                      onClick={() => setSelectedRecipe(recipe)}
                      onDelete={() => setDeleteRecipeId(recipe.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )
        }
      </div >

      <Button
        onClick={() => setIsFormOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40 p-0",
          "bg-[#718355] hover:bg-[#718355]/90"
        )}
      >
        <Plus className="w-7 h-7 text-white" />
      </Button>

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
