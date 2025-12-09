import React from 'react';
import { StreetReport } from '../types';
import MetricCard from './MetricCard';
import { 
  Bike, 
  Footprints, 
  Ruler, 
  TreePine, 
  Building2, 
  Activity, 
  ShieldCheck,
  Droplets,
  ExternalLink,
  Map as MapIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                 <div className="flex justify-between items-center">
                   <span className="text-slate-600 font-medium">Greenery Coverage</span>
                   <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                     <TreePine className="w-4 h-4" /> {report.vegetationLevel}
                   </span>
                </div>
                 <div className="flex gap-1 h-2">
                   {['None', 'Sparse', 'Moderate', 'Abundant'].map((level, idx) => {
                     const currentLevelIdx = ['None', 'Sparse', 'Moderate', 'Abundant'].indexOf(report.vegetationLevel);
                     return (
                       <div 
                        key={level} 
                        className={`flex-1 rounded-full ${idx <= currentLevelIdx ? 'bg-emerald-500' : 'bg-slate-200'}`}
                       />
                     );
                   })}
                 </div>
                 <p className="text-sm text-slate-500">
                   {report.vegetationLevel === 'Abundant' ? 'High canopy coverage, excellent for cooling.' : 
                    report.vegetationLevel === 'Moderate' ? 'Some vegetation present.' :
                    'Area lacks significant green spaces.'}
                 </p>
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
             <div className="text-sm text-slate-400">out of 100</div>
          </div>

          {/* Building Mix Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" /> Zoning Estimate
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
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