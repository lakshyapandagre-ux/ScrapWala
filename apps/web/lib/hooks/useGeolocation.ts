'use client';

import { useState, useCallback, useEffect } from 'react';

export type GeoStatus = 'idle' | 'locating' | 'success' | 'denied' | 'error';

export type GeoState = {
  status: GeoStatus;
  lat: number | null;
  lng: number | null;
  locality: string | null;
  district: string | null;
  state: string | null;
  displayName: string | null;
  errorMsg: string;
  errorType?: 'denied' | 'disabled' | 'timeout' | 'unavailable' | null;
};

export function useGeolocation(autoDetect: boolean = false) {
  const [state, setState] = useState<GeoState>({
    status: 'idle',
    lat: null,
    lng: null,
    locality: null,
    district: null,
    state: null,
    displayName: null,
    errorMsg: '',
    errorType: null,
  });

  const detect = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        status: 'error',
        errorType: 'unavailable',
        errorMsg: 'GPS इस डिवाइस पर उपलब्ध नहीं है। कृपया मैन्युअल शहर चुनें।',
      }));
      return;
    }

    setState((s) => ({
      ...s,
      status: 'locating',
      errorMsg: '',
      errorType: null,
    }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        // Set coords immediately so location is usable even if reverse geocode is pending
        setState((s) => ({
          ...s,
          status: 'success',
          lat,
          lng,
          errorMsg: '',
          errorType: null,
        }));

        try {
          const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const data = await res.json();
            setState((s) => ({
              ...s,
              status: 'success',
              lat,
              lng,
              locality: data.locality || s.locality || 'Indore',
              district: data.district || s.district || 'Indore',
              state: data.state || s.state || 'Madhya Pradesh',
              displayName: data.display_name || s.displayName,
              errorMsg: '',
              errorType: null,
            }));
          }
        } catch {
          // Coords still usable without locality name
        }
      },
      (err) => {
        let msg = 'लोकेशन नहीं मिल पाई, दोबारा कोशिश करें।';
        let status: GeoStatus = 'error';
        let errorType: GeoState['errorType'] = 'unavailable';

        if (err.code === err.PERMISSION_DENIED) {
          msg = 'लोकेशन की अनुमति नहीं मिली। सेटिंग्स में जाकर अनुमति दें।';
          status = 'denied';
          errorType = 'denied';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS ऑन करें या सिग्नल का इंतज़ार करें।';
          status = 'error';
          errorType = 'disabled';
        } else if (err.code === err.TIMEOUT) {
          msg = 'लोकेशन टाइमआउट हो गया। दोबारा कोशिश करें।';
          status = 'error';
          errorType = 'timeout';
        }

        setState((s) => ({
          ...s,
          status,
          errorType,
          errorMsg: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, localityName: string) => {
    setState((s) => ({
      ...s,
      status: 'success',
      lat,
      lng,
      locality: localityName,
      errorMsg: '',
      errorType: null,
    }));
  }, []);

  useEffect(() => {
    if (autoDetect) {
      detect();
    }
  }, [autoDetect, detect]);

  return {
    ...state,
    detect,
    setManualLocation,
    setState,
  };
}
