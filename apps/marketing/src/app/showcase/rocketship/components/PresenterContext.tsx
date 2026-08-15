'use client';

import React, { createContext, useContext } from 'react';

const PresenterContext = createContext(false);

export function PresenterProvider({ value, children }: { value: boolean; children: React.ReactNode }) {
  return <PresenterContext.Provider value={value}>{children}</PresenterContext.Provider>;
}

export function usePresenterMode() {
  return useContext(PresenterContext);
}
