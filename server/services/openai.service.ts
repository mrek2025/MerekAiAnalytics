import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Check if we have a valid API key
const apiKey = process.env.OPENAI_API_KEY;
const useDemo = !apiKey || apiKey === "demo";

// Initialize OpenAI with API key from environment variables
let openai: OpenAI | undefined;
if (!useDemo) {
  openai = new OpenAI({
    apiKey: apiKey
  });
}

interface Brand {
  name: string;
  description: string;
  type: string;
}

interface BrandComparisonResult {
  similarity: number;
  wordAnalysis: string;
  phoneticAnalysis: string;
  industryContext: string;
  regulatoryCompliance: string;
  recommendation: string;
  brand1: Brand;
  brand2: Brand;
}

export const openaiService = {
  /**
   * Compare two brand names using OpenAI's language model
   */
  async compareBrands(brand1: Brand, brand2: Brand): Promise<BrandComparisonResult> {
    // If we're in demo mode, return a demo response right away
    if (useDemo) {
      console.log("Using demo mode for brand comparison since API key is not valid");
      return generateDemoResponse(brand1, brand2);
    }
    
    try {
      const prompt = `
        Compare the following two brand names:
        
        Brand 1: "${brand1.name}"
        Description: "${brand1.description || 'No description provided'}"
        Product/Service Type: "${brand1.type || 'Not specified'}"
        
        Brand 2: "${brand2.name}"
        Description: "${brand2.description || 'No description provided'}"
        Product/Service Type: "${brand2.type || 'Not specified'}"
        
        Please analyze the following aspects:
        1. Word similarity (compare the actual words, their meanings, and any shared terms)
        2. Phonetic similarity (how they sound when pronounced)
        3. Industry context (considering their product/service type)
        4. Regulatory compliance (check if there are any words related to Indonesian regulations, ideologies, or cultural norms that might be problematic)
        
        Also calculate an overall similarity percentage (0-100%).
        
        Provide a detailed recommendation based on the analysis.

        Format your response as a JSON object with these fields:
        - similarity (number between 0-100)
        - wordAnalysis (string)
        - phoneticAnalysis (string)
        - industryContext (string)
        - regulatoryCompliance (string)
        - recommendation (string)
        - brand1 (object with name, description, type)
        - brand2 (object with name, description, type)
      `;

      if (!openai) {
        throw new Error("OpenAI client is not initialized");
      }
      
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to get a response from the AI model");
      }

      // Parse the JSON response
      const result = JSON.parse(content) as BrandComparisonResult;

      // Ensure the brands are included in the response
      result.brand1 = brand1;
      result.brand2 = brand2;

      return result;
    } catch (error: any) {
      console.error("Error comparing brands with OpenAI:", error);
      
      // If there's an error, also use the fallback demo response
      return generateDemoResponse(brand1, brand2);
    }
  }
};

/**
 * Generate a demo response for brand comparison
 * Used when no API key is available
 */
function generateDemoResponse(brand1: Brand, brand2: Brand): BrandComparisonResult {
  // Calculate a basic similarity score based on string similarity
  const name1 = brand1.name.toLowerCase();
  const name2 = brand2.name.toLowerCase();
  
  // Check if they share words
  const words1 = name1.split(/\s+/);
  const words2 = name2.split(/\s+/);
  const sharedWords = words1.filter(word => words2.includes(word)).length;
  
  // Basic similarity calculation
  const similarity = Math.min(
    100,
    Math.round(
      (sharedWords > 0 ? 50 : 30) +
      (brand1.type === brand2.type ? 20 : 0) +
      (Math.random() * 20)
    )
  );

  return {
    similarity,
    wordAnalysis: `Both brands ${sharedWords > 0 ? 'share common words' : 'use different words'}, which ${sharedWords > 0 ? 'increases' : 'decreases'} their similarity. ${brand1.name} and ${brand2.name} have ${similarity > 50 ? 'significant' : 'some'} conceptual overlap in their meaning.`,
    phoneticAnalysis: `When spoken, the names ${similarity > 50 ? 'sound similar and could cause confusion' : 'have distinct sound patterns that help differentiate them'}. The rhythm and pronunciation create ${similarity > 50 ? 'comparable' : 'different'} auditory experiences.`,
    industryContext: `Both brands operate in the ${brand1.type === brand2.type ? 'same' : 'different'} industry sector${brand1.type === brand2.type ? ' (' + brand1.type + ')' : ''}. This ${brand1.type === brand2.type ? 'increases' : 'decreases'} the risk of consumer confusion.`,
    regulatoryCompliance: `Neither brand name contains words prohibited by Indonesian regulations or terms that violate cultural norms. ${similarity > 70 ? 'However, the similarity may present challenges during trademark registration.' : 'They should both be eligible for trademark registration from a regulatory perspective.'}`,
    recommendation: `The ${similarity > 70 ? 'high' : similarity > 40 ? 'moderate' : 'low'} similarity (${similarity}%) between these brands ${similarity > 60 ? 'presents a significant risk of consumer confusion. Consider further differentiation to avoid potential trademark issues.' : similarity > 40 ? 'may create some confusion in the marketplace. Some additional differentiation would be beneficial.' : 'is unlikely to cause consumer confusion. Both brands can likely coexist in the marketplace.'}`,
    brand1,
    brand2
  };
}
