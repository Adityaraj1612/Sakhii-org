import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/logo";
import LanguageSelector from "@/components/ui/language-selector";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Logo size="sm" />
          </div>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/doctors"
                className={`${location === '/doctors' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold`}
              >
                {t('navbar.doctors')}
              </Link>
            </li>
            <li>
              <Link
                href="/education"
                className={`${location === '/education' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold`}
              >
                {t('navbar.education')}
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                className={`${location === '/library' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold`}
              >
                {t('navbar.library')}
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className={`${location === '/community' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold`}
              >
                {t('navbar.community')}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`${location === '/contact' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold`}
              >
                {t('navbar.contact')}
              </Link>
            </li>
            <li>
              <Link
                href="/tracker"
                className={`${location === '/tracker' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold flex items-center`}
              >
                <Heart className="mr-1 h-4 w-4 text-rose-500" /> Health Tracker
              </Link>
            </li>
            <li>
              <Link
                href="/games"
                className={`${location === '/games' ? 'text-primary' : 'text-neutral-600'} hover:text-primary font-semibold flex items-center`}
              >
                <Brain className="mr-1 h-4 w-4 text-purple-500" /> Health Games
              </Link>
            </li>
            <li>
              <a
                href="https://elevenlabs.io/app/talk-to?agent_id=gXXbKfP9XqgHho0VO58k"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="bg-rose-500 text-white hover:bg-rose-600 font-semibold">
                  Saathi
                </Button>
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-3">
          <LanguageSelector variant="navbar" />
          <Link href="/sign-in">
            <Button variant="default" size="sm" className="font-semibold">
              {t('navbar.signIn')}
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm" className="font-semibold">
              {t('navbar.signUp')}
            </Button>
          </Link>
          <button className="md:hidden text-neutral-800" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <ul className="space-y-3">
            <li><Link href="/doctors" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1">{t('navbar.doctors')}</Link></li>
            <li><Link href="/education" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1">{t('navbar.education')}</Link></li>
            <li><Link href="/library" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1">{t('navbar.library')}</Link></li>
            <li><Link href="/community" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1">{t('navbar.community')}</Link></li>
            <li><Link href="/contact" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1">{t('navbar.contact')}</Link></li>
            <li><Link href="/tracker" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1 flex items-center"><Heart className="mr-1 h-4 w-4 text-rose-500" /> Health Tracker</Link></li>
            <li><Link href="/games" onClick={() => setIsMenuOpen(false)} className="font-semibold text-neutral-600 hover:text-primary block py-1 flex items-center"><Brain className="mr-1 h-4 w-4 text-purple-500" /> Health Games</Link></li>
            <li className="pt-2 border-t"><Link href="/sign-in" onClick={() => setIsMenuOpen(false)} className="text-primary font-semibold block py-1">{t('navbar.signIn')}</Link></li>
            <li><Link href="/sign-up" onClick={() => setIsMenuOpen(false)} className="text-neutral-600 font-semibold hover:text-primary block py-1">{t('navbar.signUp')}</Link></li>
            <li className="pt-2"><div className="py-1"><LanguageSelector /></div></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
