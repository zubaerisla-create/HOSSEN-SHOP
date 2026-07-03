"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';
import { Mail, Send, Users, History, FileText, CheckCircle, Trash2, Eye, Sparkles } from 'lucide-react';

interface SentEmail {
  id: string;
  recipients: string[];
  subject: string;
  body: string;
  template: string;
  sentAt: string;
}

const TEMPLATES = [
  {
    id: 'plain',
    name: 'Plain Text',
    subject: 'Update from Hossen Shop',
    body: 'Hi {name},\n\nWe wanted to share some updates with you regarding your account and shopping experience.\n\nBest regards,\nHossen Shop Team'
  },
  {
    id: 'welcome',
    name: '👋 Welcome Offer',
    subject: 'Welcome to Hossen Shop! Get 15% off your first order',
    body: 'Hi {name},\n\nWelcome to Hossen Shop! 🌿\n\nWe are thrilled to have you here. Nourish your home with Earth\'s finest organic vegetables, dairy, pantry staples, and fresh fruits.\n\nUse the promo code WELCOME15 at checkout to save 15% on your first order!\n\nShop now: http://localhost:3000/products\n\nBest regards,\nThe Hossen Shop Team'
  },
  {
    id: 'promo',
    name: '⚡ Flash Deals Announcement',
    subject: '⚡ Hot Deals inside! Limited-time offers on organic groceries',
    body: 'Hi {name},\n\nOur weekly Flash Deals are now live! We have updated our prices on seasonal fruits and vegetables, bakery delights, and meat.\n\nCheck out the deals now before they run out:\n👉 http://localhost:3000/deals\n\nSave up to 40% on organic options today!\n\nWarmly,\nHossen Shop Marketing'
  },
  {
    id: 'feedback',
    name: '⭐ Customer Feedback Request',
    subject: 'How was your recent order with Hossen Shop?',
    body: 'Hi {name},\n\nThank you for shopping with us! We hope you loved the fresh organic groceries we delivered to your doorstep.\n\nWe\'re constantly improving, and we would appreciate it if you could take 1 minute to share your feedback with us.\n\nLet us know how we did: support@hossenshop.com\n\nBest wishes,\nHossen Shop Support'
  }
];

export default function AdminSendEmailPage() {
  const { ordersList } = useAdmin();
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Load unique customers from ordersList
  const customers = useMemo(() => {
    const map = new Map<string, string>();
    // Default mock list first
    map.set('zubaerisla@gmail.com', 'ab');
    map.set('bkvhkvkcl@mail.id', 'saaka');
    map.set('aparnapadhyap672@gmail.com', 'Ghhgh');
    map.set('customer1@hossenshop.com', 'Sarah Connor');
    map.set('customer2@hossenshop.com', 'John Doe');

    // Add dynamic ones from orders
    ordersList.forEach(order => {
      if (order.customerEmail) {
        map.set(order.customerEmail.trim().toLowerCase(), order.customerName || 'Customer');
      }
    });

    return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
  }, [ordersList]);

  // Form State
  const [selectedPreset, setSelectedPreset] = useState('plain');
  const [recipientMode, setRecipientMode] = useState<'select' | 'all' | 'custom'>('select');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(TEMPLATES[0].body);

  // Search & Selection State/Handlers
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const handleSelectAll = () => {
    const filteredEmails = filteredCustomers.map(c => c.email);
    setSelectedEmails(prev => {
      const union = new Set([...prev, ...filteredEmails]);
      return Array.from(union);
    });
  };

  const handleDeselectAll = () => {
    const filteredEmails = filteredCustomers.map(c => c.email);
    setSelectedEmails(prev => prev.filter(e => !filteredEmails.includes(e)));
  };

  // Status & History State
  const [sentHistory, setSentHistory] = useState<SentEmail[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [sendingLogs, setSendingLogs] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [previewEmail, setPreviewEmail] = useState<SentEmail | null>(null);

  // Load Sent History
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hossen_shop_sent_emails');
      if (saved) {
        setSentHistory(JSON.parse(saved));
      } else {
        const dummy: SentEmail[] = [
          {
            id: 'se1',
            recipients: ['zubaerisla@gmail.com'],
            subject: 'Welcome to Hossen Shop!',
            body: 'Hi ab,\n\nWelcome to Hossen Shop! Get 15% off your first order with coupon code WELCOME15...',
            template: 'welcome',
            sentAt: '7/2/2026, 10:15:30 AM'
          }
        ];
        setSentHistory(dummy);
        localStorage.setItem('hossen_shop_sent_emails', JSON.stringify(dummy));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Change Template
  const handleTemplateChange = (templateId: string) => {
    setSelectedPreset(templateId);
    const tmpl = TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  // Delete History Item
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sentHistory.filter(h => h.id !== id);
    setSentHistory(updated);
    localStorage.setItem('hossen_shop_sent_emails', JSON.stringify(updated));
    showToast('Sent message record deleted!');
  };

  // Target Recipients Resolver
  const resolvedRecipients = useMemo(() => {
    if (recipientMode === 'all') {
      return customers.map(c => c.email);
    }
    if (recipientMode === 'custom') {
      return customEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e.includes('@'));
    }
    return selectedEmails;
  }, [recipientMode, customers, selectedEmails, customEmails]);

  // Send Email Simulated Action
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resolvedRecipients.length === 0) {
      showToast('Please add or select at least one recipient!');
      return;
    }

    setIsSending(true);
    setSendingProgress(0);
    setSendingLogs([]);

    const steps = [
      'Resolving recipient list...',
      `Validating ${resolvedRecipients.length} email addresses...`,
      'Compiling content template variables...',
      'Connecting to Gmail SMTP server...',
      'Sending mail chunks...',
    ];

    try {
      // Step 1: Resolving/Validating
      setSendingProgress(20);
      setSendingLogs(prev => [...prev, steps[0], steps[1]]);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 2: Compiling variables
      setSendingProgress(40);
      setSendingLogs(prev => [...prev, steps[2]]);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 3: SMTP connection & sending
      setSendingProgress(60);
      setSendingLogs(prev => [...prev, steps[3], steps[4]]);
      
      // Call real backend API to send the email!
      await api.sendDashboardEmail({
        recipients: resolvedRecipients,
        subject,
        body
      });

      // Done!
      setSendingProgress(100);
      setSendingLogs(prev => [...prev, 'Email dispatched successfully via Gmail SMTP!']);
      await new Promise(resolve => setTimeout(resolve, 450));

      // Save to local storage history
      const newSent: SentEmail = {
        id: Math.random().toString(36).slice(2, 9),
        recipients: resolvedRecipients,
        subject,
        body,
        template: selectedPreset,
        sentAt: new Date().toLocaleString()
      };

      const updatedHistory = [newSent, ...sentHistory];
      setSentHistory(updatedHistory);
      localStorage.setItem('hossen_shop_sent_emails', JSON.stringify(updatedHistory));

      showToast(`Email dispatched to ${resolvedRecipients.length} recipients! 🚀`);
      
      // Clear selections
      setSelectedEmails([]);
      setCustomEmails('');
    } catch (err: any) {
      console.error(err);
      setSendingLogs(prev => [...prev, `❌ Error sending: ${err.message || 'SMTP Connection failure'}`]);
      showToast('Failed to send email. Please check your SMTP settings.');
    } finally {
      setIsSending(false);
    }
  };

  // Toggle dynamic recipient selection
  const toggleRecipient = (email: string) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  // Real-time Preview computation
  const previewBody = useMemo(() => {
    // Inject the first recipient name or generic user
    const firstRecipientEmail = resolvedRecipients[0];
    const userObj = customers.find(c => c.email === firstRecipientEmail);
    const displayName = userObj ? userObj.name : 'Valued Customer';
    return body.replace(/{name}/g, displayName);
  }, [body, resolvedRecipients, customers]);

  return (
    <div className="flex flex-col gap-6 font-sans max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2C1F] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-emerald-500/20 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}

      {/* Header card */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0F2C1F] rounded-2xl flex items-center justify-center text-white shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-800">Email Dispatcher</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-0.5">Send direct updates, promotions, and customer support emails</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-neutral-100 rounded-xl p-1 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Compose
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Sent History ({sentHistory.length})
          </button>
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main composing form */}
          <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            
            {/* Template selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> Select Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedPreset === tmpl.id
                        ? 'border-brand-green bg-brand-green/5 text-brand-green'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Selection mode */}
            <div className="flex flex-col gap-3 border-t border-neutral-50 pt-4">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Recipients</label>
              
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientMode('select')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recipientMode === 'select'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  Select from Customers ({selectedEmails.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recipientMode === 'all'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  All Registered Customers ({customers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode('custom')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recipientMode === 'custom'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  Custom Email Address
                </button>
              </div>

              {/* Recipient Input modes rendering */}
              {recipientMode === 'select' && (
                <div className="flex flex-col gap-3">
                  {/* Search and Selection Tools */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-brand-green/30 focus:border-brand-green/30"
                      />
                      <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg text-[11px] cursor-pointer transition-colors active:scale-95"
                      >
                        Select All ({filteredCustomers.length})
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg text-[11px] cursor-pointer transition-colors active:scale-95"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400 font-medium bg-neutral-50/20">
                      No customers match your search
                    </div>
                  ) : (
                    <div className="border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredCustomers.map(c => {
                        const isSelected = selectedEmails.includes(c.email);
                        return (
                          <label
                            key={c.email}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-white border-brand-green/40 shadow-sm'
                                : 'bg-transparent border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRecipient(c.email)}
                              className="rounded text-brand-green focus:ring-brand-green w-3.5 h-3.5 cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-neutral-800">{c.name}</span>
                              <span className="text-[10px] text-neutral-400">{c.email}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {recipientMode === 'custom' && (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={customEmails}
                    onChange={e => setCustomEmails(e.target.value)}
                    placeholder="Enter email addresses (separated by commas)"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/20"
                  />
                  <p className="text-[10px] text-neutral-400 px-1 font-semibold">Tip: Separate multiple custom addresses with commas.</p>
                </div>
              )}

              {recipientMode === 'all' && (
                <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-3 flex items-center gap-2 text-xs font-medium text-[#0F2C1F]">
                  <Users className="w-4 h-4 shrink-0 text-brand-green" />
                  <span>Will broadcast to all <strong>{customers.length}</strong> registered customer emails in system.</span>
                </div>
              )}
            </div>

            {/* Email subject & body compose */}
            <form onSubmit={handleSend} className="flex flex-col gap-4 border-t border-neutral-50 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Special Holiday Hours Update"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Message Body</label>
                  <span className="text-[10px] text-neutral-400 font-semibold">Supports tags: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600 font-mono">{`{name}`}</code></span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Compose your email message here..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/20 font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover disabled:bg-neutral-300 text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Dispatch
              </button>
            </form>
          </div>

          {/* Sidebar Area: Live dynamic Preview & Simulation progress */}
          <div className="flex flex-col gap-6">
            
            {/* Client Viewport Simulated Email Preview */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-green" /> Live Email Inbox Preview
              </h3>
              
              <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-[#F6F8FA] flex flex-col">
                {/* Inbox header mockup */}
                <div className="bg-white px-4 py-3 border-b border-neutral-100 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold">
                    <span>To: {resolvedRecipients.length > 0 ? (resolvedRecipients.length === 1 ? resolvedRecipients[0] : `${resolvedRecipients.length} Recipients`) : 'No recipients selected'}</span>
                    <span>Just Now</span>
                  </div>
                  <h4 className="font-bold text-neutral-800 text-xs truncate">{subject || '(No Subject)'}</h4>
                  <div className="text-[10px] text-neutral-500">
                    From: <span className="font-bold text-neutral-700">Hossen Shop &lt;no-reply@hossenshop.com&gt;</span>
                  </div>
                </div>

                {/* Inbox Body mockup */}
                <div className="p-4 bg-white min-h-48 text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-wrap">
                  {previewBody || 'Start writing to see dynamic client preview...'}
                </div>
              </div>
            </div>

            {/* Simulated sending animation panel */}
            {isSending && (
              <div className="bg-[#0F2C1F] text-white rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400">SMTP Sending Activity</h3>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-orange h-full rounded-full transition-all duration-300"
                    style={{ width: `${sendingProgress}%` }}
                  />
                </div>
                
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto font-mono text-[10px] text-neutral-300">
                  {sendingLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1">
                      <span className="text-brand-orange font-bold">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Sent History list page */
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-neutral-50 pb-4">
            <h3 className="font-serif text-lg font-bold text-neutral-800">Mail Logs ({sentHistory.length})</h3>
            <button
              onClick={() => {
                setSentHistory([]);
                localStorage.removeItem('hossen_shop_sent_emails');
                showToast('All logs cleared!');
              }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Logs
            </button>
          </div>

          {sentHistory.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <Mail className="w-12 h-12 stroke-1 text-neutral-300" />
              <p className="font-serif text-base font-bold">No sent messages yet</p>
              <p className="text-xs">Any emails sent through dispatcher will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 tracking-wider uppercase">
                    <th className="pb-3 pr-4 font-bold">Date & Time</th>
                    <th className="pb-3 px-4 font-bold">Recipients</th>
                    <th className="pb-3 px-4 font-bold">Subject</th>
                    <th className="pb-3 px-4 font-bold">Preset Template</th>
                    <th className="pb-3 pl-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {sentHistory.map(email => (
                    <tr
                      key={email.id}
                      onClick={() => setPreviewEmail(email)}
                      className="group hover:bg-neutral-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 pr-4 text-xs font-semibold text-neutral-500">{email.sentAt}</td>
                      <td className="py-4 px-4 font-bold text-neutral-700 max-w-[200px] truncate">
                        {email.recipients.join(', ')}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 font-medium max-w-[240px] truncate">{email.subject}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                          {email.template}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewEmail(email);
                            }}
                            className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistory(email.id, e)}
                            className="p-2 hover:bg-red-50 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* History Detail Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-neutral-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h3 className="font-serif text-base font-bold text-neutral-800">Email Details</h3>
              <button
                onClick={() => setPreviewEmail(null)}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold border-b border-neutral-50 pb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Sent At</span>
                  <span className="text-neutral-700">{previewEmail.sentAt}</span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Recipients</span>
                  <span className="text-neutral-700 truncate" title={previewEmail.recipients.join(', ')}>
                    {previewEmail.recipients.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-50 pb-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Subject</span>
                <span className="text-sm font-bold text-neutral-800">{previewEmail.subject}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Body</span>
                <div className="p-4 rounded-2xl bg-neutral-50 text-xs text-neutral-600 whitespace-pre-wrap leading-relaxed min-h-36">
                  {previewEmail.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
