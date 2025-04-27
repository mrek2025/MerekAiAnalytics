import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section id="home" className="bg-gradient-to-b from-white to-secondary/30 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Protect Your Brand Identity with <span className="text-primary">AI-Powered Analysis</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Merek.AI helps you analyze brand similarities, compare images, and ensure your brand stands out in the market while complying with Indonesian regulations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#features" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-colors">
                Explore Features
              </a>
              <a 
                href="https://wa.me/6285621600034?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Merek.AI.%20Boleh%20saya%20mendapatkan%20informasi%20lebih%20lanjut%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-full"></div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Brand identity visualization"
                className="w-full h-auto rounded-lg shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
