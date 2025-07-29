import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useLanguageNotification = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { language, success } = event.detail;
      
      if (success) {
        toast({
          title: "Language Changed",
          description: `Website language changed to ${language}`,
          duration: 3000,
        });
      }
    };

    // Listen for language change events
    window.addEventListener('showLanguageChangeToast', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('showLanguageChangeToast', handleLanguageChange as EventListener);
    };
  }, [toast, t]);
};

export default useLanguageNotification;