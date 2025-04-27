import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, AlertCircle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ImageData {
  file: File | null;
  url: string;
  preview: string | null;
}

interface ImageComparisonResult {
  similarity: number;
  analysis: string;
  recommendation: string;
  image1Url: string;
  image2Url: string;
}

export default function ImageComparisonTool() {
  const { toast } = useToast();
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);
  
  const [image1, setImage1] = useState<ImageData>({
    file: null,
    url: "",
    preview: null,
  });
  
  const [image2, setImage2] = useState<ImageData>({
    file: null,
    url: "",
    preview: null,
  });
  
  const [result, setResult] = useState<ImageComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageNumber: 1 | 2
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size exceeds 5MB limit",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = imageNumber === 1 ? setImage1 : setImage2;
        target({
          file,
          url: "",
          preview: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageNumber: 1 | 2
  ) => {
    const url = e.target.value;
    const target = imageNumber === 1 ? setImage1 : setImage2;
    target((prev) => ({ ...prev, url }));
  };

  const clearImages = () => {
    setImage1({ file: null, url: "", preview: null });
    setImage2({ file: null, url: "", preview: null });
    setResult(null);
    setError(null);
    
    if (fileInput1Ref.current) fileInput1Ref.current.value = "";
    if (fileInput2Ref.current) fileInput2Ref.current.value = "";
  };

  const compareImagesMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      
      // Prepare FormData for file uploads
      const formData = new FormData();
      
      // Add image 1 (file or URL)
      if (image1.file) {
        formData.append("image1", image1.file);
      } else if (image1.url) {
        formData.append("image1Url", image1.url);
      } else {
        throw new Error("Please provide the first image");
      }
      
      // Add image 2 (file or URL)
      if (image2.file) {
        formData.append("image2", image2.file);
      } else if (image2.url) {
        formData.append("image2Url", image2.url);
      } else {
        throw new Error("Please provide the second image");
      }
      
      // Using custom fetch instead of apiRequest for FormData
      const response = await fetch("/api/compare-images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: (data: ImageComparisonResult) => {
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Similarity: ${data.similarity}%`,
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCompare = () => {
    compareImagesMutation.mutate();
  };

  const getSimilarityCategory = (similarity: number) => {
    if (similarity < 30) return "Low Similarity";
    if (similarity < 70) return "Moderate Similarity";
    return "High Similarity";
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 30) return "bg-green-100 text-green-800";
    if (similarity < 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="feature-pattern bg-white rounded-xl shadow-lg overflow-hidden p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image 1 Upload */}
        <div className="space-y-6">
          <div
            onClick={() => fileInput1Ref.current?.click()}
            className={`border-2 border-dashed ${
              image1.preview ? "border-primary-500" : "border-gray-300"
            } rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer bg-gray-50 relative`}
          >
            {image1.preview ? (
              <div className="relative">
                <img
                  src={image1.preview}
                  alt="Image preview"
                  className="mx-auto max-h-48 object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop image here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </>
            )}
            <input
              ref={fileInput1Ref}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 1)}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="image1-url" className="block text-sm font-medium text-gray-700">
              Or enter image URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                name="image1-url"
                id="image1-url"
                placeholder="https://example.com/image.jpg"
                value={image1.url}
                onChange={(e) => handleUrlChange(e, 1)}
                disabled={!!image1.file}
              />
            </div>
          </div>
        </div>

        {/* Image 2 Upload */}
        <div className="space-y-6">
          <div
            onClick={() => fileInput2Ref.current?.click()}
            className={`border-2 border-dashed ${
              image2.preview ? "border-primary-500" : "border-gray-300"
            } rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer bg-gray-50 relative`}
          >
            {image2.preview ? (
              <div className="relative">
                <img
                  src={image2.preview}
                  alt="Image preview"
                  className="mx-auto max-h-48 object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop image here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </>
            )}
            <input
              ref={fileInput2Ref}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 2)}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="image2-url" className="block text-sm font-medium text-gray-700">
              Or enter image URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                name="image2-url"
                id="image2-url"
                placeholder="https://example.com/image.jpg"
                value={image2.url}
                onChange={(e) => handleUrlChange(e, 2)}
                disabled={!!image2.file}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            onClick={handleCompare}
            disabled={
              compareImagesMutation.isPending ||
              ((!image1.file && !image1.url) || (!image2.file && !image2.url))
            }
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {compareImagesMutation.isPending ? "Analyzing..." : "Compare Images"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={clearImages}
            disabled={compareImagesMutation.isPending}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Clear
          </Button>
        </div>

        {compareImagesMutation.isPending && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Analyzing images...</p>
            <Progress value={compareImagesMutation.isPending ? 60 : 0} className="w-full max-w-md mx-auto" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-left">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-primary-500 mr-3" />
                <h4 className="text-xl font-semibold">Analysis Results</h4>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getSimilarityColor(result.similarity)}`}>
                  {getSimilarityCategory(result.similarity)} ({result.similarity}%)
                </span>
              </div>
            </div>
            <div className="mb-4 p-2 bg-primary/10 rounded-md text-xs text-gray-600">
              <p>This analysis uses Vision Transformer (ViT) technology with Euclidean distance metrics to compare visual similarity between images.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <img
                  src={result.image1Url}
                  alt="First image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <img
                  src={result.image2Url}
                  alt="Second image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Analysis</h5>
              <p className="text-gray-700 mb-4">{result.analysis}</p>

              <h5 className="font-medium text-gray-900 mb-2">Recommendation</h5>
              <p className="text-gray-700">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
