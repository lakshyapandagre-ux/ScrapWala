'use client';

import React, { useState } from 'react';
import {
  Recycle,
  Building2,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  Globe,
  Camera,
  Coins,
  CheckCircle2,
  Volume2,
  ChevronLeft,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, UserProfile } from '@/lib/auth-context';
import { useI18n, Language } from '@/lib/i18n';
import { AudioButton } from '../audio-button/AudioButton';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase-client';
import { OnboardingSlides } from './OnboardingSlides';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { LocationPermissionBanner } from '../ui/LocationPermissionBanner';

export type AuthStep = 'slides' | 'language' | 'role' | 'questions' | 'auth';

export const AuthScreen: React.FC<{ onClose?: () => void; initialStep?: AuthStep }> = ({ onClose, initialStep }) => {
  const router = useRouter();
  const { loginWithGoogle, signupWithRole, loginAsDemoUser, isConfigured } = useAuth();
  const { lang, setLang, t } = useI18n();
  const recyclerGeo = useGeolocation();

  // Wizard Flow State - synchronous initial check prevents flashes
  const [currentStep, setCurrentStep] = useState<AuthStep>(() => {
    if (initialStep) return initialStep;
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('scrapwala_onboarding_completed') === 'true';
      if (!completed) return 'slides';
      const hasLang = Boolean(localStorage.getItem('scrapwala_lang'));
      if (!hasLang) return 'language';
      return 'role';
    }
    return 'role';
  });

  // User Selection State
  const [selectedLang, setSelectedLang] = useState<Language>(lang || 'hi');
  const [selectedRole, setSelectedRole] = useState<UserRole>('collector');

  // Role Questions State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Recycler specific
  const [facilityName, setFacilityName] = useState('');
  const [spcbLicense, setSpcbLicense] = useState('');

  // Admin specific
  const [dept, setDept] = useState('');

  // Email Auth State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advance from slides to language or role
  const handleSlidesDone = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('scrapwala_onboarding_completed', 'true');
        const savedLang = localStorage.getItem('scrapwala_lang');
        if (savedLang) {
          setCurrentStep('role');
          return;
        }
      }
    } catch (e) {
      console.warn('Could not write onboarding state', e);
    }
    setCurrentStep('language');
  };

  // Advance from language to role
  const handleLanguageDone = () => {
    setLang(selectedLang);
    setCurrentStep('role');
  };

  // Advance from role to questions
  const handleRoleDone = () => {
    setCurrentStep('questions');
  };

  // Advance from questions to final auth
  const handleQuestionsDone = () => {
    setCurrentStep('auth');
  };

  // Handle Google Login
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      if (isConfigured) {
        await loginWithGoogle();
      } else {
        // Fallback for immediate demo testing
        await signupWithRole(selectedRole, {
          fullName: fullName || (selectedRole === 'collector' ? 'Lakshya' : selectedRole === 'recycler' ? 'राजेश वर्मा' : 'डॉ. संजय मेहता'),
          phone,
          operatingCity: city || 'Indore',
          preferredLanguage: selectedLang,
          facilityName,
          spcbLicense,
          department: dept,
          gps_lat: recyclerGeo.lat ?? undefined,
          gps_lng: recyclerGeo.lng ?? undefined,
        });
      }
      if (onClose) onClose();
      router.push(`/${selectedRole}`);
    } catch (err: any) {
      setAuthError(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('कृपया ईमेल और पासवर्ड दर्ज करें');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const res = await signUpWithEmail(email, password, {
          full_name: fullName || (selectedRole === 'collector' ? 'Lakshya' : selectedRole === 'recycler' ? 'राजेश वर्मा' : 'डॉ. संजय मेहता'),
          role: selectedRole,
          preferred_language: selectedLang,
          city: city || 'Indore',
        });
        if (res.error) throw res.error;
      } else {
        const res = await signInWithEmail(email, password);
        if (res.error) throw res.error;
      }

      await signupWithRole(selectedRole, {
        fullName: fullName || (selectedRole === 'collector' ? 'Lakshya' : selectedRole === 'recycler' ? 'राजेश वर्मा' : 'डॉ. संजय मेहता'),
        email,
        phone,
        operatingCity: city || 'Indore',
        preferredLanguage: selectedLang,
        facilityName,
        spcbLicense,
        department: dept,
        gps_lat: recyclerGeo.lat ?? undefined,
        gps_lng: recyclerGeo.lng ?? undefined,
      });

      if (onClose) onClose();
      router.push(`/${selectedRole}`);
    } catch (err: any) {
      setAuthError(err?.message || 'प्रमाणीकरण विफल रहा');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Demo Entry
  const handleQuickDemo = async (overrideRole?: any) => {
    const roleToUse: UserRole = (typeof overrideRole === 'string' && (overrideRole === 'collector' || overrideRole === 'recycler' || overrideRole === 'admin'))
      ? overrideRole
      : selectedRole;

    await signupWithRole(roleToUse, {
      fullName: fullName || (roleToUse === 'collector' ? 'Lakshya' : roleToUse === 'recycler' ? 'राजेश वर्मा' : 'डॉ. संजय मेहता'),
      phone: phone || '+91 98765 43210',
      operatingCity: city || 'Indore',
      preferredLanguage: selectedLang,
      facilityName: facilityName || 'Clean Tech Recyclers',
      spcbLicense: spcbLicense || 'MPPCB/E-WASTE/2026/089',
      department: dept || 'Ministry of Mines, Govt. of India',
      gps_lat: recyclerGeo.lat ?? 22.7196,
      gps_lng: recyclerGeo.lng ?? 75.8577,
    });
    if (onClose) onClose();
    router.push(`/${roleToUse}`);
  };

  if (currentStep === 'slides') {
    return <OnboardingSlides onComplete={handleSlidesDone} />;
  }

  return (
    <div className="min-h-screen bg-[#EAF4E8] flex items-center justify-center p-2 sm:p-4 transition-colors">
      <div className="w-full max-w-[390px] bg-white rounded-3xl sm:rounded-[36px] shadow-2xl shadow-green-950/10 border border-[#D0E2CF] overflow-hidden flex flex-col min-h-[580px] sm:h-[660px] max-h-[92vh] relative transition-all">

        {/* ================= STEP 2: SELECT LANGUAGE ================= */}
        {currentStep === 'language' && (
          <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('slides')}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold text-gray-400">चरण 1 / 4</span>
              </div>

              <div className="text-center space-y-1 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16A34A] mx-auto flex items-center justify-center mb-1 shadow-2xs">
                  <Globe size={22} />
                </div>
                <h2 className="text-xl font-black text-[#14181A]">
                  अपनी भाषा चुनें
                </h2>
                <p className="text-xs text-gray-500">
                  Select your preferred language
                </p>
              </div>

              {/* 3 Clean Language Tiles */}
              <div className="space-y-2.5">
                {[
                  { id: 'hi', native: 'हिंदी', eng: 'Hindi (हिंदी)', region: 'भारत की पसंदीदा', flag: '🇮🇳' },
                  { id: 'mr', native: 'मराठी', eng: 'Marathi (मराठी)', region: 'स्थानिक भाषा', flag: '🚩' },
                  { id: 'en', native: 'English', eng: 'English', region: 'Default English', flag: '🌐' },
                ].map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLang(l.id as Language)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedLang === l.id
                        ? 'border-[#16A34A] bg-[#EFFAEB] shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.flag}</span>
                      <div>
                        <div className="font-extrabold text-base text-[#14181A]">
                          {l.native}
                        </div>
                        <div className="text-xs text-gray-500">
                          {l.eng} • {l.region}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AudioButton
                        textToSpeak={
                          l.id === 'hi'
                            ? 'स्क्रैपवाला में आपका स्वागत है'
                            : l.id === 'mr'
                              ? 'स्क्रॅपवाला मध्ये आपले स्वागत आहे'
                              : 'Welcome to ScrapWala'
                        }
                        size={14}
                      />
                      {selectedLang === l.id && (
                        <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLanguageDone}
              className="group relative w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#15803D] hover:from-[#15803D] hover:to-[#14532D] text-white font-extrabold text-[15px] flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(22,163,74,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_22px_rgba(22,163,74,0.42)] active:scale-[0.98] transition-all duration-200 mt-5 cursor-pointer"
            >
              <span>आगे बढ़ें (Continue)</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        )}

        {/* ================= STEP 3: SELECT ROLE (CLEAN & NON-TEXTY) ================= */}
        {currentStep === 'role' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('language')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors"
                >
                  <Globe size={14} className="text-[#2E7D1F]" />
                  <span>भाषा: {selectedLang === 'hi' ? 'हिंदी' : selectedLang === 'mr' ? 'मराठी' : 'EN'}</span>
                </button>
                <span className="text-xs font-bold text-gray-400">चरण 2 / 4</span>
              </div>

              <div className="text-center space-y-1 mb-5">
                <h2 className="text-xl font-black text-[#14181A]">
                  आपकी भूमिका क्या है?
                </h2>
                <p className="text-xs text-gray-500">
                  Select your role on ScrapWala
                </p>
              </div>

              {/* 3 Sleek Role Cards (No texty paragraphs) */}
              <div className="space-y-3">
                {/* 1. Collector */}
                <div
                  onClick={() => setSelectedRole('collector')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${selectedRole === 'collector'
                      ? 'border-[#2E7D1F] bg-[#EFFAEB] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${selectedRole === 'collector' ? 'bg-[#2E7D1F] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                  <Recycle size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-[#14181A]">
                        1. कबाड़ी मित्र (Collector)
                      </h3>
                      {selectedRole === 'collector' && (
                        <div className="w-5 h-5 rounded-full bg-[#2E7D1F] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      ई-कचरा बेचें, सही भाव व 30% EPR बोनस पाएं
                    </p>
                  </div>
                </div>

                {/* 2. Recycler */}
                <div
                  onClick={() => setSelectedRole('recycler')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${selectedRole === 'recycler'
                      ? 'border-[#2E7D1F] bg-[#EFFAEB] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${selectedRole === 'recycler' ? 'bg-[#2E7D1F] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-[#14181A]">
                        2. अधिकृत रीसाइक्लर (Recycler)
                      </h3>
                      {selectedRole === 'recycler' && (
                        <div className="w-5 h-5 rounded-full bg-[#2E7D1F] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      SPCB पंजीकृत केंद्र • सत्यापित लॉट खरीदें
                    </p>
                  </div>
                </div>

                {/* 3. Admin / Ministry */}
                <div
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${selectedRole === 'admin'
                      ? 'border-[#2E7D1F] bg-[#EFFAEB] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${selectedRole === 'admin' ? 'bg-[#2E7D1F] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-[#14181A]">
                        3. खान मंत्रालय व CPCB (Admin)
                      </h3>
                      {selectedRole === 'admin' && (
                        <div className="w-5 h-5 rounded-full bg-[#2E7D1F] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      सोना, तांबा, लिथियम रिकवरी व मूल्य कार्टेल अलर्ट
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <button
                type="button"
                onClick={handleRoleDone}
                className="group relative w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#15803D] hover:from-[#15803D] hover:to-[#14532D] text-white font-extrabold text-[15px] flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(22,163,74,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_22px_rgba(22,163,74,0.42)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>भूमिका पक्की करें (Confirm Role)</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo()}
                className="w-full py-1.5 text-center text-xs font-bold text-gray-500 hover:text-[#2E7D1F] transition-colors"
              >
                ⚡ 1-क्लिक में तुरंत प्रवेश करें (Fast Demo Access) →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: ROLE SPECIFIC QUESTIONS ================= */}
        {currentStep === 'questions' && (
          <div className="flex-1 flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('role')}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold text-gray-400">चरण 3 / 4</span>
              </div>

              <div className="text-center space-y-1 mb-5">
                <h2 className="text-xl font-black text-[#14181A]">
                  {selectedRole === 'collector'
                    ? 'कबाड़ी मित्र विवरण'
                    : selectedRole === 'recycler'
                      ? 'रीसाइक्लर केंद्र विवरण'
                      : 'सरकारी अधिकारी विवरण'}
                </h2>
                <p className="text-xs text-gray-500">
                  केवल 2 आवश्यक सवाल (Quick 2-step setup)
                </p>
              </div>

              {/* Questions for Collector */}
              {selectedRole === 'collector' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <User size={14} className="text-[#2E7D1F]" />
                      आपका नाम (Your Full Name)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lakshya"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F] focus:ring-1 focus:ring-[#2E7D1F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <Phone size={14} className="text-[#2E7D1F]" />
                      मोबाइल नंबर (Mobile / WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F] focus:ring-1 focus:ring-[#2E7D1F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#2E7D1F]" />
                      कार्य क्षेत्र / शहर (Operating City)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Indore"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F] focus:ring-1 focus:ring-[#2E7D1F]"
                    />
                  </div>
                </div>
              )}

              {/* Questions for Recycler */}
              {selectedRole === 'recycler' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <Building size={14} className="text-[#2E7D1F]" />
                      रीसाइक्लिंग केंद्र का नाम (Facility Name)
                    </label>
                    <input
                      type="text"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="e.g. E-Parisaraa Clean Tech"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#2E7D1F]" />
                      SPCB लाइसेंस नंबर (Authorization No.)
                    </label>
                    <input
                      type="text"
                      value={spcbLicense}
                      onChange={(e) => setSpcbLicense(e.target.value)}
                      placeholder="MPPCB/E-WASTE/AUTH/..."
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <User size={14} className="text-[#2E7D1F]" />
                      प्रबंधक का नाम (Manager Name)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Verma"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F]"
                    />
                  </div>

                  {/* Mandatory Facility GPS Location (Required for EPR Verification) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                        <MapPin size={15} className="text-red-600" />
                        <span>सुविधा GPS स्थान (Facility GPS) *</span>
                        <span className="text-[10px] text-red-600 font-bold uppercase">(अनिवार्य)</span>
                      </label>

                      <button
                        type="button"
                        onClick={recyclerGeo.detect}
                        disabled={recyclerGeo.status === 'locating'}
                        className="px-3 py-1.5 rounded-xl bg-[#2E7D1F] hover:bg-[#256618] active:scale-95 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs disabled:opacity-60"
                      >
                        <Navigation size={12} className={recyclerGeo.status === 'locating' ? 'animate-spin' : ''} />
                        <span>{recyclerGeo.status === 'locating' ? 'जांच रहे हैं...' : 'Detect / Set Location'}</span>
                      </button>
                    </div>

                    {recyclerGeo.lat && recyclerGeo.lng ? (
                      <div className="p-2.5 rounded-xl bg-[#EFFAEB] border border-[#C5EBC2] flex items-center justify-between text-xs text-[#2E7D1F] font-bold">
                        <span className="flex items-center gap-1">
                          <Check size={14} strokeWidth={3} />
                          GPS सत्यापित: {recyclerGeo.lat.toFixed(4)}, {recyclerGeo.lng.toFixed(4)}
                        </span>
                        <span className="text-[11px] text-gray-600 font-medium">
                          {recyclerGeo.locality || 'Indore'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 font-bold flex items-center gap-1.5">
                        <span>⚠️ रीसाइक्लिंग केंद्र का GPS अनिवार्य है। "Detect / Set Location" दबाएं।</span>
                      </div>
                    )}

                    <LocationPermissionBanner
                      status={recyclerGeo.status}
                      errorMsg={recyclerGeo.errorMsg}
                      errorType={recyclerGeo.errorType}
                      onRetry={recyclerGeo.detect}
                    />
                  </div>
                </div>
              )}

              {/* Questions for Admin */}
              {selectedRole === 'admin' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <User size={14} className="text-[#2E7D1F]" />
                      अधिकारी का नाम (Officer Name)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lakshya / Dr. Sanjay Mehta"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                      <Building2 size={14} className="text-[#2E7D1F]" />
                      मंत्रालय / विभाग (Ministry / Department)
                    </label>
                    <input
                      type="text"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      placeholder="Ministry of Mines / CPCB"
                      className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D1F]"
                    />
                  </div>
                </div>
              )}
            </div>

            {selectedRole === 'recycler' && !recyclerGeo.lat && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 text-center mb-2">
                ⚠️ रीसाइक्लर पंजीकरण के लिए GPS स्थान सेट करना अनिवार्य है।
              </div>
            )}

            <button
              type="button"
              onClick={handleQuestionsDone}
              disabled={selectedRole === 'recycler' && !recyclerGeo.lat}
              className={`group relative w-full h-[52px] rounded-2xl text-white font-extrabold text-[15px] flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(22,163,74,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_22px_rgba(22,163,74,0.42)] active:scale-[0.98] transition-all duration-200 mt-2 cursor-pointer ${
                selectedRole === 'recycler' && !recyclerGeo.lat
                  ? 'bg-gray-400 opacity-60 cursor-not-allowed hover:bg-gray-400'
                  : 'bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#15803D] hover:from-[#15803D] hover:to-[#14532D]'
              }`}
            >
              <span>आगे बढ़ें (Proceed to Login)</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        )}

        {/* ================= STEP 5: FINAL LOGIN / SIGNUP WITH GOOGLE & EMAIL ================= */}
        {currentStep === 'auth' && (
          <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('questions')}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold text-gray-400">चरण 4 / 4</span>
              </div>

              {/* User Selection Pill Recap */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EFFAEB] border border-[#16A34A]/30 text-[#15803D] text-xs font-extrabold flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 size={13} />
                  {selectedRole === 'collector' ? 'कबाड़ी मित्र' : selectedRole === 'recycler' ? 'अधिकृत रीसाइक्लर' : 'खान मंत्रालय'}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold uppercase">
                  {selectedLang}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0F5A43] text-xs font-bold">
                  {fullName}
                </span>
              </div>

              <div className="text-center space-y-1 mb-5">
                <h2 className="text-xl font-black text-[#14181A]">
                  लॉग इन या साइन अप करें
                </h2>
                <p className="text-xs text-gray-500">
                  Google या ईमेल से एक क्लिक में सुरक्षित प्रवेश करें
                </p>
              </div>

              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {authError}
                </div>
              )}

              {/* 1. PRIMARY: CONTINUE WITH GOOGLE BUTTON */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm flex items-center justify-center gap-3 active:scale-98 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google से जारी रखें (Continue with Google)</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-gray-200 w-full" />
                  <span className="bg-white px-3 text-xs text-gray-400 font-bold uppercase">
                    या ईमेल से
                  </span>
                  <div className="border-t border-gray-200 w-full" />
                </div>

                {/* 2. SECONDARY: EMAIL / PASSWORD FORM */}
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="आपका ईमेल (email@example.com)"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="पासवर्ड (Password)"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      type="submit"
                      onClick={() => setAuthMode('signin')}
                      disabled={isSubmitting}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#14532D] text-white font-bold text-xs shadow-sm hover:shadow active:scale-98 transition-all cursor-pointer"
                    >
                      लॉग इन (Sign In)
                    </button>
                    <button
                      type="submit"
                      onClick={() => setAuthMode('signup')}
                      disabled={isSubmitting}
                      className="flex-1 h-11 rounded-xl border-2 border-[#16A34A] text-[#15803D] hover:bg-[#EFFAEB] font-bold text-xs active:scale-98 transition-all cursor-pointer"
                    >
                      नया खाता बनाएं
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick 1-tap demo entry button */}
            <div className="pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => handleQuickDemo()}
                className="text-xs font-bold text-gray-500 hover:text-[#2E7D1F] underline transition-colors"
              >
                डेमो के रूप में तुरंत ऐप में प्रवेश करें ({fullName || 'Lakshya'}) →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
