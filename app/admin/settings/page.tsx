'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Store Information',
    fields: [
      { key: 'storeName', label: 'Store Name', type: 'text', placeholder: 'Veescents' },
      { key: 'storeTagline', label: 'Tagline', type: 'text', placeholder: 'Smell is a word, Perfume is literature.' },
      { key: 'storeEmail', label: 'Contact Email', type: 'email', placeholder: 'hello@veescents.com' },
      { key: 'storePhone', label: 'Phone Number', type: 'text', placeholder: '+234 800 000 0000' },
      { key: 'storeAddress', label: 'Address', type: 'text', placeholder: 'Lagos, Nigeria' },
    ],
  },
  {
    title: 'Social Media',
    fields: [
      { key: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/veescents' },
      { key: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/veescents' },
      { key: 'twitter', label: 'X (Twitter) URL', type: 'url', placeholder: 'https://twitter.com/veescents' },
      { key: 'tiktok', label: 'TikTok URL', type: 'url', placeholder: 'https://tiktok.com/@veescents' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+2348000000000' },
    ],
  },
  {
    title: 'Announcement Bar',
    fields: [
      { key: 'promo1', label: 'Promo Message 1', type: 'text', placeholder: '✦ Free delivery on orders above ₦50,000' },
      { key: 'promo2', label: 'Promo Message 2', type: 'text', placeholder: '✦ New arrivals every week' },
      { key: 'promo3', label: 'Promo Message 3', type: 'text', placeholder: '✦ Authentic luxury fragrances, guaranteed' },
      { key: 'promo4', label: 'Promo Message 4', type: 'text', placeholder: '✦ Gift wrapping available on all orders' },
    ],
  },
];

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ic = 'w-full border border-gray-200 px-4 py-2.5 text-sm text-accent-dark focus:outline-none focus:border-accent-gold transition-colors bg-white rounded-sm';
  const lc = 'block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2';

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-accent-dark">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage site-wide configuration</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-accent-gold text-white hover:bg-accent-dark'}`}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {SECTIONS.map(section => (
          <div key={section.title} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
            <h2 className="font-serif text-xl text-accent-dark mb-6 pb-4 border-b border-gray-100">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map(field => (
                <div key={field.key}>
                  <label className={lc}>{field.label}</label>
                  <input
                    type={field.type}
                    className={ic}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ''}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-white rounded-sm shadow-sm border border-red-100 p-8">
          <h2 className="font-serif text-xl text-red-500 mb-6 pb-4 border-b border-red-100">Danger Zone</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="border border-red-200 text-red-500 px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
              Clear All Products
            </button>
            <button className="border border-red-200 text-red-500 px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
              Reset Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
