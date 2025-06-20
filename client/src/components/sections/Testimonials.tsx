import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Ramaswamy",
      location: "Mumbai",
      avatar: "PR",
      rating: 5,
      text: "Sakhi has transformed how I understand my body. The period tracker is incredibly accurate, and the educational resources have taught me so much about my reproductive health."
    },
    {
      name: "Anjali Deshmukh",
      location: "Bangalore",
      avatar: "AD",
      rating: 5,
      text: "Being able to consult with doctors in my native language has been life-changing. Sakhi provides a safe space for women like me to discuss health concerns without judgment."
    },
    {
      name: "Sunita Mehta",
      location: "Delhi",
      avatar: "SM",
      rating: 5,
      text: "The community support on Sakhi helped me through a difficult pregnancy. I found information and emotional support that wasn't available anywhere else. Truly grateful."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Diverse women illustration background (existing code) */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gray-100 to-gray-50">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Cdefs%3E%3Cstyle%3E.woman%7Bfill:%23ff8fab;%7D.hair1%7Bfill:%23654321;%7D.hair2%7Bfill:%23f4c2a1;%7D.hair3%7Bfill:%232c1810;%7D%3C/style%3E%3C/defs%3E%3Cg%3E%3Ccircle class='woman' cx='100' cy='120' r='40'/%3E%3Ccircle class='hair1' cx='100' cy='100' r='25'/%3E%3Ccircle class='woman' cx='200' cy='130' r='35'/%3E%3Ccircle class='hair2' cx='200' cy='115' r='20'/%3E%3Ccircle class='woman' cx='300' cy='125' r='38'/%3E%3Ccircle class='hair3' cx='300' cy='105' r='23'/%3E%3Ccircle class='woman' cx='400' cy='135' r='36'/%3E%3Ccircle class='hair1' cx='400' cy='120' r='21'/%3E%3Ccircle class='woman' cx='500' cy='120' r='40'/%3E%3Ccircle class='hair2' cx='500' cy='100' r='25'/%3E%3Ccircle class='woman' cx='600' cy='130' r='35'/%3E%3Ccircle class='hair3' cx='600' cy='115' r='20'/%3E%3Ccircle class='woman' cx='700' cy='125' r='38'/%3E%3Ccircle class='hair1' cx='700' cy='105' r='23'/%3E%3Ccircle class='woman' cx='800' cy='135' r='36'/%3E%3Ccircle class='hair2' cx='800' cy='120' r='21'/%3E%3Ccircle class='woman' cx='900' cy='120' r='40'/%3E%3Ccircle class='hair3' cx='900' cy='100' r='25'/%3E%3Ccircle class='woman' cx='1000' cy='130' r='35'/%3E%3Ccircle class='hair1' cx='1000' cy='115' r='20'/%3E%3Ccircle class='woman' cx='1100' cy='125' r='38'/%3E%3Ccircle class='hair2' cx='1100' cy='105' r='23'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom',
            opacity: 0.3
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Inserted Image with max height and object-fit */}
        {/* <div className="mb-8 flex justify-center"> */}
        {/* <img
            src="https://i.ibb.co/pjbbnfjT/margin-wrap.png"
            alt="margin-wrap"
            className="w-full max-w-5xl h-48 object-cover rounded-lg shadow-md"
          />
        </div> */}

        <div className="text-center mb-12">
          <p className="text-pink-500 font-medium text-sm uppercase tracking-wide mb-2">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Women Say About Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from women who have transformed their health journey with Sakhi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-gray-100 hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-pink-500 text-pink-500"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
