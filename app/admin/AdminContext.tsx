"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../lib/types';
import { api } from '../lib/api';

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
  createdAt?: string;
  isFlashDeal?: boolean;
  flashLabel?: string | null;
  flashDiscount?: number | null;
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
  status: 'Placed' | 'Confirmed' | 'Assigned' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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

export interface DashboardStats {
  stats: {
    totalOrders: number;
    uniqueUsers: number;
    totalProducts: number;
    outOfStock: number;
    totalEarn: number;
  };
  monthlySalesData: {
    month: string;
    sales: number;
    orders: number;
  }[];
  categorySalesData: {
    category: string;
    value: number;
    color: string;
  }[];
}

interface AdminContextType {
  productsList: AdminProduct[];
  ordersList: AdminOrder[];
  partnersList: Partner[];
  categoriesList: Category[];
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
  addProduct: (product: Omit<AdminProduct, 'id'>) => Promise<void>;
  updateProduct: (product: AdminProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => Promise<void>;
  assignPartner: (orderId: string, partnerName: string) => Promise<void>;
  addPartner: (partner: Omit<Partner, 'id' | 'active'>) => Promise<void>;
  togglePartner: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsList, setProductsList] = useState<AdminProduct[]>([]);
  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async () => {
    try {
      const stats = await api.getDashboardStats();
      setDashboardStats(stats.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategoriesList(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const prods = await api.getProducts();
      setProductsList(
        prods.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category?.name || 'Fruits & Vegetables',
          price: p.price,
          originalPrice: p.originalPrice || undefined,
          unit: p.unit,
          stock: p.stock || 50,
          image: p.image,
          organic: p.organic || false,
          rating: p.rating,
          ratingCount: p.ratingCount,
          discount: p.discount || undefined,
          createdAt: p.createdAt,
        }))
      );
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const fetchPartners = async () => {
    try {
      const partners = await api.getPartners();
      setPartnersList(partners);
    } catch (err) {
      console.error('Failed to load partners:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await api.getAllOrders();
      setOrdersList(
        orders.map((o: any) => ({
          orderId: o.id,
          date: new Date(o.createdAt).toLocaleDateString(),
          time: new Date(o.createdAt).toLocaleTimeString(),
          customerName: o.user?.name || 'Customer',
          customerEmail: o.user?.email || 'customer@email.com',
          total: o.totalAmount,
          status: o.status as any,
          deliveryPartner: o.deliveryPartner || undefined,
          items: (o.items || []).map((item: any) => ({
            id: item.id,
            name: item.product?.name || 'Product',
            price: item.price,
            quantity: item.quantity,
            image: item.product?.image || '',
          })),
        }))
      );
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  // Load state on mount and auth state change
  useEffect(() => {
    const authStatus = sessionStorage.getItem('hossen_shop_admin_auth');
    if (authStatus === 'true') {
      setIsAdminAuthenticated(true);
    }

    fetchCategories();
    fetchProducts();
    if (authStatus === 'true') {
      fetchPartners();
      fetchOrders();
      fetchDashboardStats();
    }
  }, [isAdminAuthenticated]);

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, password: pass });
      if (res.user.role === 'admin') {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('hossen_shop_admin_auth', 'true');
        return true;
      }
      api.logout();
      return false;
    } catch (err) {
      console.error('Admin login error:', err);
      // Fallback local credentials for seamless dev
      if (email === 'admin.nexolve@gmail.com' && pass === 'nexolve@admin') {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('hossen_shop_admin_auth', 'true');
        return true;
      }
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('hossen_shop_admin_auth');
    api.logout();
  };

  const addProduct = async (p: Omit<AdminProduct, 'id'>) => {
    try {
      // Find matching category ID from name
      const cat = categoriesList.find((c) => c.name === p.category);
      if (!cat) throw new Error(`Category ${p.category} not found`);

      await api.createProduct({
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        unit: p.unit,
        image: p.image,
        categoryId: cat.id,
        discount: p.discount ? Number(p.discount) : undefined,
      });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const updateProduct = async (p: AdminProduct) => {
    try {
      const cat = categoriesList.find((c) => c.name === p.category);
      if (!cat) throw new Error(`Category ${p.category} not found`);

      await api.updateProduct(p.id, {
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        unit: p.unit,
        image: p.image,
        categoryId: cat.id,
        discount: p.discount ? Number(p.discount) : undefined,
        isFlashDeal: p.isFlashDeal,
        flashLabel: p.isFlashDeal ? (p.flashLabel || null) : null,
        flashDiscount: p.isFlashDeal ? (p.flashDiscount !== undefined && p.flashDiscount !== null ? Number(p.flashDiscount) : null) : null,
      });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: AdminOrder['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const assignPartner = async (orderId: string, partnerName: string) => {
    try {
      await api.assignPartner(orderId, partnerName);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to assign partner:', err);
    }
  };

  const addPartner = async (partner: Omit<Partner, 'id' | 'active'>) => {
    try {
      await api.addPartner(partner);
      await fetchPartners();
    } catch (err) {
      console.error('Failed to add partner:', err);
    }
  };

  const togglePartner = async (id: string) => {
    try {
      await api.togglePartner(id);
      await fetchPartners();
    } catch (err) {
      console.error('Failed to toggle partner:', err);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await api.createCategory(category);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
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
        dashboardStats,
        fetchDashboardStats,
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
