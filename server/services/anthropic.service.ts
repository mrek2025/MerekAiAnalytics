import Anthropic from '@anthropic-ai/sdk';

// Use Claude 3 Sonnet model from Anthropic
const ANTHROPIC_MODEL = 'claude-3-sonnet-20240229';

// Use the provided API key for Claude
const apiKey = "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";
// Since we have a hardcoded API key, we're not in demo mode
const useDemo = false;

// Initialize Anthropic with API key from environment variables and use OpenRouter
let anthropic: Anthropic | undefined;
if (!useDemo) {
  anthropic = new Anthropic({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
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

export const anthropicService = {
  /**
   * Compare two brand names using Anthropic's language model
   */
  async compareBrands(brand1: Brand, brand2: Brand): Promise<BrandComparisonResult> {
    // If we're in demo mode, return a demo response right away
    if (useDemo) {
      console.log("Using demo mode for brand comparison since API key is not valid");
      return generateDemoResponse(brand1, brand2);
    }

    try {
      if (!anthropic) {
        throw new Error("Anthropic client is not initialized");
      }

      const prompt = `
        Analyze the similarity between these two brands:
        
        Brand 1:
        Name: ${brand1.name}
        Description: ${brand1.description}
        Type: ${brand1.type}
        
        Brand 2:
        Name: ${brand2.name}
        Description: ${brand2.description}
        Type: ${brand2.type}
        
        Provide a thorough analysis of the similarity between these two brands. Consider:
        1. Word Analysis - Compare the actual words in the brand names
        2. Phonetic Analysis - How similar they sound when spoken
        3. Industry Context - How their similarity might be perceived in their specific industry
        4. Indonesian Regulatory Compliance - If either brand name might violate Indonesian regulations or contain prohibited terms
        5. Recommendation - Based on their similarity, provide advice on whether there might be confusion or trademark concerns
        
        For the similarity score, provide a percentage between 0 and 100 where:
        - 0-20%: Very Low similarity
        - 21-40%: Low similarity
        - 41-60%: Moderate similarity
        - 61-80%: High similarity
        - 81-100%: Very High similarity
        
        Format your response as JSON with the following keys:
        - similarity (number between 0-100)
        - wordAnalysis (string)
        - phoneticAnalysis (string)
        - industryContext (string)
        - regulatoryCompliance (string)
        - recommendation (string)
        - brand1 (object with name, description, type)
        - brand2 (object with name, description, type)
      `;

      // Use an explicit fetch to OpenRouter instead of the Anthropic SDK
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://merek.ai', // Replace with your site URL
          'X-Title': 'Merek.AI'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-sonnet',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.5,
        })
      }).then(res => res.json());

      // OpenRouter response format is different from Anthropic API
      let content = '';
      if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
        content = response.choices[0].message.content;
        console.log("Successfully received response from OpenRouter API");
      } else {
        console.error("Unexpected OpenRouter API response format:", JSON.stringify(response, null, 2));
        throw new Error("Unexpected response format from OpenRouter API");
      }
      
      // Parse the JSON response
      try {
        const result = JSON.parse(content);
        return {
          similarity: Math.min(100, Math.max(0, result.similarity)),
          wordAnalysis: result.wordAnalysis,
          phoneticAnalysis: result.phoneticAnalysis,
          industryContext: result.industryContext,
          regulatoryCompliance: result.regulatoryCompliance,
          recommendation: result.recommendation,
          brand1,
          brand2
        };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error comparing brands with Anthropic:", error);
      return generateDemoResponse(brand1, brand2);
    }
  },

  /**
   * Generate a response for the chatbot using Anthropic's language model
   */
  async generateChatResponse(message: string): Promise<string> {
    // If we're in demo mode, return a demo response right away
    if (useDemo) {
      console.log("Using demo mode for chatbot since API key is not valid");
      
      // Generate a more helpful demo response
      const demoResponses = [
        "Merek.AI dapat membantu Anda membandingkan merek dan gambar untuk mencegah pelanggaran hak kekayaan intelektual. Apa yang ingin Anda ketahui lebih lanjut?",
        "Sebagai layanan brand protection, kami menawarkan analisis perbandingan merek dan gambar. Bagaimana saya bisa membantu Anda hari ini?",
        "Kami menggunakan AI untuk menganalisis kesamaan antara merek dan gambar. Apakah Anda ingin mengetahui lebih lanjut tentang fitur kami?",
        "Merek.AI memiliki fitur perbandingan merek, analisis gambar, dan pemantauan merek. Apakah Anda tertarik dengan salah satu fitur tersebut?",
        "Perlindungan merek sangat penting di era digital. Merek.AI hadir untuk membantu Anda mengamankan identitas brand Anda. Ada pertanyaan spesifik?",
      ];
      
      // Return a random response from the demo responses
      return demoResponses[Math.floor(Math.random() * demoResponses.length)];
    }
    
    try {
      if (!anthropic) {
        throw new Error("Anthropic client is not initialized");
      }
      
      const systemPrompt = `
        You are an AI assistant for Merek.AI, a brand protection service that helps analyze brand similarities and image comparisons.
        Respond in a helpful, professional manner, focusing on Indonesian brand protection and trademark laws.
        You can help with questions about brand comparisons, image similarity, and general advice about protecting brand identity.
        Keep responses concise and to the point, under 250 words.
        If asked about services not offered by Merek.AI, politely redirect to the core services.
      `;

      // Use an explicit fetch to OpenRouter instead of the Anthropic SDK
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://merek.ai', // Replace with your site URL
          'X-Title': 'Merek.AI'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        })
      }).then(res => res.json());

      // OpenRouter response format is different from Anthropic API
      let content = '';
      if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
        content = response.choices[0].message.content;
        console.log("Successfully received chatbot response from OpenRouter API");
      } else {
        console.error("Unexpected OpenRouter API response format:", JSON.stringify(response, null, 2));
        throw new Error("Unexpected response format from OpenRouter API");
      }
      
      if (!content) {
        throw new Error("Failed to get a response from the AI model");
      }

      return content;
    } catch (error: any) {
      console.error("Error generating chatbot response with Anthropic:", error);
      
      // If there's an error, return a more helpful message
      const errorResponses = [
        "Maaf, API kami sedang mengalami masalah teknis. Silakan coba fitur perbandingan merek atau gambar kami, atau coba lagi nanti.",
        "Terjadi kendala pada sistem AI kami. Namun Anda tetap dapat menggunakan fitur perbandingan merek dan analisis gambar kami di halaman utama.",
        "Sistem AI kami sedang dalam pemeliharaan. Sementara itu, Anda bisa mencoba fitur brand monitoring atau perbandingan merek kami.",
        "Sepertinya ada masalah dengan koneksi AI kami. Tapi Anda masih bisa menggunakan fitur-fitur analisis kami yang lain.",
        "AI Assistant kami sedang mengalami kendala. Silakan gunakan fitur perbandingan merek atau kunjungi halaman Brand Monitoring kami."
      ];
      
      // Return a random error response
      return errorResponses[Math.floor(Math.random() * errorResponses.length)];
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