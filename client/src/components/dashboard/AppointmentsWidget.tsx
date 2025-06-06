import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppointmentsWidgetProps {
  fullWidth?: boolean;
}

const AppointmentsWidget = ({ fullWidth = false }: AppointmentsWidgetProps) => {
  // Mock appointments data
  const appointments = [
    {
      id: 1,
      doctorName: "Dr. Sarah Green",
      doctorSpecialty: "OB/GYN Specialist",
      doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      date: "June 15, 2023",
      time: "10:00 AM",
      type: "video",
      status: "confirmed"
    },
    {
      id: 2,
      doctorName: "Dr. Emily Chen",
      doctorSpecialty: "Fertility Specialist",
      doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&auto=format&fit=crop&q=60",
      date: "June 28, 2023",
      time: "2:30 PM",
      type: "in-person",
      status: "pending"
    }
  ];
  
  // Only show first appointment if not full width
  const displayAppointments = fullWidth ? appointments : [appointments[0]];

  return (
    <Card className={`${fullWidth ? 'w-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            My Appointments
          </CardTitle>
          
          <Button size="sm">Book New</Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayAppointments.length === 0 ? (
          <div className="text-center py-6">
            <CalendarIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-medium text-neutral-500 mb-1">No Upcoming Appointments</h3>
            <p className="text-neutral-400 text-sm mb-4">
              You don't have any scheduled appointments.
            </p>
            <Button>Book an Appointment</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center mb-3">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                    <AvatarFallback>{appointment.doctorName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{appointment.doctorName}</h4>
                    <p className="text-neutral-500 text-sm">{appointment.doctorSpecialty}</p>
                  </div>
                  <Badge 
                    className={`ml-auto ${
                      appointment.status === "confirmed" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    }`}
                    variant="outline"
                  >
                    {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-neutral-600">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{appointment.date}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-neutral-600 mb-4">
                  <Video className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">
                    {appointment.type === "video" ? "Video Consultation" : "In-person Visit"}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {appointment.status === "confirmed" && appointment.type === "video" && (
                    <Button size="sm" className="flex-1">Join Call</Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1">
                    {appointment.status === "confirmed" ? "Reschedule" : "Confirm"}
                  </Button>
                  {fullWidth && (
                    <Button size="sm" variant="outline" className="flex-1">Cancel</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {fullWidth && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Past Appointments</h3>
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=60" 
                    alt="Dr. Maria Rodriguez" 
                  />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Dr. Maria Rodriguez</h4>
                  <p className="text-neutral-500 text-sm">Endocrinologist</p>
                </div>
                <Badge className="ml-auto bg-gray-100 text-gray-800 hover:bg-gray-100" variant="outline">
                  Completed
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center text-neutral-600">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">May 28, 2023</span>
                </div>
                <div className="flex items-center text-neutral-600">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">11:30 AM</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">View Summary</Button>
                <Button size="sm" variant="outline" className="flex-1">Book Follow-up</Button>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Button variant="link" size="sm">View All Past Appointments</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsWidget;
