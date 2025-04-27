import { useState } from "react";
import { Helmet } from "react-helmet";
import ImageComparisonTool from "@/components/ImageComparisonTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ImageAnalysis() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Image Similarity Analysis | Merek.AI</title>
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
          <h1 className="text-3xl font-bold mb-4">Image Similarity Analysis</h1>
          <p className="text-gray-600 mb-2">
            Upload or provide URLs for two images to compare their visual similarity using our advanced Vision Transformer (ViT) technology.
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Our system uses the Vision Transformer (ViT) model to extract deep visual features from images, then applies Euclidean distance metrics to determine similarity with high precision. This approach helps identify potential trademark infringements even when images have been altered.
          </p>
        </div>
        
        <ImageComparisonTool />
      </div>
    </div>
  );
}
