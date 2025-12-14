import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Check, Clock, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Recipe } from "@shared/schema";

interface CookModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export function CookMode({ recipe, onClose }: CookModeProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  // Convert ingredients from object format to array format
  const ingredientsRaw = recipe.ingredients || [];
  const ingredients = Array.isArray(ingredientsRaw)
    ? ingredientsRaw
    : Object.entries(ingredientsRaw).map(([name, measure]) => `${name} - ${measure}`);

  const instructions = recipe.instructions || (recipe as any).steps || [];
  // Handle case where instructions might be a single string (from older imports)
  const safeInstructions = Array.isArray(instructions)
    ? instructions
    : typeof instructions === 'string'
      ? (instructions as string).split('\n').filter(s => s.trim())
      : [];

  const isVeg = recipe.category === "veg" || (recipe as any).type === "veg";

  // Determine format
  const isVideo = recipe.format === 'video' || (recipe.media_url && (recipe.media_url.includes('youtube') || recipe.media_url.includes('youtu.be')));
  const isAudio = recipe.format === 'audio' || (recipe.media_url && !isVideo);

  // Helper for YouTube Embed
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const coverImage = (recipe as any).image_query?.startsWith('http')
    ? (recipe as any).image_query
    : `https://image.pollinations.ai/prompt/${encodeURIComponent((recipe as any).image_query || recipe.title)}?width=800&height=1200&nologo=true`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#FDFBF7] overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video "Masterclass" Layout */}
      {isVideo ? (
        <div className="h-full flex flex-col md:flex-row">
          {/* Left: Cover Image ("Poster") */}
          <div className="hidden md:block w-2/5 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle overlay */}
            <img
              src={coverImage}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md mb-4 uppercase tracking-widest text-xs">
                Masterclass
              </Badge>
              <h1 className="font-serif text-5xl leading-tight mb-2">{recipe.title}</h1>
              <p className="text-white/80 font-light text-lg">{recipe.description || "A visual guide to a family classic."}</p>
            </div>
          </div>

          {/* Right: Content & Player */}
          <div className="w-full md:w-3/5 h-full bg-[#1a1a1a] text-white flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6 md:p-12 space-y-8">
              {/* Mobile Header (visible only on small screens) */}
              <div className="md:hidden flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-serif text-3xl mb-1">{recipe.title}</h1>
                  <Badge variant="outline" className="text-white/60 border-white/20">Video Recipe</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10">
                  <X size={24} />
                </Button>
              </div>

              {/* Desktop Close Button */}
              <div className="hidden md:flex justify-end">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full">
                  <X size={24} />
                </Button>
              </div>

              {/* Video Player */}
              <div className="space-y-4">
                <h2 className="text-[#A44A3F] text-xs font-bold tracking-[0.2em] uppercase">Watch & Cook</h2>
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(recipe.media_url || "")}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Helper Info */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/10 border-b">
                <div className="flex items-center gap-3 text-white/60">
                  <Clock size={16} />
                  <span className="text-sm tracking-wider uppercase">{recipe.cooking_time || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Users size={16} />
                  <span className="text-sm tracking-wider uppercase">{recipe.servings || "N/A"}</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl">Ingredients</h3>
                  <span className="text-xs text-white/40 tracking-wider">CHECK AS YOU GO</span>
                </div>
                <div className="space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group border border-transparent",
                        checkedIngredients.has(index)
                          ? "bg-white/5 border-transparent opacity-50"
                          : "hover:bg-white/5 hover:border-white/10"
                      )}
                      onClick={() => toggleIngredient(index)}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        checkedIngredients.has(index) ? "bg-[#A44A3F] border-[#A44A3F]" : "border-white/30 group-hover:border-white/60"
                      )}>
                        {checkedIngredients.has(index) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={cn(
                        "flex-1 text-sm font-medium transition-colors",
                        checkedIngredients.has(index) ? "line-through text-white/30" : "text-white/90"
                      )}>
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isAudio ? (
        /* "Spotify-vibe" Audio Layout */
        <div className="h-full bg-[#121212] text-white flex flex-col relative overflow-hidden">
          {/* Ambient Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#A44A3F]/20 to-[#121212]" />
            <img
              src={coverImage}
              className="w-full h-full object-cover opacity-20 blur-3xl scale-125"
              alt=""
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </Button>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Listening Room</span>
              <Button variant="ghost" size="icon" className="rounded-full text-white/50 cursor-default opacity-0">
                <X size={20} />
              </Button>
            </div>

            {/* Album Art */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/5 relative group">
              <img
                src={coverImage}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title & Info */}
            <div className="w-full text-center space-y-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-serif text-3xl leading-tight">{recipe.title}</h2>
              <p className="text-white/60 font-medium">{recipe.category || "General"} • {recipe.cooking_time || "Audio Note"}</p>
            </div>

            {/* Audio Player Controls */}
            <div className="w-full space-y-6">
              {/* Audio Element (Hidden but functional) */}
              <audio controls className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity rounded-lg" src={recipe.media_url || ""} />
            </div>

            {/* Ingredients Drawer Trigger */}
            <div className="mt-12 w-full">
              <div className="bg-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ChefHat size={16} className="text-[#A44A3F]" />
                    <span className="text-sm font-bold tracking-wider uppercase">Ingredients</span>
                  </div>
                  <span className="text-xs text-white/40">{checkedIngredients.size}/{ingredients.length}</span>
                </div>
                {/* Mini Preview List (First 3) */}
                <div className="space-y-1">
                  {ingredients.slice(0, 3).map((ing, i) => (
                    <p key={i} className="text-xs text-white/60 truncate">• {ing}</p>
                  ))}
                  {ingredients.length > 3 && <p className="text-xs text-white/40 italic">+ {ingredients.length - 3} more...</p>}
                </div>
                <p className="text-center text-[10px] uppercase tracking-widest text-[#A44A3F] mt-3 font-bold">Tap to Cook</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default "Written" Book Layout */
        <div className="h-full flex flex-col">
          {/* Immersive Header */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-[#E5E5E0]">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isVeg ? "bg-[#8FA792]/20 text-[#8FA792]" : "bg-[#C28E78]/20 text-[#C28E78]"
              )}>
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl text-[#2A2A2A]">{recipe.title}</h1>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Cook Mode</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5">
              <X className="w-6 h-6 text-[#2A2A2A]" />
            </Button>
          </header>

          {/* Book Layout Content */}
          <div className="flex-1 overflow-hidden grid md:grid-cols-2">
            {/* Left Page: Ingredients */}
            <div className="bg-[#F8F6F1] border-r border-[#E5E5E0] p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-[#2A2A2A]">Ingredients</h2>
                  <Badge variant="outline" className="bg-white border-[#E5E5E0] text-muted-foreground font-normal">
                    {checkedIngredients.size}/{ingredients.length} Ready
                  </Badge>
                </div>

                <div className="space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group",
                        checkedIngredients.has(index)
                          ? "bg-[#E5E5E0]/30"
                          : "hover:bg-white hover:shadow-sm"
                      )}
                      onClick={() => toggleIngredient(index)}
                    >
                      <Checkbox
                        checked={checkedIngredients.has(index)}
                        className={cn(
                          "data-[state=checked]:bg-[#2A2A2A] data-[state=checked]:border-[#2A2A2A]",
                          isVeg ? "border-[#8FA792]" : "border-[#C28E78]"
                        )}
                      />
                      <span className={cn(
                        "flex-1 font-medium transition-colors",
                        checkedIngredients.has(index) ? "text-muted-foreground line-through decoration-[#2A2A2A]/20" : "text-[#2A2A2A]"
                      )}>
                        {ingredient}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Page: Instructions */}
            <div className="bg-[#FDFBF7] p-8 overflow-y-auto custom-scrollbar relative">
              <div className="max-w-md mx-auto h-full flex flex-col">
                <div className="flex-1 flex flex-col justify-center min-h-[50vh]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex flex-col gap-2">
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-widest",
                          isVeg ? "text-[#8FA792]" : "text-[#C28E78]"
                        )}>
                          Step {currentStep + 1}
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl leading-tight text-[#2A2A2A]">
                          {safeInstructions[currentStep]}
                        </h3>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="pt-8 mt-auto border-t border-[#E5E5E0] flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="text-muted-foreground hover:text-[#2A2A2A]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {safeInstructions.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          idx === currentStep
                            ? cn("w-8", isVeg ? "bg-[#8FA792]" : "bg-[#C28E78]")
                            : "w-1.5 bg-[#E5E5E0]"
                        )}
                      />
                    ))}
                  </div>

                  {currentStep < safeInstructions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={cn(
                        "text-white shadow-lg px-6",
                        isVeg ? "bg-[#8FA792] hover:bg-[#7A8F7D]" : "bg-[#C28E78] hover:bg-[#A97A66]"
                      )}
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={onClose}
                      className="bg-[#2A2A2A] text-white hover:bg-black px-6 shadow-lg"
                    >
                      Finish Cooking
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
