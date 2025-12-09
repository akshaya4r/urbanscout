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
      2. Based on the identified location, its context (e.g., urban density, city planning data), and your knowledge of the area, ESTIMATE the likely physical infrastructure.
      3. Return ONLY valid JSON. Do not include markdown formatting, backticks, or conversational text.
      
      JSON Structure:
      {
        "streetName": "Formal Name of the location",
        "estimatedWidth": "Estimate in meters (e.g. '12m')",
        "hasCyclingLane": boolean,
        "hasPavement": boolean,
        "streetHealth": "Poor" | "Fair" | "Good" | "Excellent",
        "healthReasoning": "Brief explanation based on typical maintenance in this area",
        "hasOpenDrains": boolean,
        "vegetationLevel": "None" | "Sparse" | "Moderate" | "Abundant",
        "buildingMix": {
          "residential": number (percentage 0-100),
          "commercial": number (percentage 0-100),
          "other": number (percentage 0-100)
        }, // Ensure these 3 numbers sum to exactly 100
        "summary": "A 2-sentence summary of the likely infrastructure.",
        "infrastructureScore": number (0-100, based on walkability, road condition, and planning),
        "infrastructureScoreReasoning": "One sentence explaining the main factor driving this score (e.g. 'High score due to excellent pedestrian separation and greenery' or 'Low score reflects poor maintenance and lack of sidewalks').",
        "airQuality": {
          "aqi": number (estimate 0-500 based on typical recent data for this city/area),
          "category": "Good" | "Moderate" | "Unhealthy" | "Hazardous",
          "dominantPollutant": "e.g. 'PM2.5', 'Ozone', 'NO2' or 'N/A'"
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

    // Check for standard refusals
    const trimmedText = text.trim();
    if (
      trimmedText.startsWith("I am sorry") || 
      trimmedText.startsWith("I cannot") || 
      trimmedText.startsWith("I am unable")
    ) {
      throw new Error("The AI refused to analyze this location. It may be restricted or the model cannot access data for this specific query.");
    }

    // Extract Google Maps URI from grounding metadata if available
    let mapUrl = undefined;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      // Find a chunk that has a web URI or map URI
      const mapChunk = groundingChunks.find(c => 
        c.web?.uri?.includes('google.com/maps') || 
        (c as any).maps?.uri
      );
      
      if (mapChunk) {
        mapUrl = mapChunk.web?.uri || (mapChunk as any).maps?.uri;
      }
    }

    // Clean markdown code blocks if present
    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    
    try {
      const data = JSON.parse(cleanJson);
      return {
        ...data,
        mapUrl // Inject the map URL found in grounding
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