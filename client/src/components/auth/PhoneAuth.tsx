import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setupRecaptcha, signInWithPhone, verifyOTP } from "@/lib/firebase";
import { ConfirmationResult } from "firebase/auth";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

interface PhoneAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PhoneAuth = ({ onSuccess, onCancel }: PhoneAuthProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up any existing recaptcha
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }
  }, []);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" }
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  const sendOTP = async (data: PhoneFormValues) => {
    setIsLoading(true);
    try {
      // Clean up any existing recaptcha first
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
      
      // Set up reCAPTCHA
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      
      // Format phone number (ensure it starts with +)
      const formattedPhone = data.phoneNumber.startsWith('+') 
        ? data.phoneNumber 
        : `+1${data.phoneNumber}`;
      
      // Send OTP via Firebase
      const result = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setPhoneNumber(formattedPhone);
      setStep('otp');
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhone}`,
      });
    } catch (error: any) {
      console.error('Phone auth error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/unauthorized-domain') {
        toast({
          title: "Domain Authorization Required",
          description: "Please add this domain to Firebase authorized domains in the console.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/invalid-app-credential' || error.code === 'auth/configuration-not-found') {
        // Fallback to demo mode for development
        setPhoneNumber(data.phoneNumber);
        setStep('otp');
        toast({
          title: "Demo Mode",
          description: "Using demo OTP (123456) - Add domain to Firebase console for production",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPCode = async (data: OTPFormValues) => {
    setIsLoading(true);
    try {
      if (confirmationResult) {
        // Use Firebase verification
        await verifyOTP(confirmationResult, data.otp);
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified!",
        });
        onSuccess();
      } else {
        // Fallback demo verification
        if (data.otp === "123456") {
          toast({
            title: "Phone Verified (Demo)",
            description: "Your phone number has been successfully verified!",
          });
          onSuccess();
        } else {
          toast({
            title: "Invalid OTP",
            description: "The OTP you entered is incorrect. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MessageSquare className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <CardTitle>Enter Verification Code</CardTitle>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit code to {phoneNumber}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(verifyOTPCode)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter 6-digit code" 
                        className="text-center text-lg tracking-wider"
                        maxLength={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setStep('phone')}
                >
                  Change Phone Number
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                Demo: Use code "123456" for testing
              </p>
            </form>
          </Form>
          <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Phone className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <CardTitle>Sign in with Phone</CardTitle>
        <p className="text-sm text-gray-600">
          Enter your phone number to receive a verification code
        </p>
      </CardHeader>
      <CardContent>
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(sendOTP)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="tel"
                        placeholder="+1 (555) 123-4567" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={onCancel}
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        </Form>
        <div id="recaptcha-container"></div>
      </CardContent>
    </Card>
  );
};

export default PhoneAuth;