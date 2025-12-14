import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { LegacyAudio } from "@shared/schema";

interface AudioPlayerProps {
  audio: LegacyAudio | null;
  playlist: LegacyAudio[];
  onClose: () => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: isPlaying ? [4, Math.random() * 16 + 8, 4] : 4,
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.3,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

export function AudioPlayer({ audio, playlist, onClose, onPlayNext, onPlayPrev }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audio?.audioUrl && audioRef.current) {
      audioRef.current.src = audio.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [audio?.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audio) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50",
          isMinimized ? "h-16" : "h-auto"
        )}
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onPlayNext}
        />

        <div className="max-w-4xl mx-auto px-4 py-3">
          {isMinimized ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full shrink-0"
                  onClick={togglePlay}
                  data-testid="button-play-pause-mini"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </Button>
                <div className="truncate">
                  <p className="font-medium truncate">{audio.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Waveform isPlaying={isPlaying} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setIsMinimized(false)}
                  data-testid="button-expand-player"
                >
                  <Minimize2 className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold truncate">{audio.title}</h3>
                  {audio.category && (
                    <p className="text-sm text-muted-foreground capitalize">{audio.category}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Waveform isPlaying={isPlaying} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setIsMinimized(true)}
                    data-testid="button-minimize-player"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={onClose}
                    data-testid="button-close-player"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                  data-testid="slider-audio-progress"
                />
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                    data-testid="button-mute"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(v) => setVolume(v[0])}
                    className="w-24"
                    data-testid="slider-volume"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={onPlayPrev}
                    disabled={playlist.length <= 1}
                    data-testid="button-prev-track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12 glow-gold"
                    onClick={togglePlay}
                    data-testid="button-play-pause"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={onPlayNext}
                    disabled={playlist.length <= 1}
                    data-testid="button-next-track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-24" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
