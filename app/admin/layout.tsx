"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from './AdminContext';
import { ChevronDown, Menu, X } from 'lucide-react';

// ── Nav data ────────────────────────────────────────────────
interface NavItem { label: string; href: string; icon: React.ReactNode }
interface NavGroup { id: string; label: string; icon: React.ReactNode; items: NavItem[] }

const ic = (d: string, extra?: string) => (
  <svg className={`w-4 h-4 shrink-0 ${extra ?? ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'store',
    label: 'Store',
    icon: ic('M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'),
    items: [
      { label: 'Add Product', href: '/admin/add-product', icon: ic('M12 4.5v15m7.5-7.5h-15') },
      { label: 'Products', href: '/admin/products', icon: ic('M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z') },
      { label: 'Categories', href: '/admin/categories', icon: ic('M9.568 3H5.25A2.25 2.25 0 003 5.25v4.3m18 0V5.25A2.25 2.25 0 0018.75 3h-4.3m-11.45 18h4.3M21 16.25v4.5A2.25 2.25 0 0118.75 23h-4.3M3 10.5h18M10.5 3v18') },
    ],
  },
  {
    id: 'orders',
    label: 'Orders & CRM',
    icon: ic('M9 12h3.75M9 15h3.375M9 9h3.75M16.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM20.25 19.125a9 9 0 01-16.5 0c0-1.68 1.332-3.122 3.02-3.402a7.503 7.503 0 0110.46 0c1.689.28 3.02 1.721 3.02 3.402z'),
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ic('M9 12h3.75M9 15h3.375M9 9h3.75M16.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM20.25 19.125a9 9 0 01-16.5 0c0-1.68 1.332-3.122 3.02-3.402a7.503 7.503 0 0110.46 0c1.689.28 3.02 1.721 3.02 3.402z') },
      { label: 'Delivery Partners', href: '/admin/delivery-partners', icon: ic('M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.847-9.967a2.25 2.25 0 00-2.208-2.059L16.5 4.5h-3m4.5 14.25v-3h-3.75') },
      { label: 'Send Email', href: '/admin/send-email', icon: ic('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') },
    ],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    icon: ic('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'),
    items: [
      { label: 'Flash Promo', href: '/admin/flash-promo', icon: ic('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z') },
      { label: 'Flash Deals', href: '/admin/flash-deals', icon: ic('M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z') },
      { label: 'Flash Line', href: '/admin/flash-line', icon: ic('M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z') },
    ],
  },
  {
    id: 'content',
    label: 'Site Content',
    icon: ic('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'),
    items: [
      { label: 'All Sections', href: '/admin/site-content', icon: ic('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z') },
      { label: 'Hero Section', href: '/admin/hero', icon: ic('M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z') },
      { label: 'Feature Bar', href: '/admin/features', icon: ic('M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z') },
      { label: 'App Banner', href: '/admin/app-banner', icon: ic('M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3') },
      { label: 'Newsletter', href: '/admin/newsletter', icon: ic('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') },
      { label: 'Footer', href: '/admin/footer', icon: ic('M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21') },
      { label: 'Site Settings', href: '/admin/site-settings', icon: ic('M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z') },
    ],
  },
];

// ── Collapsible group component ──────────────────────────────
function SidebarGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const isAnyActive = group.items.some(item =>
    item.href === '/admin/products'
      ? pathname === item.href || pathname.startsWith('/admin/edit-product')
      : pathname === item.href
  );
  const [open, setOpen] = useState(isAnyActive);

  // auto-open when navigating to a child
  useEffect(() => { if (isAnyActive) setOpen(true); }, [isAnyActive]);

  return (
    <div>
      {/* Group toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
          isAnyActive
            ? 'bg-neutral-100 text-neutral-800'
            : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
        }`}
      >
        <span className="flex items-center gap-3">
          {group.icon}
          {group.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Children */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? `${group.items.length * 44}px` : '0px' }}
      >
        <div className="ml-3 pl-3 border-l border-neutral-100 mt-1 flex flex-col gap-0.5 pb-1">
          {group.items.map(item => {
            const active =
              item.href === '/admin/products'
                ? pathname === item.href || pathname.startsWith('/admin/edit-product')
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0F2C1F] text-white'
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main layout ──────────────────────────────────────────────
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(email, password)) setLoginError('Invalid email or password credentials');
    else setLoginError('');
  };

  const handleLogout = () => { logoutAdmin(); router.push('/'); };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="font-serif text-2xl font-bold text-neutral-900">Admin Authentication</h1>
            <p className="text-xs text-neutral-400 font-semibold">Enter your credentials to access the admin dashboard</p>
          </div>
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">{loginError}</div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-600">Email Address</label>
              <input type="email" required placeholder="admin.nexolve@gmail.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-600">Password</label>
              <input type="password" required placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all" />
            </div>
            <button type="submit"
              className="w-full bg-[#0F2C1F] hover:bg-[#091a12] text-white py-3.5 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all cursor-pointer mt-2">
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans text-left">

      {/* Mobile top bar (small screens) */}
      <div className="md:hidden bg-white border-b border-neutral-100 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-neutral-700">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif text-lg font-bold text-neutral-800">Admin Panel</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-600 font-bold">Logout</button>
      </div>

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-100 flex-col justify-between p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2 px-2 pt-1">
            <svg className="w-5 h-5 text-[#0F2C1F]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="font-serif text-lg font-bold text-neutral-800">Admin Panel</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 text-sm font-bold">

            {/* Dashboard — standalone */}
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-bold ${
                pathname === '/admin'
                  ? 'bg-[#0F2C1F] text-white'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              {ic('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z')}
              Dashboard
            </Link>

            {/* Grouped accordions */}
            {NAV_GROUPS.map(g => (
              <SidebarGroup key={g.id} group={g} pathname={pathname} />
            ))}
          </nav>
        </div>

        {/* Exit */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all font-bold cursor-pointer text-left text-sm mt-4"
        >
          {ic('M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75')}
          Exit
        </button>
      </aside>

      {/* Mobile sidebar drawer */}
      {isSidebarOpen && (
        <>
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-50" />
          <div className="fixed left-0 top-0 h-full w-72 bg-white z-60 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0F2C1F]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="font-serif text-lg font-bold">Admin Panel</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-bold ${pathname === '/admin' ? 'bg-[#0F2C1F] text-white' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'}`}>Dashboard</Link>
              {NAV_GROUPS.map(g => (
                <div key={g.id} className="mb-2">
                  <div className="font-bold px-3 py-2 text-neutral-600">{g.label}</div>
                  <div className="flex flex-col ml-2">
                    {g.items.map(item => (
                      <Link key={item.href} href={item.href} className="px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-50">{item.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main */}
      <main className="flex-grow p-8 overflow-y-auto h-screen w-full">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
