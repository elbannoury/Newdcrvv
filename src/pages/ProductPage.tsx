import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag, Truck, Shield, Ruler, Star, RotateCw, Check } from 'lucide-react';

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const { theme, addToCart, wishlist, toggleWishlist } = useApp();
  const tk = themeTokens[theme];
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const run = async () => {
      if (!handle) return;
      setQty(1);
      const { data } = await supabase.from('ecom_products').select('*').eq('handle', handle).single();
      setProduct(data);
      if (data) {
        const { data: rel } = await supabase.from('ecom_products').select('*').eq('product_type', data.product_type).neq('id', data.id).eq('status', 'active').limit(4);
        setRelated(rel || []);
      }
      window.scrollTo(0, 0);
    };
    run();
  }, [handle]);

  if (!product) return <div className="max-w-7xl mx-auto px-5 py-24 text-center" style={{ color: tk.sub }}>Loading…</div>;

  const fav = wishlist.includes(product.id);
  const meta = product.metadata || {};

  const handleAdd = () => {
    addToCart({ product_id: product.id, name: product.name, sku: product.sku, price: product.price, image: product.images?.[0] }, qty);
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* GALLERY + 360 */}
        <div>
          <div className="rounded-3xl overflow-hidden mb-4 relative" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <img src={product.images?.[0]} alt={product.name} className="w-full aspect-square object-cover transition-transform" style={{ transform: `rotateY(${rotate}deg)` }} />
            <button onClick={() => setRotate(r => r + 90)} className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.85)', color: '#111' }}>
              <RotateCw size={15} /> 360° View
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-xl overflow-hidden aspect-square" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" style={{ filter: `hue-rotate(${i * 8}deg)` }} />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm mb-2" style={{ color: '#19A8E5' }}>{product.product_type}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: tk.text }}>{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#19A8E5" color="#19A8E5" />)}
            <span className="text-sm" style={{ color: tk.sub }}>4.9 · 128 reviews</span>
          </div>
          <p className="text-3xl font-bold mb-5" style={{ color: tk.text }}>{formatMAD(product.price)}</p>
          <p className="mb-6 leading-relaxed" style={{ color: tk.sub }}>{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[[Ruler, 'Dimensions', meta.dimensions], [Shield, 'Material', meta.material], [Truck, 'Delivery', meta.delivery || '5-9 days'], [Check, 'Availability', product.inventory_qty > 0 ? 'In stock' : 'Made to order']].map(([Icon, l, v]: any) => v && (
              <div key={l} className="rounded-xl p-3 flex gap-3" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                <Icon size={18} color="#19A8E5" className="shrink-0 mt-0.5" />
                <div><div className="text-xs" style={{ color: tk.sub }}>{l}</div><div className="text-sm font-medium" style={{ color: tk.text }}>{v}</div></div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center rounded-full" style={{ border: `1px solid ${tk.border}` }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 text-xl" style={{ color: tk.text }}>−</button>
              <span className="w-8 text-center font-semibold" style={{ color: tk.text }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 text-xl" style={{ color: tk.text }}>+</button>
            </div>
            <button onClick={handleAdd} className="flex-1 h-12 rounded-full font-semibold text-white flex items-center justify-center gap-2" style={{ background: added ? '#2ED1C2' : '#19A8E5' }}>
              {added ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ border: `1px solid ${tk.border}` }}>
              <Heart size={20} fill={fav ? '#19A8E5' : 'none'} color={fav ? '#19A8E5' : tk.text} />
            </button>
          </div>
          <p className="text-sm flex items-center gap-2" style={{ color: tk.sub }}><Truck size={15} /> Free delivery · Cash on Delivery available</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6" style={{ color: tk.text }}>You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
