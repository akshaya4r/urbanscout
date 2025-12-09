import React, { useState } from 'react';
import { AnalysisState } from './types';
import { analyzeLocation } from './services/geminiService';
import SearchZone from './components/UploadZone'; // Renamed logically, keeping file import for now
import ReportDisplay from './components/ReportDisplay';
import { Map, Zap, Loader2, AlertCircle, Satellite } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    report: null,
    error: null,
    locationQuery: null,
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({
      ...prev,
      status: 'analyzing',
      error: null,
      locationQuery: query
    }));

    try {
      const report = await analyzeLocation(query);
      setState(prev => ({
        ...prev,
        status: 'success',
        report
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || "Something went wrong during analysis."
      }));
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      report: null,
      error: null,
      locationQuery: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation / Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">StreetScout</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
             <span className="hidden md:block">Powered by Gemini 2.5 + Maps</span>
             <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {state.status === 'idle' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Instant urban reports for <span className="text-indigo-600">any street</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Just enter a location name. Our AI scouts Google Maps for satellite and street view data to generate a comprehensive infrastructure analysis.
              </p>
            </div>

            <SearchZone 
              onSearch={handleSearch} 
              isAnalyzing={false} 
            />
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
               <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Instant Scouting</h3>
                  <p className="text-sm text-slate-500">No images needed. Just type an address.</p>
               </div>
               <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Maps Grounding</h3>
                  <p className="text-sm text-slate-500">Uses real-world map data for accuracy.</p>
               </div>
               <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Loader2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Deep Analysis</h3>
                  <p className="text-sm text-slate-500">Checks for drains, lanes, and pavement coverage.</p>
               </div>
            </div>
          </div>
        )}

        {state.status === 'analyzing' && (
          <div className="max-w-2xl mx-auto text-center pt-24 animate-in fade-in duration-500">
             <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Map className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
             </div>
             <h2 className="text-3xl font-bold text-slate-800 mb-4">Scouting Location...</h2>
             <p className="text-lg text-slate-500">
               Searching Google Maps for <span className="font-semibold text-slate-800">"{state.locationQuery}"</span>...
             </p>
             <p className="text-sm text-slate-400 mt-2">Analyzing street view and satellite data for infrastructure details.</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="max-w-lg mx-auto text-center pt-12 animate-in zoom-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Scouting Failed</h2>
              <p className="text-slate-500 mb-6">{state.error}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Try Another Location
              </button>
            </div>
          </div>
        )}

        {state.status === 'success' && state.report && (
          <ReportDisplay 
            report={state.report} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
};

export default App;