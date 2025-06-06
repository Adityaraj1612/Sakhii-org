import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  height: z.string().optional(),
  weight: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      height: user?.height?.toString() || '',
      weight: user?.weight?.toString() || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Parse height and weight to numbers if present
      const height = data.height ? parseFloat(data.height) : null;
      const weight = data.weight ? parseFloat(data.weight) : null;
      
      const success = await updateProfile({
        fullName: data.fullName,
        email: data.email,
        height: height,
        weight: weight,
      });
      
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('profile.updateErrorTitle'),
        description: t('profile.updateErrorMessage'),
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>{t('auth.signIn')}</CardTitle>
            <CardDescription>{t('auth.noAccount')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground">{t('profile.personalInfo')}</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">{t('profile.personalInfo')}</TabsTrigger>
            <TabsTrigger value="health">{t('profile.healthInformation')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  <CardDescription>{t('profile.personalInfo')}</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>{t('profile.edit')}</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t('profile.save')}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.profilePicture || ''} alt={user.fullName} />
                      <AvatarFallback className="text-2xl">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        {t('profile.changeProfilePicture')}
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.fullName')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.email')}</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{t('profile.fullName')}</p>
                          <p className="text-base">{user.fullName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{t('profile.email')}</p>
                          <p className="text-base">{user.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{t('profile.username')}</p>
                          <p className="text-base">{user.username}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{t('profile.dateOfBirth')}</p>
                          <p className="text-base">{user.dateOfBirth || '-'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.healthInformation')}</CardTitle>
                <CardDescription>{t('healthMetrics.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.height')}</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder={t('profile.heightPlaceholder')} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.weight')}</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder={t('profile.weightPlaceholder')} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('profile.height')}</p>
                        <p className="text-base">{user.height ? `${user.height} cm` : '-'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('profile.weight')}</p>
                        <p className="text-base">{user.weight ? `${user.weight} kg` : '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>{t('profile.edit')}</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t('profile.save')}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}