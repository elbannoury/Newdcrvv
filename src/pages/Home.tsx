import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';

const IMG = {
  hero: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620671463_d306135f.png',
  before: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620688727_b134880d.jpg',
  after: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620705888_c30d1163.jpg',
  insp1: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620883604_8536f750.png',
  insp2: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620883456_9a6b875d.png',
  insp3: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620885886_440a6814.png',
  garden: 'https://d64gsuwffb70l.cloudfront.net/6a221cd716d6a94b6f851f49_1780620902205_c3c47df1.jpg',
};

const categories = [
  { name: 'Living Room', handle: 'living-room', img: IMG.after },
  { name: 'Bedroom', handle: 'bedroom', img: IMG.insp1 },
  { name: 'Dining Room', handle: 'dining-room', img: IMG.insp2 },
  { name: 'Office', handle: 'office', img: IMG.insp3 },
  { name: 'Lighting', handle: 'lighting', img: IMG.hero },
  { name: 'Garden & Outdoor', handle: 'outdoor', img: IMG.garden },
];

export default function Home() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('ecom_products').select('*').eq('status', 'active').contains('tags', ['bestseller']).limit(8)
      .then(({ data }) => setProducts(data || []));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(8,12,15,0.82) 0%, rgba(8,12,15,0.45) 55%, rgba(8,12,15,0.1) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-28 md:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6" style={{ background: 'rgba(25,168,229,0.2)', border: '1px solid rgba(25,168,229,0.4)' }}>
              Premium Furniture · Morocco
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5">
              Elevate Your Space<br />With DCRVV
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-lg mb-9">
              Discover a curated collection of premium furniture and interior designs tailored for modern living in Morocco.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2 transition-transform hover:scale-105" style={{ background: '#19A8E5', boxShadow: '0 10px 40px rgba(25,168,229,0.45)' }}>
                Shop Collection
              </Link>
              <Link to="/about" className="px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
                Our Story <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: tk.text }}>Shop by space</h2>
            <p className="mt-2" style={{ color: tk.sub }}>Everything you need, room by room.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#19A8E5' }}>View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(c => (
            <Link key={c.handle} to={`/collections/${c.handle}`} className="group relative h-52 md:h-64 rounded-2xl overflow-hidden">
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)' }} />
              <div className="absolute bottom-5 left-5 flex items-center gap-2">
                <span className="text-white text-xl font-bold">{c.name}</span>
                <ArrowRight size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: tk.text }}>Best sellers</h2>
            <p className="mt-2" style={{ color: tk.sub }}>Loved by homes across Morocco.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#19A8E5' }}>Shop all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* INSPIRATIONS */}
      <section className="py-20" style={{ background: tk.surface }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: tk.text }}>Inspiration gallery</h2>
          <p className="mb-8" style={{ color: tk.sub }}>Curated interiors to spark your next transformation.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[IMG.insp1, IMG.after, IMG.insp2, IMG.insp3, IMG.garden, IMG.hero, IMG.insp1, IMG.after].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i % 3 === 0 ? 'row-span-2' : ''}`}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" style={{ minHeight: 200 }} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/inspiration" className="inline-flex items-center gap-2 font-semibold" style={{ color: '#19A8E5' }}>Explore the full gallery <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="rounded-3xl px-8 md:px-16 py-16 text-center relative overflow-hidden" style={{ background: 'linear-gradient(120deg,#111111,#1a2a33)' }}>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl mx-auto">Your dream space is just a click away</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">Browse our curated selection of furniture and start transforming your home today.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-white" style={{ background: '#19A8E5', boxShadow: '0 10px 40px rgba(25,168,229,0.45)' }}>
            Browse Shop
          </Link>
        </div>
      </section>
    </div>
  );
}
