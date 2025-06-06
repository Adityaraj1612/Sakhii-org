import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Doctor } from "@shared/schema";

const DoctorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['/api/doctors'],
    refetchOnWindowFocus: false
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Your Health, Our Priority</h1>
          <p className="mb-6">Connect with top healthcare professionals and get the care you deserve.</p>
          <Button size="lg">Book Appointment</Button>
        </div>
      </div>

      {/* Find Your Doctor Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Find Your Doctor</h2>

        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search doctor or specialty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="max-w-xs"
          />
          <Button>Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {doctors?.map((doctor: Doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <img src={doctor.profilePicture} alt={doctor.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                <div className="flex items-center mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({doctor.reviews || 0} reviewed)</span>
                </div>
                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Video Consultation", icon: "🎥" },
              { title: "In-Person Visit", icon: "👤" },
              { title: "Emergency Care", icon: "🚑" },
              { title: "Medical Records", icon: "📋" }
            ].map((service) => (
              <Card key={service.title}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className="font-semibold">{service.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>123 Medical Center, Healthcare Street</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>contact@healthcare.com</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Working Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  <span>Emergency Services Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDirectory;