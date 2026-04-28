'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import SectionTitle from './SectionTitle';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-white container mx-auto px-6 scroll-mt-20">
      <SectionTitle title="Get in Touch" subtitle="We'd love to hear from you regarding our scents." />
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent-dark transition-colors">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-accent-dark transition-colors bg-transparent" required />
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent-dark transition-colors">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-accent-dark transition-colors bg-transparent" required />
            </div>
          </div>
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent-dark transition-colors">Message</label>
            <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-accent-dark transition-colors bg-transparent resize-none" required />
          </div>
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={status !== 'idle'}
              className={`inline-flex items-center gap-2 px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${status === 'success' ? 'bg-green-500 text-white' : 'bg-accent-dark text-white hover:bg-accent-gold shadow-lg'}`}
            >
              {status === 'submitting' ? 'Sending...' : status === 'success' ? <><span>Sent</span> <CheckCircle size={16} /></> : <><span>Send Message</span> <Send size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
