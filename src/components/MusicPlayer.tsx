import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Dreams",
    artist: "AI AudioGen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
    color: "from-cyan-400 to-blue-500"
  },
  {
    id: 2,
    title: "Neon Overdrive",
    artist: "AI AudioGen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    id: 3,
    title: "Synthwave Protocol",
    artist: "AI AudioGen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
    color: "from-yellow-400 to-orange-500"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" />
          RADIO
        </h2>
        <div className="flex space-x-1">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-1 bg-cyan-400 rounded-full ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 16 + 8}px` : '4px',
                transition: 'height 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center mb-8">
        <div className={`w-32 h-32 rounded-full mb-6 relative flex items-center justify-center bg-gray-900 border-2 border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentTrack.color} opacity-20 blur-md`}></div>
          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${currentTrack.color} flex items-center justify-center shadow-inner`}>
            <div className="w-8 h-8 rounded-full bg-gray-950 border border-gray-800"></div>
          </div>
        </div>
        
        <div className="text-center w-full px-4">
          <h3 className="text-lg font-bold text-white truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-sm text-gray-400 truncate mt-1">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="w-full mb-6">
        <div 
          className="h-1.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div 
            className={`h-full bg-gradient-to-r ${currentTrack.color} relative`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_#fff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-2 text-gray-300 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full bg-gradient-to-r ${currentTrack.color} text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 text-gray-300 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-9"></div> {/* Spacer for balance */}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </div>
  );
}
