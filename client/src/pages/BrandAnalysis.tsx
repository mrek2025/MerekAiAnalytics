import { useState } from "react";
import { Helmet } from "react-helmet";
import BrandComparisonTool from "@/components/BrandComparisonTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BrandAnalysis() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Brand Name Analysis | Merek.AI</title>
      </Helmet>
      
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Brand Name Analysis</h1>
          <p className="text-gray-600">
            Compare two brand names to analyze their similarity in terms of words, phonetics, and meaning.
            Get detailed recommendations and insights for your brand strategy.
          </p>
        </div>
        
        <BrandComparisonTool />
      </div>
    </div>
  );
}
