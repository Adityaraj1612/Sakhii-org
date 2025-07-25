import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Heart, Search, Filter, X } from "lucide-react";
import Cart from "@/components/ecommerce/Cart";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
  featured: boolean;
}

const healthProducts: Product[] = [
  {
    id: 1,
    name: "Organic Cotton Menstrual Pads",
    nameHi: "ऑर्गेनिक कॉटन मासिक धर्म पैड",
    description: "100% organic cotton pads for comfortable periods",
    descriptionHi: "आरामदायक पीरियड्स के लिए 100% ऑर्गेनिक कॉटन पैड",
    price: 299,
    category: "menstrual-care",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Menstrual Cup - Medical Grade Silicone",
    nameHi: "मासिक धर्म कप - मेडिकल ग्रेड सिलिकॉन",
    description: "Eco-friendly menstrual cup for 12-hour protection",
    descriptionHi: "12 घंटे की सुरक्षा के लिए पर्यावरण-अनुकूल मासिक धर्म कप",
    price: 899,
    category: "menstrual-care",
    image: "/api/placeholder/300/300",
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Natural Feminine Hygiene Wash",
    nameHi: "प्राकृतिक स्त्री स्वच्छता वॉश",
    description: "pH balanced intimate wash with natural ingredients",
    descriptionHi: "प्राकृतिक सामग्री के साथ pH संतुलित अंतरंग वॉश",
    price: 199,
    category: "hygiene",
    image: "/api/placeholder/300/300",
    rating: 4.6,
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: "Iron & Folic Acid Tablets",
    nameHi: "आयरन और फोलिक एसिड टैबलेट",
    description: "Essential vitamins for women's health and energy",
    descriptionHi: "महिलाओं के स्वास्थ्य और ऊर्जा के लिए आवश्यक विटामिन",
    price: 450,
    category: "supplements",
    image: "/api/placeholder/300/300",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: 5,
    name: "Prenatal Multivitamin",
    nameHi: "प्रसवपूर्व मल्टीविटामिन",
    description: "Complete nutrition support for expecting mothers",
    descriptionHi: "गर्भवती माताओं के लिए पूर्ण पोषण सहायता",
    price: 650,
    category: "supplements",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "Heating Pad for Period Pain",
    nameHi: "पीरियड दर्द के लिए हीटिंग पैड",
    description: "Electric heating pad for menstrual cramp relief",
    descriptionHi: "मासिक धर्म की ऐंठन से राहत के लिए इलेक्ट्रिक हीटिंग पैड",
    price: 1299,
    category: "pain-relief",
    image: "/api/placeholder/300/300",
    rating: 4.5,
    inStock: true,
    featured: false
  }
];

const categories = [
  { value: "all", label: "All Products", labelHi: "सभी उत्पाद" },
  { value: "menstrual-care", label: "Menstrual Care", labelHi: "मासिक धर्म देखभाल" },
  { value: "hygiene", label: "Hygiene", labelHi: "स्वच्छता" },
  { value: "supplements", label: "Supplements", labelHi: "पूरक आहार" },
  { value: "pain-relief", label: "Pain Relief", labelHi: "दर्द निवारण" }
];

interface CartItem {
  id: number;
  name: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

const Shop = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const currentLanguage = i18n.language.startsWith('hi') ? 'hi' : 'en';

  const filteredProducts = healthProducts.filter(product => {
    const matchesSearch = currentLanguage === 'hi' 
      ? product.nameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descriptionHi.toLowerCase().includes(searchTerm.toLowerCase())
      : product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "featured": return b.featured ? 1 : -1;
      default: return 0;
    }
  });

  const addToCart = (productId: number) => {
    const product = healthProducts.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          nameHi: product.nameHi,
          price: product.price,
          quantity: 1,
          image: product.image
        }];
      }
    });

    toast({
      title: currentLanguage === 'hi' ? 'कार्ट में जोड़ा गया' : 'Added to Cart',
      description: currentLanguage === 'hi' ? product.nameHi : product.name,
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return currentLanguage === 'hi' ? `₹${price}` : `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Information */}
      <title>Sakhii Shop - Health & Hygiene Products for Women | सखी शॉप</title>
      <meta name="description" content="Shop authentic health and hygiene products for women at Sakhii. Menstrual care, supplements, and wellness products with free delivery | सखी पर महिलाओं के लिए प्रामाणिक स्वास्थ्य और स्वच्छता उत्पाद खरीदें" />

      {/* Header */}
      <div className="bg-rose-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {currentLanguage === 'hi' ? 'सखी स्वास्थ्य शॉप' : 'Sakhii Health Shop'}
          </h1>
          <p className="text-xl opacity-90">
            {currentLanguage === 'hi' 
              ? 'महिलाओं के लिए प्रामाणिक स्वास्थ्य और स्वच्छता उत्पाद'
              : 'Authentic health and hygiene products for women'
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={currentLanguage === 'hi' ? 'उत्पाद खोजें...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={currentLanguage === 'hi' ? 'श्रेणी चुनें' : 'Select Category'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {currentLanguage === 'hi' ? category.labelHi : category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={currentLanguage === 'hi' ? 'क्रमबद्ध करें' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  {currentLanguage === 'hi' ? 'फ़ीचर्ड' : 'Featured'}
                </SelectItem>
                <SelectItem value="price-low">
                  {currentLanguage === 'hi' ? 'कम कीमत' : 'Price: Low to High'}
                </SelectItem>
                <SelectItem value="price-high">
                  {currentLanguage === 'hi' ? 'अधिक कीमत' : 'Price: High to Low'}
                </SelectItem>
                <SelectItem value="rating">
                  {currentLanguage === 'hi' ? 'रेटिंग' : 'Rating'}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-600"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {getTotalCartItems()} {currentLanguage === 'hi' ? 'आइटम' : 'items'}
              </span>
            </Button>
          </div>
        </div>

        {/* Featured Banner */}
        {filteredProducts.some(p => p.featured) && (
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {currentLanguage === 'hi' ? 'फ़ीचर्ड उत्पाद' : 'Featured Products'}
            </h2>
            <p className="opacity-90">
              {currentLanguage === 'hi' 
                ? 'हमारे सबसे लोकप्रिय और विश्वसनीय उत्पादों की खोज करें'
                : 'Discover our most popular and trusted products'
              }
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="relative">
                {product.featured && (
                  <Badge className="absolute top-2 right-2 bg-rose-500">
                    {currentLanguage === 'hi' ? 'फ़ीचर्ड' : 'Featured'}
                  </Badge>
                )}
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={currentLanguage === 'hi' ? product.nameHi : product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45MSAxMDAgMTEwIDExNy45MSAxMTAgMTQwQzExMCAxNjIuMDkgMTI3LjkxIDE4MCAxNTAgMTgwQzE3Mi4wOSAxODAgMTkwIDE2Mi4wOSAxOTAgMTQwQzE5MCAxMTcuOTEgMTcyLjA5IDEwMCAxNTAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                    }}
                  />
                </div>
                <CardTitle className="text-lg">
                  {currentLanguage === 'hi' ? product.nameHi : product.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {currentLanguage === 'hi' ? product.descriptionHi : product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-rose-600">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                {!product.inStock && (
                  <Badge variant="secondary" className="mb-4">
                    {currentLanguage === 'hi' ? 'स्टॉक में नहीं' : 'Out of Stock'}
                  </Badge>
                )}
              </CardContent>
              
              <CardFooter className="gap-2">
                <Button 
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {currentLanguage === 'hi' ? 'कार्ट में डालें' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className={wishlist.includes(product.id) ? 'text-rose-600 border-rose-600' : ''}
                >
                  <Heart className="h-4 w-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {currentLanguage === 'hi' 
                ? 'कोई उत्पाद नहीं मिला। कृपया अपनी खोज को समायोजित करें।'
                : 'No products found. Please adjust your search or filters.'
              }
            </p>
          </div>
        )}

        {/* Trust Badges */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold">
                {currentLanguage === 'hi' ? 'मुफ़्त डिलीवरी' : 'Free Delivery'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'hi' ? '₹500+ ऑर्डर पर' : 'On orders ₹500+'}
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold">
                {currentLanguage === 'hi' ? 'सुरक्षित भुगतान' : 'Secure Payment'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'hi' ? '100% सुरक्षित' : '100% Safe'}
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold">
                {currentLanguage === 'hi' ? 'प्रामाणिक उत्पाद' : 'Authentic Products'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'hi' ? 'गुणवत्ता की गारंटी' : 'Quality Assured'}
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">📞</div>
              <h3 className="font-semibold">
                {currentLanguage === 'hi' ? '24/7 सहायता' : '24/7 Support'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'hi' ? 'हमेशा उपलब्ध' : 'Always Available'}
              </p>
            </div>
          </div>
        </div>

        {/* Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {currentLanguage === 'hi' ? 'आपका कार्ट' : 'Your Cart'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClose={() => setIsCartOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Shop;