import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClose: () => void;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClose }: CartProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const currentLanguage = i18n.language.startsWith('hi') ? 'hi' : 'en';
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof CheckoutFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: currentLanguage === 'hi' ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: currentLanguage === 'hi' ? "ऑर्डर सफल!" : "Order Successful!",
        description: currentLanguage === 'hi' 
          ? "आपका ऑर्डर दे दिया गया है। 2-3 दिन में डिलीवरी होगी।"
          : "Your order has been placed. Delivery in 2-3 days.",
      });
      onClose();
    }, 3000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'hi' ? 'आपका कार्ट खाली है' : 'Your cart is empty'}
        </h3>
        <p className="text-gray-600 mb-4">
          {currentLanguage === 'hi' 
            ? 'कुछ उत्पाद जोड़ें और खरीदारी शुरू करें'
            : 'Add some products to start shopping'
          }
        </p>
        <Button onClick={onClose}>
          {currentLanguage === 'hi' ? 'खरीदारी जारी रखें' : 'Continue Shopping'}
        </Button>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {currentLanguage === 'hi' ? 'चेकआउट' : 'Checkout'}
          </h2>
          <Button variant="outline" onClick={() => setShowCheckout(false)}>
            {currentLanguage === 'hi' ? 'वापस जाएं' : 'Back to Cart'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentLanguage === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">
                      {currentLanguage === 'hi' ? item.nameHi : item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'मात्रा' : 'Quantity'}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{currentLanguage === 'hi' ? 'उप-योग' : 'Subtotal'}:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentLanguage === 'hi' ? 'शिपिंग' : 'Shipping'}:</span>
                  <span>{shipping === 0 ? (currentLanguage === 'hi' ? 'मुफ़्त' : 'Free') : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{currentLanguage === 'hi' ? 'कुल' : 'Total'}:</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentLanguage === 'hi' ? 'डिलीवरी जानकारी' : 'Delivery Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    {currentLanguage === 'hi' ? 'पहला नाम' : 'First Name'} *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    {currentLanguage === 'hi' ? 'अंतिम नाम' : 'Last Name'} *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">
                  {currentLanguage === 'hi' ? 'ईमेल' : 'Email'} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  {currentLanguage === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">
                  {currentLanguage === 'hi' ? 'पूरा पता' : 'Full Address'} *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">
                    {currentLanguage === 'hi' ? 'शहर' : 'City'} *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">
                    {currentLanguage === 'hi' ? 'राज्य' : 'State'} *
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">
                  {currentLanguage === 'hi' ? 'पिन कोड' : 'Pin Code'} *
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">
                  {currentLanguage === 'hi' ? 'भुगतान विधि' : 'Payment Method'} *
                </Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'hi' ? 'भुगतान विधि चुनें' : 'Select payment method'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">
                      {currentLanguage === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery (COD)'}
                    </SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="card">
                      {currentLanguage === 'hi' ? 'क्रेडिट/डेबिट कार्ड' : 'Credit/Debit Card'}
                    </SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-rose-600 hover:bg-rose-700"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {currentLanguage === 'hi' ? 'प्रोसेसिंग...' : 'Processing...'}
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {currentLanguage === 'hi' ? 'ऑर्डर दें' : 'Place Order'} - ₹{total}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          {currentLanguage === 'hi' ? 'आपका कार्ट' : 'Your Cart'}
        </h2>
        <Button variant="outline" onClick={onClose}>
          {currentLanguage === 'hi' ? 'खरीदारी जारी रखें' : 'Continue Shopping'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={currentLanguage === 'hi' ? item.nameHi : item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyNkMzNC40NzcyIDI2IDMwIDMwLjQ3NzIgMzAgMzZDMzAgNDEuNTIyOCAzNC40NzcyIDQ2IDQwIDQ2QzQ1LjUyMjggNDYgNTAgNDEuNTIyOCA1MCAzNkM1MCAzMC40NzcyIDQ1LjUyMjggMjYgNDAgMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {currentLanguage === 'hi' ? item.nameHi : item.name}
                    </h3>
                    <p className="text-rose-600 font-bold text-lg">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 border rounded">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {currentLanguage === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{currentLanguage === 'hi' ? 'उप-योग' : 'Subtotal'}:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{currentLanguage === 'hi' ? 'शिपिंग' : 'Shipping'}:</span>
                <span>{shipping === 0 ? (currentLanguage === 'hi' ? 'मुफ़्त' : 'Free') : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' 
                    ? `₹${500 - subtotal} और खरीदें मुफ़्त डिलीवरी के लिए`
                    : `Spend ₹${500 - subtotal} more for free delivery`
                  }
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{currentLanguage === 'hi' ? 'कुल' : 'Total'}:</span>
                <span>₹{total}</span>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2" />
                  {currentLanguage === 'hi' ? '2-3 दिन में डिलीवरी' : 'Delivery in 2-3 days'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Badge variant="secondary" className="mr-2">COD</Badge>
                  {currentLanguage === 'hi' ? 'कैश ऑन डिलीवरी उपलब्ध' : 'Cash on Delivery Available'}
                </div>
              </div>

              <Button
                className="w-full bg-rose-600 hover:bg-rose-700"
                onClick={() => setShowCheckout(true)}
              >
                {currentLanguage === 'hi' ? 'चेकआउट करें' : 'Proceed to Checkout'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;