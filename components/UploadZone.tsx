import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Map as MapIcon, Loader2 } from 'lucide-react';

interface SearchZoneProps {
  onSearch: (query: string) => void;
  isAnalyzing: boolean;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const SearchZone: React.FC<SearchZoneProps> = ({ onSearch, isAnalyzing }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce query for map preview and suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay for better typing experience
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch Autocomplete Suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5&addressdetails=1`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.display_name);
    setShowSuggestions(false);
    // Optional: could immediately trigger search or just update map
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

          <div ref={wrapperRef} className="relative mb-6">
            <form onSubmit={handleSubmit} className="relative z-20">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.length < 3) setShowSuggestions(false);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="e.g. Abbey Road, London"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-lg text-slate-900 placeholder:text-slate-400"
                  disabled={isAnalyzing}
                  autoComplete="off"
                />
                {isLoadingSuggestions && (
                  <div className="absolute right-4">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50 divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-200">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex items-start gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 mt-1 group-hover:text-indigo-500" />
                    <span className="text-sm text-slate-600 font-medium group-hover:text-indigo-700 line-clamp-2">
                      {suggestion.display_name}
                    </span>
                  </button>
                ))}
                <div className="px-4 py-2 bg-slate-50 text-[10px] text-right text-slate-400 font-medium uppercase tracking-wider">
                  Suggestions via OSM
                </div>
              </div>
            )}
          </div>
            
          <button
            onClick={() => query.trim() && onSearch(query)}
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

          <div className="mt-8">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">Try these locations:</span>
            <div className="flex flex-wrap gap-2">
              {['Times Square, NYC', 'Shibuya Crossing, Tokyo', 'La Rambla, Barcelona'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    setDebouncedQuery(suggestion);
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