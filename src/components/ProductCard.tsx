import { Link } from 'react-router-dom';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import { Heart, Plus } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  const { theme, addToCart, wishlist, toggleWishlist } = useApp();
  const tk = themeTokens[theme];
  const fav = wishlist.includes(product.id);
  const price = product.variants?.[0]?.price || product.price;

  return (
    <div className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <Link to={`/product/${product.handle}`} className="block relative aspect-square overflow-hidden" style={{ background: tk.bg }}>
        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.85)' }}>
          <Heart size={16} fill={fav ? '#19A8E5' : 'none'} color={fav ? '#19A8E5' : '#111'} />
        </button>
        {product.tags?.includes('bestseller') && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#2ED1C2' }}>BESTSELLER</span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: tk.sub }}>{product.product_type}</p>
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-semibold text-[15px] leading-tight mb-2" style={{ color: tk.text }}>{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: tk.text }}>{formatMAD(price)}</span>
          <button onClick={() => addToCart({ product_id: product.id, name: product.name, sku: product.sku, price, image: product.images?.[0] })}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110" style={{ background: '#19A8E5' }}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
