"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

/* ─── FAQ Knowledge Base ───────────────────────────────────── */
const FAQ_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["delivery", "deliver", "shipping", "ship", "fast", "time", "how long", "কতক্ষণ", "ডেলিভারি"],
    answer: "🚚 We offer **free delivery** on all orders over $20! Standard delivery takes **1–2 hours** for local orders. We deliver 7 days a week, from 8 AM to 10 PM.",
  },
  {
    keywords: ["price", "cost", "charge", "fee", "minimum", "মূল্য", "দাম"],
    answer: "💰 Our prices are the best in town! Orders under $20 have a small $2.99 delivery fee. Orders $20 and above get **free delivery**. No hidden charges!",
  },
  {
    keywords: ["organic", "fresh", "quality", "natural", "farm", "অর্গানিক", "তাজা"],
    answer: "🌿 All our products are sourced directly from **certified organic farms**. We guarantee 100% fresh produce — if you're not happy, we'll replace it or refund you instantly!",
  },
  {
    keywords: ["return", "refund", "replace", "exchange", "damaged", "ফেরত", "রিফান্ড"],
    answer: "🔄 We have a hassle-free **100% satisfaction guarantee**. If any product is damaged or not fresh, contact us within 24 hours and we'll replace it or issue a full refund — no questions asked!",
  },
  {
    keywords: ["payment", "pay", "cash", "card", "bkash", "nagad", "পেমেন্ট", "টাকা"],
    answer: "💳 We accept **Cash on Delivery (COD)**, Credit/Debit cards, and multiple digital payment options. Pay securely at your convenience!",
  },
  {
    keywords: ["order", "track", "status", "my order", "অর্ডার", "ট্র্যাক"],
    answer: "📦 You can track your order in real-time from the **My Orders** section in your account. We'll also notify you at every delivery step — Placed → Confirmed → Out for Delivery → Delivered!",
  },
  {
    keywords: ["account", "register", "sign up", "login", "sign in", "একাউন্ট", "লগইন"],
    answer: "👤 Creating an account is free and easy! Click **Sign In** at the top right. You'll get order tracking, saved addresses, and exclusive member deals.",
  },
  {
    keywords: ["deal", "discount", "offer", "sale", "promo", "coupon", "ছাড়", "অফার", "ডিল"],
    answer: "🔥 Check our **Flash Deals** page for daily limited-time offers — up to 40% OFF on select items! Use code **HOSSEN10** for an extra 10% discount on your first order.",
  },
  {
    keywords: ["product", "item", "vegetable", "fruit", "grocery", "পণ্য", "সবজি", "ফল"],
    answer: "🛒 We stock **500+ products** including fresh vegetables, fruits, dairy, beverages, snacks, and pantry essentials — all from organic and trusted sources. Browse our full catalog at the Products page!",
  },
  {
    keywords: ["address", "location", "area", "zone", "ঠিকানা", "এলাকা"],
    answer: "📍 You can save multiple delivery addresses in your account. We currently deliver across major city zones. Visit **My Addresses** to manage your saved locations.",
  },
  {
    keywords: ["contact", "phone", "email", "support", "help", "যোগাযোগ", "সাপোর্ট"],
    answer: "📞 Need more help? Reach our support team:\n• **Email:** support@hossenshop.com\n• **Phone:** +880 1700-000000\n• **Hours:** 8 AM – 10 PM, every day",
  },
  {
    keywords: ["hello", "hi", "hey", "হ্যালো", "হাই", "সালাম", "আস্সালামু"],
    answer: "👋 Hello! Welcome to **Hossen Shop** – your trusted organic grocery store! How can I help you today?\n\nYou can ask me about:\n• 🚚 Delivery & shipping\n• 💰 Prices & offers\n• 🌿 Product quality\n• 🔄 Returns & refunds\n• 📦 Order tracking",
  },
  {
    keywords: ["thank", "thanks", "ধন্যবাদ", "শুকরিয়া"],
    answer: "😊 You're most welcome! It's our pleasure to serve you. Is there anything else I can help you with?",
  },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  text: "👋 Hi there! I'm **Hossen**, your shopping assistant.\n\nHow can I help you today? Ask me anything about our products, delivery, offers, or services!",
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "🚚 Delivery info",
  "🔥 Today's deals",
  "🔄 Returns policy",
  "📞 Contact support",
];

/* ─── Helper: find best response ──────────────────────────── */
function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const faq of FAQ_RESPONSES) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return "🤔 I'm not sure about that, but our support team can help!\n\n📞 **Call:** +880 1700-000000\n✉️ **Email:** support@hossenshop.com\n\nOr try rephrasing your question — I'm still learning!";
}

/* ─── Format bold markdown ─────────────────────────────────── */
function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/* ─── Message Bubble ───────────────────────────────────────── */
const MessageBubble = ({ msg }: { msg: Message }) => {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex gap-2.5 ${isBot ? "items-start" : "items-end flex-row-reverse"}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-[#0F2C1F] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
          isBot
            ? "bg-white border border-neutral-100 text-neutral-700 rounded-tl-sm"
            : "bg-[#0F2C1F] text-white rounded-br-sm"
        }`}
      >
        {msg.text.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>{formatText(line)}</p>
        ))}
        <p className={`text-[10px] mt-1.5 ${isBot ? "text-neutral-400" : "text-white/50"}`}>
          {msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
};

/* ─── Typing indicator ─────────────────────────────────────── */
const TypingIndicator = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-7 h-7 rounded-full bg-[#0F2C1F] flex items-center justify-center shrink-0 shadow-sm">
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    </div>
    <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

/* ─── Main Chatbot Component ───────────────────────────────── */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
      setShowPulse(false);
    }
  }, [isOpen]);

  /* Stop pulse after 8 seconds */
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay (800ms – 1.5s)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: getBotResponse(trimmed),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (reply: string) => {
    // Strip emoji prefix for cleaner query
    const clean = reply.replace(/^[^\s]+\s/, "");
    sendMessage(clean);
  };

  return (
    <>
      {/* ── Chat popup window ─────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        <div className="flex flex-col bg-white rounded-3xl shadow-2xl shadow-black/15 border border-neutral-100 overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 140px))" }}>

          {/* Header */}
          <div className="bg-[#0F2C1F] px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0F2C1F]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Hossen Assistant</p>
                <p className="text-emerald-400 text-[11px] font-medium mt-0.5">● Online · Usually replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F7F8FA] scroll-smooth">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-4 py-2.5 bg-[#F7F8FA] border-t border-neutral-100 flex gap-2 overflow-x-auto shrink-0 scroll-smooth">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="shrink-0 text-[11px] font-semibold text-[#0F2C1F] bg-white border border-[#0F2C1F]/20 hover:bg-[#0F2C1F] hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-neutral-100 flex items-center gap-3 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 text-sm bg-[#F7F8FA] border border-neutral-200 rounded-full px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C1F]/20 focus:border-[#0F2C1F]/40 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-[#0F2C1F] hover:bg-[#1a4a33] disabled:bg-neutral-200 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 text-white disabled:text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>

          {/* Footer branding */}
          <div className="px-4 py-2 bg-white border-t border-neutral-50 text-center shrink-0">
            <p className="text-[10px] text-neutral-400 font-medium">
              Powered by <span className="font-bold text-neutral-600">Hossen Shop</span> · AI Assistant
            </p>
          </div>
        </div>
      </div>

      {/* ── FAB button ────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer group ${
          isOpen
            ? "bg-[#1a4a33] rotate-0 scale-100"
            : "bg-[#0F2C1F] hover:scale-110 hover:bg-[#1a4a33]"
        }`}
        aria-label="Open chat"
      >
        {/* Pulse rings when closed */}
        {!isOpen && showPulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#0F2C1F] animate-ping opacity-30" />
            <span className="absolute inset-[-6px] rounded-full border-2 border-[#0F2C1F]/20 animate-pulse" />
          </>
        )}

        {/* Unread badge */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5C00] rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-white">
            1
          </span>
        )}

        {/* Icon — toggle between chat and close */}
        <div className={`transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "rotate-0 opacity-100"}`}>
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          )}
        </div>

        {/* Tooltip label */}
        {!isOpen && (
          <span className="absolute right-16 bg-[#0F2C1F] text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            Chat with us
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#0F2C1F] rotate-45" />
          </span>
        )}
      </button>
    </>
  );
}
