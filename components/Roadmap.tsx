import React from 'react';

interface RoadmapProps {
  onBack: () => void;
}

const RoadmapSection: React.FC<{ title: string; emoji: string; children: React.ReactNode }> = ({ title, emoji, children }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
        <span className="text-3xl mr-3" aria-hidden="true">{emoji}</span>
        {title}
      </h3>
      <ul className="space-y-3 list-disc list-inside text-slate-400">
        {children}
      </ul>
    </div>
  );
};

const Roadmap: React.FC<RoadmapProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in w-full py-2">
      <header className="flex items-center justify-between mb-8 relative">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 rounded-md p-2 -ml-2"
          aria-label="Back to home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-center absolute left-1/2 -translate-x-1/2">
          Roadmap
        </h1>
      </header>

      <main className="space-y-8">
        <RoadmapSection title="Up Next" emoji="🚀">
          <li>Share flags to social media.</li>
          <li>Download high-resolution versions of the flags.</li>
          <li>Add more town-specific data for better generation.</li>
        </RoadmapSection>

        <RoadmapSection title="Later" emoji="⏳">
          <li>Generate flags for other states or countries.</li>
          <li>User voting and rating system for generated flags.</li>
          <li>Historical flag comparison feature.</li>
        </RoadmapSection>

        <RoadmapSection title="Neat Ideas" emoji="💡">
          <li>Generate other town-specific branding (e.g., logos, slogans).</li>
          <li>Animate the generated flags (e.g., waving in the wind).</li>
          <li>Integrate a map view to see generated flags by location.</li>
        </RoadmapSection>
      </main>
    </div>
  );
};

export default Roadmap;
