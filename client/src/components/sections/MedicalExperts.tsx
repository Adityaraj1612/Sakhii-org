import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, FileText, ArrowRight } from "lucide-react";
import type { Doctor } from "@shared/schema";
 import { Link } from "wouter";

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
                   <Link to="/doctors" onClick={() => window.scrollTo(0, 0)}>
  <Button>Book Appointment</Button>
</Link>

                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-center mb-12">
           <Link to="/doctors" onClick={() => window.scrollTo(0, 0)}>
  <Button>View All Doctors</Button>
</Link>

        </div>
      </div>
    </section>
  );
};

export default MedicalExperts;
