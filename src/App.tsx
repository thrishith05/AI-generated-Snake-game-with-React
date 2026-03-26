import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="noise"></div>
      <div className="pointer-events-none absolute inset-0 z-50 scanlines opacity-40"></div>
      
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-display uppercase text-[#0ff] glitch glitch-skew" data-text="SYSTEM.SNAKE">
          SYSTEM.SNAKE
        </h1>
        <p className="text-[#f0f] mt-2 text-xl tracking-widest uppercase screen-tear">
          [ AUDIO_PROTOCOL_ACTIVE ]
        </p>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-12 items-center xl:items-start w-full max-w-7xl justify-center z-10">
        {/* Game Container */}
        <div className="brutal-border bg-black p-4 relative">
          <div className="absolute top-0 left-0 bg-[#0ff] text-black px-2 py-1 text-sm font-bold uppercase">
            EXECUTE: snake.exe
          </div>
          <div className="mt-6">
            <SnakeGame />
          </div>
        </div>

        {/* Music Player Container */}
        <div className="w-full xl:w-96 brutal-border-alt bg-black p-4 relative">
          <div className="absolute top-0 right-0 bg-[#f0f] text-black px-2 py-1 text-sm font-bold uppercase">
            MODULE: audio_stream
          </div>
          <div className="mt-6">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
