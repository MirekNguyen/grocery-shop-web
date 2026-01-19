import React, { createContext, useContext, useState } from "react";

interface StoreContextType {
  selectedStore: string | null;
  setStore: (store: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedStore, setSelectedStore] = useState<string | null>(() => {
    // Try to recover from localStorage on init
    const saved = localStorage.getItem("selectedStore");
    return saved || null;
  });

  const setStore = (store: string | null) => {
    setSelectedStore(store);
    if (store) {
      localStorage.setItem("selectedStore", store);
    } else {
      localStorage.removeItem("selectedStore");
    }
  };

  return (
    <StoreContext.Provider value={{ selectedStore, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};