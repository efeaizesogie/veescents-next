export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  isNew?: boolean;
  salesCount?: number;
  inStock?: boolean;
  category: 'men' | 'women' | 'unisex';
  cat?: 'niche' | 'gift_set' | 'body_care' | 'candles' | 'deodorants' | 'celebrity' | 'perfume_oil' | 'combo';
  section?: 'new_collection' | 'gallery';
  isNewProduct?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewName = 'HOME' | 'STORE' | 'PRODUCT' | 'CATEGORIES';

export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}
