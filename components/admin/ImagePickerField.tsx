'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Upload } from 'lucide-react';

const MEDIA_FILES = [
  'afnan-9pm-elixir-parfum-intense-100ml.jpg',
  'afnan-rare-reef-edp-100ml.jpeg',
  'afnan-supremacy-collector-s-edition-edp-100ml.jpeg',
  'arabian-luxury-perfume.webp',
  'arabian-perfume.webp',
  'armaf-club-de-nuit-intense-edt-105ml-for-men.jpg',
  'armaf-club-de-nuit-precieux-1-edp-55ml.jpeg',
  'armaf-club-de-nuit-urban-man-edp-elixir-105ml.jpeg',
  'azzaro-the-most-wanted-parfum-100ml-for-men.jpeg',
  'body-mist.jpg',
  'body-spray.jpg',
  'carolina-herrera-212-nyc-edt-100ml-for-men.jpeg',
  'combo.webp',
  'diffuser.webp',
  'emir-a-walk-on-dirt-edp-100ml.jpeg',
  'fragrance-world-midnight-oud-edp-100ml-for-men.jpeg',
  'fragrance-world-oud-madness-edp-60ml.jpg',
  'fragrance-world-suits-edp-100ml-for-men.jpeg',
  'franck-olivier-oud-touch-edp-100ml-for-men.jpeg',
  'geoffrey-beene-grey-flannel-edt-120ml-for-men.jpg',
  'gift-set.jpeg',
  'giorgio-armani-emporio-stronger-with-you-intensely-edp-100ml.jpg',
  'gucci-intense-oud-edp-90ml-for-men.jpg',
  'joop-homme-edt-125ml-for-men.jpeg',
  'kiddies.jpg',
  'lattafa-asad-edp-100ml-for-men.jpg',
  'mancera-red-tobacco-edp-120ml-for-men.jpg',
  'musamam-black-intense-lattafa-edp-100ml.webp',
  'original-designer-perfume.jpeg',
  'perfume-oil.jpg',
  'rasasi-hawas-edp-100ml-for-men.jpg',
  'rasasi-hawas-ice-edp-100ml.jpg',
  'rayhaan-elixir-eau-de-parfum-100ml.jpeg',
  'rayhaan-pacific-aura-pour-homme-edp-100ml.jpeg',
  'salvatore-ferragamo-spicy-leather-parfum-100ml.jpg',
];

export default function ImagePickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Image</label>
      <label className="flex items-center gap-2 cursor-pointer mb-3 w-fit border border-dashed border-gray-300 hover:border-accent-gold px-4 py-2 rounded-sm text-sm text-gray-500 hover:text-accent-gold transition-colors">
        <Upload size={14} />
        {uploading ? 'Uploading...' : 'Upload new image'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const fd = new FormData();
              fd.append('file', file);
              const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
              if (res.ok) {
                const { path } = await res.json();
                onChange(path);
              }
            } finally {
              setUploading(false);
            }
          }}
        />
      </label>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto border border-gray-100 rounded-sm p-2 bg-gray-50">
        {MEDIA_FILES.map((file) => {
          const path = `/products/${file}`;
          const selected = value === path;
          return (
            <button
              key={file}
              type="button"
              onClick={() => onChange(path)}
              className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-colors ${
                selected ? 'border-accent-gold' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={path} alt={file} fill className="object-cover" sizes="80px" />
              {selected && (
                <div className="absolute inset-0 bg-accent-gold/20 flex items-center justify-center">
                  <Check size={16} className="text-accent-gold" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {value && <p className="mt-2 text-xs text-gray-400 truncate">Selected: {value}</p>}
    </div>
  );
}
