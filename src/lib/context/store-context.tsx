import React, { createContext, useContext, useState } from "react";
import { StoreType } from "@/types";

interface StoreContextType {
  selectedStore: StoreType;
  setStore: (store: StoreType) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedStore, setSelectedStore] = useState<StoreType>(() => {
    // Try to recover from localStorage on init
    const saved = localStorage.getItem("selectedStore");
    return (saved as StoreType) || null;
  });

  const setStore = (store: StoreType) => {
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