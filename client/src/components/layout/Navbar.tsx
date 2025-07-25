import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Calendar, Heart, GamepadIcon, Brain, MessageCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/logo";
import LanguageSelector from "@/components/ui/language-selector";
import AskSakhiiModal from "../ai/AskSakhiiModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAskSakhiiOpen, setIsAskSakhiiOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Logo size="sm" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/doctors" className={`${location === '/doctors' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.doctors')}
          </Link>
          <Link href="/education" className={`${location === '/education' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.education')}
          </Link>
          <Link href="/library" className={`${location === '/library' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.library')}
          </Link>
          <Link href="/community" className={`${location === '/community' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.community')}
          </Link>
          <Link href="/contact" className={`${location === '/contact' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.contact')}
          </Link>
          <Link href="/tracker" className={`${location === '/tracker' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold flex items-center`}>
            <Heart className="mr-1 h-4 w-4 text-rose-500" /> Health Tracker
          </Link>
          <Link href="/games" className={`${location === '/games' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold flex items-center`}>
            <Brain className="mr-1 h-4 w-4 text-purple-500" /> Health Games
          </Link>
          <Link href="/shop" className={`${location === '/shop' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold`}>
            {t('navbar.shop', 'Shop')}
          </Link>
          <Link href="/yojanas" className={`${location === '/yojanas' ? 'text-rose-600' : 'text-gray-700'} hover:text-rose-600 font-semibold flex items-center`}>
            <Building2 className="mr-1 h-4 w-4 text-blue-500" />
            {t('navbar.yojanas', 'Government Schemes')}
          </Link>
          <Button 
            onClick={() => setIsAskSakhiiOpen(true)}
            variant="secondary" 
            className="bg-rose-500 text-white hover:bg-rose-600 flex items-center"
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Ask Sakhii
          </Button>
        </nav>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSelector variant="navbar" />

          <Link href="/sign-in">
            <Button variant="default" size="sm">{t('navbar.signIn')}</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">{t('navbar.signUp')}</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-neutral-800" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>


      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <ul className="space-y-3">
            <li>
              <Link 
                href="/doctors" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/doctors' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.doctors')}
              </Link>
            </li>
            <li>
              <Link 
                href="/education" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/education' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.education')}
              </Link>
            </li>
            <li>
              <Link 
                href="/library" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/library' ? 'text-primary' : 'text-neutral-600'}hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.library')}
              </Link>
            </li>
            <li>
              <Link 
                href="/community" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/community' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.community')}
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/contact' ? 'text-primary' : 'text-neutral-600'}hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.contact')}
              </Link>
            </li>
            <li>
              <Link 
                href="/tracker" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/tracker' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                <Heart className="mr-1 h-4 w-4 text-rose-500" /> Health Tracker
              </Link>
            </li>
            <li>
              <Link 
                href="/games" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/games' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                <Brain className="mr-1 h-4 w-4 text-purple-500" /> Health Games
              </Link>
            </li>
            <li>
              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/shop' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold block py-1`}
              >
                {t('navbar.shop', 'Shop')}
              </Link>
            </li>
            <li>
              <Link 
                href="/yojanas" 
                onClick={() => setIsMenuOpen(false)}
                className={`${location === '/yojanas' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold py-1 flex items-center`}
              >
                <Building2 className="mr-1 h-4 w-4 text-blue-500" />
                {t('navbar.yojanas', 'Government Schemes')}
              </Link>
            </li>
             <li>
              <Button 
                onClick={() => {
                  setIsAskSakhiiOpen(true);
                  setIsMenuOpen(false);
                }}
                variant="secondary" 
                className="w-full mt-2 bg-rose-500 text-white hover:bg-rose-600 font-semibold flex items-center justify-center"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                Ask Sakhii
              </Button>
            </li>

            <li className="pt-2 border-t">
              <Link 
                href="/sign-in" 
                onClick={() => setIsMenuOpen(false)}
                className="text-primary font-medium block py-1"
              >
                {t('navbar.signIn')}
              </Link>
            </li>
  
            <li>
              <Link 
                href="/sign-up" 
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-600 hover:text-primary block py-1"
              >
                {t('navbar.signUp')}
              </Link>
            </li>
            <li className="pt-2">
              <div className="py-1">
                <LanguageSelector />
              </div>
            </li>
            
          </ul>
        </div>
      )}
      
      {/* Ask Sakhii Modal */}
      <AskSakhiiModal 
        isOpen={isAskSakhiiOpen} 
        onClose={() => setIsAskSakhiiOpen(false)} 
      />
    </header>
  );
};

export default Navbar;