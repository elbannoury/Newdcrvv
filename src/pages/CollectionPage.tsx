import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!handle) return;
      setLoading(true);
      const { data: col } = await supabase.from('ecom_collections').select('*').eq('handle', handle).single();
      if (!col) { setLoading(false); return; }
      setCollection(col);
      const { data: links } = await supabase.from('ecom_product_collections').select('product_id, position').eq('collection_id', col.id).order('position');
      if (!links?.length) { setProducts([]); setLoading(false); return; }
      const ids = links.map(l => l.product_id);
      const { data: prods } = await supabase.from('ecom_products').select('*').in('id', ids).eq('status', 'active');
      setProducts(ids.map(id => prods?.find(p => p.id === id)).filter(Boolean));
      setLoading(false);
    };
    run();
  }, [handle]);

  if (loading) return <div className="max-w-7xl mx-auto px-5 py-20 text-center" style={{ color: tk.sub }}>Loading…</div>;
  if (!collection) return <div className="max-w-7xl mx-auto px-5 py-20 text-center" style={{ color: tk.sub }}>Collection not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2" style={{ color: tk.text }}>{collection.title}</h1>
      <p className="mb-8" style={{ color: tk.sub }}>{collection.description} · {products.length} products</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
