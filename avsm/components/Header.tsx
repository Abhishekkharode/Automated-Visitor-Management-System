import React from 'react';

// Add keyframes for the animation in a style tag or tailwind config
const pulseAnimation = `
@keyframes pulse-slow {
  50% {
    opacity: .7;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

export const Header = (): React.ReactNode => {
  return (
    <>
    <style>{pulseAnimation}</style>
    <header className="w-full max-w-6xl flex items-center justify-center sm:justify-start">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          VisioTrack <span className="text-cyan-500">AI</span>
        </h1>
      </div>
    </header>
    </>
  );
};