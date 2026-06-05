import { Link, useNavigate } from 'react-router-dom';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import { Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export default function Cart() {
  const { theme, cart, updateQty, removeFromCart, cartTotal } = useApp();
  const tk = themeTokens[theme];
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: tk.sub }} />
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: tk.text }}>Your cart is empty</h1>
        <p className="mb-8" style={{ color: tk.sub }}>Discover furniture that transforms your space.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>Browse Furniture <ArrowRight size={18} /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8" style={{ color: tk.text }}>Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product_id + (item.variant_id || '')} className="flex gap-4 rounded-2xl p-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: tk.text }}>{item.name}</h3>
                {item.variant_title && <p className="text-sm" style={{ color: tk.sub }}>{item.variant_title}</p>}
                <p className="font-bold mt-1" style={{ color: tk.text }}>{formatMAD(item.price)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center rounded-full" style={{ border: `1px solid ${tk.border}` }}>
                    <button onClick={() => updateQty(item.product_id, item.variant_id, item.quantity - 1)} className="w-8 h-8" style={{ color: tk.text }}>−</button>
                    <span className="w-7 text-center text-sm" style={{ color: tk.text }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product_id, item.variant_id, item.quantity + 1)} className="w-8 h-8" style={{ color: tk.text }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="text-sm flex items-center gap-1" style={{ color: tk.sub }}><Trash2 size={15} /> Remove</button>
                </div>
              </div>
              <div className="font-bold" style={{ color: tk.text }}>{formatMAD(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 h-fit lg:sticky lg:top-24" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: tk.text }}>Summary</h2>
          <div className="flex justify-between mb-2" style={{ color: tk.sub }}><span>Subtotal</span><span style={{ color: tk.text }}>{formatMAD(cartTotal)}</span></div>
          <div className="flex justify-between mb-2" style={{ color: tk.sub }}><span>Shipping</span><span style={{ color: '#2ED1C2' }}>Free</span></div>
          <div className="flex justify-between font-bold text-lg pt-4" style={{ color: tk.text, borderTop: `1px solid ${tk.border}` }}><span>Total</span><span>{formatMAD(cartTotal)}</span></div>
          <button onClick={() => navigate('/checkout')} className="w-full mt-6 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#19A8E5' }}>
            Checkout <ArrowRight size={18} />
          </button>
          <p className="text-xs text-center mt-3 flex items-center justify-center gap-1.5" style={{ color: tk.sub }}><Truck size={13} /> Free delivery · Cash on Delivery available</p>
        </div>
      </div>
    </div>
  );
}
