import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { 
  auth, 
  createUser, 
  loginUser, 
  logoutUser, 
  updateUserProfile, 
  subscribeToAuthChanges 
} from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  profilePicture: string | null;
  height?: number | null;
  weight?: number | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // Get the user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'uid'>;
            setUser({
              uid: firebaseUser.uid,
              ...userData
            });
          } else {
            // If no user document exists yet, create a basic one
            const newUser: Omit<User, 'uid'> = {
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || '',
              dateOfBirth: null,
              profilePicture: firebaseUser.photoURL,
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser({ uid: firebaseUser.uid, ...newUser });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await loginUser(email, password);
      toast({
        title: t('auth.successTitle'),
        description: t('auth.successMessage'),
      });
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: t('auth.errorTitle'),
        description: error.message || t('auth.errorMessage'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; fullName: string; dateOfBirth?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUser(userData.email, userData.password);
      const firebaseUser = userCredential.user;
      
      // Update displayName
      await updateUserProfile(firebaseUser, { displayName: userData.fullName });
      
      // Create user document in Firestore
      const userDoc = {
        email: userData.email,
        fullName: userData.fullName,
        dateOfBirth: userData.dateOfBirth || null,
        profilePicture: null,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      
      toast({
        title: t('auth.signUpSuccessTitle'),
        description: t('auth.signUpSuccessMessage'),
      });
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t('auth.signUpErrorTitle'),
        description: error.message || t('auth.signUpErrorMessage'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user || !auth.currentUser) throw new Error('User not authenticated');
      
      // Update values in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, userData);
      
      // If there's a display name update, update it in Firebase Auth
      if (userData.fullName) {
        await updateUserProfile(auth.currentUser, { displayName: userData.fullName });
      }
      
      // If there's a profile picture update, update it in Firebase Auth
      if (userData.profilePicture) {
        await updateUserProfile(auth.currentUser, { photoURL: userData.profilePicture });
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      toast({
        title: t('profile.updateSuccessTitle'),
        description: t('profile.updateSuccessMessage'),
      });
      
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: t('profile.updateErrorTitle'),
        description: error.message || t('profile.updateErrorMessage'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setLocation('/');
      toast({
        title: t('auth.logoutSuccessTitle'),
        description: t('auth.logoutSuccessMessage'),
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: error.message || 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};