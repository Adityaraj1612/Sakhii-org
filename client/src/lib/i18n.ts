import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  navbar: {
    doctors: 'Doctors',
    education: 'Education',
    library: 'Library',
    community: 'Community',
    contact: 'Contact',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    profile: 'My Profile',
    dashboard: 'Dashboard',
    logout: 'Logout',
    healthTracker: 'Health Tracker',
    healthGames: 'Health Games',
    shop: 'Shop',
    yojanas: 'Government Schemes'
  },
  home: {
    hero: {
      mainHeading: 'Empowering Women\'s Health & Education',
      subHeading: 'Your trusted companion for reproductive health, wellness education, and expert medical guidance.',
      exploreCta: 'Explore Sakhi',
      findDoctorCta: 'Find a Doctor',
      imageAlt: 'Women\'s health illustration',
      title: 'Your Trusted Partner in Women\'s Health',
      subtitle: 'Track your cycle, connect with specialists, and access resources for a healthier you.',
      cta: 'Get Started'
    },
    features: {
      title: 'Our Features',
      items: [
        {
          title: 'AI Health Assistant',
          description: 'Get instant answers to your health questions from our AI-powered chatbot.'
        },
        {
          title: 'Period Tracker',
          description: 'Track your menstrual cycle and get personalized insights.'
        },
        {
          title: 'Expert Consultation',
          description: 'Connect with qualified healthcare professionals online.'
        }
      ],
      trackTitle: 'Track Your Cycle',
      trackDesc: 'Record your period dates, symptoms, and get accurate predictions for future cycles.',
      connectTitle: 'Connect with Specialists',
      connectDesc: 'Book virtual consultations with experienced gynecologists and healthcare providers.',
      resourcesTitle: 'Educational Resources',
      resourcesDesc: 'Access evidence-based information on women\'s health, nutrition, and wellness.'
    },
    education: {
      title: 'Educational Resources',
      failedToLoad: 'Failed to load resources',
      readMore: 'Read more',
      libraryTitle: 'Health Library & Resources',
      latestArticles: 'Latest Articles',
      readTime: '{{time}}',
      featuredTopics: 'Featured Topics',
      expertBlogs: 'Expert Blogs',
      latest: 'Latest',
      articles: [
        { title: 'Understanding PCOS' },
        { title: 'Menopause: Truth & Myths' },
        { title: 'Fertility After 35' }
      ],
      topics: {
        nutrition: 'Women\'s nutrition',
        mentalHealth: 'Mental health',
        sexualHealth: 'Sexual health'
      },
      expertArticles: [
        'Managing hormonal imbalance with nutrition',
        'The future of reproductive health technology'
      ]
    }
  },
  common: {
    image: 'Image'
  },
  chatbot: {
    title: 'Health Assistant',
    welcome: "Hi! I'm your health assistant. How can I help you today?",
    inputPlaceholder: "Type your health question...",
    defaultResponse: "I'm here to help with basic women's health questions. Please ask about topics like menstrual cycles, pregnancy symptoms, contraception, or other reproductive health concerns. For medical emergencies or personalized advice, please consult a healthcare professional."
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signingIn: 'Signing in...',
    signingUp: 'Signing up...',
    welcomeBack: 'Welcome back! Please enter your details.',
    createAccount: 'Create your account to get started.',
    forgotPassword: 'Forgot password?',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    dateOfBirth: 'Date of Birth',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    rememberMe: 'Remember me',
    continueWith: 'Or continue with',
    noAccount: 'Don\'t have an account?',
    alreadyAccount: 'Already have an account?',
    successTitle: 'Successfully signed in!',
    successMessage: 'Welcome back to Sakhi.',
    errorTitle: 'Sign in failed',
    errorMessage: 'Please check your credentials and try again.',
    signUpSuccessTitle: 'Account created successfully!',
    signUpSuccessMessage: 'Welcome to Sakhi. Please sign in to continue.',
    signUpErrorTitle: 'Registration failed',
    signUpErrorMessage: 'There was an error creating your account. Please try again.',
    logoutSuccessTitle: 'Successfully logged out',
    logoutSuccessMessage: 'You have been logged out of your account.'
  },
  profile: {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    edit: 'Edit Profile',
    save: 'Save Changes',
    cancel: 'Cancel',
    fullName: 'Full Name',
    email: 'Email Address',
    username: 'Username',
    dateOfBirth: 'Date of Birth',
    height: 'Height (cm)',
    heightPlaceholder: 'Enter your height',
    weight: 'Weight (kg)',
    weightPlaceholder: 'Enter your weight',
    profilePicture: 'Profile Picture',
    changeProfilePicture: 'Change Picture',
    healthInformation: 'Health Information',
    updateSuccessTitle: 'Profile Updated',
    updateSuccessMessage: 'Your profile has been successfully updated.',
    updateErrorTitle: 'Update Failed',
    updateErrorMessage: 'There was an error updating your profile. Please try again.'
  },
  doctors: {
    title: 'Find a Doctor',
    subtitle: 'Connect with experienced healthcare professionals',
    search: 'Search doctors',
    specialtyFilter: 'Filter by Specialty',
    all: 'All Specialties',
    bookAppointment: 'Book Appointment',
    viewProfile: 'View Profile',
    experience: 'Experience',
    years: 'years',
    availability: 'Availability',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    reasonForVisit: 'Reason for Visit',
    reasonPlaceholder: 'Briefly describe your reason for consultation',
    confirmBooking: 'Confirm Booking',
    bookingSuccess: 'Appointment Booked Successfully',
    bookingError: 'Error Booking Appointment'
  },
  periodTracker: {
    title: 'Period Tracker',
    subtitle: 'Monitor your menstrual cycle',
    addPeriod: 'Log Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    symptoms: 'Symptoms',
    notes: 'Notes',
    notesPlaceholder: 'Add any notes about this period',
    save: 'Save',
    cancel: 'Cancel',
    today: 'Today',
    prediction: 'Predicted',
    periodDay: 'Period Day',
    ovulation: 'Ovulation Day',
    editEntry: 'Edit Entry',
    deleteEntry: 'Delete Entry',
    confirmDelete: 'Are you sure you want to delete this entry?'
  },
  healthMetrics: {
    title: 'Health Metrics',
    subtitle: 'Track important health indicators',
    weight: 'Weight (kg)',
    bmi: 'BMI',
    sleep: 'Sleep (hours)',
    water: 'Water Intake (glasses)',
    exercise: 'Exercise (minutes)',
    sleepQuality: 'Sleep Quality',
    poor: 'Poor',
    excellent: 'Excellent',
    addEntry: 'Add New Entry',
    editEntry: 'Edit Entry',
    date: 'Date',
    save: 'Save Entry',
    cancel: 'Cancel',
    history: 'History',
    trends: 'Trends',
    week: 'Week',
    month: 'Month',
    year: 'Year'
  },
  education: {
    title: 'Educational Resources',
    subtitle: 'Learn more about women\'s health',
    categories: {
      all: 'All Categories',
      reproductive: 'Reproductive Health',
      menstrual: 'Menstrual Health',
      pregnancy: 'Pregnancy & Childbirth',
      menopause: 'Menopause',
      nutrition: 'Nutrition',
      fitness: 'Fitness',
      mental: 'Mental Health'
    },
    search: 'Search resources',
    readMore: 'Read More',
    relatedResources: 'Related Resources'
  },
  community: {
    title: 'Community',
    subtitle: 'Connect with others on similar health journeys',
    forums: 'Forums',
    events: 'Events',
    support: 'Support Groups',
    createPost: 'Create Post',
    joinEvent: 'Join Event',
    recentPosts: 'Recent Posts',
    upcomingEvents: 'Upcoming Events',
    findGroups: 'Find Support Groups'
  },
  dashboard: {
    greeting: 'Hello',
    todayOverview: 'Today\'s Overview',
    upcomingAppointments: 'Upcoming Appointments',
    noAppointments: 'No upcoming appointments',
    viewAll: 'View All',
    recentPeriods: 'Recent Periods',
    healthMetrics: 'Health Metrics',
    latestResources: 'Latest Resources',
    communityUpdates: 'Community Updates',
    yourGoals: 'Your Health Goals',
    trackPeriod: 'Track Period',
    addHealthMetrics: 'Add Health Metrics'
  },
  languages: {
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    bengali: 'Bengali',
    tamil: 'Tamil',
    telugu: 'Telugu',
    marathi: 'Marathi',
    gujarati: 'Gujarati',
    kannada: 'Kannada',
    malayalam: 'Malayalam',
    punjabi: 'Punjabi',
    odia: 'Odia'
  },
  healthGames: {
    title: 'Health Education Games',
    subtitle: 'Learn about women\'s health through interactive games',
    quizGame: {
      title: 'Health Quiz',
      subtitle: 'Test your knowledge about women\'s health',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      next: 'Next Question',
      completed: 'Quiz Completed!',
      restart: 'Restart Quiz',
      yourScore: 'Your Score'
    },
    cycleMatchGame: {
      title: 'Cycle Phase Match',
      subtitle: 'Match characteristics to their menstrual cycle phases',
      start: 'Start Game',
      phaseCompleted: 'Phase Completed!',
      gameCompleted: 'Game Completed!',
      gameCompletedDescription: 'Congratulations! You\'ve successfully matched all characteristics to their correct cycle phases. This knowledge helps you understand your body\'s natural rhythm.',
      congratulations: 'Congratulations! You\'ve matched all cycle phases!',
      resetGame: 'Reset Game',
      playAgain: 'Play Again',
      reset: 'Reset Game'
    },
    bodySystemsGame: {
      title: 'Body Systems Explorer',
      subtitle: 'Learn about different body systems and related symptoms',
      selectSystem: 'Select a body system to learn more',
      exploreDescription: 'Explore different systems and track related symptoms',
      systems: 'Body Systems',
      aboutSystem: 'About this System',
      commonSymptoms: 'Common Symptoms',
      symptoms: 'Symptoms',
      healthyHabits: 'Healthy Habits',
      completed: 'Completed',
      learningComplete: 'Learning Complete!',
      markLearningComplete: 'Mark Learning Complete',
      resetProgress: 'Reset Progress'
    }
  }
};

// Hindi translations
const hiTranslations = {
  navbar: {
    doctors: 'डॉक्टर',
    education: 'शिक्षा',
    library: 'पुस्तकालय',
    community: 'समुदाय',
    contact: 'संपर्क',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    profile: 'मेरी प्रोफाइल',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉग आउट',
    healthTracker: 'स्वास्थ्य ट्रैकर',
    healthGames: 'स्वास्थ्य खेल',
    shop: 'दुकान',
    yojanas: 'सरकारी योजनाएं'
  },
  home: {
    hero: {
      mainHeading: 'महिलाओं के स्वास्थ्य और शिक्षा को सशक्त बनाना',
      subHeading: 'प्रजनन स्वास्थ्य, कल्याण शिक्षा और विशेषज्ञ चिकित्सा मार्गदर्शन के लिए आपका विश्वसनीय साथी।',
      exploreCta: 'साखी का अन्वेषण करें',
      findDoctorCta: 'डॉक्टर ढूंढें',
      imageAlt: 'महिलाओं के स्वास्थ्य का चित्रण',
      title: 'महिलाओं के स्वास्थ्य में आपका विश्वसनीय साथी',
      subtitle: 'अपने चक्र को ट्रैक करें, विशेषज्ञों से जुड़ें, और स्वस्थ जीवन के लिए संसाधनों तक पहुंचें।',
      cta: 'शुरू करें'
    },
    features: {
      title: 'हमारी विशेषताएं',
      items: [
        {
          title: 'एआई स्वास्थ्य सहायक',
          description: 'हमारे एआई-संचालित चैटबॉट से अपने स्वास्थ्य प्रश्नों के तत्काल उत्तर प्राप्त करें।'
        },
        {
          title: 'मासिक धर्म ट्रैकर',
          description: 'अपने मासिक धर्म चक्र को ट्रैक करें और व्यक्तिगत अंतर्दृष्टि प्राप्त करें।'
        },
        {
          title: 'विशेषज्ञ परामर्श',
          description: 'योग्य स्वास्थ्य पेशेवरों से ऑनलाइन जुड़ें।'
        }
      ],
      trackTitle: 'अपने चक्र को ट्रैक करें',
      trackDesc: 'अपने पीरियड की तारीखें, लक्षण दर्ज करें, और भविष्य के चक्रों के लिए सटीक भविष्यवाणियां प्राप्त करें।',
      connectTitle: 'विशेषज्ञों से जुड़ें',
      connectDesc: 'अनुभवी स्त्री रोग विशेषज्ञों और स्वास्थ्य सेवा प्रदाताओं के साथ वर्चुअल परामर्श बुक करें।',
      resourcesTitle: 'शैक्षिक संसाधन',
      resourcesDesc: 'महिलाओं के स्वास्थ्य, पोषण और कल्याण पर प्रमाण-आधारित जानकारी तक पहुंचें।'
    },
    education: {
      title: 'शैक्षिक संसाधन',
      failedToLoad: 'संसाधन लोड करने में विफल',
      readMore: 'और पढ़ें',
      libraryTitle: 'स्वास्थ्य पुस्तकालय और संसाधन',
      latestArticles: 'नवीनतम लेख',
      readTime: '{{time}}',
      featuredTopics: 'विशेष विषय',
      expertBlogs: 'विशेषज्ञ ब्लॉग',
      latest: 'नवीनतम',
      articles: [
        { title: 'PCOS को समझना' },
        { title: 'रजोनिवृत्ति: सत्य और मिथक' },
        { title: '35 के बाद प्रजनन क्षमता' }
      ],
      topics: {
        nutrition: 'महिलाओं का पोषण',
        mentalHealth: 'मानसिक स्वास्थ्य',
        sexualHealth: 'यौन स्वास्थ्य'
      },
      expertArticles: [
        'पोषण के साथ हार्मोनल असंतुलन का प्रबंधन',
        'प्रजनन स्वास्थ्य प्रौद्योगिकी का भविष्य'
      ]
    }
  },
  common: {
    image: 'छवि'
  },
  chatbot: {
    title: 'स्वास्थ्य सहायक',
    welcome: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    inputPlaceholder: "अपना स्वास्थ्य प्रश्न टाइप करें...",
    defaultResponse: "मैं महिलाओं के स्वास्थ्य के बुनियादी प्रश्नों में मदद करने के लिए यहां हूँ। कृपया मासिक धर्म चक्र, गर्भावस्था के लक्षण, गर्भनिरोधक, या अन्य प्रजनन स्वास्थ्य चिंताओं के बारे में पूछें। चिकित्सा आपातकाल या व्यक्तिगत सलाह के लिए, कृपया एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।"
  },
  auth: {
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    signingIn: 'साइन इन हो रहा है...',
    signingUp: 'साइन अप हो रहा है...',
    welcomeBack: 'वापसी पर स्वागत है! कृपया अपना विवरण दर्ज करें।',
    createAccount: 'शुरू करने के लिए अपना खाता बनाएं।',
    forgotPassword: 'पासवर्ड भूल गए?',
    name: 'नाम',
    namePlaceholder: 'अपना नाम दर्ज करें',
    email: 'ईमेल',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    username: 'उपयोगकर्ता नाम',
    usernamePlaceholder: 'अपना उपयोगकर्ता नाम दर्ज करें',
    dateOfBirth: 'जन्म तिथि',
    password: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'अपने पासवर्ड की पुष्टि करें',
    rememberMe: 'मुझे याद रखें',
    continueWith: 'या इसके साथ जारी रखें',
    noAccount: 'खाता नहीं है?',
    alreadyAccount: 'पहले से ही खाता है?',
    successTitle: 'सफलतापूर्वक साइन इन किया गया!',
    successMessage: 'साखी में आपका स्वागत है।',
    errorTitle: 'साइन इन विफल',
    errorMessage: 'कृपया अपने क्रेडेंशियल्स की जांच करें और पुनः प्रयास करें।',
    signUpSuccessTitle: 'खाता सफलतापूर्वक बनाया गया!',
    signUpSuccessMessage: 'साखी में आपका स्वागत है। कृपया जारी रखने के लिए साइन इन करें।',
    signUpErrorTitle: 'पंजीकरण विफल',
    signUpErrorMessage: 'आपका खाता बनाने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    logoutSuccessTitle: 'सफलतापूर्वक लॉग आउट किया गया',
    logoutSuccessMessage: 'आप अपने खाते से लॉग आउट हो गए हैं।'
  },
  profile: {
    title: 'मेरी प्रोफाइल',
    personalInfo: 'व्यक्तिगत जानकारी',
    edit: 'प्रोफाइल संपादित करें',
    save: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    username: 'उपयोगकर्ता नाम',
    dateOfBirth: 'जन्म तिथि',
    height: 'ऊंचाई (सेमी)',
    heightPlaceholder: 'अपनी ऊंचाई दर्ज करें',
    weight: 'वजन (किग्रा)',
    weightPlaceholder: 'अपना वजन दर्ज करें',
    profilePicture: 'प्रोफ़ाइल चित्र',
    changeProfilePicture: 'चित्र बदलें',
    healthInformation: 'स्वास्थ्य जानकारी',
    updateSuccessTitle: 'प्रोफाइल अपडेट हुई',
    updateSuccessMessage: 'आपकी प्रोफाइल सफलतापूर्वक अपडेट कर दी गई है।',
    updateErrorTitle: 'अपडेट विफल',
    updateErrorMessage: 'आपकी प्रोफाइल अपडेट करने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
  },
  languages: {
    language: 'भाषा',
    english: 'अंग्रेजी',
    hindi: 'हिंदी',
    bengali: 'बंगाली',
    tamil: 'तमिल',
    telugu: 'तेलुगु',
    marathi: 'मराठी',
    gujarati: 'गुजराती',
    kannada: 'कन्नड़',
    malayalam: 'मलयालम',
    punjabi: 'पंजाबी',
    odia: 'उड़िया'
  },
  healthGames: {
    title: 'स्वास्थ्य शिक्षा खेल',
    subtitle: 'इंटरैक्टिव खेलों के माध्यम से महिलाओं के स्वास्थ्य के बारे में जानें',
    quizGame: {
      title: 'स्वास्थ्य क्विज',
      subtitle: 'महिलाओं के स्वास्थ्य के बारे में अपने ज्ञान का परीक्षण करें',
      correct: 'सही!',
      incorrect: 'गलत',
      next: 'अगला प्रश्न',
      completed: 'क्विज पूरा हुआ!',
      restart: 'क्विज पुनः आरंभ करें',
      yourScore: 'आपका स्कोर'
    },
    cycleMatchGame: {
      title: 'चक्र चरण मिलान',
      subtitle: 'मासिक धर्म चक्र के चरणों से विशेषताओं का मिलान करें',
      start: 'खेल शुरू करें',
      phaseCompleted: 'चरण पूरा हुआ!',
      gameCompleted: 'खेल पूरा हुआ!',
      gameCompletedDescription: 'बधाई हो! आपने सभी विशेषताओं को उनके सही चक्र चरणों से मिलान कर लिया है। यह ज्ञान आपको अपने शरीर के प्राकृतिक लय को समझने में मदद करता है।',
      congratulations: 'बधाई हो! आपने सभी चक्र चरणों का मिलान किया है!',
      resetGame: 'खेल रीसेट करें',
      playAgain: 'फिर से खेलें',
      reset: 'खेल रीसेट करें'
    },
    bodySystemsGame: {
      title: 'शरीर प्रणाली अन्वेषक',
      subtitle: 'विभिन्न शरीर प्रणालियों और संबंधित लक्षणों के बारे में जानें',
      selectSystem: 'अधिक जानने के लिए एक शरीर प्रणाली चुनें',
      exploreDescription: 'विभिन्न प्रणालियों का अन्वेषण करें और संबंधित लक्षणों को ट्रैक करें',
      systems: 'शरीर प्रणालियाँ',
      aboutSystem: 'इस प्रणाली के बारे में',
      commonSymptoms: 'सामान्य लक्षण',
      symptoms: 'लक्षण',
      healthyHabits: 'स्वस्थ आदतें',
      completed: 'पूर्ण',
      learningComplete: 'सीखना पूरा हुआ!',
      markLearningComplete: 'सीखना पूरा करें',
      resetProgress: 'प्रगति रीसेट करें'
    }
  }
};

// Bengali translations
const bnTranslations = {
  navbar: {
    doctors: 'ডাক্তার',
    education: 'শিক্ষা',
    library: 'লাইব্রেরি',
    community: 'সম্প্রদায়',
    contact: 'যোগাযোগ',
    signIn: 'সাইন ইন',
    signUp: 'সাইন আপ',
    profile: 'আমার প্রোফাইল',
    dashboard: 'ড্যাশবোর্ড',
    logout: 'লগ আউট',
    healthTracker: 'স্বাস্থ্য ট্র্যাকার',
    healthGames: 'স্বাস্থ্য খেলা'
  },
  home: {
    hero: {
      mainHeading: 'মহিলাদের স্বাস্থ্য ও শিক্ষা সক্ষমতায়ন',
      subHeading: 'প্রজনন স্বাস্থ্য, সুস্থতা শিক্ষা এবং বিশেষজ্ঞ চিকিৎসা নির্দেশনার জন্য আপনার বিশ্বস্ত সঙ্গী।',
      exploreCta: 'সখি অন্বেষণ করুন',
      findDoctorCta: 'ডাক্তার খুঁজুন',
      imageAlt: 'মহিলাদের স্বাস্থ্য ইলাস্ট্রেশন',
      title: 'মহিলাদের স্বাস্থ্যে আপনার বিশ্বস্ত সঙ্গী',
      subtitle: 'আপনার চক্র ট্র্যাক করুন, বিশেষজ্ঞদের সাথে যোগাযোগ করুন এবং একটি স্বাস্থ্যকর আপনার জন্য সংস্থান অ্যাক্সেস করুন।',
      cta: 'শুরু করুন'
    },
    features: {
      title: 'আমাদের বৈশিষ্ট্য',
      items: [
        {
          title: 'এআই স্বাস্থ্য সহকারী',
          description: 'আমাদের এআই-পাওয়ার্ড চ্যাটবট থেকে আপনার স্বাস্থ্য প্রশ্নের তাৎক্ষণিক উত্তর পান।'
        },
        {
          title: 'পিরিয়ড ট্র্যাকার',
          description: 'আপনার মাসিক চক্র ট্র্যাক করুন এবং ব্যক্তিগত অন্তর্দৃষ্টি পান।'
        },
        {
          title: 'বিশেষজ্ঞ পরামর্শ',
          description: 'অনলাইনে যোগ্য স্বাস্থ্য পেশাদারদের সাথে সংযোগ করুন।'
        }
      ]
    },
    education: {
      title: 'শিক্ষামূলক সংস্থান',
      failedToLoad: 'সংস্থান লোড করতে ব্যর্থ হয়েছে',
      readMore: 'আরও পড়ুন',
      libraryTitle: 'স্বাস্থ্য লাইব্রেরি ও সংস্থান',
      latestArticles: 'সর্বশেষ নিবন্ধ',
      readTime: '{{time}}',
      featuredTopics: 'বিশেষ বিষয়',
      expertBlogs: 'বিশেষজ্ঞ ব্লগ',
      latest: 'সর্বশেষ',
      articles: [
        { title: 'PCOS বোঝা' },
        { title: 'মেনোপজ: সত্য ও মিথ' },
        { title: '৩৫ এর পরে প্রজনন ক্ষমতা' }
      ],
      topics: {
        nutrition: 'মহিলাদের পুষ্টি',
        mentalHealth: 'মানসিক স্বাস্থ্য',
        sexualHealth: 'যৌন স্বাস্থ্য'
      },
      expertArticles: [
        'পুষ্টির সাথে হরমোনাল ভারসাম্যহীনতা পরিচালনা',
        'প্রজনন স্বাস্থ্য প্রযুক্তির ভবিষ্যত'
      ]
    }
  },
  common: {
    image: 'ছবি'
  },
  auth: {
    signIn: 'সাইন ইন',
    signUp: 'সাইন আপ',
    signingIn: 'সাইন ইন হচ্ছে...',
    signingUp: 'সাইন আপ হচ্ছে...',
    welcomeBack: 'ফিরে আসার জন্য স্বাগতম! দয়া করে আপনার বিবরণ লিখুন।',
    createAccount: 'শুরু করার জন্য আপনার একাউন্ট তৈরি করুন।',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    name: 'নাম',
    namePlaceholder: 'আপনার নাম লিখুন',
    email: 'ইমেইল',
    emailPlaceholder: 'আপনার ইমেইল লিখুন',
    dateOfBirth: 'জন্ম তারিখ',
    password: 'পাসওয়ার্ড',
    passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    confirmPasswordPlaceholder: 'আপনার পাসওয়ার্ড নিশ্চিত করুন',
    rememberMe: 'আমাকে মনে রাখুন',
    continueWith: 'অথবা এর সাথে চালিয়ে যান',
    noAccount: 'কোনো অ্যাকাউন্ট নেই?',
    alreadyAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    successTitle: 'সফলভাবে সাইন ইন হয়েছে!',
    successMessage: 'সাখিতে আপনাকে স্বাগতম।',
    errorTitle: 'সাইন ইন ব্যর্থ হয়েছে',
    errorMessage: 'অনুগ্রহ করে আপনার শংসাপত্র পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
    signUpSuccessTitle: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
    signUpSuccessMessage: 'সাখিতে আপনাকে স্বাগতম। চালিয়ে যেতে দয়া করে সাইন ইন করুন।',
    signUpErrorTitle: 'নিবন্ধকরণ ব্যর্থ হয়েছে',
    signUpErrorMessage: 'আপনার অ্যাকাউন্ট তৈরি করতে একটি ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।'
  },
  languages: {
    language: 'ভাষা',
    english: 'ইংরেজি',
    hindi: 'হিন্দি',
    bengali: 'বাংলা',
    tamil: 'তামিল',
    telugu: 'তেলুগু',
    marathi: 'মারাঠি',
    gujarati: 'গুজরাটি',
    kannada: 'কন্নড়',
    malayalam: 'মালায়ালাম',
    punjabi: 'পাঞ্জাবি',
    odia: 'ওড়িয়া'
  }
};

// Tamil translations
const taTranslations = {
  navbar: {
    doctors: 'மருத்துவர்கள்',
    education: 'கல்வி',
    library: 'நூலகம்',
    community: 'சமூகம்',
    contact: 'தொடர்பு',
    signIn: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    healthTracker: 'உடல்நல கண்காணிப்பு',
    healthGames: 'உடல்நல விளையாட்டுகள்'
  },
  home: {
    hero: {
      mainHeading: 'பெண்களின் ஆரோக்கியம் மற்றும் கல்வியை மேம்படுத்துதல்',
      subHeading: 'இனப்பெருக்க ஆரோக்கியம், நலன் கல்வி மற்றும் நிபுணர் மருத்துவ வழிகாட்டுதலுக்கான உங்கள் நம்பகமான துணை.',
      exploreCta: 'சகியை ஆராயுங்கள்',
      findDoctorCta: 'மருத்துவரைக் கண்டறிக',
      imageAlt: 'பெண்களின் ஆரோக்கிய விளக்கப்படம்',
      title: 'பெண்களின் ஆரோக்கியத்தில் உங்கள் நம்பகமான பங்காளி',
      subtitle: 'உங்கள் சுழற்சியைக் கண்காணிக்கவும், நிபுணர்களுடன் இணைக்கவும், மற்றும் ஆரோக்கியமான உங்களுக்கான ஆதாரங்களை அணுகவும்.',
      cta: 'தொடங்குக'
    },
    features: {
      title: 'எங்கள் அம்சங்கள்',
      items: [
        {
          title: 'AI ஆரோக்கிய உதவியாளர்',
          description: 'எங்கள் AI-செயல்படுத்தப்பட்ட சாட்போட்டிலிருந்து உங்கள் ஆரோக்கிய கேள்விகளுக்கு உடனடி பதில்களைப் பெறுங்கள்.'
        },
        {
          title: 'மாதவிடாய் கண்காணிப்பு',
          description: 'உங்கள் மாதவிடாய் சுழற்சியைக் கண்காணித்து தனிப்பயனாக்கப்பட்ட நுண்ணறிவுகளைப் பெறுங்கள்.'
        },
        {
          title: 'நிபுணர் ஆலோசனை',
          description: 'தகுதிவாய்ந்த சுகாதார நிபுணர்களுடன் ஆன்லைனில் இணையுங்கள்.'
        }
      ]
    },
    education: {
      title: 'கல்வி வளங்கள்',
      failedToLoad: 'வளங்களை ஏற்ற முடியவில்லை',
      readMore: 'மேலும் படிக்க',
      libraryTitle: 'ஆரோக்கிய நூலகம் மற்றும் வளங்கள்',
      latestArticles: 'சமீபத்திய கட்டுரைகள்',
      readTime: '{{time}}',
      featuredTopics: 'சிறப்பு தலைப்புகள்',
      expertBlogs: 'நிபுணர் வலைப்பதிவுகள்',
      latest: 'சமீபத்தியது',
      articles: [
        { title: 'PCOS ஐப் புரிந்துகொள்வது' },
        { title: 'மாதவிடாய் நிறுத்தம்: உண்மை & புனைவுகள்' },
        { title: '35 வயதுக்குப் பிறகு கருவுறுதல்' }
      ],
      topics: {
        nutrition: 'பெண்களின் ஊட்டச்சத்து',
        mentalHealth: 'மன ஆரோக்கியம்',
        sexualHealth: 'பாலியல் ஆரோக்கியம்'
      },
      expertArticles: [
        'ஊட்டச்சத்துடன் ஹார்மோன் சமநிலையின்மையை நிர்வகித்தல்',
        'இனப்பெருக்க ஆரோக்கிய தொழில்நுட்பத்தின் எதிர்காலம்'
      ]
    }
  },
  common: {
    image: 'படம்'
  },
  languages: {
    language: 'மொழி',
    english: 'ஆங்கிலம்',
    hindi: 'இந்தி',
    bengali: 'வங்காளம்',
    tamil: 'தமிழ்',
    telugu: 'தெலுங்கு',
    marathi: 'மராத்தி',
    gujarati: 'குஜராத்தி',
    kannada: 'கன்னடம்',
    malayalam: 'மலையாளம்',
    punjabi: 'பஞ்சாபி',
    odia: 'ஒடியா'
  }
};

// Telugu translations
const teTranslations = {
  navbar: {
    doctors: 'వైద్యులు',
    education: 'విద్య',
    library: 'లైబ్రరీ',
    community: 'సంఘం',
    contact: 'సంప్రదించండి',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    healthTracker: 'ఆరోగ్య ట్రాకర్',
    healthGames: 'ఆరోగ్య ఆటలు'
  },
  home: {
    hero: {
      mainHeading: 'మహిళల ఆరోగ్యం & విద్యకు శక్తినిస్తోంది',
      subHeading: 'ప్రజనన ఆరోగ్యం, ఆరోగ్య విద్య మరియు నిపుణుల వైద్య మార్గదర్శకత్వం కోసం మీ నమ్మకమైన సహచరి.',
      exploreCta: 'సఖిని అన్వేషించండి',
      findDoctorCta: 'వైద్యుడిని కనుగొనండి',
      imageAlt: 'మహిళల ఆరోగ్య చిత్రీకరణ',
      title: 'మహిళల ఆరోగ్యంలో మీ విశ్వసనీయ భాగస్వామి',
      subtitle: 'మీ చక్రాన్ని ట్రాక్ చేయండి, నిపుణులతో కనెక్ట్ అవ్వండి మరియు ఆరోగ్యకరమైన మీకు వనరులను యాక్సెస్ చేయండి.'
    },
    features: {
      title: 'మా ఫీచర్లు',
      items: [
        {
          title: 'AI ఆరోగ్య సహాయకుడు',
          description: 'మా AI-శక్తితో చలించే చాట్‌బాట్ నుండి మీ ఆరోగ్య ప్రశ్నలకు తక్షణ సమాధానాలు పొందండి.'
        },
        {
          title: 'పీరియడ్ ట్రాకర్',
          description: 'మీ మెన్స్ట్రువల్ చక్రాన్ని ట్రాక్ చేయండి మరియు వ్యక్తిగతీకరించిన అంతర్దృష్టులను పొందండి.'
        },
        {
          title: 'నిపుణుల సంప్రదింపులు',
          description: 'అర్హత గల ఆరోగ్య నిపుణులతో ఆన్‌లైన్‌లో కనెక్ట్ అవ్వండి.'
        }
      ]
    },
    education: {
      title: 'విద్యా వనరులు',
      failedToLoad: 'వనరులను లోడ్ చేయడంలో విఫలమైంది',
      readMore: 'ఇంకా చదవండి',
      libraryTitle: 'ఆరోగ్య లైబ్రరీ & వనరులు',
      latestArticles: 'తాజా వ్యాసాలు',
      readTime: '{{time}}',
      featuredTopics: 'ఫీచర్డ్ టాపిక్స్',
      expertBlogs: 'నిపుణుల బ్లాగులు',
      latest: 'తాజా',
      articles: [
        { title: 'PCOS ను అర్థం చేసుకోవడం' },
        { title: 'మెనోపాజ్: నిజాలు & మిథ్స్' },
        { title: '35 తర్వాత సంతానోత్పత్తి' }
      ],
      topics: {
        nutrition: 'మహిళల పోషణ',
        mentalHealth: 'మానసిక ఆరోగ్యం',
        sexualHealth: 'లైంగిక ఆరోగ్యం'
      },
      expertArticles: [
        'పోషకాహారంతో హార్మోనల్ అసమతుల్యతను నిర్వహించడం',
        'ప్రజనన ఆరోగ్య సాంకేతికత భవిష్యత్తు'
      ]
    }
  },
  common: {
    image: 'చిత్రం'
  },
  languages: {
    language: 'భాష',
    english: 'ఆంగ్లం',
    hindi: 'హిందీ',
    bengali: 'బెంగాలీ',
    tamil: 'తమిళం',
    telugu: 'తెలుగు',
    marathi: 'మరాఠీ',
    gujarati: 'గుజరాతీ',
    kannada: 'కన్నడ',
    malayalam: 'మలయాళం',
    punjabi: 'పంజాబీ',
    odia: 'ఒడియా'
  }
};

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  bn: {
    translation: bnTranslations
  },
  ta: {
    translation: taTranslations
  },
  te: {
    translation: teTranslations
  }
};

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'language',
  caches: ['localStorage'],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: DETECTION_OPTIONS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;