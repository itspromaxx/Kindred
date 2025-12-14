import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Flame, BookOpen, Plus } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export function Layout({ children, onAddClick, showAddButton = false }: LayoutProps) {
  const [location] = useLocation();
  const { mode, setMode } = useTheme();

  const isHearth = location === "/" || location.startsWith("/hearth") || location.startsWith("/recipe");
  const isStudy = location.startsWith("/study");

  return (
    <div className="min-h-screen bg-background theme-transition">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link href="/">
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <h1 className="text-xl font-serif font-semibold tracking-tight">Kindred.</h1>
                </div>
              </motion.div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={isHearth ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-xl transition-all duration-300",
                    isHearth && "glow-sage"
                  )}
                  onClick={() => setMode("hearth")}
                  data-testid="nav-hearth"
                >
                  <Flame className="w-4 h-4" />
                  <span className="hidden sm:inline">The Hearth</span>
                </Button>
              </Link>
              <Link href="/study">
                <Button
                  variant={isStudy ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-xl transition-all duration-300",
                    isStudy && "glow-gold"
                  )}
                  onClick={() => setMode("study")}
                  data-testid="nav-study"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">The Study</span>
                </Button>
              </Link>

              {showAddButton && (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-xl ml-2"
                  onClick={onAddClick}
                  data-testid="button-add"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="theme-transition">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
