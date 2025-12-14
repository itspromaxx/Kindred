import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { motion } from "framer-motion";
import { Utensils, Mic } from "lucide-react";
import Hearth from "@/pages/hearth";
import Study from "@/pages/study";

function App() {
  const [view, setView] = useState<"home" | "hearth" | "study">("home");

  const toggleView = (newView: "home" | "hearth" | "study") => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground pb-20 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 w-full glass border-b border-border/50 z-50 px-6 py-4 flex justify-between items-center transition-all">
              <div
                onClick={() => toggleView("home")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <h1 className="font-serif text-2xl font-bold tracking-tight">
                  Kindred.
                </h1>
              </div>
              <nav className="flex gap-6">
                <button
                  onClick={() => toggleView("hearth")}
                  className={`text-xs tracking-[0.2em] hover:text-[#718355] transition-colors ${view === "hearth"
                    ? "text-[#718355] font-bold"
                    : "text-muted-foreground"
                    }`}
                >
                  HEARTH
                </button>
                <button
                  onClick={() => toggleView("study")}
                  className={`text-xs tracking-[0.2em] hover:text-[#A44A3F] transition-colors ${view === "study"
                    ? "text-[#A44A3F] font-bold"
                    : "text-muted-foreground"
                    }`}
                >
                  STUDY
                </button>
              </nav>
            </header>

            {/* Main Content */}
            <main className="pt-28 px-4 md:px-8 max-w-5xl mx-auto flex-grow w-full">
              {view === "home" && (
                <div className="text-center py-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-6">
                    <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] font-normal">
                      Preserving our
                      <br />
                      <span className="text-[#A44A3F] italic">history</span>, one
                      story
                      <br />
                      at a time.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
                      Welcome to the family archive. A digital heirloom for<br /> the Cheerla family.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
                    <motion.div
                      onClick={() => toggleView("hearth")}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-72 h-80 bg-muted/30 rounded-[2rem] border border-[#718355]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#718355]/10 transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#718355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-[#718355] mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Utensils size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-3xl mb-1 font-normal">The Hearth</h3>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          Mom's World
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() => toggleView("study")}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-72 h-80 bg-muted/30 rounded-[2rem] border border-[#A44A3F]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#A44A3F]/10 transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#A44A3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-[#A44A3F] mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Mic size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-3xl mb-1 font-normal">The Study</h3>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          Dad's World
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {view === "hearth" && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="mb-10 text-center">
                    <span className="text-[#718355] text-xs tracking-[0.2em] uppercase font-bold block mb-2">
                      Mom's World
                    </span>
                    <h2 className="font-serif text-5xl">The Kitchen Table</h2>
                  </div>
                  <Hearth />
                </div>
              )}

              {view === "study" && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="mb-10 text-center">
                    <span className="text-[#A44A3F] text-xs tracking-[0.2em] uppercase font-bold block mb-2">
                      Dad's World
                    </span>
                    <h2 className="font-serif text-5xl">The Quiet Study</h2>
                    <p className="text-muted-foreground font-light italic mt-2">
                      Wisdom, stories, and the timeline of a lifetime.
                    </p>
                  </div>
                  <Study />
                </div>
              )}
            </main>

            {/* Footer */}
            {view === "home" && (
              <footer className="mt-12 py-10 bg-background/50 border-t border-border/30 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 text-center">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 text-sm font-light text-muted-foreground">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <span className="uppercase tracking-widest text-xs font-bold text-muted-foreground/70">
                        Dedicated to
                      </span>
                      <span className="font-serif italic text-lg text-foreground">
                        Cheerla Bhaskar, Cheerla Suvarna, & Cheerla Anusri
                      </span>
                    </div>
                    <div className="hidden md:block w-px h-6 bg-border transform rotate-12" />
                    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                      <span className="text-xs uppercase tracking-widest">
                        Lovingly Crafted by
                      </span>
                      <span className="font-serif italic text-lg text-foreground">
                        Cheerla Raghavan
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-medium">
                    Kindred © 2025 • The Cheerla Family Archive
                  </div>
                </div>
              </footer>
            )}

            {/* Footer */}

          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider >
    </QueryClientProvider >
  );
}

export default App;
