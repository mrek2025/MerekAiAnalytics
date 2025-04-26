import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";
import fetch from "node-fetch";

let featureExtractionPipeline: any = null;

interface ImageComparisonResult {
  similarity: number;
  analysis: string;
  recommendation: string;
  image1Url: string;
  image2Url: string;
}

export const imageService = {
  /**
   * Compare two images using Vision Transformer (ViT) model
   */
  async compareImages(
    image1Source: string,
    image2Source: string
  ): Promise<ImageComparisonResult> {
    try {
      // Load the feature extraction pipeline if not already loaded
      if (!featureExtractionPipeline) {
        featureExtractionPipeline = await pipeline(
          "feature-extraction",
          "Xenova/vit-base-patch16-224"
        );
      }

      // Prepare the images
      const [image1, image2] = await Promise.all([
        this.prepareImage(image1Source),
        this.prepareImage(image2Source)
      ]);

      // Extract features
      const [features1, features2] = await Promise.all([
        featureExtractionPipeline(image1.data),
        featureExtractionPipeline(image2.data)
      ]);

      // Get the [CLS] token embedding which represents the whole image
      const imageFeatures1 = features1.data[0][0];
      const imageFeatures2 = features2.data[0][0];

      // Calculate similarity
      const similarity = this.calculateCosineSimilarity(imageFeatures1, imageFeatures2);

      // Generate analysis and recommendation
      const { analysis, recommendation } = this.generateRecommendation(similarity);

      return {
        similarity,
        analysis,
        recommendation,
        image1Url: image1.url,
        image2Url: image2.url
      };
    } catch (error: any) {
      console.error("Error comparing images:", error);
      throw new Error(`Failed to compare images: ${error.message}`);
    }
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
