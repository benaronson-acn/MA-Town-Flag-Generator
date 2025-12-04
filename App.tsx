import React, { useState, useCallback, useEffect } from 'react';
import { MASSACHUSETTS_TOWNS } from './constants/towns';
import { generateFlag } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import Sidebar from './components/Sidebar';
import { SavedFlag } from './constants/interface';
import Roadmap from './components/Roadmap';

// Helper function to safely read and parse flags from localStorage
const getInitialSavedFlags = (): SavedFlag[] => {
  try {
    const storedFlags = localStorage.getItem('userGeneratedFlags');
    return storedFlags ? JSON.parse(storedFlags) : [];
  } catch (error) {
    console.error("Failed to parse saved flags from localStorage", error);
    // If parsing fails, return an empty array to start fresh.
    return [];
  }
};

const App: React.FC = () => {
  const [selectedTown, setSelectedTown] = useState<string>(MASSACHUSETTS_TOWNS[0].name);
  const [generatedFlag, setGeneratedFlag] = useState<string | null>(null);
  const [flagDescription, setFlagDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlags, setSavedFlags] = useState<SavedFlag[]>(getInitialSavedFlags);
  const [view, setView] = useState<'home' | 'roadmap'>('home');

  // Effect to save flags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userGeneratedFlags', JSON.stringify(savedFlags));
    } catch (error) {
      console.error("Failed to save flags to localStorage", error);
    }
  }, [savedFlags]);

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedFlag(null);
    setFlagDescription(null);

    try {
      const townData = MASSACHUSETTS_TOWNS.find(t => t.name === selectedTown);
      if (!townData) {
        throw new Error("Selected town data not found.");
      }

      if (!townData.summary) {
        setError(`We don't have specific data for ${townData.name} yet to create a unique flag. A generic one will be attempted.`);
      }

      // Step 1: Generate the flag and description together.
      const flagResponse = await generateFlag(townData.name, townData.summary);
      setGeneratedFlag(flagResponse.imageUrl);
      setFlagDescription(flagResponse.text);
      // Use functional update to avoid stale state in useCallback
      setSavedFlags(prevFlags => [...prevFlags, {townName: townData.name, flagUrl: flagResponse.imageUrl}]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate content. ${errorMessage}`);
      console.error(err);
    } finally {
      // Step 2: All operations are finished, so turn off the loading state.
      setIsLoading(false);
    }
  }, [selectedTown]);

  const handleClearFlags = useCallback(() => {
    setSavedFlags([]);
  }, []);
  
  const handleFlagSelect = useCallback((flag: SavedFlag) => {
    setSelectedTown(flag.townName);
    setGeneratedFlag(flag.flagUrl);
    setFlagDescription(null);
    setError(null);
  }, []);

  const handleDownloadClick = useCallback(() => {
    if (!generatedFlag) return;
    const link = document.createElement('a');
    link.href = generatedFlag;
    const fileName = `flag-for-${selectedTown.replace(/\s+/g, '-')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedFlag, selectedTown]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {view === 'home' ? (
          <>
            <Header />

            <div className="flex flex-row items-start gap-8 mt-8">
              <Sidebar savedFlags={savedFlags} onClearFlags={handleClearFlags} onFlagSelect={handleFlagSelect} />

              <main className="flex-grow">
                <div className="bg-slate-800/50 rounded-xl shadow-2xl p-6 md:p-8 border border-slate-700">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="town-select" className="block text-sm font-medium text-slate-400 mb-2">
                        1. Select a Town
                      </label>
                      <select
                        id="town-select"
                        value={selectedTown}
                        onChange={(e) => setSelectedTown(e.target.value)}
                        disabled={isLoading}
                        className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      >
                        {MASSACHUSETTS_TOWNS.map((town) => (
                          <option key={town.name} value={town.name}>
                            {town.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-slate-400 text-center text-sm">{MASSACHUSETTS_TOWNS.find(town => town.name === selectedTown)?.summary}</p>
                    </div>

                    <button
                      onClick={handleGenerateClick}
                      disabled={isLoading}
                      className="w-full flex justify-center items-center gap-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          Generating...
                        </>
                      ) : (
                        '2. Generate Flag'
                      )}
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-center text-slate-300">Generated Flag</h3>
                    <div className="mt-4 w-[200px] h-[200px]  mx-auto bg-slate-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600 overflow-hidden">
                      {generatedFlag ? (
                        <div className="relative group w-full h-full">
                          <img
                            src={generatedFlag}
                            alt={`Generated flag for ${selectedTown}`}
                            className="w-full h-full object-cover"
                          />
                           <button
                              onClick={handleDownloadClick}
                              className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-sm p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              aria-label="Download flag"
                              title="Download flag"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                        </div>
                      ) : isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                          <Spinner size="h-8 w-8" />
                          <span>Creating...</span>
                        </div>
                      ) : error ? (
                        <p className="text-red-400 text-center p-4 text-sm">{error}</p>
                      ) : (
                        <p className="text-slate-500 text-center p-4 text-sm">Your flag will appear here</p>
                      )}
                    </div>
                    {error && generatedFlag && <p className="text-yellow-400 text-center p-4 text-sm">{error}</p>}
                    
                    {/* Description Section */}
                    {!isLoading && flagDescription && (
                      <div className="mt-4 p-4 bg-slate-900/60 rounded-lg border border-slate-700 animate-fade-in">
                        <h4 className="font-semibold text-slate-300 text-center">Symbolism</h4>
                        <p className="mt-2 text-slate-400 text-center text-sm">{flagDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </>
        ) : (
          <Roadmap onBack={() => setView('home')} />
        )}

        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Google Gemini</p>
          {view === 'home' && (
            <button
              onClick={() => setView('roadmap')}
              className="text-slate-400 hover:text-indigo-400 hover:underline focus:outline-none transition-colors"
              aria-label="View project roadmap"
            >
              Roadmap
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default App;