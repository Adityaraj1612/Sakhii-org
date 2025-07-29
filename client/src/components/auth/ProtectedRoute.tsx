import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ children, requireProfile = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/sign-in');
    }
  }, [user, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin h-16 w-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-600">Checking your authentication status</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Lock className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access this page</p>
            <Button onClick={() => setLocation('/sign-in')} className="bg-pink-500 hover:bg-pink-600">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if profile completion is required
  if (requireProfile && (!user.dateOfBirth || !user.height || !user.weight)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
            <p className="text-gray-600 mb-4">Please complete your profile to access this feature</p>
            <Button onClick={() => setLocation('/profile')} className="bg-pink-500 hover:bg-pink-600">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;