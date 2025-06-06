import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from "lucide-react";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { EducationalResource } from "@shared/schema";
import { useTranslation } from 'react-i18next';

const EducationalResources = () => {
  const { t } = useTranslation();
  
  const { data: resources, isLoading, error } = useQuery<EducationalResource[]>({
    queryKey: ['/api/educationalResources'],
    refetchOnWindowFocus: false
  });

  const articles = [
    {
      title: 'Understanding PCOS',
      readTime: '5 min read'
    },
    {
      title: 'Menopause: Truth & Myths',
      readTime: '7 min read'
    },
    {
      title: 'Fertility After 35',
      readTime: '8 min read'
    }
  ];

  const experts = [
    {
      name: 'Dr. Sarah Green',
      article: 'Managing hormonal imbalance with nutrition',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60',
      initials: 'SG'
    },
    {
      name: 'Dr. Emily Chen',
      article: 'The future of reproductive health technology',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&auto=format&fit=crop&q=60',
      initials: 'EC'
    }
  ];

  // Function to render resource cards
  const renderResourceCards = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <Card key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-neutral-200 animate-pulse" />
          <CardContent className="p-5">
            <div className="h-5 bg-neutral-200 w-3/4 rounded animate-pulse mb-2" />
            <div className="h-4 bg-neutral-200 w-full rounded animate-pulse mb-2" />
            <div className="h-4 bg-neutral-200 w-2/3 rounded animate-pulse mb-3" />
            <div className="h-4 bg-neutral-200 w-1/3 rounded animate-pulse" />
          </CardContent>
        </Card>
      ));
    }

    if (error) {
      return (
        <div className="col-span-3 text-center p-4">
          <p className="text-red-500">{t('home.education.failedToLoad')}</p>
        </div>
      );
    }

    if (!resources || resources.length === 0) {
      return (
        <div className="col-span-3 text-center p-4">
          <p className="text-neutral-600">No resources available</p>
        </div>
      );
    }

    return resources.map((resource) => (
      <Card key={resource.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-48 bg-neutral-200 flex items-center justify-center">
          <span className="text-neutral-600">{t('common.image')}</span>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-2">{resource.title}</h3>
          <p className="text-sm text-neutral-600 mb-3">{resource.description}</p>
          <a href="#" className="text-sm text-primary hover:underline">{t('home.education.readMore')}</a>
        </CardContent>
      </Card>
    ));
  };

  return (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-heading">
          {t('home.education.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {renderResourceCards()}
        </div>
        
        <h3 className="text-2xl font-semibold mb-6 font-heading">
          {t('home.education.libraryTitle')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-primary mb-3">
              {t('home.education.latestArticles')}
            </h4>
            <ul className="space-y-3">
              {articles.map((article, idx) => (
                <li key={idx} className="flex items-start">
                  <FileText className="text-primary mt-1 mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">{t(`home.education.articles.${idx}.title`)}</p>
                    <p className="text-sm text-neutral-600">{t('home.education.readTime', { time: article.readTime })}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">
              {t('home.education.featuredTopics')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_CATEGORIES.map((category, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {t(`education.categories.${category.toLowerCase().replace(/\s/g, '')}`)}
                </Badge>
              ))}
              <Badge variant="outline" className="bg-white">{t('home.education.topics.nutrition')}</Badge>
              <Badge variant="outline" className="bg-white">{t('home.education.topics.mentalHealth')}</Badge>
              <Badge variant="outline" className="bg-white">{t('home.education.topics.sexualHealth')}</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">
              {t('home.education.expertBlogs')}
            </h4>
            <div className="space-y-3">
              {experts.map((expert, idx) => (
                <div key={idx} className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={expert.image} />
                    <AvatarFallback>{expert.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{expert.name}</p>
                    <p className="text-sm text-neutral-600">
                      {t('home.education.latest')}: {t(`home.education.expertArticles.${idx}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationalResources;
