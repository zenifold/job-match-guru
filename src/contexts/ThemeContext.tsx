import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('resumeTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useResumeTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useResumeTheme must be used within a ThemeProvider');
  }
  return context;
};