
import { GoogleGenAI } from "@google/genai";
import { StreetReport } from "../types";

export const analyzeLocation = async (locationQuery: string): Promise<StreetReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      You are an urban planning AI assistant.
      Task: Generate a structured infrastructure report for the location: "${locationQuery}".
      
      Instructions:
      1. Use the Google Maps tool to identify and verify the specific location.
      2. Determine the LOCATION TYPE: Is this a specific "Street", a broader "District", or a whole "City"?
      3. Based on the location type, ESTIMATE the physical infrastructure. 
         - If it is a Street: Provide specific details for that street.
         - If it is a District/City: Provide AGGREGATE/AVERAGE details for the area.
      4. Return ONLY valid JSON.
      
      JSON Structure:
      {
        "streetName": "Formal Name of the location",
        "locationType": "Street" | "District" | "City",
        "estimatedWidth": "Estimate in meters (e.g. '12m' or 'Avg 15m')",
        "hasCyclingLane": boolean,
        "hasPavement": boolean,
        "pavementAnalysis": {
           "exists": boolean,
           "condition": "Good" | "Fair" | "Poor" | "N/A",
           "isRaised": boolean,
           "isWheelchairFriendly": boolean,
           "obstructions": ["string"] (e.g. "Parked Vehicles", "Trees", "None"),
           "safetyDescription": "Specific details on walkability."
        },
        "streetHealth": "Poor" | "Fair" | "Good" | "Excellent",
        "healthReasoning": "Brief explanation based on typical maintenance",
        "hasOpenDrains": boolean,
        "vegetationLevel": "None" | "Sparse" | "Moderate" | "Abundant",
        "biodiversityAnalysis": {
           "detectedSpecies": [
              {
                "commonName": "string",
                "scientificName": "string",
                "type": "Tree" | "Shrub" | "Flowering Plant" | "Grass" | "Other",
                "isNative": boolean,
                "abundance": "Rare" | "Common" | "Dominant"
              }
           ],
           "ecosystemHealth": "Poor" | "Fair" | "Good" | "Excellent",
           "nativeRatio": "string (e.g. 'Mostly Native' or 'Introduced Species')"
        },
        "buildingMix": {
          "residential": number,
          "commercial": number,
          "other": number
        },
        "cleanlinessAnalysis": {
           "rating": "Excellent" | "Good" | "Fair" | "Poor",
           "debrisLevel": "None" | "Minor" | "Moderate" | "Heavy",
           "details": "Description of garbage/debris presence (e.g. 'Litter free', 'Overflowing bins')."
        },
        "binsAnalysis": {
           "availability": "High" | "Moderate" | "Low" | "None",
           "estimatedSpacing": "string (e.g. 'Every 50m', 'At corners', 'Rare')",
           "correlationAnalysis": "One sentence analyzing if visible littering (or lack thereof) is related to the availability of bins."
        },
        "openSpaceAnalysis": {
           "exists": boolean,
           "spaces": [ 
              { "name": "string", "type": "string", "distance": "string (e.g. '200m' or '5 min walk')" } 
           ], // IMPORTANT: Include Parks, Gardens, Plazas, AND Temples/Religious Grounds (which act as community spaces).
           "amenities": ["string"], // IMPORTANT: Include physical features (Benches) AND civic facilities (Libraries, Community Centers, Municipal Buildings).
           "quality": "Excellent" | "Good" | "Fair" | "Poor" | "N/A",
           "description": "Brief description of the open spaces availability. Only include spaces strictly within the locality or a short walkable distance (max 1km)."
        },
        "lightingAnalysis": {
           "coverage": "Excellent" | "Good" | "Fair" | "Poor" | "None",
           "type": "string (e.g. Modern LED, Sodium Vapor, Mixed)",
           "qualityDescription": "Brief description of the lighting quality."
        },
        "noisePollution": {
           "level": "Low" | "Moderate" | "High" | "Severe",
           "description": "Brief description of the soundscape (e.g. 'Heavy traffic noise', 'Quiet residential area')."
        },
        "publicTransport": {
           "rating": "Excellent" | "Good" | "Fair" | "Poor" | "None",
           "types": ["string"] (e.g. "Bus", "Tram", "Subway"),
           "nearbyStops": ["string"] (e.g. "Main St Station", "Bus Stop 42"),
           "description": "Brief summary of connectivity options."
        },
        "trafficAnalysis": {
           "congestionLevel": "Low" | "Moderate" | "Heavy" | "Severe",
           "description": "Brief description of typical traffic flow and current observations if available.",
           "peakHours": "string (e.g. '08:00-09:30, 17:00-19:00')",
           "modalSplit": {
              "car": "Low" | "Moderate" | "Heavy",
              "bus": "Low" | "Moderate" | "Heavy",
              "pedestrian": "Low" | "Moderate" | "Heavy"
           }
        },
        "summary": "A 2-sentence summary of the likely infrastructure.",
        "infrastructureScore": number (0-100),
        "infrastructureScoreReasoning": "One sentence explaining the main factor driving this score.",
        "airQuality": {
          "aqi": number,
          "category": "Good" | "Moderate" | "Unhealthy" | "Hazardous",
          "dominantPollutant": "string"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const trimmedText = text.trim();
    if (
      trimmedText.startsWith("I am sorry") || 
      trimmedText.startsWith("I cannot") || 
      trimmedText.startsWith("I am unable")
    ) {
      throw new Error("The AI refused to analyze this location. It may be restricted or the model cannot access data for this specific query.");
    }

    let mapUrl = undefined;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const mapChunk = groundingChunks.find(c => 
        c.web?.uri?.includes('google.com/maps') || 
        (c as any).maps?.uri
      );
      
      if (mapChunk) {
        mapUrl = mapChunk.web?.uri || (mapChunk as any).maps?.uri;
      }
    }

    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    
    try {
      const data = JSON.parse(cleanJson);
      return {
        ...data,
        mapUrl
      };
    } catch (parseError) {
      console.error("Failed to parse JSON:", cleanJson);
      throw new Error("Received invalid data from AI. Please try a different location name.");
    }

  } catch (error: any) {
    console.error("Analysis error:", error);
    throw error;
  }
};
