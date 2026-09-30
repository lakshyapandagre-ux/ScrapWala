'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // App
  brandName: string;
  tagline: string;
  selectRole: string;
  collector: string;
  recycler: string;
  admin: string;
  switchRole: string;
  logout: string;
  searchMaterial: string;
  schedulePickup: string;
  sellNow: string;
  continueBtn: string;
  skip: string;
  addNote: string;
  itemsSelected: string;
  tapToUpload: string;
  uploadTip: string;
  uploadPicturesTitle: string;
  selectItemsToSell: string;
  scrapRatesTitle: string;
  trendingRates: string;
  trendingSubtitle: string;
  keepInMind: string;
  scrapRatesOnly: string;
  noHazardousDumping: string;
  noBurning: string;
  noBreaking: string;
  add: string;
  remove: string;
  bulkInfoBanner: string;
  getBulkQuote: string;
  homeTab: string;
  ratesTab: string;
  sellTab: string;
  earningsTab: string;
  profileTab: string;
  totalEarned: string;
  paid: string;
  pending: string;
  eprBonus: string;
  all: string;
  verified: string;
  syncStatus: string;
  estimate: string;
  // Extra detailed keys
  online: string;
  offlineMode: string;
  syncRefresh: string;
  myLotsTitle: string;
  weight: string;
  estRange: string;
  eprEligible: string;
  earningsTitle: string;
  earningsSubtitle: string;
  includesEprBonus: string;
  paymentHistory: string;
  registeredCollector: string;
  myLots: string;
  activeAndHistory: string;
  payoutAccount: string;
  cashOrUpi: string;
  safetyRules: string;
  zeroAcidRisk: string;
  appLanguage: string;
  voiceAssistance: string;
  photosAttached: string;
  notePlaceholder: string;
  pickingUpFrom: string;
  receivePaymentThrough: string;
  requestSummary: string;
  discard: string;
  confirmPickup: string;
  yourLocation: string;
}

const DICTIONARY: Record<Language, Translations> = {
  en: {
    brandName: 'ScrapWala',
    tagline: 'Formal E-Waste & Mineral Recovery',
    selectRole: 'Select Your Role',
    collector: 'Collector',
    recycler: 'Recycler',
    admin: 'Govt Admin',
    switchRole: 'Switch Role',
    logout: 'Log Out',
    searchMaterial: 'Search material or e-waste...',
    schedulePickup: 'Schedule Pickup +',
    sellNow: 'Sell Now',
    continueBtn: 'Continue',
    skip: 'Skip',
    addNote: 'Add a note',
    itemsSelected: 'items selected',
    tapToUpload: 'Tap here to upload images',
    uploadTip: 'Tip: Uploading clear photos speeds up verified pricing and pickup.',
    uploadPicturesTitle: 'Upload scrap items pictures',
    selectItemsToSell: 'Select scrap items to sell',
    scrapRatesTitle: 'Scrap Rates',
    trendingRates: 'Trending rates',
    trendingSubtitle: 'Verified daily benchmark rates in your area',
    keepInMind: 'Please keep in mind',
    scrapRatesOnly: 'We buy only in scrap rates',
    noHazardousDumping: 'No dumping in open drains',
    noBurning: 'Do not burn (Toxic fumes)',
    noBreaking: 'Do not smash (Acid risk)',
    add: '+ Add',
    remove: '− Remove',
    bulkInfoBanner: 'These rates are for regular quantities. For bulk (100+ kg), get higher formal pricing.',
    getBulkQuote: 'Get Bulk Quote',
    homeTab: 'Home',
    ratesTab: 'Rates',
    sellTab: 'Sell',
    earningsTab: 'Earnings',
    profileTab: 'Profile',
    totalEarned: 'Total Earned',
    paid: 'Paid',
    pending: 'Pending',
    eprBonus: 'EPR Bonus',
    all: 'All',
    verified: 'Verified',
    syncStatus: 'Synced',
    estimate: 'Estimate',
    online: 'Online (Connected)',
    offlineMode: 'Offline Mode (Local-First)',
    syncRefresh: 'Sync Refresh',
    myLotsTitle: 'Recent Lots',
    weight: 'Weight',
    estRange: 'Est. Range',
    eprEligible: '+EPR Eligible',
    earningsTitle: 'Earnings',
    earningsSubtitle: 'Ledger of verified payments and EPR bonus',
    includesEprBonus: 'Includes ₹233 Govt EPR bonus',
    paymentHistory: 'Payment History',
    registeredCollector: 'Registered Scrap Collector',
    myLots: 'My Lots',
    activeAndHistory: 'Active & History',
    payoutAccount: 'Payout Account',
    cashOrUpi: 'Cash or UPI',
    safetyRules: 'Safety Rules',
    zeroAcidRisk: 'Zero Acid & Burning Risk',
    appLanguage: 'Language',
    voiceAssistance: 'Voice Assistance',
    photosAttached: 'photos attached',
    notePlaceholder: 'e.g. kept near gate / pickup at 10 AM...',
    pickingUpFrom: 'Picking up from',
    receivePaymentThrough: 'Receive payment through',
    requestSummary: 'Request summary',
    discard: 'Discard',
    confirmPickup: 'Confirm Pickup Request',
    yourLocation: 'Your Location',
  },
  hi: {
    brandName: 'स्क्रैपवाला',
    tagline: 'औपचारिक ई-कचरा व खनिज रिकवरी',
    selectRole: 'भूमिका चुनें',
    collector: 'कबाड़ी मित्र',
    recycler: 'रीसाइक्लर',
    admin: 'खान मंत्रालय',
    switchRole: 'भूमिका बदलें',
    logout: 'लॉग आउट',
    searchMaterial: 'सामग्री खोजें...',
    schedulePickup: 'पिकअप बुक करें +',
    sellNow: 'अभी बेचें',
    continueBtn: 'आगे बढ़ें',
    skip: 'छोड़ें',
    addNote: 'नोट जोड़ें',
    itemsSelected: 'सामग्री चुनी गई',
    tapToUpload: 'फोटो अपलोड करने के लिए छुएं',
    uploadTip: 'सुझाव: साफ फोटो से जल्दी रीसाइक्लर सत्यापन और सही भाव मिलता है।',
    uploadPicturesTitle: 'कबाड़ सामग्री की फोटो अपलोड करें',
    selectItemsToSell: 'बेचने के लिए सामग्री चुनें',
    scrapRatesTitle: 'कबाड़ के आज के दाम',
    trendingRates: 'ट्रेंडिंग स्क्रैप भाव',
    trendingSubtitle: 'आपके क्षेत्र में दैनिक सत्यापित सरकारी व बाज़ार दरें',
    keepInMind: 'कृपया ध्यान रखें (सुरक्षा नियम)',
    scrapRatesOnly: 'केवल प्रमाणित स्क्रैप भाव पर खरीद',
    noHazardousDumping: 'नाली या खुले कचरे में न फेंकें',
    noBurning: 'आग में कभी न जलाएं (जहरीला धुआं)',
    noBreaking: 'हथौड़े से न तोड़ें (एसिड का खतरा)',
    add: '+ चुनें',
    remove: '− हटाएं',
    bulkInfoBanner: 'यह दरें सामान्य वजन के लिए हैं। 100+ kg थोक माल पर अधिक ईपीआर बोनस पाएं।',
    getBulkQuote: 'थोक भाव देखें',
    homeTab: 'होम',
    ratesTab: 'दाम सूची',
    sellTab: 'बेचें',
    earningsTab: 'कमाई',
    profileTab: 'प्रोफ़ाइल',
    totalEarned: 'कुल कमाई',
    paid: 'प्राप्त',
    pending: 'लंबित',
    eprBonus: 'ईपीआर बोनस',
    all: 'सभी',
    verified: 'सत्यापित',
    syncStatus: 'सिंक हुआ',
    estimate: 'अनुमानित',
    online: 'ऑनलाइन (सक्रिय)',
    offlineMode: 'ऑफलाइन मोड (लोकल-फर्स्ट)',
    syncRefresh: 'सिंक रिफ्रेश',
    myLotsTitle: 'मेरे हाल के लॉट',
    weight: 'वजन',
    estRange: 'अनुमानित सीमा',
    eprEligible: '+EPR पात्र',
    earningsTitle: 'मेरी कमाई',
    earningsSubtitle: 'कुल भुगतान और ईपीआर बोनस का खाता-बही',
    includesEprBonus: 'जिसमें ₹233 सरकारी ईपीआर बोनस शामिल है',
    paymentHistory: 'भुगतान इतिहास',
    registeredCollector: 'पंजीकृत कबाड़ी मित्र',
    myLots: 'मेरे लॉट',
    activeAndHistory: 'सक्रिय व इतिहास',
    payoutAccount: 'भुगतान खाता',
    cashOrUpi: 'नकद या UPI',
    safetyRules: 'सुरक्षा नियम',
    zeroAcidRisk: 'एसिड व आग से बचाव',
    appLanguage: 'ऐप भाषा',
    voiceAssistance: 'ध्वनि सहायता',
    photosAttached: 'फोटो जुड़े हुए हैं',
    notePlaceholder: 'उदा. लिफ्ट के पास रखा है / सुबह 10 बजे पिकअप...',
    pickingUpFrom: 'पिकअप स्थान',
    receivePaymentThrough: 'भुगतान का माध्यम',
    requestSummary: 'ऑर्डर सारांश',
    discard: 'रद्द करें',
    confirmPickup: 'पिकअप अनुरोध भेजें',
    yourLocation: 'आपका स्थान',
  },
  mr: {
    brandName: 'स्क्रॅपवाला',
    tagline: 'ई-कचरा व खनिज पुनर्प्राप्ती',
    selectRole: 'भूमिका निवडा',
    collector: 'कबाडी मित्र',
    recycler: 'रीसायकलर',
    admin: 'खाण मंत्रालय',
    switchRole: 'भूमिका बदला',
    logout: 'बाहेर पडा',
    searchMaterial: 'साहित्य शोधा...',
    schedulePickup: 'पिकअप नोंदवा +',
    sellNow: 'आता विका',
    continueBtn: 'पुढे जा',
    skip: 'वगळा',
    addNote: 'नोंद जोडा',
    itemsSelected: 'वस्तू निवडल्या',
    tapToUpload: 'फोटो अपलोड करण्यासाठी स्पर्श करा',
    uploadTip: 'टीप: स्पष्ट फोटोमुळे रीसायकलर कडून योग्य दर आणि जलद पिकअप मिळते.',
    uploadPicturesTitle: 'भंगार वस्तूंचे फोटो अपलोड करा',
    selectItemsToSell: 'विक्रीसाठी वस्तू निवडा',
    scrapRatesTitle: 'आजचे भंगार दर',
    trendingRates: 'ट्रेंडिंग भंगार दर',
    trendingSubtitle: 'आपल्या परिसरातील अधिकृत दैनिक दर',
    keepInMind: 'कृपया लक्षात ठेवा',
    scrapRatesOnly: 'फक्त स्क्रॅप दराने खरेदी',
    noHazardousDumping: 'उघड्यावर किंवा नाल्यात टाकू नका',
    noBurning: 'कधीही जाळू नका (विषारी धूर)',
    noBreaking: 'तोडू किंवा फोडू नका (अ‍ॅसिडचा धोका)',
    add: '+ जोडा',
    remove: '− काढा',
    bulkInfoBanner: 'हे दर सामान्य वजनासाठी आहेत. 100+ kg मोठ्या मालासाठी जास्त बोनस मिळवा.',
    getBulkQuote: 'घाऊक दर मिळवा',
    homeTab: 'मुख्य',
    ratesTab: 'दर यादी',
    sellTab: 'विका',
    earningsTab: 'कमाई',
    profileTab: 'प्रोफाइल',
    totalEarned: 'एकूण कमाई',
    paid: 'मिळाले',
    pending: 'प्रलंबित',
    eprBonus: 'ईपीआर बोनस',
    all: 'सर्व',
    verified: 'तपासलेले',
    syncStatus: 'सिंक झाले',
    estimate: 'अंदाजे',
    online: 'ऑनलाइन (सक्रिय)',
    offlineMode: 'ऑफलाइन मोड',
    syncRefresh: 'सिंक रिफ्रेश',
    myLotsTitle: 'माझे अलीकडील लॉट',
    weight: 'वजन',
    estRange: 'अंदाजे मर्यादा',
    eprEligible: '+EPR पात्र',
    earningsTitle: 'माझी कमाई',
    earningsSubtitle: 'पेमेंट आणि ईपीआर बोनस तपशील',
    includesEprBonus: 'ज्यामध्ये ₹२३३ सरकारी ईपीआर बोनस समाविष्ट आहे',
    paymentHistory: 'पेमेंट इतिहास',
    registeredCollector: 'नोंदणीकृत कबाडी मित्र',
    myLots: 'माझे लॉट',
    activeAndHistory: 'सक्रिय आणि इतिहास',
    payoutAccount: 'पेमेंट खाते',
    cashOrUpi: 'रोख किंवा UPI',
    safetyRules: 'सुरक्षा नियम',
    zeroAcidRisk: 'अ‍ॅसिड व आगीपासून बचाव',
    appLanguage: 'अ‍ॅप भाषा',
    voiceAssistance: 'आवाज सहाय्य',
    photosAttached: 'फोटो जोडले आहेत',
    notePlaceholder: 'उदा. मुख्य गेटजवळ ठेवले आहे...',
    pickingUpFrom: 'पिकअप ठिकाण',
    receivePaymentThrough: 'पेमेंट पद्धत',
    requestSummary: 'मागणी सारांश',
    discard: 'रद्द करा',
    confirmPickup: 'पिकअप विनंती पाठवा',
    yourLocation: 'आपले ठिकाण',
  },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('scrapwala_lang') as Language | null;
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'mr')) {
        setLangState(savedLang);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapwala_lang', newLang);
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTIONARY[lang] }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
