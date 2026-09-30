'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, signInWithGoogle, signOut } from './supabase-client';

export type UserRole = 'collector' | 'recycler' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  email?: string;
  preferredLanguage?: 'hi' | 'en' | 'mr';
  operatingCity?: string;
  gps_lat?: number;
  gps_lng?: number;
  facilityName?: string;
  physicalAddress?: string;
  spcbLicense?: string;
  expiryDate?: string;
  authorizedMaterials?: string[];
  pickupAvailability?: string;
  department?: string;
  designation?: string;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  role: UserRole | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (role: UserRole) => void;
  signupWithRole: (role: UserRole, onboardingData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole | null) => void;
}

const DEFAULT_DEMO_PROFILES: Record<UserRole, UserProfile> = {
  collector: {
    id: 'demo-collector-1',
    role: 'collector',
    fullName: 'Lakshya (कबाड़ी मित्र)',
    phone: '+91 98765 43210',
    email: 'lakshya@scrapwala.in',
    preferredLanguage: 'hi',
    operatingCity: 'Indore (इंदौर)',
    onboardingCompleted: true,
  },
  recycler: {
    id: 'demo-recycler-1',
    role: 'recycler',
    fullName: 'राजेश वर्मा (Rajesh Verma)',
    phone: '+91 98260 11223',
    email: 'contact@eparisaraa.com',
    facilityName: 'E-Parisaraa Clean Tech Pvt. Ltd.',
    physicalAddress: 'Plot 12, Pithampur Industrial Area, Sector 3, Indore, MP',
    spcbLicense: 'MPPCB/E-WASTE/AUTH/2024/089',
    expiryDate: 'Dec 2027',
    pickupAvailability: 'scheduled',
    authorizedMaterials: ['PCBs', 'Batteries', 'Cables', 'CRT Monitors', 'LCD Panels'],
    onboardingCompleted: true,
  },
  admin: {
    id: 'demo-admin-1',
    role: 'admin',
    fullName: 'डॉ. संजय मेहता (Dr. Sanjay Mehta)',
    email: 'director.mines@nic.in',
    department: 'खान मंत्रालय (Ministry of Mines), भारत सरकार',
    designation: 'निदेशक (क्रिटिकल मिनरल व सस्टेनेबिलिटी)',
    operatingCity: 'National Monitoring Cell (New Delhi)',
    onboardingCompleted: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function isValidRole(r: any): r is UserRole {
  return r === 'collector' || r === 'recycler' || r === 'admin';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scrapwala_role');
      if (isValidRole(stored)) {
        return stored;
      }
      if (stored) {
        localStorage.removeItem('scrapwala_role');
      }
    }
    return null;
  });
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scrapwala_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.fullName && (parsed.fullName.includes('रामू') || parsed.fullName.includes('Ramu'))) {
            parsed.fullName = 'Lakshya';
          }
          return parsed;
        } catch {}
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load active session from Supabase if configured or localStorage
  useEffect(() => {
    async function initSession() {
      // 1. First check if there is an active Supabase user
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncUserProfile(session.user);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase session load error:', e);
        }
      }

      // 2. Check localStorage if no Supabase session
      if (typeof window !== 'undefined') {
        const storedRoleRaw = localStorage.getItem('scrapwala_role');
        const storedProfile = localStorage.getItem('scrapwala_profile');
        if (isValidRole(storedRoleRaw)) {
          const validRole = storedRoleRaw;
          if (storedProfile) {
            try {
              const parsed = JSON.parse(storedProfile);
              // If stored name was old Ramu, update to Lakshya or clean
              if (parsed.fullName && (parsed.fullName.includes('रामू') || parsed.fullName.includes('Ramu'))) {
                parsed.fullName = 'Lakshya';
              }
              setProfile(parsed);
              setRole(validRole);
            } catch {
              setProfile(DEFAULT_DEMO_PROFILES[validRole]);
              setRole(validRole);
            }
          } else {
            setProfile(DEFAULT_DEMO_PROFILES[validRole]);
            setRole(validRole);
          }
        } else {
          if (storedRoleRaw) {
            localStorage.removeItem('scrapwala_role');
          }
          setRole(null);
        }
      }

      setIsLoading(false);
    }

    async function syncUserProfile(user: any) {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // Extract Google Name with high precision
        const googleName = 
          user.user_metadata?.name || 
          user.user_metadata?.full_name || 
          user.user_metadata?.user_name ||
          (user.email ? user.email.split('@')[0] : 'Lakshya');

        const resolvedName = 
          (dbProfile?.full_name && 
           !dbProfile.full_name.includes('रामू') && 
           !dbProfile.full_name.toLowerCase().includes('ramu') && 
           dbProfile.full_name !== 'उपयोगकर्ता')
            ? dbProfile.full_name
            : googleName;

        const activeUserRole: UserRole = (dbProfile?.role as UserRole) || 'collector';

        // Auto-update profile in database with live Google account details
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: resolvedName,
          email: user.email,
          role: activeUserRole,
          preferred_language: dbProfile?.preferred_language || 'hi',
        });

        const formattedProfile: UserProfile = {
          id: user.id,
          role: activeUserRole,
          fullName: resolvedName,
          email: user.email,
          phone: dbProfile?.phone || user.phone,
          preferredLanguage: dbProfile?.preferred_language || 'hi',
          operatingCity: dbProfile?.operating_city || 'Indore',
          onboardingCompleted: true,
        };

        setRole(activeUserRole);
        setProfile(formattedProfile);

        if (typeof window !== 'undefined') {
          localStorage.setItem('scrapwala_role', activeUserRole);
          localStorage.setItem('scrapwala_profile', JSON.stringify(formattedProfile));
        }
      } catch (err) {
        console.error('Error syncing profile with Google auth:', err);
      }
    }

    initSession();

    let authListenerSubscription: any = null;
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await syncUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setRole(null);
          setProfile(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('scrapwala_role');
            localStorage.removeItem('scrapwala_profile');
          }
        }
      });
      authListenerSubscription = subscription;
    }

    return () => {
      if (authListenerSubscription) {
        authListenerSubscription.unsubscribe();
      }
    };
  }, []);

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await signInWithGoogle();
    } else {
      // Demo Google Sign-In fallback
      loginAsDemoUser(role || 'collector');
    }
  };

  const loginAsDemoUser = (selectedRole: UserRole) => {
    const demoProf = DEFAULT_DEMO_PROFILES[selectedRole];
    setRole(selectedRole);
    setProfile(demoProf);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapwala_role', selectedRole);
      localStorage.setItem('scrapwala_profile', JSON.stringify(demoProf));
    }
  };

  const signupWithRole = async (selectedRole: UserRole, onboardingData: Partial<UserProfile>) => {
    setIsLoading(true);
    const validRole: UserRole = (selectedRole === 'collector' || selectedRole === 'recycler' || selectedRole === 'admin')
      ? selectedRole
      : 'collector';

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      role: validRole,
      fullName: typeof onboardingData.fullName === 'string' && onboardingData.fullName.trim() ? onboardingData.fullName.trim() : (validRole === 'collector' ? 'Lakshya' : validRole === 'recycler' ? 'राजेश वर्मा' : 'डॉ. संजय मेहता'),
      phone: typeof onboardingData.phone === 'string' ? onboardingData.phone : undefined,
      email: typeof onboardingData.email === 'string' ? onboardingData.email : undefined,
      preferredLanguage: (onboardingData.preferredLanguage === 'hi' || onboardingData.preferredLanguage === 'mr' || onboardingData.preferredLanguage === 'en') ? onboardingData.preferredLanguage : 'hi',
      operatingCity: typeof onboardingData.operatingCity === 'string' && onboardingData.operatingCity.trim() ? onboardingData.operatingCity.trim() : 'Indore',
      facilityName: typeof onboardingData.facilityName === 'string' ? onboardingData.facilityName : undefined,
      physicalAddress: typeof onboardingData.physicalAddress === 'string' ? onboardingData.physicalAddress : undefined,
      spcbLicense: typeof onboardingData.spcbLicense === 'string' ? onboardingData.spcbLicense : undefined,
      expiryDate: typeof onboardingData.expiryDate === 'string' ? onboardingData.expiryDate : '2028-12-31',
      authorizedMaterials: Array.isArray(onboardingData.authorizedMaterials) ? onboardingData.authorizedMaterials : ['PCBs', 'Cables'],
      pickupAvailability: typeof onboardingData.pickupAvailability === 'string' ? onboardingData.pickupAvailability : 'scheduled',
      department: typeof onboardingData.department === 'string' ? onboardingData.department : undefined,
      designation: typeof onboardingData.designation === 'string' ? onboardingData.designation : undefined,
      gps_lat: typeof onboardingData.gps_lat === 'number' ? onboardingData.gps_lat : 22.7196,
      gps_lng: typeof onboardingData.gps_lng === 'number' ? onboardingData.gps_lng : 75.8577,
      onboardingCompleted: true,
    };

    // If Supabase is connected, persist to Supabase tables
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id || newProfile.id;

        await supabase.from('profiles').upsert({
          id: userId,
          role: selectedRole,
          full_name: newProfile.fullName,
          phone: newProfile.phone,
          email: newProfile.email,
          preferred_language: newProfile.preferredLanguage,
        });

        if (selectedRole === 'collector') {
          await supabase.from('collectors').upsert({
            id: userId,
            operating_city: newProfile.operatingCity,
          });
        } else if (selectedRole === 'recycler') {
          await supabase.from('recyclers').upsert({
            id: userId,
            facility_name: newProfile.facilityName || 'Recycler Facility',
            physical_address: newProfile.physicalAddress || 'Industrial Area',
            spcb_license_number: newProfile.spcbLicense,
            authorization_status: 'authorized',
            pickup_availability: newProfile.pickupAvailability,
            gps_lat: 22.7196,
            gps_lng: 75.8577,
          });
        }
      } catch (err) {
        console.error('Failed to sync profile to Supabase:', err);
      }
    }

    setRole(validRole);
    setProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapwala_role', validRole);
      localStorage.setItem('scrapwala_profile', JSON.stringify(newProfile));
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut();
    setRole(null);
    setProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('scrapwala_role');
      localStorage.removeItem('scrapwala_profile');
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        loginWithGoogle,
        loginAsDemoUser,
        signupWithRole,
        logout,
        setRole: (r) => {
          const validRole: UserRole | null = (r === 'collector' || r === 'recycler' || r === 'admin') ? r : null;
          setRole(validRole);
          if (validRole) {
            setProfile(DEFAULT_DEMO_PROFILES[validRole]);
            if (typeof window !== 'undefined') {
              localStorage.setItem('scrapwala_role', validRole);
              localStorage.setItem('scrapwala_profile', JSON.stringify(DEFAULT_DEMO_PROFILES[validRole]));
            }
          } else {
            setProfile(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('scrapwala_role');
              localStorage.removeItem('scrapwala_profile');
            }
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
