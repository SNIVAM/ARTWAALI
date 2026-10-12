import React, { useState, useEffect } from 'react';
import { Phone, Mail, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { OrderEnquiry } from '../types';

interface ContactSectionProps {
  onAddOrder: (order: OrderEnquiry) => void;
  prefillMessage?: string;
  prefillType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onAddOrder,
  prefillMessage = '',
  prefillType = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState(prefillType || 'Purchase a Listed Item');
  const [message, setMessage] = useState(prefillMessage || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefillMessage) setMessage(prefillMessage);
    if (prefillType) setInquiryType(prefillType);
  }, [prefillMessage, prefillType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newEnquiry: OrderEnquiry = {
      id: 'enq_' + Date.now(),
      time: new Date().toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '—',
      type: inquiryType,
      message: message.trim() || 'General inquiry',
      status: 'Pending',
      updatedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    };

    onAddOrder(newEnquiry);
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#C9A84C] block mb-2 font-mono">
          Get in Touch
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#ddeaf8]">
          Let's Create <em className="italic text-[#7FFFD4]">Something</em> Beautiful
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[#4DC8C8]/15 bg-[#101c2b]/50">
              <div className="w-10 h-10 rounded-full border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C] block mb-0.5">
                  Phone / WhatsApp
                </span>
                <a
                  href="tel:+919873909050"
                  className="text-sm font-medium text-[#ddeaf8] hover:text-[#7FFFD4] transition-colors"
                >
                  +91 98739 09050
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[#4DC8C8]/15 bg-[#101c2b]/50">
              <div className="w-10 h-10 rounded-full border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C] block mb-0.5">
                  Email Address
                </span>
                <a
                  href="mailto:hello@artwaali.in"
                  className="text-sm font-medium text-[#ddeaf8] hover:text-[#7FFFD4] transition-colors"
                >
                  hello@artwaali.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[#4DC8C8]/15 bg-[#101c2b]/50">
              <div className="w-10 h-10 rounded-full border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4] shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C] block mb-0.5">
                  Instagram Studio
                </span>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#ddeaf8] hover:text-[#7FFFD4] transition-colors"
                >
                  @artwaali.studio
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#C9A84C]/25 bg-[#C9A84C]/5 text-xs text-[#7a9ab8] leading-relaxed">
            <strong className="text-[#C9A84C] block mb-1">Custom Commissions:</strong>
            We handcraft bespoke trays, geode clocks, dining tables, and corporate wedding favours tailored to your palette. Delivery across India in 7–10 business days.
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl border border-[#4DC8C8]/20 bg-[#101c2b]/80 backdrop-blur-md space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sen"
                  className="w-full p-3 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full p-3 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Inquiry Type
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                >
                  <option>Purchase a Listed Item</option>
                  <option>Custom Commission</option>
                  <option>Gifting / Corporate</option>
                  <option>Wedding Favours</option>
                  <option>General Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                Your Message / Custom Details
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about colours, dimensions, or the piece you'd like crafted..."
                className="w-full p-3 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="submit"
                id="submit-enquiry-btn"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#08121e] font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_2px_15px_rgba(77,200,200,0.25)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>

              {isSubmitted && (
                <div className="flex items-center gap-2 text-xs text-[#7FFFD4] animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message sent! We will reply within 24 hours.</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
