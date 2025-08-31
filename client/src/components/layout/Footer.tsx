import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from '../../../src/assets/logo.png'

const Footer = () => {
  return (
    <footer className="bg-[#ca3561] text-white max-w-screen-2xl mx-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* <h3 className="font-bold text-xl mb-4 flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Sakhii
            </h3> */}
            <div className="">
              <img src={logo} alt="" className="" />
            </div>
            <p className="text-purple-100 mb-4">
              
Empowering women through health education and support since 2020.
            </p>
            <div className="flex space-x-4">
  <a
    href="#"
    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
  >
    <Facebook className="h-5 w-5" />
  </a>
  <a
    href="#"
    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
  >
    <Twitter className="h-5 w-5" />
  </a>
  <a
    href="#"
    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
  >
    <Instagram className="h-5 w-5" />
  </a>
  <a
    href="#"
    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
  >
    <Youtube className="h-5 w-5" />
  </a>
</div>

          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-purple-100 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/doctors" className="text-purple-100 hover:text-white">Find Doctors</Link>
              </li>
              <li>
                <Link href="/library" className="text-purple-100 hover:text-white">Health Library</Link>
              </li>
              <li>
                <Link href="/community" className="text-purple-100 hover:text-white">Community</Link>
              </li>
              <li>
                <Link href="/careers" className="text-purple-100 hover:text-white">Careers</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                Health Articles
              </li>
              <li className="flex items-start">
                Video Library
              </li>
              <li className="flex items-start">
                Community Forum
              </li>
              <li className="flex items-start">
                FAQs
              </li>
              <li className="flex items-start">
                Privacy Policy 
              </li>
              
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>Durga Colony Roorkee Uttarakhand</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>+91 9027704514</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>sakhiindiafoundation@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8  text-purple-100 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Sakhiicare Foundation. All rights reserved.</p>
          <div className="  space-x-4">
            <Link href="/privacy" className="text-purple-100 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-purple-100 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/cookies" className="text-purple-100 hover:text-white text-sm">Cookie Policy</Link>
          </div> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
