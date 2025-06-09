import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Sakhii
            </h3>
            <p className="text-purple-100 mb-4">
              Your trusted companion for women's health and wellness journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-purple-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-purple-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-purple-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-purple-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-purple-100 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/doctors">
                  <a className="text-purple-100 hover:text-white">Find Doctors</a>
                </Link>
              </li>
              <li>
                <Link href="/library">
                  <a className="text-purple-100 hover:text-white">Health Library</a>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <a className="text-purple-100 hover:text-white">Community</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-purple-100 hover:text-white">Careers</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>Chandigarh University</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>+91 9027704514, 9661265525</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>sakhiindiafoundation@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <p className="mb-3 text-purple-100">Subscribe to our newsletter</p>
            <form className="mb-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-r-none bg-white text-black" 
                />
                <Button type="submit" className="rounded-l-none bg-rose-500 hover:bg-rose-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <p className="text-xs text-purple-100">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-purple-100">
          <p>&copy; {new Date().getFullYear()} Sakhii. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy">
              <a className="text-purple-100 hover:text-white text-sm">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="text-purple-100 hover:text-white text-sm">Terms of Service</a>
            </Link>
            <Link href="/cookies">
              <a className="text-purple-100 hover:text-white text-sm">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
