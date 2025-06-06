import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ForumPost {
  id: number;
  title: string;
  author: string;
  authorImg: string;
  date: string;
  category: string;
  replies: number;
}

interface ForumCardProps {
  post: ForumPost;
}

const ForumCard = ({ post }: ForumCardProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Badge variant="outline" className="bg-purple-50 text-primary border-purple-200">
                {post.category}
              </Badge>
              <span className="text-neutral-500 text-sm ml-3">{post.date}</span>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={post.authorImg} alt={post.author} />
                <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-neutral-600">Posted by {post.author}</span>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center text-neutral-500 mr-6">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.replies} replies</span>
            </div>
            
            <a href="#" className="text-primary hover:text-primary/80 flex items-center">
              <span className="text-sm mr-1">Read</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumCard;
