
export interface StreetReport {
  streetName: string;
  locationType: 'Street' | 'District' | 'City' | 'Unknown';
  estimatedWidth: string;
  hasCyclingLane: boolean;
  hasPavement: boolean;
  pavementAnalysis: {
    exists: boolean;
    condition: 'Good' | 'Fair' | 'Poor' | 'N/A';
    isRaised: boolean;
    isWheelchairFriendly: boolean;
    obstructions: string[]; // e.g. ["Parked Cars", "Trees", "Poles"]
    safetyDescription: string;
  };
  streetHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  healthReasoning: string;
  hasOpenDrains: boolean;
  vegetationLevel: 'None' | 'Sparse' | 'Moderate' | 'Abundant';
  buildingMix: {
    residential: number;
    commercial: number;
    other: number;
  };
  openSpaceAnalysis: {
    exists: boolean;
    names: string[]; // e.g. ["Central Park", "Times Square Plaza"]
    types: string[]; // e.g. ["Park", "Playground", "Plaza", "Garden"]
    amenities: string[]; // e.g. ["Benches", "Water Fountain", "Public Art", "Shade"]
    quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'N/A';
    description: string;
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
