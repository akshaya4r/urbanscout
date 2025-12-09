export interface StreetReport {
  streetName: string;
  estimatedWidth: string;
  hasCyclingLane: boolean;
  hasPavement: boolean;
  streetHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  healthReasoning: string;
  hasOpenDrains: boolean;
  vegetationLevel: 'None' | 'Sparse' | 'Moderate' | 'Abundant';
  buildingMix: {
    residential: number;
    commercial: number;
    other: number;
  };
  summary: string;
  infrastructureScore: number; // 0-100
  infrastructureScoreReasoning: string;
  airQuality: {
    aqi: number;
    category: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
    dominantPollutant: string;
  };
  mapUrl?: string;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  report: StreetReport | null;
  error: string | null;
  locationQuery: string | null;
}