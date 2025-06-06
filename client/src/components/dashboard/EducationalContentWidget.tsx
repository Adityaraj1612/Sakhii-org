import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { EducationalResource } from "@shared/schema";

interface EducationalContentWidgetProps {
  fullWidth?: boolean;
}

const EducationalContentWidget = ({ fullWidth = false }: EducationalContentWidgetProps) => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/educationalResources'],
    refetchOnWindowFocus: false
  });

  // If resources are loading or not available, use fallback data
  const fallbackResources = [
    {
      id: 1,
      title: "Understanding Your Menstrual Cycle",
      description: "A comprehensive guide to the phases of your menstrual cycle and what they mean for your overall health.",
      category: "Reproductive Health",
      imageUrl: "/images/reproductive-health.jpg"
    },
    {
      id: 2,
      title: "Nutrition for Hormonal Balance",
      description: "How specific foods and dietary patterns can help regulate hormones and improve overall well-being.",
      category: "Nutrition",
      imageUrl: "/images/nutrition.jpg"
    },
    {
      id: 3,
      title: "Managing Stress and Your Cycle",
      description: "Learn how stress affects your menstrual cycle and techniques to manage it effectively.",
      category: "Mental Health",
      imageUrl: "/images/mental-health.jpg"
    }
  ];
  
  const displayResources = resources || fallbackResources;
  
  // Only show first resource if not full width
  const limitedResources = fullWidth ? displayResources : [displayResources[0]];

  return (
    <Card className={`${fullWidth ? 'w-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Educational Content
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {fullWidth ? (
          <Tabs defaultValue="recommended">
            <TabsList className="mb-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4 h-24 bg-neutral-200 rounded"></div>
                        <div className="md:w-3/4">
                          <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
                          <div className="h-3 bg-neutral-200 rounded mb-2 w-full"></div>
                          <div className="h-3 bg-neutral-200 rounded mb-2 w-2/3"></div>
                          <div className="h-8 bg-neutral-200 rounded w-24 mt-3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayResources.map((resource: any) => (
                    <div key={resource.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4 h-24 bg-neutral-200 rounded flex items-center justify-center">
                          <span className="text-neutral-500">Article Image</span>
                        </div>
                        <div className="md:w-3/4">
                          <Badge className="mb-2">{resource.category}</Badge>
                          <h3 className="font-medium mb-1">{resource.title}</h3>
                          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                            {resource.description}
                          </p>
                          <Button variant="link" className="p-0 h-auto flex items-center text-primary">
                            Read Article <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4">
                View All Recommended Content
              </Button>
            </TabsContent>
            
            <TabsContent value="latest" className="space-y-4">
              <div className="text-center py-4">
                <p className="text-neutral-500">Latest content will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              <div className="text-center py-4">
                <p className="text-neutral-500">Saved content will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            {isLoading ? (
              <div className="border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-neutral-200 rounded mb-2 w-full"></div>
                <div className="h-3 bg-neutral-200 rounded mb-2 w-2/3"></div>
                <div className="h-8 bg-neutral-200 rounded w-24 mt-3"></div>
              </div>
            ) : (
              limitedResources.map((resource: any) => (
                <div key={resource.id} className="border rounded-lg p-4">
                  <Badge className="mb-2">{resource.category}</Badge>
                  <h3 className="font-medium mb-1">{resource.title}</h3>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  <Button variant="link" className="p-0 h-auto flex items-center text-primary">
                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            
            <div className="mt-4 text-center">
              <Button variant="link" className="text-primary">
                View All Resources
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationalContentWidget;
