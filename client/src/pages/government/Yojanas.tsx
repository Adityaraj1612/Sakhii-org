import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Heart, Users, GraduationCap, Home, Baby, Shield } from "lucide-react";

interface YojanaScheme {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  benefits: string[];
  benefitsHindi: string[];
  eligibility: string[];
  eligibilityHindi: string[];
  documents: string[];
  documentsHindi: string[];
  category: string;
  ministry: string;
  ministryHindi: string;
  officialWebsite: string;
  applicationProcess: string;
  applicationProcessHindi: string;
  icon: React.ReactNode;
}

// Authentic government schemes for women from official sources
const GOVERNMENT_SCHEMES: YojanaScheme[] = [
  {
    id: "pradhan-mantri-matru-vandana-yojana",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    nameHindi: "प्रधानमंत्री मातृ वंदना योजना",
    description: "Maternity benefit programme for pregnant women and lactating mothers",
    descriptionHindi: "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं के लिए मातृत्व लाभ कार्यक्रम",
    benefits: [
      "₹5,000 cash incentive in three installments",
      "Better nutrition during pregnancy and lactation",
      "Compensation for wage loss",
      "Institutional delivery promotion"
    ],
    benefitsHindi: [
      "तीन किश्तों में ₹5,000 नकद प्रोत्साहन",
      "गर्भावस्था और स्तनपान के दौरान बेहतर पोषण",
      "मजदूरी हानि के लिए मुआवजा",
      "संस्थागत प्रसव को बढ़ावा"
    ],
    eligibility: [
      "All pregnant women and lactating mothers",
      "Excluding female government employees",
      "First live birth only",
      "Age 19 years or above"
    ],
    eligibilityHindi: [
      "सभी गर्भवती महिलाएं और स्तनपान कराने वाली माताएं",
      "महिला सरकारी कर्मचारियों को छोड़कर",
      "केवल पहला जीवित जन्म",
      "19 वर्ष या उससे अधिक आयु"
    ],
    documents: [
      "Aadhar card",
      "Bank account details",
      "MCP card",
      "Institutional delivery certificate"
    ],
    documentsHindi: [
      "आधार कार्ड",
      "बैंक खाता विवरण",
      "एमसीपी कार्ड",
      "संस्थागत प्रसव प्रमाणपत्र"
    ],
    category: "Maternal Health",
    ministry: "Ministry of Women and Child Development",
    ministryHindi: "महिला एवं बाल विकास मंत्रालय",
    officialWebsite: "https://pmmvy.wcd.gov.in/",
    applicationProcess: "Apply through Anganwadi Worker/ANM/ASHA at health facility",
    applicationProcessHindi: "स्वास्थ्य सुविधा में आंगनवाड़ी कार्यकर्ता/एएनएम/आशा के माध्यम से आवेदन करें",
    icon: <Baby className="h-8 w-8 text-pink-600" />
  },
  {
    id: "beti-bachao-beti-padhao",
    name: "Beti Bachao Beti Padhao",
    nameHindi: "बेटी बचाओ बेटी पढ़ाओ",
    description: "Multi-sectoral intervention to address declining Child Sex Ratio and women empowerment",
    descriptionHindi: "घटते बाल लिंगानुपात और महिला सशक्तिकरण के लिए बहु-क्षेत्रीय हस्तक्षेप",
    benefits: [
      "Improved Child Sex Ratio",
      "Education for girl children",
      "Women empowerment initiatives",
      "Awareness campaigns"
    ],
    benefitsHindi: [
      "बेहतर बाल लिंगानुपात",
      "बालिकाओं की शिक्षा",
      "महिला सशक्तिकरण पहल",
      "जागरूकता अभियान"
    ],
    eligibility: [
      "All girl children",
      "Focus on 640+ districts",
      "Community participation",
      "Multi-stakeholder approach"
    ],
    eligibilityHindi: [
      "सभी बालिकाएं",
      "640+ जिलों पर फोकस",
      "सामुदायिक भागीदारी",
      "बहु-हितधारक दृष्टिकोण"
    ],
    documents: [
      "Birth certificate",
      "School enrollment proof",
      "Identity documents",
      "Address proof"
    ],
    documentsHindi: [
      "जन्म प्रमाणपत्र",
      "स्कूल नामांकन प्रमाण",
      "पहचान दस्तावेज",
      "पता प्रमाण"
    ],
    category: "Girl Child Welfare",
    ministry: "Ministry of Women and Child Development",
    ministryHindi: "महिला एवं बाल विकास मंत्रालय",
    officialWebsite: "https://wcd.nic.in/bbbp-schemes",
    applicationProcess: "Contact district administration or visit official website",
    applicationProcessHindi: "जिला प्रशासन से संपर्क करें या आधिकारिक वेबसाइट पर जाएं",
    icon: <GraduationCap className="h-8 w-8 text-purple-600" />
  },
  {
    id: "one-stop-centre",
    name: "One Stop Centre (OSC) - Sakhi",
    nameHindi: "वन स्टॉप सेंटर - सखी",
    description: "Integrated support and assistance to women affected by violence",
    descriptionHindi: "हिंसा से प्रभावित महिलाओं को एकीकृत सहायता और सहायता",
    benefits: [
      "Medical assistance",
      "Legal aid and counseling",
      "Police assistance",
      "Temporary shelter if required"
    ],
    benefitsHindi: [
      "चिकित्सा सहायता",
      "कानूनी सहायता और परामर्श",
      "पुलिस सहायता",
      "आवश्यकता पड़ने पर अस्थायी आश्रय"
    ],
    eligibility: [
      "Women affected by violence",
      "All age groups",
      "Private and public violence cases",
      "24/7 emergency services"
    ],
    eligibilityHindi: [
      "हिंसा से प्रभावित महिलाएं",
      "सभी आयु समूह",
      "निजी और सार्वजनिक हिंसा के मामले",
      "24/7 आपातकालीन सेवाएं"
    ],
    documents: [
      "Identity proof",
      "Medical reports (if any)",
      "Police complaint (if filed)",
      "Address proof"
    ],
    documentsHindi: [
      "पहचान प्रमाण",
      "चिकित्सा रिपोर्ट (यदि कोई हो)",
      "पुलिस शिकायत (यदि दर्ज की गई हो)",
      "पता प्रमाण"
    ],
    category: "Women Safety",
    ministry: "Ministry of Women and Child Development",
    ministryHindi: "महिला एवं बाल विकास मंत्रालय",
    officialWebsite: "https://wcd.nic.in/schemes/one-stop-centre-scheme-sakhi",
    applicationProcess: "Visit nearest OSC or call helpline 181",
    applicationProcessHindi: "निकटतम OSC पर जाएं या हेल्पलाइन 181 पर कॉल करें",
    icon: <Shield className="h-8 w-8 text-red-600" />
  },
  {
    id: "pradhan-mantri-awas-yojana",
    name: "Pradhan Mantri Awas Yojana (Women)",
    nameHindi: "प्रधानमंत्री आवास योजना (महिला)",
    description: "Housing scheme with preference to women ownership",
    descriptionHindi: "महिला स्वामित्व को प्राथमिकता देने वाली आवास योजना",
    benefits: [
      "Subsidy up to ₹2.67 lakhs",
      "Women ownership preference",
      "Interest subsidy on home loans",
      "Affordable housing"
    ],
    benefitsHindi: [
      "₹2.67 लाख तक की सब्सिडी",
      "महिला स्वामित्व को प्राथमिकता",
      "होम लोन पर ब्याज सब्सिडी",
      "किफायती आवास"
    ],
    eligibility: [
      "EWS/LIG/MIG categories",
      "First-time home buyer",
      "Women ownership/co-ownership",
      "Income criteria applicable"
    ],
    eligibilityHindi: [
      "EWS/LIG/MIG श्रेणियां",
      "पहली बार घर खरीदार",
      "महिला स्वामित्व/सह-स्वामित्व",
      "आय मानदंड लागू"
    ],
    documents: [
      "Income certificate",
      "Identity and address proof",
      "Bank statements",
      "Property documents"
    ],
    documentsHindi: [
      "आय प्रमाणपत्र",
      "पहचान और पता प्रमाण",
      "बैंक स्टेटमेंट",
      "संपत्ति दस्तावेज"
    ],
    category: "Housing",
    ministry: "Ministry of Housing and Urban Affairs",
    ministryHindi: "आवासन और शहरी मामलों का मंत्रालय",
    officialWebsite: "https://pmaymis.gov.in/",
    applicationProcess: "Apply online through PMAY portal or Common Service Center",
    applicationProcessHindi: "PMAY पोर्टल या कॉमन सर्विस सेंटर के माध्यम से ऑनलाइन आवेदन करें",
    icon: <Home className="h-8 w-8 text-green-600" />
  },
  {
    id: "mahila-shakti-kendra",
    name: "Mahila Shakti Kendra (MSK)",
    nameHindi: "महिला शक्ति केंद्र",
    description: "Women empowerment program in rural areas",
    descriptionHindi: "ग्रामीण क्षेत्रों में महिला सशक्तिकरण कार्यक्रम",
    benefits: [
      "Skill development training",
      "Digital literacy",
      "Health and nutrition awareness",
      "Employment opportunities"
    ],
    benefitsHindi: [
      "कौशल विकास प्रशिक्षण",
      "डिजिटल साक्षरता",
      "स्वास्थ्य और पोषण जागरूकता",
      "रोजगार के अवसर"
    ],
    eligibility: [
      "Rural women (14-45 years)",
      "All social categories",
      "Preference to SCs/STs/Minorities",
      "Community participation"
    ],
    eligibilityHindi: [
      "ग्रामीण महिलाएं (14-45 वर्ष)",
      "सभी सामाजिक श्रेणियां",
      "SC/ST/अल्पसंख्यकों को प्राथमिकता",
      "सामुदायिक भागीदारी"
    ],
    documents: [
      "Age proof",
      "Residence proof",
      "Caste certificate (if applicable)",
      "Bank account details"
    ],
    documentsHindi: [
      "आयु प्रमाण",
      "निवास प्रमाण",
      "जाति प्रमाणपत्र (यदि लागू हो)",
      "बैंक खाता विवरण"
    ],
    category: "Women Empowerment",
    ministry: "Ministry of Women and Child Development",
    ministryHindi: "महिला एवं बाल विकास मंत्रालय",
    officialWebsite: "https://wcd.nic.in/schemes/mahila-shakti-kendra-msk",
    applicationProcess: "Contact Block/District office or visit Anganwadi centers",
    applicationProcessHindi: "ब्लॉक/जिला कार्यालय से संपर्क करें या आंगनवाड़ी केंद्रों पर जाएं",
    icon: <Users className="h-8 w-8 text-orange-600" />
  },
  {
    id: "janani-suraksha-yojana",
    name: "Janani Suraksha Yojana (JSY)",
    nameHindi: "जननी सुरक्षा योजना",
    description: "Safe motherhood intervention for poor pregnant women",
    descriptionHindi: "गरीब गर्भवती महिलाओं के लिए सुरक्षित मातृत्व हस्तक्षेप",
    benefits: [
      "Cash assistance for institutional delivery",
      "₹1,400 for rural areas",
      "₹1,000 for urban areas",
      "Free delivery and post-natal care"
    ],
    benefitsHindi: [
      "संस्थागत प्रसव के लिए नकद सहायता",
      "ग्रामीण क्षेत्रों के लिए ₹1,400",
      "शहरी क्षेत्रों के लिए ₹1,000",
      "मुफ्त प्रसव और प्रसव के बाद की देखभाल"
    ],
    eligibility: [
      "BPL pregnant women",
      "All SC/ST women",
      "Age 19 years and above",
      "Institutional delivery mandatory"
    ],
    eligibilityHindi: [
      "बीपीएल गर्भवती महिलाएं",
      "सभी SC/ST महिलाएं",
      "19 वर्ष और उससे अधिक आयु",
      "संस्थागत प्रसव अनिवार्य"
    ],
    documents: [
      "BPL card or caste certificate",
      "Pregnancy registration card",
      "Bank account details",
      "Identity proof"
    ],
    documentsHindi: [
      "बीपीएल कार्ड या जाति प्रमाणपत्र",
      "गर्भावस्था पंजीकरण कार्ड",
      "बैंक खाता विवरण",
      "पहचान प्रमाण"
    ],
    category: "Maternal Health",
    ministry: "Ministry of Health and Family Welfare",
    ministryHindi: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
    officialWebsite: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=841&lid=309",
    applicationProcess: "Register at nearest health facility during pregnancy",
    applicationProcessHindi: "गर्भावस्था के दौरान निकटतम स्वास्थ्य सुविधा में पंजीकरण कराएं",
    icon: <Heart className="h-8 w-8 text-red-500" />
  }
];

export default function Yojanas() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { value: "all", label: "All Schemes", labelHindi: "सभी योजनाएं" },
    { value: "Maternal Health", label: "Maternal Health", labelHindi: "मातृ स्वास्थ्य" },
    { value: "Women Safety", label: "Women Safety", labelHindi: "महिला सुरक्षा" },
    { value: "Women Empowerment", label: "Women Empowerment", labelHindi: "महिला सशक्तिकरण" },
    { value: "Girl Child Welfare", label: "Girl Child Welfare", labelHindi: "बालिका कल्याण" },
    { value: "Housing", label: "Housing", labelHindi: "आवास" }
  ];

  const filteredSchemes = selectedCategory === "all" 
    ? GOVERNMENT_SCHEMES 
    : GOVERNMENT_SCHEMES.filter(scheme => scheme.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {i18n.language === 'hi' ? 'सरकारी योजनाएं' : 'Government Schemes'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {i18n.language === 'hi' 
              ? 'महिलाओं के लिए सरकारी योजनाओं और लाभों की खोज करें। अपने अधिकारों को जानें और उपलब्ध सहायता का लाभ उठाएं।'
              : 'Discover government schemes and benefits for women. Know your rights and access available support.'
            }
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="mb-2"
            >
              {i18n.language === 'hi' ? category.labelHindi : category.label}
            </Button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-pink-500">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  {scheme.icon}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {i18n.language === 'hi' ? scheme.nameHindi : scheme.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {i18n.language === 'hi' ? scheme.ministryHindi : scheme.ministry}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                <CardDescription className="text-sm line-clamp-3">
                  {i18n.language === 'hi' ? scheme.descriptionHindi : scheme.description}
                </CardDescription>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {i18n.language === 'hi' ? 'मुख्य लाभ:' : 'Key Benefits:'}
                  </h4>
                  <ul className="text-xs space-y-1">
                    {(i18n.language === 'hi' ? scheme.benefitsHindi : scheme.benefits)
                      .slice(0, 2)
                      .map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-pink-500 mt-1">•</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        {i18n.language === 'hi' ? 'विवरण देखें' : 'Learn More'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-start gap-3 mb-4">
                          {scheme.icon}
                          <div>
                            <DialogTitle className="text-xl">
                              {i18n.language === 'hi' ? scheme.nameHindi : scheme.name}
                            </DialogTitle>
                            <Badge variant="secondary" className="mt-2">
                              {i18n.language === 'hi' ? scheme.ministryHindi : scheme.ministry}
                            </Badge>
                          </div>
                        </div>
                        <DialogDescription className="text-base">
                          {i18n.language === 'hi' ? scheme.descriptionHindi : scheme.description}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Benefits */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            {i18n.language === 'hi' ? 'योजना के लाभ' : 'Scheme Benefits'}
                          </h3>
                          <ul className="space-y-2">
                            {(i18n.language === 'hi' ? scheme.benefitsHindi : scheme.benefits)
                              .map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">✓</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {/* Eligibility */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            {i18n.language === 'hi' ? 'पात्रता मानदंड' : 'Eligibility Criteria'}
                          </h3>
                          <ul className="space-y-2">
                            {(i18n.language === 'hi' ? scheme.eligibilityHindi : scheme.eligibility)
                              .map((criteria, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{criteria}</span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {/* Required Documents */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            {i18n.language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}
                          </h3>
                          <ul className="space-y-2">
                            {(i18n.language === 'hi' ? scheme.documentsHindi : scheme.documents)
                              .map((doc, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">📄</span>
                                  <span>{doc}</span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {/* Application Process */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            {i18n.language === 'hi' ? 'आवेदन प्रक्रिया' : 'Application Process'}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {i18n.language === 'hi' ? scheme.applicationProcessHindi : scheme.applicationProcess}
                          </p>
                        </div>

                        {/* Official Website */}
                        <div className="pt-4 border-t">
                          <Button asChild className="w-full">
                            <a 
                              href={scheme.officialWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {i18n.language === 'hi' ? 'आधिकारिक वेबसाइट पर जाएं' : 'Visit Official Website'}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button asChild size="sm" variant="default">
                    <a 
                      href={scheme.officialWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {i18n.language === 'hi' ? 'आवेदन' : 'Apply'}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {i18n.language === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {i18n.language === 'hi' 
              ? 'योजनाओं के बारे में अधिक जानकारी या आवेदन में सहायता के लिए संपर्क करें।'
              : 'Contact for more information about schemes or help with applications.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              📞 {i18n.language === 'hi' ? 'हेल्पलाइन: 181' : 'Helpline: 181'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              🌐 {i18n.language === 'hi' ? 'माई स्कीम पोर्टल' : 'MyScheme Portal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}