import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import { getMarketPrices } from "../services/marketService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSettings } from "../context/SettingsContext";

const translations = {
  "en-IN": {
    pageTitle: "Market Prices",
    subtitle:
      "Check the latest mandi prices across India.",

    state: "State",
    crop: "Crop",

    selectState: "Select State",
    selectCrop: "Select Crop",

    search: "Search",
    searching: "Searching...",

    initialTitle: "Search Market Prices",
    initialDescription:
      "Select a state and crop to view the latest market prices.",

    noDataTitle: "No Market Data Found",
    noDataDescription:
      "Try selecting another state or crop.",

    latestPrices: "Latest Market Prices",

    showingRecords: (count) =>
      `Showing ${count} market records`,

    market: "Market",
    district: "District",
    commodity: "Commodity",
    variety: "Variety",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    modalPrice: "Modal Price",
    arrivalDate: "Arrival Date",

    notAvailable: "Not available",
    priceNotAvailable: "N/A",

    selectRequired:
      "Please select a state and crop",

    pricesUpdated:
      "Market prices updated",

    noMarketData:
      "No market price data found",

    fetchFailed:
      "Unable to fetch market prices",
  },

  "te-IN": {
    pageTitle: "మార్కెట్ ధరలు",
    subtitle:
      "భారతదేశంలోని తాజా మండీ ధరలను తెలుసుకోండి.",

    state: "రాష్ట్రం",
    crop: "పంట",

    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    selectCrop: "పంటను ఎంచుకోండి",

    search: "వెతకండి",
    searching: "వెతుకుతోంది...",

    initialTitle:
      "మార్కెట్ ధరలను వెతకండి",

    initialDescription:
      "తాజా ధరలను చూడటానికి రాష్ట్రం మరియు పంటను ఎంచుకోండి.",

    noDataTitle:
      "మార్కెట్ సమాచారం లభించలేదు",

    noDataDescription:
      "మరో రాష్ట్రం లేదా పంటను ఎంచుకుని ప్రయత్నించండి.",

    latestPrices:
      "తాజా మార్కెట్ ధరలు",

    showingRecords: (count) =>
      `${count} మార్కెట్ రికార్డులు చూపబడుతున్నాయి`,

    market: "మార్కెట్",
    district: "జిల్లా",
    commodity: "పంట ఉత్పత్తి",
    variety: "రకం",
    minPrice: "కనిష్ఠ ధర",
    maxPrice: "గరిష్ఠ ధర",
    modalPrice: "సాధారణ ధర",
    arrivalDate: "వచ్చిన తేదీ",

    notAvailable: "అందుబాటులో లేదు",
    priceNotAvailable: "లేదు",

    selectRequired:
      "రాష్ట్రం మరియు పంటను ఎంచుకోండి",

    pricesUpdated:
      "మార్కెట్ ధరలు నవీకరించబడ్డాయి",

    noMarketData:
      "మార్కెట్ ధరల సమాచారం లభించలేదు",

    fetchFailed:
      "మార్కెట్ ధరలను పొందలేకపోయాము",
  },

  "hi-IN": {
    pageTitle: "बाज़ार भाव",
    subtitle:
      "भारत की नवीनतम मंडी कीमतें देखें।",

    state: "राज्य",
    crop: "फसल",

    selectState: "राज्य चुनें",
    selectCrop: "फसल चुनें",

    search: "खोजें",
    searching: "खोज जारी है...",

    initialTitle:
      "बाज़ार भाव खोजें",

    initialDescription:
      "नवीनतम कीमतें देखने के लिए राज्य और फसल चुनें।",

    noDataTitle:
      "बाज़ार डेटा नहीं मिला",

    noDataDescription:
      "किसी अन्य राज्य या फसल का चयन करके प्रयास करें।",

    latestPrices:
      "नवीनतम बाज़ार भाव",

    showingRecords: (count) =>
      `${count} बाज़ार रिकॉर्ड दिखाए जा रहे हैं`,

    market: "बाज़ार",
    district: "जिला",
    commodity: "फसल",
    variety: "किस्म",
    minPrice: "न्यूनतम कीमत",
    maxPrice: "अधिकतम कीमत",
    modalPrice: "सामान्य कीमत",
    arrivalDate: "आगमन तिथि",

    notAvailable: "उपलब्ध नहीं",
    priceNotAvailable: "उपलब्ध नहीं",

    selectRequired:
      "राज्य और फसल चुनें",

    pricesUpdated:
      "बाज़ार भाव अपडेट हो गए",

    noMarketData:
      "बाज़ार भाव का डेटा नहीं मिला",

    fetchFailed:
      "बाज़ार भाव प्राप्त नहीं हो सके",
  },

  "ta-IN": {
    pageTitle: "சந்தை விலைகள்",
    subtitle:
      "இந்தியாவின் சமீபத்திய மண்டி விலைகளைப் பார்க்கவும்.",

    state: "மாநிலம்",
    crop: "பயிர்",

    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",

    search: "தேடுங்கள்",
    searching: "தேடப்படுகிறது...",

    initialTitle:
      "சந்தை விலைகளைத் தேடுங்கள்",

    initialDescription:
      "சமீபத்திய விலைகளைப் பார்க்க மாநிலம் மற்றும் பயிரைத் தேர்ந்தெடுக்கவும்.",

    noDataTitle:
      "சந்தை தகவல் கிடைக்கவில்லை",

    noDataDescription:
      "வேறொரு மாநிலம் அல்லது பயிரைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.",

    latestPrices:
      "சமீபத்திய சந்தை விலைகள்",

    showingRecords: (count) =>
      `${count} சந்தை பதிவுகள் காட்டப்படுகின்றன`,

    market: "சந்தை",
    district: "மாவட்டம்",
    commodity: "பயிர்",
    variety: "வகை",
    minPrice: "குறைந்தபட்ச விலை",
    maxPrice: "அதிகபட்ச விலை",
    modalPrice: "பொதுவான விலை",
    arrivalDate: "வருகை தேதி",

    notAvailable: "கிடைக்கவில்லை",
    priceNotAvailable: "இல்லை",

    selectRequired:
      "மாநிலம் மற்றும் பயிரைத் தேர்ந்தெடுக்கவும்",

    pricesUpdated:
      "சந்தை விலைகள் புதுப்பிக்கப்பட்டன",

    noMarketData:
      "சந்தை விலை தகவல் கிடைக்கவில்லை",

    fetchFailed:
      "சந்தை விலைகளைப் பெற முடியவில்லை",
  },

  "kn-IN": {
    pageTitle: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    subtitle:
      "ಭಾರತದ ಇತ್ತೀಚಿನ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",

    state: "ರಾಜ್ಯ",
    crop: "ಬೆಳೆ",

    selectState: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    selectCrop: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",

    search: "ಹುಡುಕಿ",
    searching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",

    initialTitle:
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಹುಡುಕಿ",

    initialDescription:
      "ಇತ್ತೀಚಿನ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ರಾಜ್ಯ ಮತ್ತು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",

    noDataTitle:
      "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ",

    noDataDescription:
      "ಬೇರೆ ರಾಜ್ಯ ಅಥವಾ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪ್ರಯತ್ನಿಸಿ.",

    latestPrices:
      "ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",

    showingRecords: (count) =>
      `${count} ಮಾರುಕಟ್ಟೆ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ`,

    market: "ಮಾರುಕಟ್ಟೆ",
    district: "ಜಿಲ್ಲೆ",
    commodity: "ಬೆಳೆ",
    variety: "ತಳಿ",
    minPrice: "ಕನಿಷ್ಠ ಬೆಲೆ",
    maxPrice: "ಗರಿಷ್ಠ ಬೆಲೆ",
    modalPrice: "ಸಾಮಾನ್ಯ ಬೆಲೆ",
    arrivalDate: "ಆಗಮನ ದಿನಾಂಕ",

    notAvailable: "ಲಭ್ಯವಿಲ್ಲ",
    priceNotAvailable: "ಇಲ್ಲ",

    selectRequired:
      "ರಾಜ್ಯ ಮತ್ತು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",

    pricesUpdated:
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ನವೀಕರಿಸಲಾಗಿದೆ",

    noMarketData:
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ",

    fetchFailed:
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪಡೆಯಲಾಗಲಿಲ್ಲ",
  },

  "ml-IN": {
    pageTitle: "വിപണി വിലകൾ",
    subtitle:
      "ഇന്ത്യയിലെ ഏറ്റവും പുതിയ മണ്ഡി വിലകൾ പരിശോധിക്കുക.",

    state: "സംസ്ഥാനം",
    crop: "വിള",

    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    selectCrop: "വിള തിരഞ്ഞെടുക്കുക",

    search: "തിരയുക",
    searching: "തിരയുന്നു...",

    initialTitle:
      "വിപണി വിലകൾ തിരയുക",

    initialDescription:
      "പുതിയ വിലകൾ കാണാൻ സംസ്ഥാനവും വിളയും തിരഞ്ഞെടുക്കുക.",

    noDataTitle:
      "വിപണി വിവരങ്ങൾ ലഭിച്ചില്ല",

    noDataDescription:
      "മറ്റൊരു സംസ്ഥാനമോ വിളയോ തിരഞ്ഞെടുക്കുക.",

    latestPrices:
      "പുതിയ വിപണി വിലകൾ",

    showingRecords: (count) =>
      `${count} വിപണി രേഖകൾ കാണിക്കുന്നു`,

    market: "വിപണി",
    district: "ജില്ല",
    commodity: "വിള",
    variety: "ഇനം",
    minPrice: "കുറഞ്ഞ വില",
    maxPrice: "കൂടിയ വില",
    modalPrice: "സാധാരണ വില",
    arrivalDate: "വരവ് തീയതി",

    notAvailable: "ലഭ്യമല്ല",
    priceNotAvailable: "ഇല്ല",

    selectRequired:
      "സംസ്ഥാനവും വിളയും തിരഞ്ഞെടുക്കുക",

    pricesUpdated:
      "വിപണി വിലകൾ പുതുക്കി",

    noMarketData:
      "വിപണി വില വിവരങ്ങൾ ലഭിച്ചില്ല",

    fetchFailed:
      "വിപണി വിലകൾ ലഭ്യമാക്കാനായില്ല",
  },
};

const stateOptions = [
  {
    value: "Telangana",
    labels: {
      "en-IN": "Telangana",
      "te-IN": "తెలంగాణ",
      "hi-IN": "तेलंगाना",
      "ta-IN": "தெலங்கானா",
      "kn-IN": "ತೆಲಂಗಾಣ",
      "ml-IN": "തെലങ്കാന",
    },
  },

  {
    value: "Andhra Pradesh",
    labels: {
      "en-IN": "Andhra Pradesh",
      "te-IN": "ఆంధ్రప్రదేశ్",
      "hi-IN": "आंध्र प्रदेश",
      "ta-IN": "ஆந்திரப் பிரதேசம்",
      "kn-IN": "ಆಂಧ್ರ ಪ್ರದೇಶ",
      "ml-IN": "ആന്ധ്രപ്രദേശ്",
    },
  },

  {
    value: "Karnataka",
    labels: {
      "en-IN": "Karnataka",
      "te-IN": "కర్ణాటక",
      "hi-IN": "कर्नाटक",
      "ta-IN": "கர்நாடகா",
      "kn-IN": "ಕರ್ನಾಟಕ",
      "ml-IN": "കർണാടക",
    },
  },

  {
    value: "Tamil Nadu",
    labels: {
      "en-IN": "Tamil Nadu",
      "te-IN": "తమిళనాడు",
      "hi-IN": "तमिलनाडु",
      "ta-IN": "தமிழ்நாடு",
      "kn-IN": "ತಮಿಳುನಾಡು",
      "ml-IN": "തമിഴ്നാട്",
    },
  },

  {
    value: "Kerala",
    labels: {
      "en-IN": "Kerala",
      "te-IN": "కేరళ",
      "hi-IN": "केरल",
      "ta-IN": "கேரளா",
      "kn-IN": "ಕೇರಳ",
      "ml-IN": "കേരളം",
    },
  },

  {
    value: "Maharashtra",
    labels: {
      "en-IN": "Maharashtra",
      "te-IN": "మహారాష్ట్ర",
      "hi-IN": "महाराष्ट्र",
      "ta-IN": "மகாராஷ்டிரா",
      "kn-IN": "ಮಹಾರಾಷ್ಟ್ರ",
      "ml-IN": "മഹാരാഷ്ട്ര",
    },
  },

  {
    value: "Gujarat",
    labels: {
      "en-IN": "Gujarat",
      "te-IN": "గుజరాత్",
      "hi-IN": "गुजरात",
      "ta-IN": "குஜராத்",
      "kn-IN": "ಗುಜರಾತ್",
      "ml-IN": "ഗുജറാത്ത്",
    },
  },

  {
    value: "Punjab",
    labels: {
      "en-IN": "Punjab",
      "te-IN": "పంజాబ్",
      "hi-IN": "पंजाब",
      "ta-IN": "பஞ்சாப்",
      "kn-IN": "ಪಂಜಾಬ್",
      "ml-IN": "പഞ്ചാബ്",
    },
  },

  {
    value: "Haryana",
    labels: {
      "en-IN": "Haryana",
      "te-IN": "హర్యానా",
      "hi-IN": "हरियाणा",
      "ta-IN": "ஹரியானா",
      "kn-IN": "ಹರಿಯಾಣ",
      "ml-IN": "ഹരിയാന",
    },
  },

  {
    value: "Rajasthan",
    labels: {
      "en-IN": "Rajasthan",
      "te-IN": "రాజస్థాన్",
      "hi-IN": "राजस्थान",
      "ta-IN": "ராஜஸ்தான்",
      "kn-IN": "ರಾಜಸ್ಥಾನ",
      "ml-IN": "രാജസ്ഥാൻ",
    },
  },

  {
    value: "Uttar Pradesh",
    labels: {
      "en-IN": "Uttar Pradesh",
      "te-IN": "ఉత్తరప్రదేశ్",
      "hi-IN": "उत्तर प्रदेश",
      "ta-IN": "உத்தரப் பிரதேசம்",
      "kn-IN": "ಉತ್ತರ ಪ್ರದೇಶ",
      "ml-IN": "ഉത്തർപ്രദേശ്",
    },
  },

  {
    value: "Madhya Pradesh",
    labels: {
      "en-IN": "Madhya Pradesh",
      "te-IN": "మధ్యప్రదేశ్",
      "hi-IN": "मध्य प्रदेश",
      "ta-IN": "மத்தியப் பிரதேசம்",
      "kn-IN": "ಮಧ್ಯ ಪ್ರದೇಶ",
      "ml-IN": "മധ്യപ്രദേശ്",
    },
  },

  {
    value: "West Bengal",
    labels: {
      "en-IN": "West Bengal",
      "te-IN": "పశ్చిమ బెంగాల్",
      "hi-IN": "पश्चिम बंगाल",
      "ta-IN": "மேற்கு வங்காளம்",
      "kn-IN": "ಪಶ್ಚಿಮ ಬಂಗಾಳ",
      "ml-IN": "പശ്ചിമ ബംഗാൾ",
    },
  },

  {
    value: "Odisha",
    labels: {
      "en-IN": "Odisha",
      "te-IN": "ఒడిశా",
      "hi-IN": "ओडिशा",
      "ta-IN": "ஒடிசா",
      "kn-IN": "ಒಡಿಶಾ",
      "ml-IN": "ഒഡീഷ",
    },
  },

  {
    value: "Bihar",
    labels: {
      "en-IN": "Bihar",
      "te-IN": "బీహార్",
      "hi-IN": "बिहार",
      "ta-IN": "பீகார்",
      "kn-IN": "ಬಿಹಾರ",
      "ml-IN": "ബിഹാർ",
    },
  },
];

const cropOptions = [
  {
    value: "Tomato",
    labels: {
      "en-IN": "Tomato",
      "te-IN": "టమాట",
      "hi-IN": "टमाटर",
      "ta-IN": "தக்காளி",
      "kn-IN": "ಟೊಮ್ಯಾಟೊ",
      "ml-IN": "തക്കാളി",
    },
  },

  {
    value: "Potato",
    labels: {
      "en-IN": "Potato",
      "te-IN": "బంగాళాదుంప",
      "hi-IN": "आलू",
      "ta-IN": "உருளைக்கிழங்கு",
      "kn-IN": "ಆಲೂಗಡ್ಡೆ",
      "ml-IN": "ഉരുളക്കിഴങ്ങ്",
    },
  },

  {
    value: "Onion",
    labels: {
      "en-IN": "Onion",
      "te-IN": "ఉల్లిపాయ",
      "hi-IN": "प्याज",
      "ta-IN": "வெங்காயம்",
      "kn-IN": "ಈರುಳ್ಳಿ",
      "ml-IN": "സവാള",
    },
  },

  {
    value: "Rice",
    labels: {
      "en-IN": "Rice",
      "te-IN": "వరి",
      "hi-IN": "धान",
      "ta-IN": "நெல்",
      "kn-IN": "ಭತ್ತ",
      "ml-IN": "നെല്ല്",
    },
  },

  {
    value: "Wheat",
    labels: {
      "en-IN": "Wheat",
      "te-IN": "గోధుమ",
      "hi-IN": "गेहूं",
      "ta-IN": "கோதுமை",
      "kn-IN": "ಗೋಧಿ",
      "ml-IN": "ഗോതമ്പ്",
    },
  },

  {
    value: "Maize",
    labels: {
      "en-IN": "Maize",
      "te-IN": "మొక్కజొన్న",
      "hi-IN": "मक्का",
      "ta-IN": "மக்காச்சோளம்",
      "kn-IN": "ಮೆಕ್ಕೆಜೋಳ",
      "ml-IN": "ചോളം",
    },
  },

  {
    value: "Cotton",
    labels: {
      "en-IN": "Cotton",
      "te-IN": "పత్తి",
      "hi-IN": "कपास",
      "ta-IN": "பருத்தி",
      "kn-IN": "ಹತ್ತಿ",
      "ml-IN": "പരുത്തി",
    },
  },

  {
    value: "Groundnut",
    labels: {
      "en-IN": "Groundnut",
      "te-IN": "వేరుశనగ",
      "hi-IN": "मूंगफली",
      "ta-IN": "நிலக்கடலை",
      "kn-IN": "ಕಡಲೆಕಾಯಿ",
      "ml-IN": "നിലക്കടല",
    },
  },

  {
    value: "Chilli",
    labels: {
      "en-IN": "Chilli",
      "te-IN": "మిరపకాయ",
      "hi-IN": "मिर्च",
      "ta-IN": "மிளகாய்",
      "kn-IN": "ಮೆಣಸಿನಕಾಯಿ",
      "ml-IN": "മുളക്",
    },
  },

  {
    value: "Turmeric",
    labels: {
      "en-IN": "Turmeric",
      "te-IN": "పసుపు",
      "hi-IN": "हल्दी",
      "ta-IN": "மஞ்சள்",
      "kn-IN": "ಅರಿಶಿನ",
      "ml-IN": "മഞ്ഞൾ",
    },
  },

  {
    value: "Soyabean",
    labels: {
      "en-IN": "Soyabean",
      "te-IN": "సోయాబీన్",
      "hi-IN": "सोयाबीन",
      "ta-IN": "சோயாபீன்",
      "kn-IN": "ಸೋಯಾಬೀನ್",
      "ml-IN": "സോയാബീൻ",
    },
  },

  {
    value: "Bajra",
    labels: {
      "en-IN": "Bajra",
      "te-IN": "సజ్జలు",
      "hi-IN": "बाजरा",
      "ta-IN": "கம்பு",
      "kn-IN": "ಸಜ್ಜೆ",
      "ml-IN": "കമ്പ്",
    },
  },
];

function MarketPrices() {
  const [selectedState, setSelectedState] =
    useState("Telangana");

  const [selectedCrop, setSelectedCrop] =
    useState("Tomato");

  const [prices, setPrices] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const { language } = useSettings();

  const text = useMemo(() => {
    return (
      translations[language] ||
      translations["en-IN"]
    );
  }, [language]);

  useEffect(() => {
    setPrices([]);
    setHasSearched(false);
  }, [language]);

  const getLocalizedLabel = (option) => {
    return (
      option.labels?.[language] ||
      option.labels?.["en-IN"] ||
      option.value
    );
  };

  const fetchPrices = async () => {
    if (
      !selectedState ||
      !selectedCrop
    ) {
      toast.error(text.selectRequired);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setPrices([]);

      const response =
        await getMarketPrices(
          selectedState,
          selectedCrop,
          language
        );

      const marketData =
        Array.isArray(response?.data)
          ? response.data
          : [];

      setPrices(marketData);

      if (marketData.length > 0) {
        toast.success(
          text.pricesUpdated
        );
      } else {
        toast.error(
          text.noMarketData
        );
      }
    } catch (error) {
      console.error(
        "Market Price Error:",
        error?.response?.data ||
          error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          text.fetchFailed
      );

      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchPrices();
  };

  const displayValue = (value) => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return text.notAvailable;
    }

    return value;
  };

  const displayPrice = (value) => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return text.priceNotAvailable;
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 md:p-8">
      <h1 className="mb-3 text-center text-4xl font-bold text-green-700 md:text-5xl">
        📈 {text.pageTitle}
      </h1>

      <p className="mb-10 text-center text-gray-600">
        {text.subtitle}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-10 max-w-4xl rounded-3xl bg-white p-6 shadow-xl md:p-8"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="state"
              className="mb-2 block font-semibold text-gray-700"
            >
              {text.state}
            </label>

            <select
              id="state"
              value={selectedState}
              onChange={(event) => {
                setSelectedState(
                  event.target.value
                );

                setPrices([]);
                setHasSearched(false);
              }}
              disabled={loading}
              className="w-full rounded-xl border-2 border-green-300 bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {text.selectState}
              </option>

              {stateOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {getLocalizedLabel(
                      option
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="crop"
              className="mb-2 block font-semibold text-gray-700"
            >
              {text.crop}
            </label>

            <select
              id="crop"
              value={selectedCrop}
              onChange={(event) => {
                setSelectedCrop(
                  event.target.value
                );

                setPrices([]);
                setHasSearched(false);
              }}
              disabled={loading}
              className="w-full rounded-xl border-2 border-green-300 bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {text.selectCrop}
              </option>

              {cropOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {getLocalizedLabel(
                      option
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
            >
              {loading
                ? text.searching
                : `🔍 ${text.search}`}
            </button>
          </div>
        </div>
      </form>

      {loading && <LoadingSpinner />}

      {!loading && !hasSearched && (
        <div className="mt-16 text-center">
          <div className="mb-5 text-7xl">
            🌾
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            {text.initialTitle}
          </h2>

          <p className="mt-2 text-gray-500">
            {text.initialDescription}
          </p>
        </div>
      )}

      {!loading &&
        hasSearched &&
        prices.length === 0 && (
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
            <div className="mb-4 text-6xl">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              {text.noDataTitle}
            </h2>

            <p className="mt-3 text-gray-500">
              {text.noDataDescription}
            </p>
          </div>
        )}

      {!loading && prices.length > 0 && (
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-green-700 p-5 text-white">
            <h2 className="text-2xl font-bold">
              📊 {text.latestPrices}
            </h2>

            <p className="mt-1 text-green-100">
              {text.showingRecords(
                prices.length
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-green-100">
                <tr className="text-center text-green-800">
                  <th className="p-4">
                    {text.market}
                  </th>

                  <th className="p-4">
                    {text.district}
                  </th>

                  <th className="p-4">
                    {text.commodity}
                  </th>

                  <th className="p-4">
                    {text.variety}
                  </th>

                  <th className="p-4">
                    {text.minPrice}
                  </th>

                  <th className="p-4">
                    {text.maxPrice}
                  </th>

                  <th className="p-4">
                    {text.modalPrice}
                  </th>

                  <th className="p-4">
                    {text.arrivalDate}
                  </th>
                </tr>
              </thead>

              <tbody>
                {prices.map(
                  (item, index) => (
                    <tr
                      key={`${item.market}-${item.arrivalDate}-${index}`}
                      className="border-b text-center transition hover:bg-green-50"
                    >
                      <td className="p-4 font-semibold">
                        {displayValue(
                          item.market
                        )}
                      </td>

                      <td className="p-4">
                        {displayValue(
                          item.district
                        )}
                      </td>

                      <td className="p-4">
                        {displayValue(
                          item.commodity
                        )}
                      </td>

                      <td className="p-4">
                        {displayValue(
                          item.variety
                        )}
                      </td>

                      <td className="p-4 font-semibold text-red-600">
                        ₹{" "}
                        {displayPrice(
                          item.minPrice
                        )}
                      </td>

                      <td className="p-4 font-semibold text-blue-600">
                        ₹{" "}
                        {displayPrice(
                          item.maxPrice
                        )}
                      </td>

                      <td className="p-4 font-bold text-green-700">
                        ₹{" "}
                        {displayPrice(
                          item.modalPrice
                        )}
                      </td>

                      <td className="p-4">
                        {displayValue(
                          item.arrivalDate
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketPrices;