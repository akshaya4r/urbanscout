
import React from 'react';
import { StreetReport } from '../types';
import MetricCard from './MetricCard';
import { 
  Bike, 
  Footprints, 
  Ruler, 
  TreeDeciduous,
  Building2, 
  Activity, 
  ShieldCheck,
  Droplets,
  ExternalLink,
  Map as MapIcon,
  Wind,
  Accessibility,
  ArrowUpFromLine,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Waves,
  Armchair,
  Flower2,
  Palmtree,
  Sun,
  MapPin,
  Building,
  Lightbulb
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ReportDisplayProps {
  report: StreetReport;
  onReset: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onReset }) => {
  
  const mixData = [
    { name: 'Residential', value: report.buildingMix.residential, color: '#6366f1' }, // Indigo
    { name: 'Commercial', value: report.buildingMix.commercial, color: '#ec4899' },   // Pink
    { name: 'Other', value: report.buildingMix.other, color: '#94a3b8' },            // Slate
  ].filter(d => d.value > 0);

  const getHealthStatus = (health: string) => {
    switch (health) {
      case 'Excellent': return 'success';
      case 'Good': return 'success';
      case 'Fair': return 'warning';
      case 'Poor': return 'danger';
      default: return 'neutral';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };
  
  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Good
    if (aqi <= 100) return 'bg-amber-50 text-amber-700 border-amber-200'; // Moderate
    if (aqi <= 150) return 'bg-orange-50 text-orange-700 border-orange-200'; // Unhealthy for Sensitive
    return 'bg-rose-50 text-rose-700 border-rose-200'; // Unhealthy+
  };

  const vegLevels = ['None', 'Sparse', 'Moderate', 'Abundant'];
  const currentVegIndex = vegLevels.indexOf(report.vegetationLevel);

  // Helper for Pavement Status Icons
  const PavementIcon = report.pavementAnalysis?.exists 
    ? (report.pavementAnalysis.isWheelchairFriendly ? Accessibility : Footprints)
    : Ban;

  // Determine map query for open spaces
  const openSpaceQuery = report.openSpaceAnalysis?.names && report.openSpaceAnalysis.names.length > 0
    ? report.openSpaceAnalysis.names[0] + " near " + report.streetName
    : "parks near " + report.streetName;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner - Map Style */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden mb-8 shadow-2xl p-6 md:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                 {report.locationType === 'City' ? <Building2 className="w-3 h-3" /> : 
                  report.locationType === 'District' ? <MapIcon className="w-3 h-3" /> : 
                  <MapPin className="w-3 h-3" />}
                 {report.locationType || 'Location'} Analysis
              </div>
              {report.mapUrl && (
                <a 
                  href={report.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                >
                  <ExternalLink className="w-3 h-3" /> Open in Maps
                </a>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {report.streetName}
            </h1>
            <p className="text-slate-300 max-w-2xl text-lg leading-relaxed border-l-2 border-indigo-500/50 pl-4">
              {report.summary}
            </p>
          </div>

          {/* Infrastructure Score Circle */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">Infrastructure<br/>Score</div>
              <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-[6px] ${getScoreColor(report.infrastructureScore)}`}>
                  <div className="text-center">
                    <span className={`text-4xl font-black text-white`}>
                      {report.infrastructureScore}
                    </span>
                    <span className="block text-xs font-medium text-slate-400 -mt-1">/ 100</span>
                  </div>
              </div>
              <div className="mt-3 text-center max-w-[140px]">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAqiColor(report.infrastructureScore >= 50 ? 50 : 150)}`}>
                   {report.infrastructureScore >= 80 ? 'Excellent' : report.infrastructureScore >= 50 ? 'Average' : 'Needs Work'}
                </span>
              </div>
          </div>
        </div>
      </div>

      {/* Score Reasoning Bar */}
      <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
         <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
           <ShieldCheck className="w-5 h-5" />
         </div>
         <div>
           <h4 className="text-sm font-bold text-indigo-900 uppercase mb-1">Why this score?</h4>
           <p className="text-indigo-800 text-sm">{report.infrastructureScoreReasoning}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Infrastructure Metrics */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-indigo-600" /> Infrastructure Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label={report.locationType === 'Street' ? "Est. Width" : "Avg. Width"}
                value={report.estimatedWidth} 
                icon={Ruler} 
              />
              <MetricCard 
                label="Cycling Lane" 
                value={report.hasCyclingLane ? "Present" : "None"} 
                icon={Bike} 
                status={report.hasCyclingLane ? 'success' : 'neutral'}
              />
              <MetricCard 
                label="Open Drains" 
                value={report.hasOpenDrains ? "Detected" : "None"} 
                icon={Droplets} 
                status={report.hasOpenDrains ? 'danger' : 'success'}
              />
               <MetricCard 
                label="Pavement" 
                value={
                  report.hasPavement 
                    ? (report.pavementAnalysis?.isWheelchairFriendly ? "Available" : "Limited Access") 
                    : "Missing"
                } 
                icon={PavementIcon} 
                status={
                  report.hasPavement 
                    ? (report.pavementAnalysis?.isWheelchairFriendly ? 'success' : 'warning') 
                    : 'danger'
                }
              />
            </div>
          </section>

          {/* Walkability & Accessibility Section */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-indigo-600" /> Walkability & Accessibility
            </h3>
            
            {report.pavementAnalysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Left: Detailed Description */}
                 <div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {report.pavementAnalysis.safetyDescription}
                    </p>
                    
                    <div className="flex flex-col gap-2">
                       <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Obstructions</span>
                       {report.pavementAnalysis.obstructions && report.pavementAnalysis.obstructions.length > 0 && report.pavementAnalysis.obstructions[0] !== "None" ? (
                         <div className="flex flex-wrap gap-2">
                           {report.pavementAnalysis.obstructions.map((obs, idx) => (
                             <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs border border-amber-100 font-medium">
                               <AlertTriangle className="w-3 h-3" /> {obs}
                             </span>
                           ))}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                           <CheckCircle2 className="w-4 h-4" /> Path Clear
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Right: Key Features Grid */}
                 <div className="grid grid-cols-2 gap-3">
                    {/* Raised Status */}
                    <div className={`p-3 rounded-lg border ${report.pavementAnalysis.isRaised ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-2 mb-1">
                          <ArrowUpFromLine className={`w-4 h-4 ${report.pavementAnalysis.isRaised ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold uppercase ${report.pavementAnalysis.isRaised ? 'text-indigo-700' : 'text-slate-500'}`}>Elevation</span>
                       </div>
                       <span className={`text-sm font-medium ${report.pavementAnalysis.isRaised ? 'text-indigo-900' : 'text-slate-600'}`}>
                         {report.pavementAnalysis.isRaised ? "Raised Curb" : "Flush / None"}
                       </span>
                    </div>

                    {/* Wheelchair Status */}
                    <div className={`p-3 rounded-lg border ${report.pavementAnalysis.isWheelchairFriendly ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                       <div className="flex items-center gap-2 mb-1">
                          <Accessibility className={`w-4 h-4 ${report.pavementAnalysis.isWheelchairFriendly ? 'text-emerald-600' : 'text-rose-500'}`} />
                          <span className={`text-xs font-bold uppercase ${report.pavementAnalysis.isWheelchairFriendly ? 'text-emerald-700' : 'text-rose-700'}`}>Access</span>
                       </div>
                       <span className={`text-sm font-medium ${report.pavementAnalysis.isWheelchairFriendly ? 'text-emerald-900' : 'text-rose-800'}`}>
                         {report.pavementAnalysis.isWheelchairFriendly ? "Friendly" : "Limited"}
                       </span>
                    </div>

                     {/* Condition */}
                    <div className="col-span-2 p-3 rounded-lg border bg-slate-50 border-slate-100 flex flex-col justify-center gap-2">
                       <div className="flex justify-between items-end">
                         <span className="text-xs font-bold uppercase text-slate-500">Surface Condition</span>
                         <span className={`text-xs font-bold uppercase ${
                           report.pavementAnalysis.condition === 'Good' ? 'text-emerald-600' : 
                           report.pavementAnalysis.condition === 'Fair' ? 'text-amber-600' : 
                           report.pavementAnalysis.condition === 'Poor' ? 'text-rose-600' : 'text-slate-400'
                         }`}>
                           {report.pavementAnalysis.condition}
                         </span>
                       </div>
                       
                       <div className="flex gap-1 h-2.5 w-full">
                          {['Poor', 'Fair', 'Good'].map((level) => {
                             const isMatch = report.pavementAnalysis.condition === level;
                             let baseColor = 'bg-slate-200';
                             if (isMatch) {
                               if (level === 'Poor') baseColor = 'bg-rose-500';
                               if (level === 'Fair') baseColor = 'bg-amber-500';
                               if (level === 'Good') baseColor = 'bg-emerald-500';
                             }
                             
                             return (
                               <div 
                                 key={level}
                                 className={`flex-1 rounded-full transition-all duration-300 ${baseColor} ${isMatch ? 'opacity-100 shadow-sm scale-105' : 'opacity-30 grayscale'}`}
                                 title={level}
                               />
                             );
                          })}
                       </div>
                       
                       <div className="flex justify-between px-1">
                          <span className={`text-[9px] uppercase font-bold ${report.pavementAnalysis.condition === 'Poor' ? 'text-rose-400' : 'text-slate-300'}`}>Poor</span>
                          <span className={`text-[9px] uppercase font-bold ${report.pavementAnalysis.condition === 'Fair' ? 'text-amber-400' : 'text-slate-300'}`}>Fair</span>
                          <span className={`text-[9px] uppercase font-bold ${report.pavementAnalysis.condition === 'Good' ? 'text-emerald-400' : 'text-slate-300'}`}>Good</span>
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm italic">No detailed pavement analysis available.</div>
            )}
          </section>

          {/* Public Realm & Open Spaces Section */}
          {report.openSpaceAnalysis && (
            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Palmtree className="w-5 h-5 text-indigo-600" /> Public Realm & Open Spaces
                </h3>
                {report.openSpaceAnalysis.exists && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    report.openSpaceAnalysis.quality === 'Excellent' || report.openSpaceAnalysis.quality === 'Good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    report.openSpaceAnalysis.quality === 'Fair' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {report.openSpaceAnalysis.quality} Quality
                  </span>
                )}
              </div>

              {report.openSpaceAnalysis.exists ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                     {/* Type Icons */}
                     <div className="flex flex-wrap gap-3">
                        {report.openSpaceAnalysis.types.map((type, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center p-3 w-20 h-20 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                             {type.toLowerCase().includes('water') ? <Waves className="w-6 h-6 text-indigo-500 mb-1" /> :
                              type.toLowerCase().includes('garden') ? <Flower2 className="w-6 h-6 text-indigo-500 mb-1" /> :
                              type.toLowerCase().includes('play') ? <Sun className="w-6 h-6 text-indigo-500 mb-1" /> :
                              <Palmtree className="w-6 h-6 text-indigo-500 mb-1" />
                             }
                             <span className="text-[9px] font-bold uppercase text-indigo-800 text-center leading-tight">{type}</span>
                          </div>
                        ))}
                     </div>

                     {/* Identified Names */}
                     {report.openSpaceAnalysis.names && report.openSpaceAnalysis.names.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Identified Nearby</span>
                          <div className="flex flex-col gap-2">
                             {report.openSpaceAnalysis.names.map((name, idx) => (
                               <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                 <MapPin className="w-4 h-4 text-indigo-500" />
                                 {name}
                               </div>
                             ))}
                          </div>
                        </div>
                     )}

                     <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-indigo-100 pl-4">
                       {report.openSpaceAnalysis.description}
                     </p>

                     {/* Amenities */}
                     {report.openSpaceAnalysis.amenities.length > 0 && report.openSpaceAnalysis.amenities[0] !== 'None' && (
                       <div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amenities</span>
                         <div className="flex flex-wrap gap-2">
                           {report.openSpaceAnalysis.amenities.map((amenity, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                               {amenity.toLowerCase().includes('bench') ? <Armchair className="w-3 h-3 text-slate-400" /> :
                                amenity.toLowerCase().includes('water') ? <Droplets className="w-3 h-3 text-slate-400" /> :
                                <CheckCircle2 className="w-3 h-3 text-slate-400" />
                               }
                               <span className="truncate">{amenity}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>

                  {/* Right Column: Map */}
                  <div className="h-full min-h-[250px] md:min-h-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group">
                     <iframe 
                       width="100%" 
                       height="100%" 
                       className="absolute inset-0 w-full h-full grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                       frameBorder="0" 
                       title="open spaces map" 
                       scrolling="no" 
                       src={`https://maps.google.com/maps?q=${encodeURIComponent(openSpaceQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                       loading="lazy"
                     />
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-slate-500 shadow-sm pointer-events-none border border-white/20">
                       Nearby Open Spaces
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="text-center text-slate-400">
                     <Palmtree className="w-8 h-8 mx-auto mb-2 opacity-50" />
                     <p className="font-medium">No significant open spaces identified nearby.</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Condition & Environment */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Condition & Environment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Health Score */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-slate-600 font-medium">Infrastructure Health</span>
                   <span className={`px-3 py-1 rounded-full text-sm font-bold bg-slate-100 ${
                     report.streetHealth === 'Excellent' ? 'text-emerald-600 bg-emerald-50' : 
                     report.streetHealth === 'Good' ? 'text-emerald-600 bg-emerald-50' :
                     report.streetHealth === 'Fair' ? 'text-amber-600 bg-amber-50' : 
                     'text-rose-600 bg-rose-50'
                   }`}>{report.streetHealth}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getHealthStatus(report.streetHealth) === 'success' ? 'bg-emerald-500' : getHealthStatus(report.streetHealth) === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: report.streetHealth === 'Excellent' ? '100%' : report.streetHealth === 'Good' ? '75%' : report.streetHealth === 'Fair' ? '50%' : '25%' }}
                  />
                </div>
                <p className="text-sm text-slate-500 italic">"{report.healthReasoning}"</p>
              </div>

              {/* Vegetation */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-slate-600 font-medium">Greenery Coverage</span>
                </div>
                 
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-end justify-between gap-1 h-20">
                    {vegLevels.map((level, idx) => {
                      const isActive = idx <= currentVegIndex;
                      const isCurrent = idx === currentVegIndex;
                      
                      // Scale mapping
                      const scale = idx === 0 ? 'scale-90' : idx === 1 ? 'scale-100' : idx === 2 ? 'scale-110' : 'scale-125';
                      const color = idx === 0 ? 'text-slate-400 bg-slate-400' : 
                                    idx === 1 ? 'text-emerald-300 bg-emerald-300' : 
                                    idx === 2 ? 'text-emerald-500 bg-emerald-500' : 
                                    'text-emerald-700 bg-emerald-700';
                      
                      const iconColor = isActive ? color.split(' ')[0] : 'text-slate-200';
                      const barColor = isActive ? color.split(' ')[1] : 'bg-slate-100';

                      return (
                        <div key={level} className="flex flex-col items-center gap-1.5 flex-1 relative group">
                           {/* Icon with growing size */}
                           <div className={`transition-all duration-500 transform ${isActive ? scale : 'scale-90'} ${iconColor} ${isCurrent ? 'drop-shadow-sm' : ''}`}>
                              <TreeDeciduous 
                                strokeWidth={isActive ? 2.5 : 2} 
                                className={`w-${6 + (idx * 2)} h-${6 + (idx * 2)}`} // Dynamic sizing class isn't ideal in Tailwind w/o safelist, so using style or specific classes
                                style={{ width: `${20 + idx * 6}px`, height: `${20 + idx * 6}px`}}
                              />
                           </div>
                           
                           {/* Indicator Bar */}
                           <div className={`w-full h-1.5 rounded-full transition-colors duration-500 ${barColor}`}></div>
                           
                           {/* Label */}
                           <span className={`text-[10px] uppercase font-bold transition-colors ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                             {level === 'Moderate' ? 'Mod' : level === 'Abundant' ? 'High' : level}
                           </span>
                        </div>
                      );
                    })}
                 </div>

                 <p className="text-sm text-slate-500 leading-snug">
                   {report.vegetationLevel === 'Abundant' ? 'Dense vegetation providing extensive shade.' : 
                    report.vegetationLevel === 'Moderate' ? 'Balanced greenery with street trees.' :
                    report.vegetationLevel === 'Sparse' ? 'Limited planting, mostly hardscape.' :
                    'Urban hardscape with no visible nature.'}
                 </p>
              </div>

              {/* Air Quality */}
              <div className={`p-4 rounded-xl border ${getAqiColor(report.airQuality.aqi)} flex flex-col justify-between`}>
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-medium opacity-90">Air Quality</span>
                    <Wind className="w-5 h-5 opacity-80" />
                 </div>
                 <div>
                   <div className="text-3xl font-bold mb-1">{report.airQuality.aqi}</div>
                   <div className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-2">{report.airQuality.category}</div>
                   <div className="text-xs opacity-70">
                      Pollutant: {report.airQuality.dominantPollutant}
                   </div>
                 </div>
              </div>

              {/* Lighting Analysis (New) */}
              <div className={`p-4 rounded-xl border ${
                report.lightingAnalysis?.coverage === 'Excellent' || report.lightingAnalysis?.coverage === 'Good' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                report.lightingAnalysis?.coverage === 'Fair' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                'bg-slate-100 text-slate-500 border-slate-200'
              } flex flex-col justify-between`}>
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-medium opacity-90">Lighting</span>
                    <Lightbulb className="w-5 h-5 opacity-80" />
                 </div>
                 <div>
                   <div className="text-xl font-bold mb-1">
                     {report.lightingAnalysis?.coverage || 'N/A'}
                   </div>
                   <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
                     {report.lightingAnalysis?.type || 'Unknown'}
                   </div>
                   <div className="text-xs opacity-75 leading-tight">
                      {report.lightingAnalysis?.qualityDescription || 'No data'}
                   </div>
                 </div>
              </div>

            </div>
          </section>

        </div>

        {/* Sidebar / Secondary Stats */}
        <div className="space-y-8">
          
          {/* Building Mix Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" /> Zoning Estimate
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Chart */}
              <div className="h-40 w-40 flex-shrink-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {mixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text indicating dominant */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400">MIX</span>
                 </div>
              </div>

              {/* Legend / Bars */}
              <div className="flex-1 w-full space-y-4">
                {mixData.length > 0 ? mixData.map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-400 text-sm text-center italic">No zoning data available</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2">
               <MapPin className="w-4 h-4" /> About this Report
             </h4>
             <p className="mb-4">
               This analysis is generated using AI estimations based on satellite imagery and maps data for 
               <span className="text-white font-medium"> {report.streetName}</span>.
             </p>
             <div className="text-xs opacity-70 border-t border-slate-800 pt-3">
               Infrastructure scores are estimates and may not reflect real-time conditions.
             </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center pb-12">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
        >
          Scout Another Location
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;
