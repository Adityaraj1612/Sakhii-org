import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'default' | 'navbar';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
  const { t, i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: t('languages.english') },
    { code: 'hi', name: t('languages.hindi') },
    { code: 'bn', name: t('languages.bengali') },
    { code: 'ta', name: t('languages.tamil') },
    { code: 'te', name: t('languages.telugu') },
    { code: 'mr', name: t('languages.marathi') },
    { code: 'gu', name: t('languages.gujarati') },
    { code: 'kn', name: t('languages.kannada') },
    { code: 'ml', name: t('languages.malayalam') },
    { code: 'pa', name: t('languages.punjabi') },
    { code: 'or', name: t('languages.odia') }
  ];
  
  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('language', languageCode);
      
      // Show success notification
      setTimeout(() => {
        const event = new CustomEvent('showLanguageChangeToast', {
          detail: { 
            language: languages.find(l => l.code === languageCode)?.name || languageCode,
            success: true
          }
        });
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  if (variant === 'navbar') {
    return (
      <div className="flex items-center">
        <Select
          value={i18n.language}
          onValueChange={changeLanguage}
        >
          <SelectTrigger className="w-10 h-10 p-0 border-none bg-transparent hover:bg-gray-100/30 flex items-center justify-center rounded-full">
            <Globe className="h-5 w-5 text-gray-600" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={i18n.language}
        onValueChange={changeLanguage}
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder={t('languages.language')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;