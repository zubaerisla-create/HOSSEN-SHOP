"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  addresses: Address[];
  login: (name: string, email: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  updateAddress: (id: string, updated: Partial<Address>) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mockup address matching user's screenshots
const INITIAL_MOCK_ADDRESSES: Address[] = [
  {
    id: "mock-1",
    label: "dfsrd",
    street: "rtgsfd",
    city: "gfs",
    state: "gfs",
    zip: "453",
    isDefault: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // 1. Load User Session
    const savedUser = localStorage.getItem('hossen_shop_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user auth session:', e);
      }
    }

    // 2. Load Addresses
    const savedAddresses = localStorage.getItem('hossen_shop_addresses');
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (e) {
        console.error('Error parsing saved addresses:', e);
        setAddresses(INITIAL_MOCK_ADDRESSES);
      }
    } else {
      setAddresses(INITIAL_MOCK_ADDRESSES);
      localStorage.setItem('hossen_shop_addresses', JSON.stringify(INITIAL_MOCK_ADDRESSES));
    }

    setIsHydrated(true);
  }, []);

  const login = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('hossen_shop_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hossen_shop_user');
  };

  const saveAddressesToStorage = (updated: Address[]) => {
    setAddresses(updated);
    localStorage.setItem('hossen_shop_addresses', JSON.stringify(updated));
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addr,
      id: Date.now().toString()
    };

    let updated = [...addresses];
    if (newAddress.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: false }));
    }
    updated.push(newAddress);
    saveAddressesToStorage(updated);
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    // If we deleted the default, set first remaining as default
    if (addresses.find(a => a.id === id)?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    saveAddressesToStorage(updated);
  };

  const updateAddress = (id: string, updatedFields: Partial<Address>) => {
    let updated = addresses.map(a => {
      if (a.id === id) {
        return { ...a, ...updatedFields };
      }
      return a;
    });

    if (updatedFields.isDefault) {
      updated = updated.map(a => (a.id === id ? a : { ...a, isDefault: false }));
    }
    saveAddressesToStorage(updated);
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAddressesToStorage(updated);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: !!user, 
        addresses, 
        login, 
        logout,
        addAddress,
        deleteAddress,
        updateAddress,
        setDefaultAddress
      }}
    >
      {isHydrated ? children : <div className="invisible">{children}</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
