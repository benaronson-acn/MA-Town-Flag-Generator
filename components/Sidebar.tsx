
import React from 'react';
import { SavedFlag } from '../constants/interface';

interface SidebarProps {
  savedFlags: SavedFlag[];
  onClearFlags: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ savedFlags, onClearFlags }) => {
  return (
    <aside className="w-48 flex-shrink-0 bg-slate-800/50 rounded-xl shadow-2xl p-4 border border-slate-700 self-start max-w-[300px] w-[300px]">
      <h2 className="text-lg font-semibold text-slate-300 mb-4 text-center">
        Generated Flags
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {savedFlags.map(({ townName, flagUrl }, index) => (
          <div key={`${townName}-${index}`} className="flex justify-center mt-0">
            <img
              src={flagUrl}
              alt={`Previously generated flag for ${townName}`}
              title={townName} // Tooltip with the town's name
              className="w-[100px] h-[50px] object-cover rounded-sm shadow-lg transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>
      {savedFlags.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={onClearFlags}
            className="text-xs text-slate-400 hover:text-red-400 hover:underline focus:outline-none transition-colors"
            aria-label="Clear all saved flags"
          >
            Clear History
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
