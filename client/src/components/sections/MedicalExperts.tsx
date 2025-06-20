import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, FileText, ArrowRight } from "lucide-react";
import type { Doctor } from "@shared/schema";

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/api/doctors");
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
};
const MedicalExperts = () => {
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['/api/doctors'],
    queryFn: fetchDoctors,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-heading">Our Medical Experts</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            // Skeleton loaders for experts
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-100">
                <div className="h-56 bg-neutral-200 animate-pulse" />
                <CardContent className="p-5">
                  <div className="h-5 bg-neutral-200 w-3/4 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-neutral-200 w-1/2 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-neutral-200 w-1/3 rounded animate-pulse mb-3" />
                  <div className="h-10 bg-neutral-200 w-full rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-4 text-center p-4">
              <p className="text-red-500">Failed to load doctors</p>
            </div>
          ) : (
            // Display actual doctors
            doctors && doctors.map((doctor: Doctor) => (
              <Card key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-100">
                <div className="h-56 bg-neutral-200 relative">
                  <img src={doctor.profilePicture ?? undefined} 
                    className="w-full h-full object-contain" 
                    alt={doctor.name} 
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{doctor.specialty}</p>
                  <p className="text-xs text-neutral-600 mb-3">{doctor.experience}</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-purple-50 text-primary hover:bg-primary hover:text-white"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-center mb-12">
          <Button variant="outline">View All Doctors</Button>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 font-heading">Online Consultation</h3>
              <p className="text-neutral-600 mb-6">
                Get expert medical advice from the comfort of your home. Our doctors are available 24/7 for video consultations.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                    <Video className="text-primary h-4 w-4" />
                  </div>
                  <p className="font-medium">Video Consultations</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                    <Calendar className="text-primary h-4 w-4" />
                  </div>
                  <p className="font-medium">24/7 Availability</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                    <FileText className="text-primary h-4 w-4" />
                  </div>
                  <p className="font-medium">Digital Prescriptions</p>
                </div>
              </div>
              
              <Button>Book Consultation</Button>
            </div>
            
            <div className="md:w-1/2">
              <div className="h-64 bg-neutral-200 rounded-lg flex items-center justify-center">
                <span className="text-neutral-600">Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalExperts;
