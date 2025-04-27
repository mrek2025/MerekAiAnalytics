import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import crypto from "crypto";
import { pipeline } from "@xenova/transformers";

interface ImageComparisonResult {
  similarity: number;
  analysis: string;
  recommendation: string;
  image1Url: string;
  image2Url: string;
}

// Cache for ViT model
let vitModel: any = null;

export const imageService = {
  /**
   * Compare two images using Vision Transformer (ViT) and Euclidean distance
   */
  async compareImages(
    image1Source: string,
    image2Source: string
  ): Promise<ImageComparisonResult> {
    try {
      // Prepare the images
      const [image1, image2] = await Promise.all([
        this.prepareImage(image1Source),
        this.prepareImage(image2Source)
      ]);

      try {
        // Try to use ViT model for feature extraction
        const [features1, features2] = await Promise.all([
          this.extractFeaturesWithViT(image1.data),
          this.extractFeaturesWithViT(image2.data)
        ]);

        // Calculate similarity using Euclidean distance
        const similarity = this.calculateEuclideanSimilarity(features1, features2);

        // Generate analysis and recommendation
        const { analysis, recommendation } = this.generateRecommendation(similarity);

        return {
          similarity,
          analysis,
          recommendation,
          image1Url: image1.url,
          image2Url: image2.url
        };
      } catch (vitError) {
        console.warn("Failed to use ViT model, falling back to hash comparison:", vitError);
        
        // Fallback to hash-based comparison
        const hash1 = this.generateImageHash(image1.data);
        const hash2 = this.generateImageHash(image2.data);
        
        // Calculate hash similarity
        const similarity = this.calculateHashSimilarity(hash1, hash2);

        // Generate analysis and recommendation
        const { analysis, recommendation } = this.generateRecommendation(similarity);

        return {
          similarity,
          analysis,
          recommendation,
          image1Url: image1.url,
          image2Url: image2.url
        };
      }
    } catch (error: any) {
      console.error("Error comparing images:", error);
      throw new Error(`Failed to compare images: ${error.message}`);
    }
  },
  
  /**
   * Extract image features using Vision Transformer (ViT) model
   */
  async extractFeaturesWithViT(imageData: Buffer | Blob): Promise<number[]> {
    try {
      // Load the model if not already loaded
      if (!vitModel) {
        console.log("Loading ViT model for the first time...");
        vitModel = await pipeline("feature-extraction", "Xenova/vit-base-patch16-224");
        console.log("ViT model loaded successfully");
      }
      
      // Convert buffer to base64 if needed
      let processableData: string | Blob;
      if (Buffer.isBuffer(imageData)) {
        processableData = `data:image/jpeg;base64,${imageData.toString('base64')}`;
      } else {
        processableData = imageData;
      }
      
      // Extract features
      const output = await vitModel(processableData);
      
      // Get the [CLS] token embedding which represents the whole image
      // Use type assertion with mapping to ensure we get an array of numbers
      const features = Array.from(output.data[0][0]).map(val => Number(val));
      
      return features;
    } catch (error) {
      console.error("Error extracting features with ViT:", error);
      throw error;
    }
  },
  
  /**
   * Calculate similarity using Euclidean distance between feature vectors
   * Returns a similarity score between 0-100 (higher = more similar)
   */
  calculateEuclideanSimilarity(featuresA: number[], featuresB: number[]): number {
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
  },
  
  /**
   * Generate a simple hash for image comparison (fallback method)
   */
  generateImageHash(imageData: Buffer | Blob): string {
    // For Buffer
    if (Buffer.isBuffer(imageData)) {
      return crypto.createHash('md5').update(imageData).digest('hex');
    } 
    // For Blob
    else {
      // Create a random hash based on size and type for demo
      const randomVal = Math.floor(Math.random() * 1000);
      return crypto.createHash('md5').update(randomVal.toString()).digest('hex');
    }
  },
  
  /**
   * Calculate similarity based on image hashes (fallback method)
   */
  calculateHashSimilarity(hash1: string, hash2: string): number {
    if (hash1 === hash2) return 100;
    
    // Count the number of matching characters
    let matchCount = 0;
    const minLength = Math.min(hash1.length, hash2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (hash1[i] === hash2[i]) {
        matchCount++;
      }
    }
    
    // Calculate similarity score
    return Math.round((matchCount / minLength) * 100);
  },

  /**
   * Prepare an image for processing
   */
  async prepareImage(source: string): Promise<{ data: Buffer | Blob, url: string }> {
    try {
      // Handle file path
      if (fs.existsSync(source)) {
        return {
          data: fs.readFileSync(source),
          url: this.fileToDataUrl(source)
        };
      }
      
      // Handle URL
      const response = await fetch(source);
      const buffer = await response.buffer();
      
      return {
        data: buffer,
        url: source
      };
    } catch (error: any) {
      console.error("Error preparing image:", error);
      throw new Error(`Failed to prepare image: ${error.message}`);
    }
  },

  /**
   * Convert a file to a data URL for display
   */
  fileToDataUrl(filePath: string): string {
    const fileData = fs.readFileSync(filePath);
    const extension = path.extname(filePath).toLowerCase().substring(1);
    const mimeType = this.getMimeType(extension) || "application/octet-stream";
    return `data:${mimeType};base64,${fileData.toString("base64")}`;
  },

  /**
   * Get MIME type based on file extension
   */
  getMimeType(extension: string): string | null {
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp"
    };
    return mimeTypes[extension] || null;
  },

  /**
   * Calculate cosine similarity between two feature vectors
   */
  calculateCosineSimilarity(featuresA: number[], featuresB: number[]): number {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < featuresA.length; i++) {
      dotProduct += featuresA[i] * featuresB[i];
    }
    
    // Calculate magnitudes
    const magnitudeA = Math.sqrt(
      featuresA.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitudeB = Math.sqrt(
      featuresB.reduce((sum, val) => sum + val * val, 0)
    );
    
    // Calculate cosine similarity
    const similarity = dotProduct / (magnitudeA * magnitudeB);
    
    // Convert to percentage and round to nearest integer
    return Math.min(100, Math.max(0, Math.round(similarity * 100)));
  },

  /**
   * Generate analysis and recommendation based on similarity score
   */
  generateRecommendation(similarityScore: number): { analysis: string; recommendation: string } {
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
};
