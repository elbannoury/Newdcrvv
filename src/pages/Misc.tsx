import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, themeTokens } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Mail, Phone, MapPin, Heart } from 'lucide-react';

const IMG = {
  insp1: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620883604_8536f750.png',
  insp2: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620883456_9a6b875d.png',
  insp3: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620885886_440a6814.png',
  after: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620705888_c30d1163.jpg',
  garden: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620902205_c3c47df1.jpg',
  hero: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620671463_d306135f.png',
};

export function About() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-16">
      <span className="inline-flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: '#19A8E5' }}>ABOUT DCRVV</span>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6" style={{ color: tk.text }}>Premium Interior Design for Morocco.</h1>
      <p className="text-lg leading-relaxed mb-6" style={{ color: tk.sub }}>DCRVV is Morocco's premier furniture and interior design platform. We curate high-quality pieces that bring modern elegance to your home. Our collection is designed to help you create spaces that reflect your personality and style.</p>
      <div className="grid md:grid-cols-3 gap-6 my-10">
        {[['500+', 'Curated Pieces'], ['48h', 'Average delivery'], ['100%', 'Made in Morocco']].map(([a, b]) => (
          <div key={b} className="rounded-2xl p-6" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <div className="text-3xl font-extrabold mb-1" style={{ color: '#19A8E5' }}>{a}</div>
            <div style={{ color: tk.sub }}>{b}</div>
          </div>
        ))}
      </div>
      <img src={IMG.after} alt="" className="rounded-3xl w-full h-80 object-cover mb-10" />
      <h2 className="text-2xl font-bold mb-3" style={{ color: tk.text }}>Our mission</h2>
      <p className="leading-relaxed" style={{ color: tk.sub }}>We believe every home deserves beautiful design — accessible to all. By providing a curated catalog of premium furniture and professional interior inspiration, DCRVV makes transforming your home simple, affordable and personal.</p>
    </div>
  );
}

export function Contact() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://famous.ai/api/crm/6a221cd716d6a94b6f851f49/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, source: 'contact-form', tags: ['contact', 'dcrvv'] })
      });
    } catch (e) { /* ignore */ }
    setSent(true); setForm({ name: '', email: '', message: '' });
  };
  const input = { background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` };
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: tk.text }}>Let's talk</h1>
        <p className="mb-8" style={{ color: tk.sub }}>Questions about a product, an order, or professional design services? We're here.</p>
        {[[Mail, 'hello@dcrvv.ma'], [Phone, '+212 5 22 00 00 00'], [MapPin, 'Casablanca, Morocco']].map(([Icon, v]: any) => (
          <div key={v} className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(25,168,229,0.12)' }}><Icon size={18} color="#19A8E5" /></div>
            <span style={{ color: tk.text }}>{v}</span>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="rounded-3xl p-6 space-y-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
        <input required placeholder="Your name" className="w-full rounded-xl px-4 h-12 outline-none" style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full rounded-xl px-4 h-12 outline-none" style={input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <textarea required rows={4} placeholder="Message" className="w-full rounded-xl px-4 py-3 outline-none resize-none" style={input} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <button className="w-full py-3.5 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>{sent ? 'Message sent ✓' : 'Send Message'}</button>
      </form>
    </div>
  );
}

export function Inspiration() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const imgs = [IMG.insp1, IMG.after, IMG.insp2, IMG.insp3, IMG.garden, IMG.hero, IMG.insp2, IMG.after, IMG.insp1, IMG.garden, IMG.insp3, IMG.hero];
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2" style={{ color: tk.text }}>Inspiration</h1>
      <p className="mb-8" style={{ color: tk.sub }}>Real transformations and curated interiors from the DCRVV community.</p>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {imgs.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden break-inside-avoid">
            <img src={img} alt="" className="w-full hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>Shop the Look</Link>
      </div>
    </div>
  );
}

export function Wishlist() {
  const { theme, wishlist } = useApp();
  const tk = themeTokens[theme];
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); return; }
    supabase.from('ecom_products').select('*').in('id', wishlist).then(({ data }) => setProducts(data || []));
  }, [wishlist]);
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8" style={{ color: tk.text }}>Favorites</h1>
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <Heart size={44} className="mx-auto mb-4" style={{ color: tk.sub }} />
          <p style={{ color: tk.sub }}>No favorites yet. Tap the heart on any product to save it.</p>
          <Link to="/shop" className="inline-block mt-6 px-7 py-3 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>Browse Furniture</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
