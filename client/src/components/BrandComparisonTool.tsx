import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface BrandData {
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
  brand1: BrandData;
  brand2: BrandData;
}

export default function BrandComparisonTool() {
  const { toast } = useToast();
  const [brand1, setBrand1] = useState<BrandData>({
    name: "",
    description: "",
    type: "",
  });
  
  const [brand2, setBrand2] = useState<BrandData>({
    name: "",
    description: "",
    type: "",
  });
  
  const [result, setResult] = useState<BrandComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    brandNum: 1 | 2,
    field: "name" | "description" | "type"
  ) => {
    const setter = brandNum === 1 ? setBrand1 : setBrand2;
    setter((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const clearForm = () => {
    setBrand1({ name: "", description: "", type: "" });
    setBrand2({ name: "", description: "", type: "" });
    setResult(null);
    setError(null);
  };

  const compareBrandsMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (!brand1.name || !brand2.name) {
        throw new Error("Both brand names are required");
      }
      
      return await apiRequest("POST", "/api/compare-brands", {
        brand1,
        brand2,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
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
    compareBrandsMutation.mutate();
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
        {/* Brand 1 Form */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-dark">Brand 1</h4>
          <div>
            <Label htmlFor="brand1-name">Brand Name</Label>
            <Input
              id="brand1-name"
              name="brand1-name"
              value={brand1.name}
              onChange={(e) => handleChange(e, 1, "name")}
              placeholder="e.g. Bintang Terang"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand1-description">Brand Description</Label>
            <Textarea
              id="brand1-description"
              name="brand1-description"
              rows={3}
              value={brand1.description}
              onChange={(e) => handleChange(e, 1, "description")}
              placeholder="Brief description of the brand"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand1-type">Product/Service Type</Label>
            <Input
              id="brand1-type"
              name="brand1-type"
              value={brand1.type}
              onChange={(e) => handleChange(e, 1, "type")}
              placeholder="e.g. Coffee Shop, Fashion Retail"
              className="mt-1"
            />
          </div>
        </div>

        {/* Brand 2 Form */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-dark">Brand 2</h4>
          <div>
            <Label htmlFor="brand2-name">Brand Name</Label>
            <Input
              id="brand2-name"
              name="brand2-name"
              value={brand2.name}
              onChange={(e) => handleChange(e, 2, "name")}
              placeholder="e.g. Bintang Cahaya"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand2-description">Brand Description</Label>
            <Textarea
              id="brand2-description"
              name="brand2-description"
              rows={3}
              value={brand2.description}
              onChange={(e) => handleChange(e, 2, "description")}
              placeholder="Brief description of the brand"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand2-type">Product/Service Type</Label>
            <Input
              id="brand2-type"
              name="brand2-type"
              value={brand2.type}
              onChange={(e) => handleChange(e, 2, "type")}
              placeholder="e.g. Coffee Shop, Fashion Retail"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            onClick={handleCompare}
            disabled={
              compareBrandsMutation.isPending ||
              !brand1.name ||
              !brand2.name
            }
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {compareBrandsMutation.isPending ? "Analyzing..." : "Analyze Brand Names"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            disabled={compareBrandsMutation.isPending}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Clear
          </Button>
        </div>

        {compareBrandsMutation.isPending && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Analyzing brand names...</p>
            <Progress value={compareBrandsMutation.isPending ? 60 : 0} className="w-full max-w-md mx-auto" />
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
                {result.similarity >= 70 ? (
                  <AlertTriangle className="h-8 w-8 text-accent-500 mr-3" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-accent-500 mr-3" />
                )}
                <h4 className="text-xl font-semibold">Analysis Results</h4>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getSimilarityColor(result.similarity)}`}>
                  {getSimilarityCategory(result.similarity)} ({result.similarity}%)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">{result.brand1.name}</h5>
                  <p className="text-sm text-gray-600">{result.brand1.type}</p>
                  <p className="text-sm text-gray-600 mt-2">{result.brand1.description}</p>
                </div>
                <div className="flex-1 p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">{result.brand2.name}</h5>
                  <p className="text-sm text-gray-600">{result.brand2.type}</p>
                  <p className="text-sm text-gray-600 mt-2">{result.brand2.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Word Similarity Analysis</h5>
                <p className="text-gray-700">{result.wordAnalysis}</p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Phonetic Analysis</h5>
                <p className="text-gray-700">{result.phoneticAnalysis}</p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Industry Context</h5>
                <p className="text-gray-700">{result.industryContext}</p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Regulatory Compliance</h5>
                <p className="text-gray-700">{result.regulatoryCompliance}</p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Recommendation</h5>
                <p className="text-gray-700">{result.recommendation}</p>
                {result.similarity >= 70 && (
                  <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
                    <li>Choosing a completely different first word instead of shared terms</li>
                    <li>Developing a distinctive visual identity to compensate for name similarity</li>
                    <li>Adding a unique descriptor or modifier to create more distinction</li>
                    <li>Conducting a formal trademark search before proceeding</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
