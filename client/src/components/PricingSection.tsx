import { CheckCircle, XCircle } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">
            Choose the plan that works for your business needs. All plans include access to our core analysis tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white transition-all hover:shadow-lg">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-dark">Basic</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-dark">Free</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">Perfect for trying out our services</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Image similarity comparison</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Brand name analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Basic AI chatbot assistant</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <XCircle className="h-5 w-5 mt-0.5 mr-2" />
                  <span>Trademark database integration</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <XCircle className="h-5 w-5 mt-0.5 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
              <a
                href="/#features"
                className="mt-8 block w-full px-4 py-2 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Get Started
              </a>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="relative border border-primary-200 rounded-lg shadow-md overflow-hidden bg-white transform scale-105 z-10 transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 -mr-1 -mt-1 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-bl-lg">
              Popular
            </div>
            <div className="p-6 border-b border-primary-200 bg-primary-50">
              <h3 className="text-lg font-medium text-primary-600">Professional</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-dark">Rp 299K</span>
                <span className="ml-1 text-base text-gray-500">/month</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">For growing businesses and agencies</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">All features from Basic plan</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Trademark database integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Advanced and reliable AI models</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">In-depth analysis and recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
              <a
                href="https://wa.me/6285621600034?text=I'm%20interested%20in%20the%20Professional%20plan%20of%20Merek.AI%20for%20Rp%20299K"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full px-4 py-2 bg-primary-500 text-white text-center font-medium rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Contact Sales
              </a>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white transition-all hover:shadow-lg">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-dark">Enterprise</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-dark">Rp 999K</span>
                <span className="ml-1 text-base text-gray-500">/month</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">For large organizations and agencies</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">All features from Professional plan</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Real-time trademark data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Unlimited analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Full API access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Free consultation with trademark experts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
              </ul>
              <a
                href="https://wa.me/6285621600034?text=I'm%20interested%20in%20the%20Enterprise%20plan%20of%20Merek.AI%20for%20Rp%20999K"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full px-4 py-2 bg-orange-500 text-white text-center font-medium rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
