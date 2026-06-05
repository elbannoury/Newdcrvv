import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [params] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [q, setQ] = useState(params.get('q') || '');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(15000);

  useEffect(() => { setQ(params.get('q') || ''); }, [params]);

  useEffect(() => {
    supabase.from('ecom_products').select('*').eq('status', 'active').then(({ data }) => setProducts(data || []));
  }, []);

  const cats = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.product_type).filter(Boolean)))], [products]);

  const filtered = useMemo(() => {
    let r = products.filter(p =>
      (cat === 'All' || p.product_type === cat) &&
      (p.price / 100) <= maxPrice &&
      (!q || (p.name + ' ' + p.description + ' ' + (p.tags || []).join(' ') + ' ' + p.product_type).toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [products, cat, q, sort, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2" style={{ color: tk.text }}>Shop</h1>
      <p className="mb-8" style={{ color: tk.sub }}>{filtered.length} premium pieces · Free delivery across Morocco</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center rounded-full px-4 h-12 flex-1" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <Search size={18} style={{ color: tk.sub }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Try: modern sofa under 5000 MAD"
            className="bg-transparent outline-none px-3 flex-1 text-sm" style={{ color: tk.text }} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-full px-5 h-12 text-sm font-medium outline-none" style={{ background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ background: cat === c ? '#19A8E5' : tk.surface, color: cat === c ? '#fff' : tk.text, border: `1px solid ${tk.border}` }}>{c}</button>
        ))}
        <div className="flex items-center gap-2 ml-auto text-sm" style={{ color: tk.sub }}>
          <SlidersHorizontal size={15} /> Max {maxPrice.toLocaleString()} MAD
          <input type="range" min={1000} max={15000} step={500} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="accent-[#19A8E5] w-32" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center" style={{ color: tk.sub }}>No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
          }
