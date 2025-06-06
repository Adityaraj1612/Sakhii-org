import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Users } from "lucide-react";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    host: string;
    topic: string;
    participants: number;
    image: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto bg-neutral-200 relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('flex', 'items-center', 'justify-center');
                parent.innerHTML = '<span class="text-neutral-600">Event Image</span>';
              }
            }}
          />
        </div>
        
        <CardContent className="md:w-2/3 p-6">
          <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-neutral-600">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{event.date}</span>
            </div>
            
            <div className="flex items-center text-neutral-600">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-neutral-600">
              <User className="h-4 w-4 mr-2 text-primary" />
              <span>Host: {event.host}</span>
            </div>
            
            <div className="flex items-center text-neutral-600">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span>{event.participants} participants</span>
            </div>
          </div>
          
          <p className="text-neutral-600 mb-4">{event.topic}</p>
          
          <div className="flex space-x-3">
            <Button>Register</Button>
            <Button variant="outline">More Info</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventCard;
