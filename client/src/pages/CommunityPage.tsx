import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, MessageSquare } from "lucide-react";
import ForumCard from "@/components/community/ForumCard";
import EventCard from "@/components/community/EventCard";

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample topics for the community
  
  // Sample forums
  const forumPosts = [
    {
      id: 1,
      title: "Managing work stress during your cycle",
      author: "Emily Chen",
      authorImg: "https://images.unsplash.com/photo-1669170023257-4da4bc7afarb",
      date: "2 days ago",
      category: "Mental Wellness",
      replies: 24
    },
    {
      id: 2,
      title: "Nutrition tips that helped my PCOS symptoms",
      author: "Sarah Johnson",
      authorImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      date: "5 days ago",
      category: "PCOS Support Group",
      replies: 36
    },
    {
      id: 3,
      title: "Exercise routines during pregnancy - what worked for you?",
      author: "Mia Rodriguez",
      authorImg: "https://images.unsplash.com/photo-1664575599736-c5197c684c3b",
      date: "1 week ago",
      category: "Pregnancy & Postpartum",
      replies: 42
    }
  ];
  
  // Sample events
  const events = [
    {
      id: 1,
      title: "Women's Wellness Webinar",
      date: "June 15, 2023",
      time: "6:00 PM - 7:30 PM",
      host: "Dr. Sarah Green",
      topic: "Hormonal Balance & Nutrition",
      participants: 156,
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754"
    },
    {
      id: 2,
      title: "Virtual Yoga for PCOS",
      date: "June 18, 2023",
      time: "9:00 AM - 10:00 AM",
      host: "Lisa Johnson, Certified Yoga Instructor",
      topic: "Gentle yoga poses to help manage PCOS symptoms",
      participants: 89,
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597"
    }
  ];

  // Filter forums based on search
  const filteredForums = forumPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="py-10 bg-purple-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-heading">Sakhi Community</h1>
            <p className="text-neutral-600">
              Connect with women and healthcare professionals in our supportive community
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Users className="mr-2 h-4 w-4" /> Join Community
          </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search forums, topics, events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <Tabs defaultValue="forums">
          <TabsList className="mb-6">
            <TabsTrigger value="forums" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> Forums
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center">
              <Users className="mr-2 h-4 w-4" /> Topics
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forums">
            <div className="space-y-6">
              {searchTerm && filteredForums.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>No forum posts match your search criteria</p>
                  </CardContent>
                </Card>
              ) : (
                filteredForums.map(post => (
                  <ForumCard key={post.id} post={post} />
                ))
              )}
              
              {!searchTerm && (
                <div className="text-center mt-6">
                  <Button variant="outline">View More Posts</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          
          <TabsContent value="events">
            <div className="space-y-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              
              <div className="text-center mt-6">
                <Button variant="outline">View All Events</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-heading mb-2">Start Your Own Discussion</h2>
            <p className="text-neutral-600">
              Have a question or want to share your experiences? Start a new discussion topic.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button>Create New Topic</Button>
            <Button variant="outline">Ask a Question</Button>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm flex gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-bold font-heading mb-4">Community Guidelines</h2>
              <ul className="space-y-2 text-neutral-600">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Be respectful and supportive of other members
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Protect your privacy and that of others
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                No promotion of products or services without permission
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Medical advice should be verified with healthcare professionals
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Report inappropriate content to moderators
              </li>
            </ul>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <img 
                src="https://i.ibb.co/ccT1KKVw/Screenshot-2025-03-21-163106.png" 
                alt="Community QR Code" 
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
