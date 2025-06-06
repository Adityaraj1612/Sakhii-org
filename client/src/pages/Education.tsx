import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { EducationalResource } from "@shared/schema";

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['/api/educationalResources'],
    refetchOnWindowFocus: false
  });
  
  // Filter resources by category
  const filteredResources = resources ? 
    (selectedCategory === "all" ? 
      resources : 
      resources.filter((resource: EducationalResource) => resource.category === selectedCategory)
    ) : [];

  return (
    <div className="py-10 bg-purple-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 font-heading">Educational Resources</h1>
        <p className="text-neutral-600 mb-8">
          Explore our comprehensive library of articles, guides, and resources about women's health
        </p>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="bg-white p-1 overflow-x-auto flex flex-nowrap max-w-full">
            <TabsTrigger value="all" className="whitespace-nowrap">All Resources</TabsTrigger>
            {RESOURCE_CATEGORIES.map((category, index) => (
              <TabsTrigger key={index} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Card key={index} className="bg-white">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-5 bg-gray-200 w-2/3 rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-full rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-2/3 rounded mb-3 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-red-500">Failed to load educational resources</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p>No resources found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredResources.map((resource: EducationalResource) => (
                  <Card key={resource.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-neutral-200 flex items-center justify-center">
                      <span className="text-neutral-600">Image</span>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-neutral-600 mb-3">{resource.description}</p>
                      <a href="#" className="text-sm text-primary hover:underline">Read more</a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Featured articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 font-heading">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 bg-neutral-200 h-48 md:h-auto flex items-center justify-center">
                  <span className="text-neutral-600">Image</span>
                </div>
                <CardContent className="md:w-3/5 p-6">
                  <h3 className="text-xl font-semibold mb-2">Understanding Your Menstrual Cycle</h3>
                  <p className="text-neutral-600 mb-4 line-clamp-3">
                    A comprehensive guide to the phases of your menstrual cycle and what they mean for your overall health.
                  </p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <span>By Dr. Sarah Green</span>
                    <span className="mx-2">•</span>
                    <span>10 min read</span>
                  </div>
                </CardContent>
              </div>
            </Card>
            
            <Card className="bg-white p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 bg-neutral-200 h-48 md:h-auto flex items-center justify-center">
                  <span className="text-neutral-600">Image</span>
                </div>
                <CardContent className="md:w-3/5 p-6">
                  <h3 className="text-xl font-semibold mb-2">Nutrition for Hormonal Balance</h3>
                  <p className="text-neutral-600 mb-4 line-clamp-3">
                    How specific foods and dietary patterns can help regulate hormones and improve overall well-being.
                  </p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <span>By Dr. Lisa Johnson</span>
                    <span className="mx-2">•</span>
                    <span>8 min read</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
