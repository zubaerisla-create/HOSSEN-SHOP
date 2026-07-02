"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAdmin } from './AdminContext';
import AdminCharts from '../components/admin/AdminCharts';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const { ordersList, productsList } = useAdmin();

  // Stats Calculations
  const stats = useMemo(() => {
    const totalOrders = ordersList.length;
    // Mock users count or unique customer emails
    const uniqueUsers = new Set(ordersList.map(o => o.customerEmail)).size + 780; 
    const totalProducts = productsList.length;
    const outOfStock = productsList.filter(p => p.stock === 0).length;
    // Calculate total earnings from placed orders + mockup base sales
    const totalEarn = ordersList.reduce((sum, order) => sum + order.total, 0) + 128540.50;

    return { totalOrders, uniqueUsers, totalProducts, outOfStock, totalEarn };
  }, [ordersList, productsList]);

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Premium Dashboard Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* CARD 1: Total Earnings */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Total Earnings</span>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight">
                ${stats.totalEarn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/30 flex items-center justify-center text-emerald-600 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              +14.5% <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
            <span className="text-neutral-400">vs last month</span>
          </div>
        </div>

        {/* CARD 2: Total Orders */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Total Orders</span>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight">{stats.totalOrders}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100/30 flex items-center justify-center text-brand-orange shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="bg-orange-50 text-brand-orange px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              +4.8% <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
            <span className="text-neutral-400">vs last month</span>
          </div>
        </div>

        {/* CARD 3: Total Users */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Total Users</span>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight">{stats.uniqueUsers}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/30 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
              +24 today
            </span>
            <span className="text-neutral-400">active families</span>
          </div>
        </div>

        {/* CARD 4: Total Products */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Total Products</span>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight">{stats.totalProducts}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100/30 flex items-center justify-center text-purple-600 shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-md">
              In Stock
            </span>
            <span className="text-neutral-400">active catalog items</span>
          </div>
        </div>

        {/* CARD 5: Out of Stock */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Out of Stock</span>
              <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stats.outOfStock > 0 ? 'text-red-650' : 'text-neutral-850'}`}>
                {stats.outOfStock}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
              stats.outOfStock > 0 
                ? 'bg-red-50 border-red-100/35 text-red-600' 
                : 'bg-neutral-50 border-neutral-200/30 text-neutral-450'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className={`px-1.5 py-0.5 rounded-md ${
              stats.outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
            }`}>
              {stats.outOfStock > 0 ? 'Restock Needed' : 'Inventory Healthy'}
            </span>
            <span className="text-neutral-400">current status</span>
          </div>
        </div>

      </div>

      {/* Interactive Charts Dashboard */}
      <AdminCharts />

      {/* Recent Orders Card matching layout */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-neutral-800">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 cursor-pointer transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 tracking-wider uppercase">
                <th className="pb-3 pr-4 font-bold">Order ID</th>
                <th className="pb-3 px-4 font-bold">Customer</th>
                <th className="pb-3 px-4 font-bold">Items</th>
                <th className="pb-3 px-4 font-bold">Total</th>
                <th className="pb-3 px-4 font-bold">Status</th>
                <th className="pb-3 pl-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.slice(0, 7).map((order) => (
                <tr key={order.orderId} className="border-b border-neutral-50/50 hover:bg-neutral-50/20 transition-all">
                  <td className="py-4 pr-4 font-bold text-neutral-500">#{order.orderId}</td>
                  <td className="py-4 px-4 flex flex-col">
                    <span className="font-bold text-neutral-800 leading-tight">{order.customerName}</span>
                    <span className="text-[11px] text-neutral-400 font-semibold">{order.customerEmail}</span>
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-bold">
                    {order.items.length > 0 
                      ? `${order.items.reduce((sum, item) => sum + item.quantity, 0)} items` 
                      : '2 items'
                    }
                  </td>
                  <td className="py-4 px-4 font-extrabold text-neutral-800">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`font-bold text-[11px] px-3 py-1 rounded-full border ${
                      order.status === 'Placed' ? 'bg-blue-50 text-blue-500 border-blue-100/50' :
                      order.status === 'Confirmed' ? 'bg-orange-50 text-orange-500 border-orange-100/50' :
                      order.status === 'Assigned' ? 'bg-neutral-100 text-neutral-600 border-neutral-200/50' :
                      order.status === 'Out for Delivery' ? 'bg-indigo-50 text-indigo-500 border-indigo-100/50' :
                      'bg-green-50 text-green-600 border-green-100/50'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-neutral-400 font-bold text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
