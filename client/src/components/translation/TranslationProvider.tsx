import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  translatePage: () => void;
  availableLanguages: Language[];
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    // Save language preference
    localStorage.setItem('preferred-language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      
      // If changing to a language other than English, translate the page content
      if (language !== 'en') {
        setTimeout(() => translatePage(), 500);
      }
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  const translatePage = () => {
    // This function can be used to trigger additional translation for dynamic content
    // For now, we'll let i18next handle the static translations
    const event = new CustomEvent('languageChanged', { 
      detail: { language: currentLanguage } 
    });
    window.dispatchEvent(event);
  };

  const value: TranslationContextType = {
    currentLanguage,
    changeLanguage,
    translatePage,
    availableLanguages,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;