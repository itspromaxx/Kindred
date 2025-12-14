import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, Plus, Mic, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { StudyModal } from "@/components/study-modal";
import { KindleReader } from "@/components/kindle-reader";
import { PodcastPlayer } from "@/components/podcast-player";

type Story = {
  id: number;
  title: string;
  type: "podcast" | "short";
  duration?: string;
  topic?: string;
  year?: string;
  content?: string;
  media_url?: string;
  created_at: string;
};

export default function Study() {
  const { setMode } = useTheme();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<"short" | "podcast">("podcast");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reader/Player State
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);

  useEffect(() => {
    setMode("study");
    fetchStories();
  }, [setMode]);

  const fetchStories = async () => {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setStories(data);
      const latestPodcast = data.find((s: Story) => s.type === "podcast");
      if (latestPodcast) setFeaturedStory(latestPodcast);
    }
  };

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
    if (story.type === "short") {
      setIsReaderOpen(true);
    } else {
      setIsPlayerOpen(true);
    }
  };

  const filteredStories = stories.filter((s) => s.type === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">


      {/* Featured Wisdom Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => featuredStory && handleStoryClick(featuredStory)}
        className="relative overflow-hidden rounded-[2rem] bg-[#2A2A2A] text-[#FDFBF7] p-8 md:p-12 mb-16 shadow-2xl cursor-pointer group hover:scale-[1.01] transition-transform duration-500"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <BookOpen size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[#A44A3F] text-[10px] tracking-[0.3em] uppercase font-bold">
              Featured Wisdom
            </span>
            <span className="text-white/40 text-xs font-serif italic">
              Latest Entry
            </span>
          </div>

          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight group-hover:text-white/90 transition-colors">
              {featuredStory ? featuredStory.title : "Ready to preserve history..."}
            </h2>

            {featuredStory && (
              <div className="flex items-center gap-6">
                <button className="w-16 h-16 rounded-full bg-[#A44A3F] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#A44A3F]/20">
                  <Play className="w-6 h-6 text-white ml-1 fill-white" />
                </button>

                <div className="flex gap-1 items-end h-8 opacity-50 hidden sm:flex">
                  {[40, 60, 45, 70, 90, 30, 60, 50, 40, 60, 80, 50, 40, 30, 40, 50, 70, 40, 30, 40].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-1 bg-white/60 rounded-full" />
                  ))}
                </div>

                <div className="flex-grow" />

                <span className="text-xs font-mono opacity-50 tracking-widest">
                  {featuredStory.duration || "AUDIO"}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs & Content */}
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-8 border-b border-[#A44A3F]/20 mb-10 pb-1">
          <button
            onClick={() => setActiveTab("podcast")}
            className={`pb-4 text-xs tracking-[0.2em] uppercase transition-all ${activeTab === "podcast"
              ? "font-bold text-[#A44A3F] border-b-2 border-[#A44A3F]"
              : "text-muted-foreground hover:text-[#2A2A2A]"
              }`}
          >
            The Podcast
          </button>
          <button
            onClick={() => setActiveTab("short")}
            className={`pb-4 text-xs tracking-[0.2em] uppercase transition-all ${activeTab === "short"
              ? "font-bold text-[#A44A3F] border-b-2 border-[#A44A3F]"
              : "text-muted-foreground hover:text-[#2A2A2A]"
              }`}
          >
            Short Notes
          </button>
        </div>

        {/* List View */}
        <div className="space-y-4">
          {filteredStories.length > 0 ? (
            filteredStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleStoryClick(story)}
                className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-[#E5E5E0] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-[#E5E5E0] flex items-center justify-center group-hover:border-[#A44A3F] group-hover:bg-[#A44A3F] transition-colors shrink-0">
                  {story.type === "podcast" ? (
                    <Play className="w-5 h-5 text-[#A44A3F] group-hover:text-white ml-0.5 transition-colors" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#A44A3F] group-hover:text-white transition-colors" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-xl text-[#2A2A2A] group-hover:text-[#A44A3F] transition-colors">
                      {story.title}
                    </h3>
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    {story.type === "short" ? story.year : story.topic}
                  </p>
                </div>

                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {story.type === "short" ? "" : story.duration}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground italic font-serif">
              The archive is waiting for its first story...
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#2A2A2A] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-colors z-50"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <StudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchStories}
      />

      {/* Immersive Views */}
      <KindleReader
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        story={activeStory as any}
      />
      <PodcastPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        story={activeStory as any}
      />
    </div>
  );
}
