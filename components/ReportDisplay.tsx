
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
  Lightbulb,
  Sparkles,
  Trash2,
  Navigation,
  Bus,
  TrainFront,
  Car,
  Clock,
  Users,
  Coffee,
  Wifi,
  Utensils,
  Music,
  Info,
  Volume2,
  Recycle,
  Landmark,
  BookOpen,
  Leaf,
  Sprout,
  Shrub
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
  
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Good
    if (aqi <= 100) return 'bg-amber-50 text-amber-700 border-amber-200'; // Moderate
    if (aqi <= 150) return 'bg-orange-50 text-orange-700 border-orange-200'; // Unhealthy for Sensitive
    return 'bg-rose-50 text-rose-700 border-rose-200'; // Unhealthy+
  };
  
  const getCongestionColor = (level: string) => {
     switch (level) {
       case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
       case 'Moderate': return 'bg-amber-100 text-amber-800 border-amber-200';
       case 'Heavy': return 'bg-orange-100 text-orange-800 border-orange-200';
       case 'Severe': return 'bg-rose-100 text-rose-800 border-rose-200';
       default: return 'bg-slate-100 text-slate-800 border-slate-200';
     }
  };

  // Helper for Pavement Status Icons
  const PavementIcon = report.pavementAnalysis?.exists 
    ? (report.pavementAnalysis.isWheelchairFriendly ? Accessibility : Footprints)
    : Ban;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Banner - Map Style */}
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

      {/* 2. Score Reasoning Bar */}
      <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
         <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
           <ShieldCheck className="w-5 h-5" />
         </div>
         <div>
           <h4 className="text-sm font-bold text-indigo-900 uppercase mb-1">Why this score?</h4>
           <p className="text-indigo-800 text-sm">{report.infrastructureScoreReasoning}</p>
         </div>
      </div>

      {/* 3. Context & Vitals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         
         {/* Zoning Mix */}
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-indigo-600" /> Zoning Mix
            </h3>
            <div className="flex items-center gap-4 flex-1">
               <div className="h-24 w-24 relative flex-shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {mixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
               </div>
               <div className="flex-1 space-y-2">
                {mixData.length > 0 ? mixData.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    <div className="flex justify-between items-center text-xs">
                       <span className="flex items-center gap-1.5 font-medium text-slate-600">
                         <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                         {item.name}
                       </span>
                       <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                )) : <span className="text-xs text-slate-400 italic">No zoning data</span>}
               </div>
            </div>
         </div>

         {/* Street Health */}
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
               <span className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                 <Activity className="w-4 h-4 text-indigo-600" /> Infra Health
               </span>
               <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 ${
                     report.streetHealth === 'Excellent' ? 'text-emerald-600 bg-emerald-50' : 
                     report.streetHealth === 'Good' ? 'text-emerald-600 bg-emerald-50' :
                     report.streetHealth === 'Fair' ? 'text-amber-600 bg-amber-50' : 
                     'text-rose-600 bg-rose-50'
                   }`}>{report.streetHealth}</span>
             </div>
             <div className="space-y-3">
               <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getHealthStatus(report.streetHealth) === 'success' ? 'bg-emerald-500' : getHealthStatus(report.streetHealth) === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: report.streetHealth === 'Excellent' ? '100%' : report.streetHealth === 'Good' ? '75%' : report.streetHealth === 'Fair' ? '50%' : '25%' }}
                  />
               </div>
               <p className="text-xs text-slate-500 italic leading-snug">"{report.healthReasoning}"</p>
             </div>
         </div>
      </div>

      {/* 4. Connectivity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Public Transport */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Bus className="w-4 h-4 text-indigo-600" /> Public Transport
                    </h3>
                    <div className="text-2xl font-bold text-slate-900">{report.publicTransport?.rating || "N/A"}</div>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {report.publicTransport?.description || "Data unavailable"}
                 </p>
                 {report.publicTransport?.types && report.publicTransport.types.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                      {report.publicTransport.types.map((type, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] uppercase font-bold text-slate-600 flex items-center gap-1.5">
                          {type.toLowerCase().includes('train') || type.toLowerCase().includes('metro') ? <TrainFront className="w-3 h-3" /> : <Bus className="w-3 h-3" />}
                          {type}
                        </span>
                      ))}
                   </div>
                 )}
              </div>
          </div>

          {/* Traffic Dynamics */}
          {report.trafficAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4 text-indigo-600" /> Traffic Dynamics
                  </h3>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${getCongestionColor(report.trafficAnalysis.congestionLevel)}`}>
                      {report.trafficAnalysis.congestionLevel} Congestion
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-sm text-slate-600 leading-relaxed">
                     {report.trafficAnalysis.description}
                     {report.trafficAnalysis.peakHours && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
                           <Clock className="w-3 h-3" /> Peak: {report.trafficAnalysis.peakHours}
                        </div>
                     )}
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {[
                        { label: 'Cars', icon: Car, level: report.trafficAnalysis.modalSplit.car },
                        { label: 'Transit', icon: Bus, level: report.trafficAnalysis.modalSplit.bus },
                        { label: 'Pedestrians', icon: Users, level: report.trafficAnalysis.modalSplit.pedestrian }
                      ].map((mode) => (
                        <div key={mode.label} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2 text-slate-600">
                              <mode.icon className="w-3.5 h-3.5 opacity-70" />
                              <span>{mode.label}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                mode.level === 'Heavy' ? 'bg-rose-500' :
                                mode.level === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                              <span className="font-medium text-slate-700">{mode.level}</span>
                           </div>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
          )}
      </div>

      {/* 5. Physical Infrastructure & Public Realm Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* LEFT COLUMN: Physical Build */}
        <div className="space-y-8">
           {/* Metric Cards Grid */}
           <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-indigo-600" /> Street Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* 1. Road Width */}
                <div className="p-4 rounded-xl border bg-slate-800 text-white border-slate-700 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium opacity-80">{report.locationType === 'Street' ? "Road Width" : "Avg. Road Width"}</span>
                      <Ruler className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div className="text-xl font-bold">{report.estimatedWidth}</div>
                </div>

                {/* 2. Pavement */}
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

                {/* 3. Cycling Lane */}
                <MetricCard 
                  label="Cycling Lane" 
                  value={report.hasCyclingLane ? "Present" : "None"} 
                  icon={Bike} 
                  status={report.hasCyclingLane ? 'success' : 'neutral'}
                />

                {/* 4. Lighting */}
                <MetricCard
                   label="Lighting"
                   value={report.lightingAnalysis?.coverage || 'N/A'}
                   subtext={report.lightingAnalysis?.qualityDescription}
                   icon={Lightbulb}
                   status={
                     report.lightingAnalysis?.coverage === 'Excellent' ? 'success' :
                     report.lightingAnalysis?.coverage === 'Good' ? 'success' :
                     report.lightingAnalysis?.coverage === 'Fair' ? 'warning' : 'neutral'
                   }
                />

                {/* 5. Greenery */}
                <MetricCard
                  label="Greenery"
                  value={report.vegetationLevel}
                  icon={TreeDeciduous}
                  status={
                    report.vegetationLevel === 'Abundant' ? 'success' :
                    report.vegetationLevel === 'Moderate' ? 'success' :
                    report.vegetationLevel === 'Sparse' ? 'warning' : 'neutral'
                  }
                />

                {/* 6. Drainage */}
                <MetricCard 
                  label="Drainage" 
                  value={report.hasOpenDrains ? "Exposed" : "Underground"} 
                  icon={Waves} 
                  status={report.hasOpenDrains ? 'danger' : 'success'}
                />
              </div>
           </section>

           {/* Walkability Card */}
           <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-indigo-600" /> Walkability & Accessibility
            </h3>
            
            {report.pavementAnalysis ? (
              <div className="space-y-6">
                 {/* Detailed Description */}
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

                 {/* Key Features Grid */}
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
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm italic">No detailed pavement analysis available.</div>
            )}
           </section>
        </div>

        {/* RIGHT COLUMN: Environment & Public Realm */}
        <div className="space-y-8">
           
           {/* Sanitation & Environment Card */}
           <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Wind className="w-5 h-5 text-indigo-600" /> Sanitation & Environment
             </h3>

             {/* Environment Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Air Quality */}
                <div className={`p-4 rounded-xl border ${getAqiColor(report.airQuality.aqi)} flex flex-col justify-between`}>
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-90">Air Quality</span>
                      <Wind className="w-4 h-4 opacity-80" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-0.5">{report.airQuality.aqi}</div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80">{report.airQuality.category}</div>
                    <div className="text-[10px] opacity-70 mt-1 truncate">
                        {report.airQuality.dominantPollutant}
                    </div>
                  </div>
                </div>

                {/* Noise Pollution */}
                {report.noisePollution && (
                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    report.noisePollution.level === 'Low' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                    report.noisePollution.level === 'Moderate' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                    'bg-rose-50 border-rose-100 text-rose-800'
                  }`}>
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Noise Level</span>
                        <Volume2 className="w-4 h-4 opacity-70" />
                     </div>
                     <div>
                        <div className="text-xl font-bold mb-1">{report.noisePollution.level}</div>
                        <p className="text-[10px] opacity-80 leading-snug line-clamp-2">{report.noisePollution.description}</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="border-t border-slate-100 my-4"></div>

             {/* Sanitation Section */}
             <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Management</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        report.cleanlinessAnalysis?.rating === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                        report.cleanlinessAnalysis?.rating === 'Good' ? 'bg-emerald-50 text-emerald-600' :
                        report.cleanlinessAnalysis?.rating === 'Fair' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {report.cleanlinessAnalysis?.rating || "N/A"} Cleanliness
                  </span>
                </div>

                <div className="space-y-4">
                   {/* Cleanliness Details */}
                   <div className="flex items-start gap-3">
                     <div className={`p-2 rounded-lg shrink-0 ${
                       report.cleanlinessAnalysis?.debrisLevel === 'None' || report.cleanlinessAnalysis?.debrisLevel === 'Minor' 
                       ? 'bg-emerald-100 text-emerald-600' 
                       : 'bg-amber-100 text-amber-600'
                     }`}>
                        {(report.cleanlinessAnalysis?.debrisLevel === 'None' || report.cleanlinessAnalysis?.debrisLevel === 'Minor')
                          ? <Sparkles className="w-4 h-4" /> 
                          : <Trash2 className="w-4 h-4" />
                        }
                     </div>
                     <div>
                       <p className="text-sm font-medium text-slate-800">
                         Debris: <span className="font-normal text-slate-600">{report.cleanlinessAnalysis?.details || "Analysis not available."}</span>
                       </p>
                     </div>
                   </div>

                   {/* Integrated Bins Info */}
                   {report.binsAnalysis && (
                     <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          report.binsAnalysis.availability === 'High' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                           <Recycle className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-800">Bin Availability:</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                report.binsAnalysis.availability === 'High' ? 'bg-emerald-100 text-emerald-700' :
                                report.binsAnalysis.availability === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {report.binsAnalysis.availability}
                              </span>
                              <span className="text-xs text-slate-500">({report.binsAnalysis.estimatedSpacing})</span>
                           </div>
                           <p className="text-xs text-slate-500 italic leading-snug">
                             "{report.binsAnalysis.correlationAnalysis}"
                           </p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           </section>

           {/* Biodiversity (Renamed from Urban Forest) */}
           {report.biodiversityAnalysis && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" /> Biodiversity
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    report.biodiversityAnalysis.ecosystemHealth === 'Excellent' || report.biodiversityAnalysis.ecosystemHealth === 'Good' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {report.biodiversityAnalysis.ecosystemHealth} Health
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                   {report.biodiversityAnalysis.nativeRatio}
                </p>

                <div className="grid grid-cols-1 gap-2">
                   {report.biodiversityAnalysis.detectedSpecies && report.biodiversityAnalysis.detectedSpecies.length > 0 ? (
                      report.biodiversityAnalysis.detectedSpecies.map((plant, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                           <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-full ${plant.isNative ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                 {plant.type === 'Tree' ? <TreeDeciduous className="w-4 h-4" /> :
                                  plant.type === 'Flowering Plant' ? <Flower2 className="w-4 h-4" /> :
                                  plant.type === 'Shrub' ? <Shrub className="w-4 h-4" /> :
                                  <Sprout className="w-4 h-4" />
                                 }
                              </div>
                              <div>
                                 <div className="text-sm font-semibold text-slate-800 leading-tight">{plant.commonName}</div>
                                 <div className="text-[10px] text-slate-500 italic">{plant.scientificName}</div>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  plant.abundance === 'Dominant' ? 'bg-slate-200 text-slate-700' : 
                                  plant.abundance === 'Common' ? 'bg-slate-100 text-slate-600' : 'bg-white border border-slate-100 text-slate-400'
                                }`}>
                                  {plant.abundance.toUpperCase()}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  plant.isNative ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {plant.isNative ? 'NATIVE' : 'EXOTIC'}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-medium uppercase">{plant.type}</span>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="text-slate-400 text-sm italic py-2 text-center">No distinct species identified.</div>
                   )}
                </div>
              </section>
           )}

           {/* Public Realm & Open Spaces Section - Enhanced Visuals */}
           {report.openSpaceAnalysis && (
            <section className="bg-gradient-to-br from-white via-indigo-50/20 to-emerald-50/20 rounded-xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Palmtree className="w-5 h-5 text-indigo-600" /> Public Realm & Spaces
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
                <div className="space-y-6 flex-1">
                   {/* Type Icons */}
                   <div className="flex flex-wrap gap-3">
                        {report.openSpaceAnalysis.spaces.slice(0, 3).map((space, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center p-3 w-20 h-20 bg-white border border-indigo-100 rounded-lg shadow-sm">
                             {space.type.toLowerCase().includes('water') ? <Waves className="w-6 h-6 text-cyan-500 mb-1" /> :
                              space.type.toLowerCase().includes('garden') ? <Flower2 className="w-6 h-6 text-pink-500 mb-1" /> :
                              space.type.toLowerCase().includes('play') ? <Sun className="w-6 h-6 text-amber-500 mb-1" /> :
                              (space.type.toLowerCase().includes('temple') || space.type.toLowerCase().includes('church') || space.type.toLowerCase().includes('mosque')) ? <Landmark className="w-6 h-6 text-orange-600 mb-1" /> :
                              <Palmtree className="w-6 h-6 text-emerald-500 mb-1" />
                             }
                             <span className="text-[9px] font-bold uppercase text-slate-600 text-center leading-tight truncate w-full">{space.type.split(' ')[0]}</span>
                          </div>
                        ))}
                   </div>

                   <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-indigo-200 pl-4">
                       {report.openSpaceAnalysis.description}
                   </p>

                   {/* Nearby Locations List */}
                   <div className="bg-white/60 rounded-xl p-4 border border-slate-100/50 backdrop-blur-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Walkable Spaces</span>
                    {report.openSpaceAnalysis.spaces && report.openSpaceAnalysis.spaces.length > 0 ? (
                      <div className="space-y-3">
                        {report.openSpaceAnalysis.spaces.map((space, idx) => (
                           <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
                              <div className="flex items-center gap-3">
                                 <div className="bg-indigo-50 p-1.5 rounded-full text-indigo-600">
                                    <MapPin className="w-3.5 h-3.5" />
                                 </div>
                                 <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">{space.name}</div>
                                    <div className="text-[10px] text-slate-500">{space.type}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600 shrink-0">
                                 <Navigation className="w-3 h-3" /> {space.distance}
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-4 text-xs">No specific names identified.</div>
                    )}
                  </div>
                   
                   {/* Amenities - Enhanced Icons */}
                   {report.openSpaceAnalysis.amenities.length > 0 && report.openSpaceAnalysis.amenities[0] !== 'None' && (
                     <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amenities</span>
                       <div className="flex flex-wrap gap-2">
                         {report.openSpaceAnalysis.amenities.map((amenity, idx) => {
                            const lowerAmenity = amenity.toLowerCase();
                            let Icon = CheckCircle2;
                            let colorClass = "text-slate-400";
                            
                            if (lowerAmenity.includes('bench') || lowerAmenity.includes('seat')) { Icon = Armchair; colorClass = "text-amber-500"; }
                            else if (lowerAmenity.includes('water')) { Icon = Droplets; colorClass = "text-cyan-500"; }
                            else if (lowerAmenity.includes('cafe') || lowerAmenity.includes('coffee')) { Icon = Coffee; colorClass = "text-amber-700"; }
                            else if (lowerAmenity.includes('food') || lowerAmenity.includes('restaurant')) { Icon = Utensils; colorClass = "text-orange-500"; }
                            else if (lowerAmenity.includes('wifi')) { Icon = Wifi; colorClass = "text-indigo-500"; }
                            else if (lowerAmenity.includes('music')) { Icon = Music; colorClass = "text-purple-500"; }
                            else if (lowerAmenity.includes('info') || lowerAmenity.includes('sign')) { Icon = Info; colorClass = "text-blue-500"; }
                            else if (lowerAmenity.includes('library') || lowerAmenity.includes('book')) { Icon = BookOpen; colorClass = "text-indigo-600"; }
                            else if (lowerAmenity.includes('municipal') || lowerAmenity.includes('community') || lowerAmenity.includes('civic')) { Icon = Building2; colorClass = "text-slate-600"; }

                            return (
                             <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                               <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                               <span className="truncate">{amenity}</span>
                             </div>
                            );
                         })}
                       </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-8 bg-white/50 rounded-xl border border-dashed border-slate-200">
                  <div className="text-center text-slate-400">
                     <Palmtree className="w-8 h-8 mx-auto mb-2 opacity-50" />
                     <p className="font-medium">No significant open spaces identified nearby.</p>
                  </div>
                </div>
              )}
            </section>
           )}

           {/* About / Disclaimer */}
           <div className="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2">
               <MapPin className="w-4 h-4" /> About this Report
             </h4>
             <p className="mb-4">
               This analysis is generated using AI estimations based on satellite imagery and maps data for 
               <span className="text-white font-medium"> {report.streetName}</span>.
             </p>
             <div className="text-xs opacity-70 border-t border-slate-800 pt-3">
               Infrastructure scores and metrics are estimates for planning and scouting purposes.
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
