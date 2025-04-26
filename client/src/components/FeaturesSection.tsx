import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive tools help you analyze and protect your brand identity through cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Image Comparison Feature */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-dark">Image Similarity Analysis</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Compare two images to determine their visual similarity using advanced Vision Transformer (ViT) technology. Get a detailed analysis with similarity percentage and actionable recommendations.
              </p>
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Image analysis visualization"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Upload images or use URL</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Accurate similarity percentage</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Smart recommendations</span>
                </li>
              </ul>
              <Link href="/image-analysis">
                <a className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium">
                  Try Image Analysis
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>

          {/* Brand Name Comparison Feature */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-accent-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-accent-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-dark">Brand Name Analysis</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Compare two brand names to analyze their similarity in terms of words, phonetics, and meaning. Evaluate compliance with Indonesian regulations and get comprehensive recommendations.
              </p>
              <img
                src="https://images.unsplash.com/photo-1588600878108-578031a7e32e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Brand comparison illustration"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Linguistic similarity analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Indonesian regulatory compliance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Detailed reports with recommendations</span>
                </li>
              </ul>
              <Link href="/brand-analysis">
                <a className="inline-flex items-center text-accent-500 hover:text-accent-600 font-medium">
                  Try Brand Analysis
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
