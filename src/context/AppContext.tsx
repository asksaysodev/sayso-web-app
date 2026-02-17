import React, { createContext, useContext } from 'react';

// Utility function to capitalize words
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface AppContextValue {
  capitalizeWords: (str: string) => string;
}

// Create the context
const AppContext = createContext<AppContextValue>({} as AppContextValue);

// Create the provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {
    capitalizeWords,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 