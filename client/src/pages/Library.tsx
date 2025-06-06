import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Video, Search } from "lucide-react";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { EducationalResource } from "@shared/schema";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("articles");
  
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['/api/educationalResources'],
    refetchOnWindowFocus: false
  });
  
  // Filter resources based on search
  const filteredResources = resources ? 
    resources.filter((resource: EducationalResource) => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  return (
    <div className="py-10 bg-purple-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 font-heading">Health Library & Resources</h1>
        <p className="text-neutral-600 mb-8">
          Access our comprehensive collection of health information, articles, videos and guides
        </p>
        
        {/* Search */}
        <div className="mb-8 relative">
          <Input
            type="text"
            placeholder="Search for health topics, articles, or resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 bg-white"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Content tabs */}
        <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-white">
            <TabsTrigger value="articles" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" /> Articles
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" /> Guides
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center">
              <Video className="h-4 w-4 mr-2" /> Videos
            </TabsTrigger>
          </TabsList>
          
          {/* Articles tab */}
          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="h-5 bg-gray-200 w-2/3 rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-full rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-2/3 rounded mb-3 animate-pulse" />
                      <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <div className="col-span-3 text-center p-8 bg-white rounded-lg shadow">
                  <p className="text-red-500">Failed to load articles</p>
                </div>
              ) : searchTerm && filteredResources.length === 0 ? (
                <div className="col-span-3 text-center p-8 bg-white rounded-lg shadow">
                  <p>No articles found matching "{searchTerm}"</p>
                </div>
              ) : (
                (searchTerm ? filteredResources : resources).map((resource: EducationalResource) => (
                  <Card key={resource.id} className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-xs bg-purple-100 text-primary px-2 py-1 rounded-full">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      <a href="#" className="text-primary text-sm hover:underline">Read more</a>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Guides tab */}
          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RESOURCE_CATEGORIES.map((category, index) => (
                <Card key={index} className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">{category} Guide</h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      Comprehensive information about {category.toLowerCase()} topics, treatments, and resources.
                    </p>
                    <a href="#" className="text-primary text-sm hover:underline">View Guide</a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Videos tab */}
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="bg-white shadow-sm">
                  <div className="bg-neutral-200 h-48 flex items-center justify-center rounded-t-lg">
                    <Video className="h-10 w-10 text-neutral-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Understanding {RESOURCE_CATEGORIES[index % RESOURCE_CATEGORIES.length]}</h3>
                    <p className="text-neutral-600 text-sm mb-2">
                      Expert explanation of key health concepts and treatments.
                    </p>
                    <div className="flex items-center text-xs text-neutral-500">
                      <span>Dr. Sarah Green</span>
                      <span className="mx-2">•</span>
                      <span>10:24 mins</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 font-heading">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {RESOURCE_CATEGORIES.map((category, index) => (
              <Card key={index} className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category}</h3>
                    <p className="text-sm text-neutral-600">{Math.floor(Math.random() * 20) + 5} articles</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
