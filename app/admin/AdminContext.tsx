"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts, categories as defaultCategories } from '../lib/mockData';
import { Category } from '../lib/types';

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  image: string;
  description?: string;
  organic?: boolean;
  rating?: number;
  ratingCount?: number;
  discount?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AdminOrder {
  orderId: string;
  date: string;
  time: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'Placed' | 'Confirmed' | 'Assigned' | 'Out for Delivery' | 'Delivered';
  deliveryPartner?: string;
}

export interface Partner {
  id: string;
  name: string;
  vehicle: string;
  email: string;
  phone: string;
  active: boolean;
}

interface AdminContextType {
  productsList: AdminProduct[];
  ordersList: AdminOrder[];
  partnersList: Partner[];
  categoriesList: Category[];
  addProduct: (product: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (product: AdminProduct) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => void;
  assignPartner: (orderId: string, partnerName: string) => void;
  addPartner: (partner: Omit<Partner, 'id' | 'active'>) => void;
  togglePartner: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsList, setProductsList] = useState<AdminProduct[]>([]);
  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Load state on mount
  useEffect(() => {
    // 0. Load Categories
    const savedCats = localStorage.getItem('hossen_shop_admin_categories');
    if (savedCats) {
      setCategoriesList(JSON.parse(savedCats));
    } else {
      setCategoriesList(defaultCategories);
      localStorage.setItem('hossen_shop_admin_categories', JSON.stringify(defaultCategories));
    }

    // 1. Auth check
    const authStatus = sessionStorage.getItem('hossen_shop_admin_auth');
    if (authStatus === 'true') {
      setIsAdminAuthenticated(true);
    }

    // 2. Load products
    const savedProds = localStorage.getItem('hossen_shop_admin_products');
    if (savedProds) {
      setProductsList(JSON.parse(savedProds));
    } else {
      const initialProds: AdminProduct[] = defaultProducts.map((p, idx) => {
        const nameLower = p.name.toLowerCase();
        let derivedCategory = 'Fruits & Vegetables';
        if (nameLower.includes('paper') || nameLower.includes('toilet')) derivedCategory = 'Personal Care';
        else if (nameLower.includes('rice') || nameLower.includes('honey')) derivedCategory = 'Pantry Staples';
        else if (nameLower.includes('bread') || nameLower.includes('barley')) derivedCategory = 'Bakery';
        else if (nameLower.includes('fanta') || nameLower.includes('sprite') || nameLower.includes('juice')) derivedCategory = 'Beverages';
        else if (nameLower.includes('salmon')) derivedCategory = 'Meat & Seafood';
        else if (nameLower.includes('soup') || nameLower.includes('noodles') || nameLower.includes('knorr') || nameLower.includes('maggi')) derivedCategory = 'Snacks';
        else if (nameLower.includes('cheese') || nameLower.includes('milk') || nameLower.includes('eggs') || nameLower.includes('yogurt')) derivedCategory = 'Dairy & Eggs';

        return {
          ...p,
          category: derivedCategory,
          stock: idx % 3 === 0 ? 0 : 50 + idx * 5,
        };
      });
      setProductsList(initialProds);
      localStorage.setItem('hossen_shop_admin_products', JSON.stringify(initialProds));
    }

    // 3. Load partners
    const savedPartners = localStorage.getItem('hossen_shop_admin_partners');
    if (savedPartners) {
      setPartnersList(JSON.parse(savedPartners));
    } else {
      const initialPartners: Partner[] = [
        {
          id: 'p1',
          name: 'Avinash',
          vehicle: 'Bike',
          email: 'partner1@greatstack.dev',
          phone: '9876543210',
          active: true,
        }
      ];
      setPartnersList(initialPartners);
      localStorage.setItem('hossen_shop_admin_partners', JSON.stringify(initialPartners));
    }

    // 4. Load orders
    const savedOrders = localStorage.getItem('hossen_shop_placed_orders');
    let loadedOrders: AdminOrder[] = [];
    if (savedOrders) {
      try {
        const raw = JSON.parse(savedOrders);
        loadedOrders = raw.map((o: any) => ({
          orderId: o.orderId,
          date: o.date,
          time: o.time || '12:00 PM',
          items: o.items || [],
          customerName: o.address?.label === 'dfsrd' ? 'ab' : 'Customer Name',
          customerEmail: o.address?.label === 'dfsrd' ? 'zubaerisla@gmail.com' : 'user@email.com',
          total: o.total,
          status: o.status || 'Placed',
          deliveryPartner: o.deliveryPartner
        }));
      } catch (e) {
        console.error(e);
      }
    }

    // Default mockup orders for dashboard parity
    const mockupOrders: AdminOrder[] = [
      {
        orderId: '3449D2',
        date: '7/2/2026',
        time: '12:29:58 PM',
        customerName: 'ab',
        customerEmail: 'zubaerisla@gmail.com',
        items: [],
        total: 235.44,
        status: 'Placed',
      },
      {
        orderId: '6F3EA2',
        date: '7/2/2026',
        time: '9:24:26 AM',
        customerName: 'saaka',
        customerEmail: 'bkvhkvkcl@mail.id',
        items: [],
        total: 151.20,
        status: 'Placed',
      },
      {
        orderId: '8AA0DD',
        date: '7/1/2026',
        time: '10:04:58 PM',
        customerName: 'Ghhgh',
        customerEmail: 'aparnapadhyap672@gmail.com',
        items: [],
        total: 75.60,
        status: 'Assigned',
        deliveryPartner: 'Avinash',
      },
      {
        orderId: '3FA5FF',
        date: '7/1/2026',
        time: '8:46:56 PM',
        customerName: 'Hey',
        customerEmail: 'heiy@gmail.com',
        items: [],
        total: 210.60,
        status: 'Placed',
      },
      {
        orderId: '487C62',
        date: '7/1/2026',
        time: '7:32:35 PM',
        customerName: 'Akash',
        customerEmail: 'akash@gmail.com',
        items: [],
        total: 371.52,
        status: 'Placed',
      },
      {
        orderId: 'AC78DF',
        date: '7/1/2026',
        time: '7:14:15 PM',
        customerName: 'Aditya Jangid',
        customerEmail: 'jangidaditya130@gmail.com',
        items: [],
        total: 140.40,
        status: 'Placed',
      },
      {
        orderId: '17FB5B',
        date: '7/1/2026',
        time: '2:59:50 PM',
        customerName: 'folajimi',
        customerEmail: 'folajimi@gmail.com',
        items: [],
        total: 37.80,
        status: 'Placed',
      },
      {
        orderId: '06B3E7',
        date: '7/1/2026',
        time: '12:20:02 AM',
        customerName: 'test',
        customerEmail: 'testemail@gmail.com',
        items: [],
        total: 745.20,
        status: 'Confirmed',
      },
      {
        orderId: '8C5236',
        date: '6/30/2026',
        time: '5:55:03 PM',
        customerName: 'john',
        customerEmail: 'hello@gmail.com',
        items: [],
        total: 118.80,
        status: 'Confirmed',
      },
      {
        orderId: '7B4BA8',
        date: '6/29/2026',
        time: '10:23:40 PM',
        customerName: 'Sankalp',
        customerEmail: 'e106224006@timscdrmumbai.in',
        items: [],
        total: 318.60,
        status: 'Assigned',
        deliveryPartner: 'Avinash',
      }
    ];

    const combinedOrders = [...loadedOrders];
    mockupOrders.forEach(mockOrder => {
      if (!combinedOrders.some(o => o.orderId.toUpperCase() === mockOrder.orderId.toUpperCase())) {
        combinedOrders.push(mockOrder);
      }
    });

    setOrdersList(combinedOrders);
    const toSave = combinedOrders.map(o => ({
      orderId: o.orderId,
      date: o.date,
      time: o.time,
      items: o.items,
      address: { label: o.customerName === 'ab' ? 'dfsrd' : 'Home', street: 'Street info', city: 'City', state: 'State', zip: 'Zip' },
      total: o.total,
      status: o.status,
      deliveryPartner: o.deliveryPartner
    }));
    localStorage.setItem('hossen_shop_placed_orders', JSON.stringify(toSave));
  }, []);

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email === 'admin.nexolve@gmail.com' && pass === 'nexolve@admin') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('hossen_shop_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('hossen_shop_admin_auth');
  };

  const addProduct = (p: Omit<AdminProduct, 'id'>) => {
    const newProd: AdminProduct = {
      ...p,
      id: Date.now().toString(),
    };
    const updated = [newProd, ...productsList];
    setProductsList(updated);
    localStorage.setItem('hossen_shop_admin_products', JSON.stringify(updated));
  };

  const updateProduct = (p: AdminProduct) => {
    const updated = productsList.map(item => item.id === p.id ? p : item);
    setProductsList(updated);
    localStorage.setItem('hossen_shop_admin_products', JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = productsList.filter(item => item.id !== id);
    setProductsList(updated);
    localStorage.setItem('hossen_shop_admin_products', JSON.stringify(updated));
  };

  const updateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    const updated = ordersList.map(o => o.orderId === orderId ? { ...o, status } : o);
    setOrdersList(updated);

    // Sync back to localstorage
    const savedOrdersStr = localStorage.getItem('hossen_shop_placed_orders');
    if (savedOrdersStr) {
      try {
        const raw = JSON.parse(savedOrdersStr);
        const updatedRaw = raw.map((o: any) => o.orderId === orderId ? { ...o, status } : o);
        localStorage.setItem('hossen_shop_placed_orders', JSON.stringify(updatedRaw));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const assignPartner = (orderId: string, partnerName: string) => {
    const updated = ordersList.map(o =>
      o.orderId === orderId
        ? { ...o, deliveryPartner: partnerName || undefined, status: (partnerName ? 'Assigned' : 'Placed') as any }
        : o
    );
    setOrdersList(updated);

    const savedOrdersStr = localStorage.getItem('hossen_shop_placed_orders');
    if (savedOrdersStr) {
      try {
        const raw = JSON.parse(savedOrdersStr);
        const updatedRaw = raw.map((o: any) =>
          o.orderId === orderId
            ? { ...o, deliveryPartner: partnerName || undefined, status: partnerName ? 'Assigned' : 'Placed' }
            : o
        );
        localStorage.setItem('hossen_shop_placed_orders', JSON.stringify(updatedRaw));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const addPartner = (partner: Omit<Partner, 'id' | 'active'>) => {
    const newPartner: Partner = {
      ...partner,
      id: Date.now().toString(),
      active: true,
    };
    const updated = [...partnersList, newPartner];
    setPartnersList(updated);
    localStorage.setItem('hossen_shop_admin_partners', JSON.stringify(updated));
  };

  const togglePartner = (id: string) => {
    const updated = partnersList.map(p => p.id === id ? { ...p, active: !p.active } : p);
    setPartnersList(updated);
    localStorage.setItem('hossen_shop_admin_partners', JSON.stringify(updated));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...category,
      id: Date.now().toString(),
    };
    const updated = [...categoriesList, newCat];
    setCategoriesList(updated);
    localStorage.setItem('hossen_shop_admin_categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categoriesList.filter(c => c.id !== id);
    setCategoriesList(updated);
    localStorage.setItem('hossen_shop_admin_categories', JSON.stringify(updated));
  };

  return (
    <AdminContext.Provider
      value={{
        productsList,
        ordersList,
        partnersList,
        categoriesList,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        assignPartner,
        addPartner,
        togglePartner,
        addCategory,
        deleteCategory,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
