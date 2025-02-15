import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface NavigationContextType {
  history: string[];
  currentPage: string;
  navigateTo: (page: string) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>(['home']);
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = useCallback((page: string) => {
    setHistory(prev => [...prev, page]);
    setCurrentPage(page);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPage(previousPage);
      toast.success('Navigated back');
    }
  }, [history]);

  const canGoBack = history.length > 1;

  return (
    <NavigationContext.Provider value={{ history, currentPage, navigateTo, goBack, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};