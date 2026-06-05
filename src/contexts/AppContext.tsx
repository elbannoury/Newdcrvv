import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  product_id: string;
  variant_id?: string;
  quantity: number;
  name: string;
  variant_title?: string;
  sku?: string;
  price: number;
  image?: string;
};

type ThemeKey = 'desert' | 'modern' | 'studio';
type LangKey = 'ar' | 'dr' | 'fr' | 'en';

type AppContextType = {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  lang: LangKey;
  setLang: (l: LangKey) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (product_id: string, variant_id?: string) => void;
  updateQty: (product_id: string, variant_id: string | undefined, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const themeTokens: Record<ThemeKey, { bg: string; surface: string; text: string; sub: string; border: string; name: string }> = {
  desert: { bg: '#E8CCB2', surface: '#F6E8DA', text: '#111111', sub: '#5b4a3a', border: 'rgba(17,17,17,0.10)', name: 'Desert AI' },
  modern: { bg: '#0c0f12', surface: '#16191d', text: '#F6E8DA', sub: '#9aa3ad', border: 'rgba(255,255,255,0.10)', name: 'Modern AI' },
  studio: { bg: '#ffffff', surface: '#F6E8DA', text: '#111111', sub: '#5b5b5b', border: 'rgba(17,17,17,0.08)', name: 'Light Studio' },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboardedState] = useState(true);
  const [theme, setThemeState] = useState<ThemeKey>('desert');
  const [lang, setLangState] = useState<LangKey>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const ob = localStorage.getItem('dcrvv_onboarded');
      if (ob === 'true') setOnboardedState(true);
      const t = localStorage.getItem('dcrvv_theme') as ThemeKey | null;
      if (t) setThemeState(t);
      const l = localStorage.getItem('dcrvv_lang') as LangKey | null;
      if (l) setLangState(l);
      setCart(JSON.parse(localStorage.getItem('ecom_cart') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('dcrvv_wishlist') || '[]'));
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    const tk = themeTokens[theme];
    document.documentElement.style.setProperty('--bg', tk.bg);
    document.documentElement.style.setProperty('--surface', tk.surface);
    document.documentElement.style.setProperty('--text', tk.text);
    document.documentElement.style.setProperty('--sub', tk.sub);
    document.documentElement.style.setProperty('--border', tk.border);
    document.body.style.backgroundColor = tk.bg;
    document.body.style.color = tk.text;
  }, [theme]);

  const setOnboarded = (v: boolean) => { setOnboardedState(v); localStorage.setItem('dcrvv_onboarded', String(v)); };
  const setTheme = (t: ThemeKey) => { setThemeState('desert'); localStorage.setItem('dcrvv_theme', 'desert'); };
  const setLang = (l: LangKey) => { setLangState(l); localStorage.setItem('dcrvv_lang', l); };

  const persistCart = (c: CartItem[]) => { setCart(c); localStorage.setItem('ecom_cart', JSON.stringify(c)); };

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    const next = [...cart];
    const idx = next.findIndex(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
    if (idx >= 0) next[idx].quantity += qty;
    else next.push({ ...item, quantity: qty });
    persistCart(next);
  };
  const removeFromCart = (product_id: string, variant_id?: string) => {
    persistCart(cart.filter(i => !(i.product_id === product_id && i.variant_id === variant_id)));
  };
  const updateQty = (product_id: string, variant_id: string | undefined, qty: number) => {
    if (qty <= 0) return removeFromCart(product_id, variant_id);
    persistCart(cart.map(i => (i.product_id === product_id && i.variant_id === variant_id) ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => persistCart([]);

  const toggleWishlist = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem('dcrvv_wishlist', JSON.stringify(next));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{ onboarded, setOnboarded, theme, setTheme, lang, setLang, cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, wishlist, toggleWishlist }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const formatMAD = (cents: number) =>
  new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(Math.round(cents / 100)) + ' MAD';
