import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ChefHat, Trash2, Video, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SmartPantry } from "./smart-pantry";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: any) => void;
  isPending?: boolean;
}

export function RecipeForm({ isOpen, onClose, onSubmit, isPending }: RecipeFormProps) {
  // Format State
  const [format, setFormat] = useState<"written" | "video" | "audio">("written");

  // Basic Info
  const [title, setTitle] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  // Written Recipe Fields
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [customIngredient, setCustomIngredient] = useState("");
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  // Media Fields
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Cover Image State
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() && !customIngredients.includes(customIngredient.trim())) {
      const newIngredient = customIngredient.trim();
      setCustomIngredients((prev) => [...prev, newIngredient]);
      setSelectedIngredients((prev) => [...prev, newIngredient]);
      setCustomIngredient("");
    }
  };

  const handleRemoveCustomIngredient = (ingredient: string) => {
    setCustomIngredients((prev) => prev.filter((i) => i !== ingredient));
    setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient));
  };

  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `recipes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kindred-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('kindred-media').getPublicUrl(filePath);
      setMediaUrl(data.publicUrl);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCoverUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Date.now()}.${fileExt}`;
      const filePath = `recipes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kindred-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('kindred-media').getPublicUrl(filePath);
      setCoverImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Error uploading cover photo');
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Use custom cover image if provided, otherwise generate AI prompt
    const finalImageQuery = coverImageUrl.trim()
      ? coverImageUrl.trim()
      : `${title} ${isVeg ? 'veg' : 'non-veg'} food`;

    // Build ingredients object for Supabase
    const ingredientsObj = selectedIngredients.reduce((acc, ing) => ({
      ...acc,
      [ing]: quantities[ing] || "to taste" // Default measurement if empty
    }), {});

    onSubmit({
      title: title.trim(),
      type: isVeg ? "veg" : "non-veg",
      format,
      category: category || "Main",
      cooking_time: cookTime.trim() || null,
      servings: servings.trim() || null,
      description: description.trim() || null,
      media_url: mediaUrl.trim() || null,
      ingredients: ingredientsObj,
      steps: instructions.filter((i) => i.trim()).join('\n'),
      image_query: finalImageQuery,
      status: 'fresh'
    });

    // Reset form
    setTitle("");
    setFormat("written");
    setIsVeg(true);
    setCookTime("");
    setServings("");
    setCategory("");
    setSelectedIngredients([]);
    setQuantities({});
    setCustomIngredients([]);
    setInstructions([""]);
    setMediaUrl("");
    setDescription("");
    setCoverImageUrl("");
    setCoverImageFile(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#FDFBF7] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl custom-scrollbar z-50 border border-[#E5E5E0]/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">

                <h2 className="font-serif text-3xl text-[#2A2A2A]">New Recipe</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-transparent text-gray-400 hover:text-[#2A2A2A]"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <p className="text-muted-foreground text-sm mb-8">Add a flavor to the family legacy.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex gap-4 items-start">
                {/* Diet Type Toggle - Pill Design */}
                <div className="bg-[#E5E5E0]/30 p-1 rounded-full inline-flex relative">
                  <div
                    className={cn(
                      "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 shadow-sm z-0",
                      isVeg ? "left-1 bg-[#718355]" : "left-[calc(50%+4px)] bg-[#A44A3F]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setIsVeg(true)}
                    className={cn(
                      "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 min-w-[100px]",
                      isVeg ? "text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVeg(false)}
                    className={cn(
                      "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 min-w-[100px]",
                      !isVeg ? "text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* Format Selector (kept simple) */}
              <div>
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block font-bold">Recipe Format</Label>
                <div className="flex gap-3">
                  {(['Written', 'Video', 'Audio'] as const).map((f) => {
                    const id = f.toLowerCase() as "written" | "video" | "audio";
                    const isActive = format === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormat(id)}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-200",
                          isActive
                            ? "bg-[#2A2A2A] text-white border-[#2A2A2A] shadow-md transform scale-[1.02]"
                            : "bg-white border-[#E5E5E0] text-gray-500 hover:border-gray-400 hover:text-gray-900"
                        )}
                      >
                        {f} Recipe
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Dish Name</Label>
                <Input
                  placeholder="e.g. Sunday Mutton Curry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white p-4 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792] shadow-sm font-serif text-xl h-auto"
                  required
                />
              </div>

              {/* Category Selection Grid - Available for ALL formats now */}
              <div>
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block font-bold">Select Course</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    "Breakfast", "Lunch", "Dinner", "Snacks",
                    "Appetizers", "Desserts", "Beverages", "Healthy"
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "py-3 px-2 rounded-xl text-sm font-medium border transition-all text-center",
                        category === cat
                          ? "bg-[#E5E5E0] border-[#8FA792] text-[#2A2A2A]"
                          : "bg-white border-[#E5E5E0] text-gray-500 hover:border-gray-400 hover:bg-[#FDFBF7]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Fields Based on Format */}
              {format === "written" ? (
                <div className="space-y-8 animate-in fade-in">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Cooking Time</Label>
                      <Input
                        placeholder="e.g. 45 mins"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                        className="rounded-xl bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Servings</Label>
                      <Input
                        placeholder="e.g. 4 people"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="rounded-xl bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Pantry Staples</Label>
                    <div className="space-y-4">
                      <SmartPantry
                        selectedIngredients={selectedIngredients}
                        onToggleIngredient={handleToggleIngredient}
                        customIngredients={customIngredients}
                        onRemoveCustom={handleRemoveCustomIngredient}
                        activeClassName="bg-[#8FA792] border-[#8FA792] text-white"
                        inactiveClassName="bg-white border-[#E5E5E0] text-gray-500 hover:border-gray-400 font-light"
                      />

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom ingredient..."
                          value={customIngredient}
                          onChange={(e) => setCustomIngredient(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomIngredient();
                            }
                          }}
                          className="rounded-xl border-[#E5E5E0] bg-white focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-xl shrink-0 border-[#E5E5E0] hover:bg-white hover:border-gray-400"
                          onClick={handleAddCustomIngredient}
                        >
                          <Plus className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>

                      {/* Selected Ingredients Quantity Inputs */}
                      {selectedIngredients.length > 0 && (
                        <div className="space-y-3 mt-4 bg-white/50 p-4 rounded-2xl border border-[#E5E5E0]/50">
                          <Label className="text-[10px] uppercase tracking-widest text-[#2A2A2A] mb-2 block font-bold">Quantities</Label>
                          {selectedIngredients.map(ing => (
                            <div key={ing} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-sm font-medium text-[#2A2A2A] min-w-[120px] capitalize">{ing}</span>
                              <Input
                                placeholder="e.g. 2 cups, 500g"
                                value={quantities[ing] || ""}
                                onChange={(e) => setQuantities(prev => ({ ...prev, [ing]: e.target.value }))}
                                className="h-9 text-sm rounded-lg bg-white border-[#E5E5E0]"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                  handleToggleIngredient(ing);
                                  if (customIngredients.includes(ing)) handleRemoveCustomIngredient(ing);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Cooking Steps</Label>
                    <div className="space-y-4">
                      {instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium",
                            isVeg ? "bg-[#718355] text-white" : "bg-[#A44A3F] text-white"
                          )}>
                            {index + 1}
                          </div>
                          <Textarea
                            placeholder={`Step ${index + 1}...`}
                            value={instruction}
                            onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                            className="rounded-xl min-h-[80px] bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                          />
                          {instructions.length > 1 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="rounded-xl shrink-0"
                              onClick={() => handleRemoveInstruction(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl gap-2"
                        onClick={handleAddInstruction}
                      >
                        <Plus className="w-4 h-4" />
                        Add Step
                      </Button>
                    </div>
                  </div>

                  {/* Cover Image Upload for Written Recipes */}
                  <div className="pt-4 border-t border-[#E5E5E0]">
                    <Label className="text-[10px] uppercase tracking-widest text-[#2A2A2A] mb-3 block font-bold">Cover Photo (Optional)</Label>
                    <div className="bg-[#E5E5E0]/30 p-4 rounded-2xl border border-[#E5E5E0] flex flex-col gap-4">
                      <Input
                        placeholder="Paste image link here..."
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="rounded-xl bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                      />
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-xs text-muted-foreground font-medium">OR UPLOAD</span>
                        <div className="h-px bg-gray-300 flex-1" />
                      </div>
                      <input
                        type="file"
                        ref={coverInputRef}
                        onChange={handleCoverUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full py-4 border-dashed border-[#8FA792] rounded-xl text-[#5A6B5D] hover:bg-[#8FA792]/10 transition-colors"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isCoverUploading}
                      >
                        {isCoverUploading ? "Uploading..." : "Select Photo from Gallery"}
                      </Button>
                      {coverImageUrl && !isCoverUploading && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E5E5E0]">
                          <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImageUrl("")}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">* If left empty, AI will generate a photo for you.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center gap-3 text-foreground mb-4">
                      {format === 'video' ? <Video size={20} /> : <Mic size={20} />}
                      <span className="font-serif text-lg">Add {format === 'video' ? 'Visuals' : 'Voice'}</span>
                    </div>
                    <Input
                      id="mediaUrl"
                      type="url"
                      placeholder={`Paste ${format} link (YouTube, Spotify, etc.)`}
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full bg-white p-3 rounded-xl border border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792] mb-2"
                    />
                    <div className="text-center text-xs text-muted-foreground my-2">- or -</div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept={format === "video" ? "video/*" : "audio/*"}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full py-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-background hover:text-foreground transition-colors text-sm h-auto"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Description / Notes</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about this memory..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl min-h-[100px] bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                    />
                  </div>

                  {/* Cover Image Upload for Media Recipes */}
                  <div className="pt-4 border-t border-[#E5E5E0]">
                    <Label className="text-[10px] uppercase tracking-widest text-[#2A2A2A] mb-3 block font-bold">Cover Photo (Optional)</Label>
                    <div className="bg-[#E5E5E0]/30 p-4 rounded-2xl border border-[#E5E5E0] flex flex-col gap-4">
                      <Input
                        placeholder="Paste image link here..."
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="rounded-xl bg-white border-[#E5E5E0] focus-visible:ring-1 focus-visible:ring-[#8FA792]"
                      />
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-xs text-muted-foreground font-medium">OR UPLOAD</span>
                        <div className="h-px bg-gray-300 flex-1" />
                      </div>
                      <input
                        type="file"
                        ref={coverInputRef}
                        onChange={handleCoverUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full py-4 border-dashed border-[#8FA792] rounded-xl text-[#5A6B5D] hover:bg-[#8FA792]/10 transition-colors"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isCoverUploading}
                      >
                        {isCoverUploading ? "Uploading..." : "Select Photo from Gallery"}
                      </Button>
                      {coverImageUrl && !isCoverUploading && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E5E5E0]">
                          <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImageUrl("")}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">* If left empty, AI will generate a photo for you.</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6 rounded-2xl font-medium shadow-lg text-lg mt-8 bg-[#2A2A2A] hover:bg-black text-white"
                disabled={isPending || !title.trim() || isUploading || isCoverUploading}
              >
                {isPending ? "Adding..." : "Add to Kitchen"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
