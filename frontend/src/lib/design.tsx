import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type DesignStyle = 'classic' | 'modern-programmer';

interface DesignContextValue {
  design: DesignStyle;
  setDesign: (design: DesignStyle) => void;
}

const STORAGE_KEY = 'workflow-sg-design-style';

const DesignContext = createContext<DesignContextValue | undefined>(undefined);

function getInitialDesign(): DesignStyle {
  if (typeof window === 'undefined') {
    return 'classic';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'classic' || stored === 'modern-programmer') {
    return stored;
  }

  return 'classic';
}

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [design, setDesignState] = useState<DesignStyle>(() => getInitialDesign());

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.design = design;
    document.body.dataset.design = design;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, design);
    }

    return () => {
      delete document.documentElement.dataset.design;
      delete document.body.dataset.design;
    };
  }, [design]);

  const setDesign = useCallback((nextDesign: DesignStyle) => {
    setDesignState(nextDesign);
  }, []);

  const value = useMemo(
    () => ({
      design,
      setDesign,
    }),
    [design, setDesign],
  );

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
};

export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
