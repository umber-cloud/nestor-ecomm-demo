"use client";

import { useState } from "react";
import Link from "next/link";
import BreadCrumb from "@/components/breadcrumb";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  Search,
  CheckCircle2,
  Send,
  ChevronDown,
} from "lucide-react";

/**
 * Support Help Category Cards Data
 */
const SUPPORT_CATEGORIES = [
  {
    icon: Truck,
    title: "Order Tracking & Global Shipping",
    description: "Track your international shipment, view dispatch notices, or adjust delivery instructions.",
    tag: "LOGISTICS",
  },
  {
    icon: Cpu,
    title: "Hardware Setup & AI Firmware",
    description: "Pairing guides for IRay Spectacles, UV bottle sterilization cycles, and air purifier sensor calibration.",
    tag: "FIRMWARE",
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Repair Protection",
    description: "All flagship devices include 1-year global limited warranty and hardware defect replacement.",
    tag: "WARRANTY",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns & Exchanges",
    description: "Hassle-free 30-day return policy with prepaid shipping labels for eligible unopened items.",
    tag: "RETURNS",
  },
];

/**
 * Frequently Asked Questions Data
 */
const FAQ_ITEMS = [
  {
    q: "How do I pair IRay Spectacles with my phone?",
    a: "Turn on Bluetooth on your device, press and hold the right temple hinge button for 4 seconds until the status LED pulses amber, then select 'IRay Spectacles' from your Bluetooth device list.",
  },
  {
    q: "How does the IClean UV Bottle self-cleaning mechanism work?",
    a: "The cap houses an integrated medical-grade 280nm UV-C LED that automatically initiates a 60-second sterilization cycle every 2 hours, eradicating 99.9% of bio-contaminants. You can also tap the cap twice to trigger an instant cycle.",
  },
  {
    q: "When should I replace the HEPA Air Purifier filter?",
    a: "Under typical household usage, the True HEPA H13 filter lasts 6 to 8 months. The front laser sensor panel will display an amber filter indicator when replacement is recommended.",
  },
  {
    q: "What is your standard shipping timeline?",
    a: "Domestic orders typically arrive within 2–4 business days with expedited air courier. International shipments take 5–8 business days depending on customs clearance.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    category: "General",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-16 pt-2 mb-20 max-w-6xl mx-auto w-full">
      <BreadCrumb />

      {/* Hero Header */}
      <section className="mt-6 mb-12 flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary font-semibold">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          SYSTEM PROTOCOL {"//"} CUSTOMER CARE
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
          Hardware Support &amp; <em className="font-serif font-normal text-primary">Dispatch</em>
        </h1>

        <p className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Access diagnostic guides, track global consignments, or submit an operational inquiry to our hardware engineering dispatch desk.
        </p>

        {/* Live Search Bar */}
        <div className="relative max-w-xl mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diagnostics, firmware setup, order tracking..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border text-foreground font-mono text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors shadow-xs"
          />
        </div>
      </section>

      {/* Support Categories Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {SUPPORT_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border p-6 flex flex-col justify-between gap-4 hover:border-primary/60 transition-colors shadow-xs"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 border border-border bg-muted/50 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                    {cat.tag}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-foreground leading-snug">
                  {cat.title}
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Content Split: FAQs & Contact Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Frequently Asked Questions */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="border-b border-border pb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-foreground">
              Frequently Asked Questions
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground tracking-widest">
              [{filteredFaqs.length} ARTICLES]
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-border bg-card overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-serif text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-border/60 font-mono text-xs text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 border border-border bg-card text-center font-mono text-xs text-muted-foreground">
                No matching support articles found for &quot;{searchQuery}&quot;. Please submit an inquiry below.
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Support Ticket Dispatch Form */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-foreground">
              Dispatch Inquiries
            </h2>
          </div>

          <div className="border border-border bg-card p-6 shadow-xs">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-primary" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Inquiry Dispatched
                </h3>
                <p className="font-mono text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Your ticket has been logged with ID <span className="text-foreground font-bold">#IG-8841</span>. A support engineer will reply within 4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 font-mono text-xs uppercase tracking-widest border border-border hover:bg-muted text-foreground transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
                <div>
                  <label className="block mb-1.5 uppercase text-muted-foreground tracking-wider text-[11px]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-muted-foreground tracking-wider text-[11px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-muted-foreground tracking-wider text-[11px]">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="IG-49021"
                    className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-muted-foreground tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:border-primary text-foreground cursor-pointer"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Shipping">Shipping &amp; Logistics</option>
                    <option value="Hardware">Hardware Setup / Bluetooth</option>
                    <option value="Returns">Warranty &amp; Returns</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-muted-foreground tracking-wider text-[11px]">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the issue with your hardware or shipment..."
                    className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:border-primary text-foreground resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-primary-foreground py-3 font-bold uppercase tracking-widest transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Direct Contact Channels Footer */}
      <section className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
        <div className="flex items-center gap-3 p-4 border border-border bg-card">
          <Mail className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Email Dispatch</div>
            <a href="mailto:support@infinitygadgets.io" className="text-foreground hover:text-primary font-bold">
              support@infinitygadgets.io
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-border bg-card">
          <Phone className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Voice Hotline</div>
            <div className="text-foreground font-bold">+1 (800) 555-4423</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-border bg-card">
          <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Operating Hours</div>
            <div className="text-foreground font-bold">Mon - Fri: 09:00 - 18:00 EST</div>
          </div>
        </div>
      </section>
    </div>
  );
}

