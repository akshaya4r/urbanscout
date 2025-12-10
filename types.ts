
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
  biodiversityAnalysis: {
    detectedSpecies: Array<{
      commonName: string;
      scientificName: string;
      type: 'Tree' | 'Shrub' | 'Flowering Plant' | 'Grass' | 'Other';
      isNative: boolean;
      abundance: 'Rare' | 'Common' | 'Dominant';
    }>;
    ecosystemHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    nativeRatio: string; // e.g. "Mostly Introduced" or "Mix of Native/Exotic"
  };
  buildingMix: {
    residential: number;
    commercial: number;
    other: number;
  };
  cleanlinessAnalysis: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    debrisLevel: 'None' | 'Minor' | 'Moderate' | 'Heavy';
    details: string;
  };
  binsAnalysis: {
    availability: 'High' | 'Moderate' | 'Low' | 'None';
    estimatedSpacing: string; // e.g. "Every 50m", "Rare"
    correlationAnalysis: string; // e.g. "Littering is likely due to lack of bins."
  };
  openSpaceAnalysis: {
    exists: boolean;
    spaces: { name: string; type: string; distance: string }[];
    amenities: string[]; // e.g. ["Benches", "Water Fountain", "Public Art", "Shade"]
    quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'N/A';
    description: string;
  };
  lightingAnalysis: {
    coverage: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
    type: string; // e.g. "LED", "Sodium", "Mixed"
    qualityDescription: string;
  };
  noisePollution: {
    level: 'Low' | 'Moderate' | 'High' | 'Severe';
    description: string;
  };
  publicTransport: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
    types: string[]; // e.g. ["Bus", "Metro", "Tram"]
    nearbyStops: string[];
    description: string;
  };
  trafficAnalysis: {
    congestionLevel: 'Low' | 'Moderate' | 'Heavy' | 'Severe';
    description: string;
    peakHours: string; // e.g. "08:00-10:00, 17:00-19:00"
    modalSplit: {
      car: 'Low' | 'Moderate' | 'Heavy';
      bus: 'Low' | 'Moderate' | 'Heavy';
      pedestrian: 'Low' | 'Moderate' | 'Heavy';
    };
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