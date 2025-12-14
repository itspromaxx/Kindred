import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ThemeMode = "hearth" | "study";
type FoodCategory = "veg" | "non-veg";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  foodCategory: FoodCategory;
  setFoodCategory: (category: FoodCategory) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("hearth");
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("veg");

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove("study", "non-veg");
    
    if (mode === "study") {
      root.classList.add("study");
    }
    
    if (foodCategory === "non-veg") {
      root.classList.add("non-veg");
    }
  }, [mode, foodCategory]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, foodCategory, setFoodCategory }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
