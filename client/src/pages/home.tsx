import { motion } from "framer-motion";
import { Utensils, Mic } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function HomePage() {
    const { setMode } = useTheme();

    const navigateToHearth = () => {
        setMode("hearth");
        window.location.href = "/hearth";
    };

    const navigateToStudy = () => {
        setMode("study");
        window.location.href = "/study";
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.1] text-foreground">
                            Preserving our
                            <br />
                            <span className="text-[#A44A3F] italic">history</span>, one story
                            <br />
                            at a time.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
                            Welcome to the family archive.
                        </p>
                    </motion.div>

                    {/* Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col md:flex-row justify-center gap-6 pt-8"
                    >
                        {/* The Hearth Card */}
                        <motion.div
                            onClick={navigateToHearth}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full md:w-72 h-80 bg-muted/30 rounded-[2rem] border border-[#718355]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#718355]/10 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#718355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="text-[#718355] mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Utensils size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-3xl mb-1 text-foreground">The Hearth</h3>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                    Mom's World
                                </p>
                            </div>
                        </motion.div>

                        {/* The Study Card */}
                        <motion.div
                            onClick={navigateToStudy}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full md:w-72 h-80 bg-muted/30 rounded-[2rem] border border-[#A44A3F]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#A44A3F]/10 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#A44A3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="text-[#A44A3F] mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Mic size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-3xl mb-1 text-foreground">The Study</h3>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                    Dad's World
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Footer with Family Credits */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="py-10 bg-background/50 border-t border-border backdrop-blur-sm"
            >
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
                </div>
            </motion.footer>
        </div>
    );
}
