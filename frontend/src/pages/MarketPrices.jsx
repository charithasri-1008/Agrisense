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
      "Compare the latest mandi prices and choose the best market for your crop.",

    badge: "Live Agricultural Market Insights",
    heroTitle: "Know the right price before you sell",
    heroDescription:
      "Explore district-wise crop prices, compare market rates and make informed selling decisions.",

    state: "State",
    district: "District",
    districtOptional: "District (Optional)",
    crop: "Crop",

    selectState: "Select State",
    selectDistrict: "All Districts",
    selectCrop: "Select Crop",

    search: "Search Prices",
    searching: "Searching...",

    quickCrops: "Quick Crop Selection",

    initialTitle: "Search Market Prices",
    initialDescription:
      "Select a state and crop to view the latest available mandi prices.",

    noDataTitle: "No Market Data Found",
    noDataDescription:
      "Try selecting another state, district or crop.",

    latestPrices: "Latest Market Prices",
    showingRecords: (count) =>
      `Showing ${count} market records`,

    showingAcross: (crop, state) =>
      `Showing ${crop} prices across ${state}`,

    showingDistrict: (crop, district, state) =>
      `Showing ${crop} prices in ${district}, ${state}`,

    averagePrice: "Average Modal Price",
    minimumPrice: "Lowest Price",
    maximumPrice: "Highest Price",
    totalMarkets: "Total Markets",

    market: "Market",
    districtLabel: "District",
    commodity: "Commodity",
    variety: "Variety",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    modalPrice: "Modal Price",
    arrivalDate: "Arrival Date",

    priceUnit: "Prices shown in ₹ per quintal",
    dataNotice:
      "Market prices may change during the day. Verify the final rate with the local mandi before selling.",

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
      "తాజా మండీ ధరలను పోల్చి మీ పంటకు సరైన మార్కెట్‌ను ఎంచుకోండి.",

    badge: "తాజా వ్యవసాయ మార్కెట్ సమాచారం",
    heroTitle: "పంటను అమ్మే ముందు సరైన ధరను తెలుసుకోండి",
    heroDescription:
      "జిల్లాల వారీగా పంట ధరలను తెలుసుకుని సరైన నిర్ణయం తీసుకోండి.",

    state: "రాష్ట్రం",
    district: "జిల్లా",
    districtOptional: "జిల్లా (ఐచ్ఛికం)",
    crop: "పంట",

    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    selectDistrict: "అన్ని జిల్లాలు",
    selectCrop: "పంటను ఎంచుకోండి",

    search: "ధరలను వెతకండి",
    searching: "వెతుకుతోంది...",

    quickCrops: "త్వరిత పంట ఎంపిక",

    initialTitle: "మార్కెట్ ధరలను వెతకండి",
    initialDescription:
      "తాజా మండీ ధరలను చూడటానికి రాష్ట్రం మరియు పంటను ఎంచుకోండి.",

    noDataTitle: "మార్కెట్ సమాచారం లభించలేదు",
    noDataDescription:
      "మరో రాష్ట్రం, జిల్లా లేదా పంటను ఎంచుకుని ప్రయత్నించండి.",

    latestPrices: "తాజా మార్కెట్ ధరలు",
    showingRecords: (count) =>
      `${count} మార్కెట్ రికార్డులు చూపబడుతున్నాయి`,

    showingAcross: (crop, state) =>
      `${state} అంతటా ${crop} ధరలు చూపబడుతున్నాయి`,

    showingDistrict: (crop, district, state) =>
      `${district}, ${state} లో ${crop} ధరలు చూపబడుతున్నాయి`,

    averagePrice: "సగటు సాధారణ ధర",
    minimumPrice: "కనిష్ఠ ధర",
    maximumPrice: "గరిష్ఠ ధర",
    totalMarkets: "మొత్తం మార్కెట్లు",

    market: "మార్కెట్",
    districtLabel: "జిల్లా",
    commodity: "పంట",
    variety: "రకం",
    minPrice: "కనిష్ఠ ధర",
    maxPrice: "గరిష్ఠ ధర",
    modalPrice: "సాధారణ ధర",
    arrivalDate: "వచ్చిన తేదీ",

    priceUnit: "ధరలు క్వింటాల్‌కు రూపాయల్లో చూపబడతాయి",
    dataNotice:
      "మార్కెట్ ధరలు రోజులో మారవచ్చు. అమ్మే ముందు స్థానిక మండీలో ధరను నిర్ధారించండి.",

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
      "नवीनतम मंडी भाव की तुलना करें और सही बाज़ार चुनें।",

    badge: "लाइव कृषि बाज़ार जानकारी",
    heroTitle: "बेचने से पहले सही कीमत जानें",
    heroDescription:
      "जिले के अनुसार फसल की कीमतें देखें और सही निर्णय लें।",

    state: "राज्य",
    district: "जिला",
    districtOptional: "जिला (वैकल्पिक)",
    crop: "फसल",

    selectState: "राज्य चुनें",
    selectDistrict: "सभी जिले",
    selectCrop: "फसल चुनें",

    search: "कीमत खोजें",
    searching: "खोज जारी है...",

    quickCrops: "त्वरित फसल चयन",

    initialTitle: "बाज़ार भाव खोजें",
    initialDescription:
      "नवीनतम मंडी भाव देखने के लिए राज्य और फसल चुनें।",

    noDataTitle: "बाज़ार डेटा नहीं मिला",
    noDataDescription:
      "दूसरा राज्य, जिला या फसल चुनकर प्रयास करें।",

    latestPrices: "नवीनतम बाज़ार भाव",
    showingRecords: (count) =>
      `${count} बाज़ार रिकॉर्ड दिखाए जा रहे हैं`,

    showingAcross: (crop, state) =>
      `${state} में ${crop} की कीमतें दिखाई जा रही हैं`,

    showingDistrict: (crop, district, state) =>
      `${district}, ${state} में ${crop} की कीमतें दिखाई जा रही हैं`,

    averagePrice: "औसत सामान्य कीमत",
    minimumPrice: "सबसे कम कीमत",
    maximumPrice: "सबसे अधिक कीमत",
    totalMarkets: "कुल बाज़ार",

    market: "बाज़ार",
    districtLabel: "जिला",
    commodity: "फसल",
    variety: "किस्म",
    minPrice: "न्यूनतम कीमत",
    maxPrice: "अधिकतम कीमत",
    modalPrice: "सामान्य कीमत",
    arrivalDate: "आगमन तिथि",

    priceUnit: "कीमतें ₹ प्रति क्विंटल में दिखाई गई हैं",
    dataNotice:
      "बाज़ार की कीमतें दिन के दौरान बदल सकती हैं। बेचने से पहले स्थानीय मंडी में पुष्टि करें।",

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
      "சமீபத்திய மண்டி விலைகளை ஒப்பிட்டு சரியான சந்தையைத் தேர்வு செய்யுங்கள்.",

    badge: "நேரடி வேளாண் சந்தை தகவல்",
    heroTitle: "விற்பதற்கு முன் சரியான விலையை அறியுங்கள்",
    heroDescription:
      "மாவட்ட வாரியான பயிர் விலைகளைப் பார்த்து சரியான முடிவை எடுக்குங்கள்.",

    state: "மாநிலம்",
    district: "மாவட்டம்",
    districtOptional: "மாவட்டம் (விருப்பம்)",
    crop: "பயிர்",

    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDistrict: "அனைத்து மாவட்டங்கள்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",

    search: "விலைகளைத் தேடுங்கள்",
    searching: "தேடப்படுகிறது...",

    quickCrops: "விரைவு பயிர் தேர்வு",

    initialTitle: "சந்தை விலைகளைத் தேடுங்கள்",
    initialDescription:
      "சமீபத்திய விலைகளைப் பார்க்க மாநிலம் மற்றும் பயிரைத் தேர்ந்தெடுக்கவும்.",

    noDataTitle: "சந்தை தகவல் கிடைக்கவில்லை",
    noDataDescription:
      "வேறொரு மாநிலம், மாவட்டம் அல்லது பயிரைத் தேர்ந்தெடுக்கவும்.",

    latestPrices: "சமீபத்திய சந்தை விலைகள்",
    showingRecords: (count) =>
      `${count} சந்தை பதிவுகள் காட்டப்படுகின்றன`,

    showingAcross: (crop, state) =>
      `${state} முழுவதும் ${crop} விலைகள் காட்டப்படுகின்றன`,

    showingDistrict: (crop, district, state) =>
      `${district}, ${state} இல் ${crop} விலைகள் காட்டப்படுகின்றன`,

    averagePrice: "சராசரி விலை",
    minimumPrice: "குறைந்த விலை",
    maximumPrice: "அதிக விலை",
    totalMarkets: "மொத்த சந்தைகள்",

    market: "சந்தை",
    districtLabel: "மாவட்டம்",
    commodity: "பயிர்",
    variety: "வகை",
    minPrice: "குறைந்தபட்ச விலை",
    maxPrice: "அதிகபட்ச விலை",
    modalPrice: "பொதுவான விலை",
    arrivalDate: "வருகை தேதி",

    priceUnit: "விலைகள் ஒரு குவிண்டாலுக்கு ரூபாயில் காட்டப்படுகின்றன",
    dataNotice:
      "சந்தை விலைகள் நாளின் போது மாறலாம். விற்பதற்கு முன் உள்ளூர் சந்தையில் உறுதிப்படுத்தவும்.",

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
      "ಇತ್ತೀಚಿನ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಿ ಉತ್ತಮ ಮಾರುಕಟ್ಟೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",

    badge: "ಲೈವ್ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ",
    heroTitle: "ಮಾರಾಟ ಮಾಡುವ ಮೊದಲು ಸರಿಯಾದ ಬೆಲೆ ತಿಳಿಯಿರಿ",
    heroDescription:
      "ಜಿಲ್ಲಾವಾರು ಬೆಳೆ ಬೆಲೆಗಳನ್ನು ನೋಡಿ ಸರಿಯಾದ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳಿ.",

    state: "ರಾಜ್ಯ",
    district: "ಜಿಲ್ಲೆ",
    districtOptional: "ಜಿಲ್ಲೆ (ಐಚ್ಛಿಕ)",
    crop: "ಬೆಳೆ",

    selectState: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    selectDistrict: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    selectCrop: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",

    search: "ಬೆಲೆ ಹುಡುಕಿ",
    searching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",

    quickCrops: "ತ್ವರಿತ ಬೆಳೆ ಆಯ್ಕೆ",

    initialTitle: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಹುಡುಕಿ",
    initialDescription:
      "ಇತ್ತೀಚಿನ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ರಾಜ್ಯ ಮತ್ತು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",

    noDataTitle: "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ",
    noDataDescription:
      "ಬೇರೆ ರಾಜ್ಯ, ಜಿಲ್ಲೆ ಅಥವಾ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",

    latestPrices: "ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    showingRecords: (count) =>
      `${count} ಮಾರುಕಟ್ಟೆ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ`,

    showingAcross: (crop, state) =>
      `${state} ರಾಜ್ಯದಾದ್ಯಂತ ${crop} ಬೆಲೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ`,

    showingDistrict: (crop, district, state) =>
      `${district}, ${state} ನಲ್ಲಿ ${crop} ಬೆಲೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ`,

    averagePrice: "ಸರಾಸರಿ ಸಾಮಾನ್ಯ ಬೆಲೆ",
    minimumPrice: "ಕನಿಷ್ಠ ಬೆಲೆ",
    maximumPrice: "ಗರಿಷ್ಠ ಬೆಲೆ",
    totalMarkets: "ಒಟ್ಟು ಮಾರುಕಟ್ಟೆಗಳು",

    market: "ಮಾರುಕಟ್ಟೆ",
    districtLabel: "ಜಿಲ್ಲೆ",
    commodity: "ಬೆಳೆ",
    variety: "ತಳಿ",
    minPrice: "ಕನಿಷ್ಠ ಬೆಲೆ",
    maxPrice: "ಗರಿಷ್ಠ ಬೆಲೆ",
    modalPrice: "ಸಾಮಾನ್ಯ ಬೆಲೆ",
    arrivalDate: "ಆಗಮನ ದಿನಾಂಕ",

    priceUnit: "ಬೆಲೆಗಳು ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ರೂಪಾಯಿಗಳಲ್ಲಿ",
    dataNotice:
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ದಿನದಲ್ಲಿ ಬದಲಾಗಬಹುದು. ಮಾರಾಟಕ್ಕೂ ಮೊದಲು ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ದೃಢೀಕರಿಸಿ.",

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
      "പുതിയ മണ്ഡി വിലകൾ താരതമ്യം ചെയ്ത് മികച്ച വിപണി തിരഞ്ഞെടുക്കുക.",

    badge: "തത്സമയ കാർഷിക വിപണി വിവരം",
    heroTitle: "വിൽക്കുന്നതിന് മുമ്പ് ശരിയായ വില അറിയുക",
    heroDescription:
      "ജില്ല തിരിച്ചുള്ള വിളവിലകൾ പരിശോധിച്ച് മികച്ച തീരുമാനം എടുക്കുക.",

    state: "സംസ്ഥാനം",
    district: "ജില്ല",
    districtOptional: "ജില്ല (ഓപ്ഷണൽ)",
    crop: "വിള",

    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    selectDistrict: "എല്ലാ ജില്ലകളും",
    selectCrop: "വിള തിരഞ്ഞെടുക്കുക",

    search: "വില തിരയുക",
    searching: "തിരയുന്നു...",

    quickCrops: "വേഗത്തിലുള്ള വിള തിരഞ്ഞെടുപ്പ്",

    initialTitle: "വിപണി വിലകൾ തിരയുക",
    initialDescription:
      "പുതിയ വിലകൾ കാണാൻ സംസ്ഥാനവും വിളയും തിരഞ്ഞെടുക്കുക.",

    noDataTitle: "വിപണി വിവരങ്ങൾ ലഭിച്ചില്ല",
    noDataDescription:
      "മറ്റൊരു സംസ്ഥാനം, ജില്ല അല്ലെങ്കിൽ വിള തിരഞ്ഞെടുക്കുക.",

    latestPrices: "പുതിയ വിപണി വിലകൾ",
    showingRecords: (count) =>
      `${count} വിപണി രേഖകൾ കാണിക്കുന്നു`,

    showingAcross: (crop, state) =>
      `${state} മുഴുവൻ ${crop} വിലകൾ കാണിക്കുന്നു`,

    showingDistrict: (crop, district, state) =>
      `${district}, ${state} ലെ ${crop} വിലകൾ കാണിക്കുന്നു`,

    averagePrice: "ശരാശരി വില",
    minimumPrice: "കുറഞ്ഞ വില",
    maximumPrice: "കൂടിയ വില",
    totalMarkets: "ആകെ വിപണികൾ",

    market: "വിപണി",
    districtLabel: "ജില്ല",
    commodity: "വിള",
    variety: "ഇനം",
    minPrice: "കുറഞ്ഞ വില",
    maxPrice: "കൂടിയ വില",
    modalPrice: "സാധാരണ വില",
    arrivalDate: "വരവ് തീയതി",

    priceUnit: "വിലകൾ ക്വിന്റലിന് രൂപയിൽ കാണിക്കുന്നു",
    dataNotice:
      "വിപണി വിലകൾ ദിവസത്തിൽ മാറാം. വിൽക്കുന്നതിന് മുമ്പ് പ്രാദേശിക വിപണിയിൽ സ്ഥിരീകരിക്കുക.",

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
    icon: "🍅",
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
    icon: "🥔",
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
    icon: "🧅",
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
    icon: "🌾",
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
    icon: "🌾",
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
    icon: "🌽",
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
    icon: "☁️",
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
    icon: "🥜",
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
    icon: "🌶️",
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
    icon: "🟡",
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
    icon: "🫘",
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
    icon: "🌿",
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

  const [selectedDistrict, setSelectedDistrict] =
    useState("");

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
    setSelectedDistrict("");
    setHasSearched(false);
  }, [language]);

  const getLocalizedLabel = (option) => {
    return (
      option.labels?.[language] ||
      option.labels?.["en-IN"] ||
      option.value
    );
  };

  const parsePrice = (value) => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return null;
    }

    const numericValue = Number(
      String(value).replace(/,/g, "")
    );

    return Number.isFinite(numericValue)
      ? numericValue
      : null;
  };

  const formatPrice = (value) => {
    const numericValue = parsePrice(value);

    if (numericValue === null) {
      return text.priceNotAvailable;
    }

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(numericValue);
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

  const districtOptions = useMemo(() => {
    const districts = prices
      .map((item) => item?.district)
      .filter(
        (district) =>
          district &&
          String(district).trim() !== ""
      )
      .map((district) =>
        String(district).trim()
      );

    return [...new Set(districts)].sort(
      (first, second) =>
        first.localeCompare(second)
    );
  }, [prices]);

  useEffect(() => {
    if (
      selectedDistrict &&
      !districtOptions.includes(
        selectedDistrict
      )
    ) {
      setSelectedDistrict("");
    }
  }, [districtOptions, selectedDistrict]);

  const filteredPrices = useMemo(() => {
    if (!selectedDistrict) {
      return prices;
    }

    return prices.filter((item) => {
      return (
        String(item?.district || "")
          .trim()
          .toLowerCase() ===
        selectedDistrict
          .trim()
          .toLowerCase()
      );
    });
  }, [prices, selectedDistrict]);

  const statistics = useMemo(() => {
    const minimumValues =
      filteredPrices
        .map((item) =>
          parsePrice(item?.minPrice)
        )
        .filter((value) => value !== null);

    const maximumValues =
      filteredPrices
        .map((item) =>
          parsePrice(item?.maxPrice)
        )
        .filter((value) => value !== null);

    const modalValues =
      filteredPrices
        .map((item) =>
          parsePrice(item?.modalPrice)
        )
        .filter((value) => value !== null);

    const averageModal =
      modalValues.length > 0
        ? Math.round(
            modalValues.reduce(
              (total, value) =>
                total + value,
              0
            ) / modalValues.length
          )
        : null;

    const minimumPrice =
      minimumValues.length > 0
        ? Math.min(...minimumValues)
        : null;

    const maximumPrice =
      maximumValues.length > 0
        ? Math.max(...maximumValues)
        : null;

    const markets = new Set(
      filteredPrices
        .map((item) => item?.market)
        .filter(Boolean)
    );

    return {
      averageModal,
      minimumPrice,
      maximumPrice,
      totalMarkets: markets.size,
    };
  }, [filteredPrices]);

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

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedDistrict("");
    setPrices([]);
    setHasSearched(false);
  };

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
    setSelectedDistrict("");
    setPrices([]);
    setHasSearched(false);
  };

  const handleQuickCrop = (crop) => {
    setSelectedCrop(crop);
    setSelectedDistrict("");
    setPrices([]);
    setHasSearched(false);
  };

  const currentCropLabel = useMemo(() => {
    const crop = cropOptions.find(
      (option) =>
        option.value === selectedCrop
    );

    return crop
      ? getLocalizedLabel(crop)
      : selectedCrop;
  }, [selectedCrop, language]);

  const currentStateLabel = useMemo(() => {
    const state = stateOptions.find(
      (option) =>
        option.value === selectedState
    );

    return state
      ? getLocalizedLabel(state)
      : selectedState;
  }, [selectedState, language]);

  const resultDescription =
    selectedDistrict
      ? text.showingDistrict(
          currentCropLabel,
          selectedDistrict,
          currentStateLabel
        )
      : text.showingAcross(
          currentCropLabel,
          currentStateLabel
        );

  const summaryCards = [
    {
      title: text.averagePrice,
      value:
        statistics.averageModal === null
          ? text.priceNotAvailable
          : `₹${formatPrice(
              statistics.averageModal
            )}`,
      icon: "📊",
      border:
        "border-emerald-100",
      iconBackground:
        "bg-emerald-100",
    },
    {
      title: text.minimumPrice,
      value:
        statistics.minimumPrice === null
          ? text.priceNotAvailable
          : `₹${formatPrice(
              statistics.minimumPrice
            )}`,
      icon: "📉",
      border:
        "border-orange-100",
      iconBackground:
        "bg-orange-100",
    },
    {
      title: text.maximumPrice,
      value:
        statistics.maximumPrice === null
          ? text.priceNotAvailable
          : `₹${formatPrice(
              statistics.maximumPrice
            )}`,
      icon: "📈",
      border:
        "border-blue-100",
      iconBackground:
        "bg-blue-100",
    },
    {
      title: text.totalMarkets,
      value:
        statistics.totalMarkets,
      icon: "🏪",
      border:
        "border-purple-100",
      iconBackground:
        "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-900 via-green-800 to-lime-700 px-6 py-9 text-white shadow-xl md:px-10 md:py-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <span>🌿</span>
                <span>{text.badge}</span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {text.heroTitle}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
                {text.heroDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  📍 District-wise prices
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  📊 Market comparison
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  🌾 Multiple crops
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[270px] lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-56 w-56 items-center justify-center rounded-full border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur">
                  🌾
                </div>
              </div>

              <div className="absolute right-0 top-3 rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur">
                <p className="text-xs text-emerald-100">
                  Live Insights
                </p>
                <p className="mt-1 text-lg font-bold">
                  Smart Prices
                </p>
              </div>

              <div className="absolute bottom-2 left-0 rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur">
                <p className="text-xs text-emerald-100">
                  Coverage
                </p>
                <p className="mt-1 text-lg font-bold">
                  District Markets
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-5 max-w-6xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              📈 {text.pageTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {text.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {text.state}
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                  htmlFor="district"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {text.districtOptional}
                </label>

                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={(event) =>
                    setSelectedDistrict(
                      event.target.value
                    )
                  }
                  disabled={
                    loading ||
                    districtOptions.length ===
                      0
                  }
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {text.selectDistrict}
                  </option>

                  {districtOptions.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    )
                  )}
                </select>

                {districtOptions.length ===
                  0 &&
                  !loading && (
                    <p className="mt-2 text-xs text-slate-400">
                      Search once to load available districts.
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="crop"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {text.crop}
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="crop"
                  value={selectedCrop}
                  onChange={handleCropChange}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-200 transition duration-200 hover:-translate-y-0.5 hover:from-green-800 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span>
                    {loading
                      ? "⏳"
                      : "🔍"}
                  </span>

                  <span>
                    {loading
                      ? text.searching
                      : text.search}
                  </span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-5">
            <p className="mb-3 text-sm font-bold text-slate-700">
              {text.quickCrops}
            </p>

            <div className="flex flex-wrap gap-2">
              {cropOptions
                .slice(0, 9)
                .map((crop) => {
                  const isSelected =
                    selectedCrop ===
                    crop.value;

                  return (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() =>
                        handleQuickCrop(
                          crop.value
                        )
                      }
                      disabled={loading}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "border-green-700 bg-green-700 text-white shadow-md"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                      }`}
                    >
                      <span className="mr-2">
                        {crop.icon}
                      </span>

                      {getLocalizedLabel(
                        crop
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </section>

        {loading && (
          <div className="py-14">
            <LoadingSpinner />
          </div>
        )}

        {!loading &&
          !hasSearched && (
            <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl">
                🌾
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-800">
                {text.initialTitle}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                {text.initialDescription}
              </p>
            </section>
          )}

        {!loading &&
          hasSearched &&
          prices.length === 0 && (
            <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-5xl">
                🔍
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-800">
                {text.noDataTitle}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {text.noDataDescription}
              </p>
            </section>
          )}

        {!loading &&
          prices.length > 0 && (
            <>
              <section className="mt-8">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-slate-900">
                    {text.latestPrices}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {resultDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map(
                    (card) => (
                      <article
                        key={card.title}
                        className={`rounded-3xl border ${card.border} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-500">
                              {card.title}
                            </p>

                            <p className="mt-3 text-2xl font-black text-slate-900">
                              {card.value}
                            </p>
                          </div>

                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${card.iconBackground} text-2xl`}
                          >
                            {card.icon}
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </section>

              <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                <div className="flex flex-col gap-4 bg-gradient-to-r from-green-800 to-emerald-700 px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black sm:text-2xl">
                      📊{" "}
                      {text.latestPrices}
                    </h2>

                    <p className="mt-1 text-sm text-green-100">
                      {text.showingRecords(
                        filteredPrices.length
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                    {text.priceUnit}
                  </div>
                </div>

                {filteredPrices.length >
                0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px]">
                      <thead className="bg-slate-100">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-600">
                          <th className="px-5 py-4">
                            {text.market}
                          </th>

                          <th className="px-5 py-4">
                            {
                              text.districtLabel
                            }
                          </th>

                          <th className="px-5 py-4">
                            {text.commodity}
                          </th>

                          <th className="px-5 py-4">
                            {text.variety}
                          </th>

                          <th className="px-5 py-4 text-center">
                            {text.minPrice}
                          </th>

                          <th className="px-5 py-4 text-center">
                            {text.maxPrice}
                          </th>

                          <th className="px-5 py-4 text-center">
                            {
                              text.modalPrice
                            }
                          </th>

                          <th className="px-5 py-4">
                            {
                              text.arrivalDate
                            }
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredPrices.map(
                          (
                            item,
                            index
                          ) => (
                            <tr
                              key={`${item.market}-${item.arrivalDate}-${index}`}
                              className="transition hover:bg-green-50/70"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-lg">
                                    🏪
                                  </div>

                                  <span className="font-bold text-slate-800">
                                    {displayValue(
                                      item.market
                                    )}
                                  </span>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
                                  📍{" "}
                                  {displayValue(
                                    item.district
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                {displayValue(
                                  item.commodity
                                )}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {displayValue(
                                  item.variety
                                )}
                              </td>

                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex rounded-xl bg-orange-50 px-3 py-2 font-bold text-orange-700">
                                  ₹
                                  {formatPrice(
                                    item.minPrice
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex rounded-xl bg-blue-50 px-3 py-2 font-bold text-blue-700">
                                  ₹
                                  {formatPrice(
                                    item.maxPrice
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex rounded-xl bg-green-100 px-3 py-2 font-black text-green-800">
                                  ₹
                                  {formatPrice(
                                    item.modalPrice
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm font-medium text-slate-600">
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
                ) : (
                  <div className="p-10 text-center">
                    <div className="text-5xl">
                      📍
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-800">
                      {
                        text.noDataTitle
                      }
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {
                        text.noDataDescription
                      }
                    </p>
                  </div>
                )}
              </section>

              <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                      💡
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Market Information
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {text.dataNotice}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                    Current Selection
                  </p>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">
                        {text.state}
                      </span>

                      <span className="font-bold text-slate-800">
                        {
                          currentStateLabel
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">
                        {text.district}
                      </span>

                      <span className="font-bold text-slate-800">
                        {selectedDistrict ||
                          text.selectDistrict}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">
                        {text.crop}
                      </span>

                      <span className="font-bold text-slate-800">
                        {
                          currentCropLabel
                        }
                      </span>
                    </div>
                  </div>
                </article>
              </section>
            </>
          )}
      </main>
    </div>
  );
}

export default MarketPrices;