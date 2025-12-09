import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Map as MapIcon } from 'lucide-react';

interface SearchZoneProps {
  onSearch: (query: string) => void;
  isAnalyzing: boolean;
}

const SearchZone: React.FC<SearchZoneProps> = ({ onSearch, isAnalyzing }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query for map preview to avoid rapid reloads while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[420px]">
        
        {/* Input Section */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              Scout a Location
            </h3>
            <p className="text-slate-500 mt-2">
              Enter a street or district. Verify it on the map, then generate your report.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center mb-4">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Abbey Road, London"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-lg text-slate-900 placeholder:text-slate-400"
                disabled={isAnalyzing}
              />
            </div>
            
            <button
              type="submit"
              disabled={!query.trim() || isAnalyzing}
              className={`
                w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200
                flex items-center justify-center gap-2
                ${!query.trim() || isAnalyzing 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Scanning Satellite Data...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" /> Generate Report
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">Try these locations:</span>
            <div className="flex flex-wrap gap-2">
              {['Times Square, NYC', 'Shibuya Crossing, Tokyo', 'La Rambla, Barcelona'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Preview Section */}
        <div className="md:w-[45%] bg-slate-100 relative min-h-[300px] md:min-h-full border-t md:border-t-0 md:border-l border-slate-200">
           {debouncedQuery ? (
             <iframe 
               width="100%" 
               height="100%" 
               className="absolute inset-0 w-full h-full grayscale-[10%] hover:grayscale-0 transition-all duration-700"
               frameBorder="0" 
               title="map preview" 
               scrolling="no" 
               src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
               loading="lazy"
             />
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-100/50">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                  <MapIcon className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-medium text-slate-500">Map Preview</p>
                <p className="text-sm mt-1 max-w-[200px] opacity-75">Start typing to verify the location here</p>
             </div>
           )}
           
           {/* Overlay Badge */}
           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-sm pointer-events-none z-20 border border-slate-100">
             Preview
           </div>
        </div>
      </div>
    </div>
  );
};

export default SearchZone;