import { Button } from "@/components/ui/button";
import { Users, Lightbulb, BookOpen } from "lucide-react";
import communityimage from "../../../../attached_assets/community.jpg";
import { Link } from "wouter";

const Community = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-heading">Join Our Community</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
           <div className="h-80 rounded-lg overflow-hidden">
  <img
    src={communityimage}
    alt="Community"
    className="object-cover w-full h-full"
  />
</div>

          </div>
          
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 font-heading">
              Connect with peers, experts and supportive communities
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mt-1 mr-3">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Supportive Environment</h4>
                  <p className="text-neutral-600">
                    Join discussion groups with women experiencing similar health journeys
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mt-1 mr-3">
                  <Lightbulb className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Expert-led Guidance</h4>
                  <p className="text-neutral-600">
                    Participate in Q&A sessions with qualified healthcare professionals
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mt-1 mr-3">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Knowledge Sharing</h4>
                  <p className="text-neutral-600">
                    Access community-sourced tips, experiences, and recommendations
                  </p>
                </div>
              </div>
            </div>
          <Link to="/community" onClick={() => window.scrollTo(0, 0)}>
  <Button>Join Community</Button>
</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
