export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">About Merek.AI</h2>
          <p className="text-lg text-gray-600">
            We're on a mission to help businesses protect their brand identity through advanced AI technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Team working on brand analysis"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Our Vision</h3>
              <p className="text-gray-600">
                We envision a business landscape where brand owners can confidently create and protect their unique identities while navigating complex regulatory environments. Our platform provides the technology to make this possible for businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Advanced Technology</h3>
              <p className="text-gray-600">
                Merek.AI leverages cutting-edge artificial intelligence, including Vision Transformer (ViT) for image analysis and natural language processing for brand name comparison, to provide accurate and actionable insights.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Indonesian Context</h3>
              <p className="text-gray-600">
                Our platform is uniquely tailored to understand Indonesian regulations, language nuances, and cultural context, making it the ideal solution for businesses operating in the Indonesian market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
