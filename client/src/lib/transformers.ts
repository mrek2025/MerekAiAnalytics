// This utility handles the Vision Transformer (ViT) model loading and image similarity comparison
import { pipeline } from "@xenova/transformers";

// For loading status tracking
let modelLoadingStatus = {
  started: false,
  completed: false,
  error: null as Error | null,
};

// Load the Vision Transformer model for image feature extraction
export async function loadViTModel() {
  try {
    if (modelLoadingStatus.started && !modelLoadingStatus.completed) {
      // Wait for the model to load if it's already being loaded
      while (!modelLoadingStatus.completed) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (modelLoadingStatus.error) throw modelLoadingStatus.error;
      }
      return true;
    }

    if (modelLoadingStatus.completed) return true;

    modelLoadingStatus.started = true;
    
    // Load the feature extraction pipeline
    // This will be used to extract features from images for comparison
    const featureExtractionPipeline = await pipeline(
      "feature-extraction",
      "Xenova/vit-base-patch16-224"
    );
    
    modelLoadingStatus.completed = true;
    
    // Attach to window for reuse
    (window as any).__vitModel = featureExtractionPipeline;
    
    return true;
  } catch (error) {
    modelLoadingStatus.error = error as Error;
    console.error("Error loading ViT model:", error);
    throw error;
  }
}

// Extract features from an image using the ViT model
export async function extractImageFeatures(imageData: string | Blob) {
  try {
    // Load model if not already loaded
    await loadViTModel();
    
    const featureExtractionPipeline = (window as any).__vitModel;
    
    // Extract features
    const output = await featureExtractionPipeline(imageData);
    
    // Get the [CLS] token embedding which represents the whole image
    const features = output.data[0][0];
    
    return features;
  } catch (error) {
    console.error("Error extracting image features:", error);
    throw error;
  }
}

// Calculate cosine similarity between two feature vectors
export function calculateCosineSimilarity(featuresA: number[], featuresB: number[]) {
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < featuresA.length; i++) {
    dotProduct += featuresA[i] * featuresB[i];
  }
  
  // Calculate magnitudes
  const magnitudeA = Math.sqrt(featuresA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(featuresB.reduce((sum, val) => sum + val * val, 0));
  
  // Calculate cosine similarity
  const similarity = dotProduct / (magnitudeA * magnitudeB);
  
  // Convert to percentage and round to 2 decimal places
  return Math.round(similarity * 100 * 100) / 100;
}

// Calculate Euclidean distance similarity between two feature vectors
export function calculateEuclideanSimilarity(featuresA: number[], featuresB: number[]) {
  if (featuresA.length !== featuresB.length) {
    throw new Error("Feature vectors must have the same length");
  }
  
  // Calculate Euclidean distance
  let sumSquaredDifferences = 0;
  for (let i = 0; i < featuresA.length; i++) {
    const diff = featuresA[i] - featuresB[i];
    sumSquaredDifferences += diff * diff;
  }
  const euclideanDistance = Math.sqrt(sumSquaredDifferences);
  
  // Convert to similarity score (0-100)
  // We use an exponential decay formula to convert distance to similarity
  // Smaller distances result in higher similarity scores
  const similarity = 100 * Math.exp(-euclideanDistance / 10);
  
  // Round to nearest integer and ensure it's between 0-100
  return Math.min(100, Math.max(0, Math.round(similarity)));
}

// Prepare recommendations based on similarity score
export function generateRecommendation(similarityScore: number) {
  if (similarityScore >= 70) {
    return {
      analysis: `These images show a high similarity score of ${similarityScore}%. They share significant visual elements, colors, patterns, and overall composition.`,
      recommendation: "The high similarity between these images could lead to brand confusion and potential trademark issues. Consider redesigning one of the images to create more visual distinction and avoid potential legal challenges."
    };
  } else if (similarityScore >= 30) {
    return {
      analysis: `These images show a moderate similarity score of ${similarityScore}%. While there are some shared visual elements, they also have notable differences in design, color scheme, or composition.`,
      recommendation: "The moderate similarity may or may not cause consumer confusion depending on the context. Consider adding more distinctive elements to reduce similarity if these brands operate in the same market sector."
    };
  } else {
    return {
      analysis: `These images show a low similarity score of ${similarityScore}%. They differ significantly in visual style, color scheme, layout, and overall appearance.`,
      recommendation: "The brands are visually distinct and unlikely to cause confusion among consumers. The low similarity score indicates these designs can coexist in the market without significant brand confusion risks."
    };
  }
}
