import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ColoredProgress } from "./BrandMonitoring/components";
import MainLayout from "@/layouts/MainLayout";

interface BrandMention {
  id: string;
  source: string;
  date: Date;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  url: string;
  platform: "social" | "news" | "marketplace" | "review";
  impact: number;
}

interface BrandMetrics {
  sentimentScore: number;
  mentions: number;
  positive: number;
  negative: number;
  neutral: number;
  riskScore: number;
  trend: "up" | "down" | "stable";
}

export default function BrandMonitoring() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [brand, setBrand] = useState("");
  const [metrics, setMetrics] = useState<BrandMetrics>({
    sentimentScore: 78,
    mentions: 342,
    positive: 245,
    negative: 32,
    neutral: 65,
    riskScore: 22,
    trend: "up",
  });
  const [mentions, setMentions] = useState<BrandMention[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Demo data for mentions with different sentiments
  const generateDemoMentions = (): BrandMention[] => {
    const platforms = ["social", "news", "marketplace", "review"];
    const demoMentions: BrandMention[] = [
      {
        id: "1",
        source: "Twitter",
        date: new Date(2025, 3, 25),
        text: "Just bought the new product from this brand, absolutely love it! #GreatProduct",
        sentiment: "positive",
        url: "#",
        platform: "social",
        impact: 85,
      },
      {
        id: "2",
        source: "Instagram",
        date: new Date(2025, 3, 24),
        text: "This brand's customer service is exceptional, they solved my issue within minutes!",
        sentiment: "positive",
        url: "#",
        platform: "social",
        impact: 92,
      },
      {
        id: "3",
        source: "Tokopedia",
        date: new Date(2025, 3, 23),
        text: "Product quality doesn't match the price. Disappointed with my purchase.",
        sentiment: "negative",
        url: "#",
        platform: "marketplace",
        impact: 78,
      },
      {
        id: "4",
        source: "Detik News",
        date: new Date(2025, 3, 22),
        text: "The brand announces new product line, expanding their market reach in Southeast Asia",
        sentiment: "neutral",
        url: "#",
        platform: "news",
        impact: 65,
      },
      {
        id: "5",
        source: "Google Reviews",
        date: new Date(2025, 3, 21),
        text: "Average experience. Products are good but delivery times could be improved.",
        sentiment: "neutral",
        url: "#",
        platform: "review",
        impact: 45,
      },
      {
        id: "6",
        source: "Facebook",
        date: new Date(2025, 3, 20),
        text: "Amazing brand! Their new collection exceeds expectations in quality and design.",
        sentiment: "positive",
        url: "#",
        platform: "social",
        impact: 88,
      },
      {
        id: "7",
        source: "Shopee",
        date: new Date(2025, 3, 19),
        text: "Received damaged product and no response from customer service after multiple attempts.",
        sentiment: "negative",
        url: "#",
        platform: "marketplace",
        impact: 94,
      },
      {
        id: "8",
        source: "TikTok",
        date: new Date(2025, 3, 18),
        text: "I've tried multiple products from this brand and they never disappoint! #LoyalCustomer",
        sentiment: "positive",
        url: "#",
        platform: "social",
        impact: 76,
      },
    ];
    return demoMentions;
  };

  // Animation effect for metric changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Demo animation to simulate real-time data changes
    if (scanning) {
      interval = setInterval(() => {
        // Progress animation
        setProgress((prev) => {
          if (prev < 100) return prev + 1;
          setScanning(false);
          toast({
            title: "Monitoring Active",
            description: "Brand monitoring is now running in real-time",
          });
          return 100;
        });

        // Simulate changing metrics
        if (progress > 50 && progress % 10 === 0) {
          setMetrics((prev) => ({
            ...prev,
            sentimentScore: Math.min(100, Math.max(0, prev.sentimentScore + (Math.random() > 0.5 ? 1 : -1))),
            mentions: prev.mentions + Math.floor(Math.random() * 3),
            positive: prev.positive + (Math.random() > 0.7 ? 1 : 0),
            negative: prev.negative + (Math.random() > 0.9 ? 1 : 0),
            neutral: prev.neutral + (Math.random() > 0.8 ? 1 : 0),
            riskScore: Math.min(100, Math.max(0, prev.riskScore + (Math.random() > 0.5 ? 1 : -1))),
            trend: Math.random() > 0.7 ? "up" : Math.random() > 0.5 ? "down" : "stable",
          }));
        }

        // Add new mentions occasionally
        if (progress > 70 && progress % 25 === 0) {
          const newMention: BrandMention = {
            id: Math.random().toString(36).substring(7),
            source: ["Twitter", "Instagram", "Facebook", "Tokopedia", "Shopee"][Math.floor(Math.random() * 5)],
            date: new Date(),
            text: [
              "This brand is gaining popularity in my area, seeing it everywhere now!",
              "Had a smooth transaction buying from this brand online",
              "Customer support was helpful in resolving my issue quickly",
              "The quality of their latest product is truly excellent",
              "Disappointed with the delivery time, expected better service"
            ][Math.floor(Math.random() * 5)],
            sentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)] as any,
            url: "#",
            platform: ["social", "news", "marketplace", "review"][Math.floor(Math.random() * 4)] as any,
            impact: 40 + Math.floor(Math.random() * 60),
          };
          setMentions((prev) => [newMention, ...prev].slice(0, 30));
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [scanning, progress, toast]);

  // Initial setup with demo data
  useEffect(() => {
    setMentions(generateDemoMentions());
  }, []);

  // Handle starting the brand monitoring
  const handleStartMonitoring = () => {
    if (!brand.trim()) {
      toast({
        title: "Brand name required",
        description: "Please enter a brand name to monitor",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setScanning(true);
      setProgress(0);
      toast({
        title: "Monitoring Started",
        description: `Now monitoring brand: ${brand}`,
      });
    }, 1500);
  };

  // Filter mentions based on selected platform
  const filteredMentions = selectedPlatform === "all" 
    ? mentions 
    : mentions.filter(m => m.platform === selectedPlatform);

  return (
    <MainLayout>
      <Helmet>
        <title>Brand Monitoring | Merek.AI</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brand Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor your brand mentions, sentiment, and potential infringements across the web in real-time
          </p>
        </div>
        
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Set Up Monitoring</CardTitle>
              <CardDescription>
                Enter your brand name to start real-time monitoring across social media, marketplaces, news, and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input 
                    id="brand-name" 
                    placeholder="Enter your brand name" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Label htmlFor="monitoring-frequency">Update Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="monitoring-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">&nbsp;</Label>
                  <Button onClick={handleStartMonitoring} disabled={loading || scanning}>
                    {loading ? "Setting Up..." : scanning ? "Monitoring..." : "Start Monitoring"}
                  </Button>
                </div>
              </div>
              
              {scanning && (
                <div className="mt-4">
                  <Label className="mb-2 block">Setting up real-time monitoring...</Label>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mentions">Brand Mentions</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-900/20 to-green-950/20 border-green-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sentiment Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-bold">{metrics.sentimentScore}%</span>
                      {metrics.trend === "up" ? (
                        <Badge className="bg-green-600">↑ Improving</Badge>
                      ) : metrics.trend === "down" ? (
                        <Badge className="bg-red-600">↓ Declining</Badge>
                      ) : (
                        <Badge variant="outline">→ Stable</Badge>
                      )}
                    </div>
                    <Progress value={metrics.sentimentScore} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Mentions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{metrics.mentions}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-600/10 text-green-500 border-green-500/20">
                        {metrics.positive} Positive
                      </Badge>
                      <Badge variant="outline" className="bg-red-600/10 text-red-500 border-red-500/20">
                        {metrics.negative} Negative
                      </Badge>
                      <Badge variant="outline">
                        {metrics.neutral} Neutral
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border-orange-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Brand Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{metrics.riskScore}%</div>
                    <Progress 
                      value={metrics.riskScore} 
                      className={`h-2 mt-2 ${metrics.riskScore > 70 ? "bg-red-500/20" : metrics.riskScore > 30 ? "bg-orange-500/20" : "bg-green-500/20"}`}
                    />
                    <p className="text-sm mt-2 text-muted-foreground">
                      {metrics.riskScore > 70 ? "High risk - immediate action required" : 
                       metrics.riskScore > 30 ? "Moderate risk - monitor closely" : 
                       "Low risk - brand is well protected"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Last 7 days of brand mentions across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-80 bg-muted/20 rounded-md border flex items-center justify-center p-4">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Sentiment Trend Visualization</p>
                        <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-6 w-48 mx-auto rounded-md relative">
                          <div 
                            className="absolute h-8 w-2 bg-white rounded-full border-2 border-primary top-1/2 -translate-y-1/2"
                            style={{ left: `${metrics.sentimentScore}%` }}
                          />
                        </div>
                        <p className="mt-4 text-sm">Brand sentiment is {metrics.sentimentScore >= 70 ? "very positive" : metrics.sentimentScore >= 50 ? "positive" : metrics.sentimentScore >= 30 ? "neutral" : "concerning"}</p>
                      </div>
                    </div>
                    <div className="h-80 bg-muted/20 rounded-md border overflow-hidden p-4">
                      <h4 className="text-sm font-medium mb-2">Platform Distribution</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Social Media</span>
                            <span>64%</span>
                          </div>
                          <Progress value={64} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Marketplaces</span>
                            <span>28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>News</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Reviews</span>
                            <span>3%</span>
                          </div>
                          <Progress value={3} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mentions" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Brand Mentions</CardTitle>
                      <CardDescription>All mentions across digital platforms</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="marketplace">Marketplaces</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="review">Reviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredMentions.length === 0 ? (
                      <div className="text-center py-12">
                        <p>No mentions found for the selected filter</p>
                      </div>
                    ) : (
                      filteredMentions.map((mention) => (
                        <div key={mention.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">{mention.platform}</Badge>
                              <span className="font-medium">{mention.source}</span>
                            </div>
                            <Badge className={
                              mention.sentiment === "positive" ? "bg-green-600" : 
                              mention.sentiment === "negative" ? "bg-red-600" : 
                              "bg-yellow-600"
                            }>
                              {mention.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{mention.text}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div>
                              {mention.date.toLocaleDateString()} at {mention.date.toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-1">
                              Impact Score: 
                              <span className={
                                mention.impact > 70 ? "text-red-500" : 
                                mention.impact > 40 ? "text-yellow-500" : 
                                "text-green-500"
                              }>
                                {mention.impact}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Potential brand risks and infringements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted/20 rounded-lg p-4 border border-amber-500/30">
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Medium Risk: Similar Brand Names
                      </h3>
                      <p className="mb-4">We've detected 3 brands with similar names operating in related industries</p>
                      <div className="space-y-2">
                        <div className="bg-background p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">Brand X</p>
                            <p className="text-sm text-muted-foreground">Similarity: 68%</p>
                          </div>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                        <div className="bg-background p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">Brand Y</p>
                            <p className="text-sm text-muted-foreground">Similarity: 52%</p>
                          </div>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                        <div className="bg-background p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">Brand Z</p>
                            <p className="text-sm text-muted-foreground">Similarity: 45%</p>
                          </div>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4 border border-red-500/30">
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        High Risk: Brand Impersonation
                      </h3>
                      <p className="mb-4">Potential brand impersonation detected on online marketplace</p>
                      <div className="space-y-2">
                        <div className="bg-background p-3 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">Suspicious Seller on Tokopedia</p>
                            <Badge className="bg-red-600">High Risk</Badge>
                          </div>
                          <p className="text-sm mb-2">This seller is using your brand name and logo on unauthorized products</p>
                          <Button size="sm" variant="destructive">Take Action</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4 border border-green-500/30">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Low Risk: Trademark Registration
                      </h3>
                      <p>Your brand name is properly registered and protected in your primary markets</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Generate Complete Risk Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}