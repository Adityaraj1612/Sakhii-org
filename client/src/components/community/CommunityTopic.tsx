import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";

interface CommunityTopicProps {
  topic: {
    id: number;
    title: string;
    description: string;
    members: number;
    posts: number;
  };
}

const CommunityTopic = ({ topic }: CommunityTopicProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
        <p className="text-neutral-600 text-sm mb-4">{topic.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-neutral-500">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">{topic.members.toLocaleString()} members</span>
          </div>
          
          <div className="flex items-center text-neutral-500">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-sm">{topic.posts.toLocaleString()} posts</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          Join Group
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityTopic;
