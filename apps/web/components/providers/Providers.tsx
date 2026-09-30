'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { I18nProvider } from '@/lib/i18n';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <I18nProvider>
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
};
