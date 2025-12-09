import React from 'react';
import { StreetReport } from '../types';
import MetricCard from './MetricCard';
import { 
  Bike, 
  Footprints, 
  Ruler, 
  TreePine,
  TreeDeciduous,
  Building2, 
  Activity, 
  ShieldCheck,
  Droplets,
  ExternalLink,
  Map as MapIcon,
  Wind
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner - Map Style */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-8 shadow-xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 mb-2 font-medium">
             <MapIcon className="w-4 h-4" />
             <span>Location Scouted</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{report.streetName}</h1>
          <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">{report.summary}</p>
        </div>

        {report.mapUrl && (
          <a 
            href={report.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all font-medium whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" /> View on Google Maps
          </a>
        )}
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
                label="Est. Width" 
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
                label="Pavement" 
                value={report.hasPavement ? "Available" : "Missing"} 
                icon={Footprints} 
                status={report.hasPavement ? 'success' : 'danger'}
              />
              <MetricCard 
                label="Open Drains" 
                value={report.hasOpenDrains ? "Detected" : "None"} 
                icon={Droplets} 
                status={report.hasOpenDrains ? 'danger' : 'success'}
              />
            </div>
          </section>

          {/* Health & Environment */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Condition & Environment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                   {report.vegetationLevel === 'Abundant' ? 'Dense vegetation providing extensive shade and aesthetic value.' : 
                    report.vegetationLevel === 'Moderate' ? 'Balanced greenery with street trees or small gardens.' :
                    report.vegetationLevel === 'Sparse' ? 'Limited planting, mostly concrete with few trees.' :
                    'Urban hardscape with little to no visible nature.'}
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
            </div>
          </section>

        </div>

        {/* Sidebar / Secondary Stats */}
        <div className="space-y-8">
          
          {/* Infrastructure Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <ShieldCheck className="w-32 h-32" />
             </div>
             <h3 className="text-slate-500 font-medium uppercase tracking-wide text-xs mb-2">Infrastructure Score</h3>
             <div className={`text-6xl font-black ${getScoreColor(report.infrastructureScore)} mb-2`}>
               {report.infrastructureScore}
             </div>
             <div className="text-sm text-slate-400 mb-4">out of 100</div>
             
             {/* Score Reasoning */}
             <div className="w-full bg-slate-50 rounded-xl p-3 text-left border border-slate-100">
               <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Why this score?</p>
               <p className="text-sm text-slate-600 leading-snug">{report.infrastructureScoreReasoning}</p>
             </div>
          </div>

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

        </div>
      </div>

      <div className="flex justify-center pb-12">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-200"
        >
          Scout Another Location
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;