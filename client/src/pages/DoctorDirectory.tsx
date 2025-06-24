import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, MapPin, Phone, Mail, Clock, Filter, Star, ChevronLeft, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Doctor } from "@shared/schema";

const DoctorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    consultationType: "online",
    problem: "",
    medicalHistory: "",
    preferredDate: "",
    preferredTime: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['/api/doctors'],
    refetchOnWindowFocus: false
  });

  const specialties = [
    "All Specialities",
    "Gynaecologist", 
    "Reproductive Endocrinologist",
    "Obstetrician",
    "Fertility Specialist",
    "Reproductive Urologist"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-pink-500">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Medical Experts
              </Button>
            </div>
            <Button variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-50">
              Clear All Filters ×
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Find Medical Experts</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, specialty, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg rounded-lg border-gray-200"
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-3">Specialties:</div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <Badge
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-sm ${
                  selectedSpecialty === specialty 
                    ? "bg-pink-500 text-white border-pink-500" 
                    : "hover:bg-pink-50 border-gray-200"
                }`}
                onClick={() => setSelectedSpecialty(specialty === selectedSpecialty ? "" : specialty)}
              >
                {specialty}
              </Badge>
            ))}
            <Badge variant="outline" className="cursor-pointer px-3 py-1.5 rounded-full hover:bg-pink-50 border-gray-200">
              More +
            </Badge>
          </div>
        </div>
        
        {/* Filter Row */}
        <div className="flex flex-wrap gap-6 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Availability:</span>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-gray-900">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="today">Available Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Consultation Type:</span>
            <Select>
              <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-gray-900">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="video">Video Consultation</SelectItem>
                <SelectItem value="person">In Person Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Language:</span>
            <Select>
              <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-gray-900">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Price Range:</span>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-gray-900">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="low">Under $100</SelectItem>
                <SelectItem value="medium">$100-$300</SelectItem>
                <SelectItem value="high">Above $300</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <Select>
              <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-gray-900">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-3">Quick Filters:</div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="px-3 py-1.5 rounded-full border-gray-200 hover:bg-gray-50 cursor-pointer">
              ✓ Available Now
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 rounded-full border-gray-200 hover:bg-gray-50 cursor-pointer">
              📹 Video Consultation
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 rounded-full border-gray-200 hover:bg-gray-50 cursor-pointer">
              🛡️ Accepts Insurance
            </Badge>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">Showing 12 of 48 experts</p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse border rounded-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600">Error loading doctors</p>
            </div>
          ) : (
            // Doctor cards  
            (Array.isArray(doctors) ? doctors : []).map((doctor: Doctor, index) => (
              <Card key={doctor.id} className="border rounded-lg hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm font-medium">
                        {doctor.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{doctor.name}</h3>
                      <p className="text-pink-500 text-sm font-medium mb-1">{doctor.specialty}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 text-xs mr-1">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-gray-600 text-xs">4.{index + 6} ({180 + index * 20} reviews)</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{["New York, NY", "Chicago, IL", "Boston, MA"][index % 3]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {["Specializing in PCOS, fertility treatments, and hormonal disorders with over 15 years of experience. Board certified with Johns Hopkins training.",
                      "Expert in women's health, menstrual disorders, and preventive care with a focus on patient-centered approaches. Specializes in adolescent gynecology.", 
                      "Specializing in male fertility issues, reproductive health, and advanced fertility treatments. Expert in microsurgical procedures."][index % 3]}
                  </p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 px-2 py-0.5">
                        ✓ Available {["Today", "Tomorrow", "Now"][index % 3]}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      Next available: {["Mon-Fri, 9AM-5PM", "Today, 3:30 PM", "Jun 8, 10:00 AM"][index % 3]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {["EDT (UTC-4)", "CDT (UTC-5)", "EDT (UTC-4)"][index % 3]}
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          📹 Video Consultation
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          🏥 In Person Visit
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-xs">
                          <div className="font-semibold">📹 ₹{[800, 600, 900][index % 3]}</div>
                          <div className="text-gray-500">Online • 30 min</div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-pink-500 hover:bg-pink-600 text-xs px-3 py-1 h-7"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          Book Now
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs">
                          <div className="font-semibold">🏥 ₹{[1500, 1200, 1800][index % 3]}</div>
                          <div className="text-gray-500">In-Person • 45 min</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs px-2 py-1 h-7"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          View Calendar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                      <Button variant="ghost" size="sm" className="text-xs text-pink-500 p-0 h-auto">
                        View Full Profile →
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
                      <span>🛡️ Accepts Insurance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

       


        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-pink-500 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">...</Button>
            <Button variant="outline" size="sm">6</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Book Appointment with {selectedDoctor?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-600">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={bookingForm.age}
                    onChange={(e) => setBookingForm({...bookingForm, age: e.target.value})}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Consultation Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-600">Consultation Type</h3>
              <RadioGroup 
                value={bookingForm.consultationType} 
                onValueChange={(value) => setBookingForm({...bookingForm, consultationType: value})}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1">
                    <div className="font-medium">📹 Online Consultation</div>
                    <div className="text-sm text-gray-600">
                      ₹800 - ₹900 • 30 minutes
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="inperson" id="inperson" />
                  <Label htmlFor="inperson" className="flex-1">
                    <div className="font-medium">🏥 In-Person Visit</div>
                    <div className="text-sm text-gray-600">
                      ₹1500 - ₹1800 • 45 minutes
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Appointment Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-600">Preferred Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select value={bookingForm.preferredTime} onValueChange={(value) => setBookingForm({...bookingForm, preferredTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-600">Medical Information</h3>
              <div>
                <Label htmlFor="problem">Describe your problem/concern *</Label>
                <Textarea
                  id="problem"
                  value={bookingForm.problem}
                  onChange={(e) => setBookingForm({...bookingForm, problem: e.target.value})}
                  placeholder="Please describe your symptoms, concerns, or reason for consultation"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="history">Medical History (Optional)</Label>
                <Textarea
                  id="history"
                  value={bookingForm.medicalHistory}
                  onChange={(e) => setBookingForm({...bookingForm, medicalHistory: e.target.value})}
                  placeholder="Please share any relevant medical history, current medications, or previous treatments"
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-600">Medical Reports/Files (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-600 mb-2">
                  Upload medical reports, test results, or images
                </div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadedFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" type="button">
                    Choose Files
                  </Button>
                </Label>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {uploadedFiles.length} file(s) selected
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedDoctor(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                onClick={() => {
                  console.log('Booking submitted:', bookingForm);
                  setSelectedDoctor(null);
                  setBookingForm({
                    name: "", email: "", phone: "", age: "",
                    consultationType: "online", problem: "", medicalHistory: "",
                    preferredDate: "", preferredTime: ""
                  });
                  setUploadedFiles([]);
                }}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDirectory;