import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import { LogOut, Package, Heart, Image as ImageIcon } from 'lucide-react';

export default function Account() {
  const { user, signOut } = useAuth();
  const { theme, wishlist } = useApp();
  const tk = themeTokens[theme];
  const [orders, setOrders] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('ecom_customers').select('id').eq('email', user.email).single().then(({ data }) => {
      if (data) supabase.from('ecom_orders').select('*').eq('customer_id', data.id).order('created_at', { ascending: false }).then(({ data: o }) => setOrders(o || []));
    });
    try { setDesigns(JSON.parse(localStorage.getItem('dcrvv_designs') || '[]')); } catch (e) { /* ignore */ }
  }, [user]);

  if (!user) return (
    <div className="max-w-2xl mx-auto px-5 py-24 text-center">
      <h1 className="text-3xl font-extrabold mb-3" style={{ color: tk.text }}>Sign in to view your account</h1>
      <Link to="/" className="inline-block mt-4 px-7 py-3 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>Go Home</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: tk.text }}>My Account</h1>
          <p style={{ color: tk.sub }}>{user.email}</p>
        </div>
        <button onClick={signOut} className="px-5 py-2.5 rounded-full font-semibold flex items-center gap-2" style={{ background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` }}><LogOut size={16} /> Sign Out</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[[Package, orders.length, 'Orders'], [ImageIcon, designs.length, 'Saved Designs'], [Heart, wishlist.length, 'Favorites']].map(([Icon, n, l]: any) => (
          <div key={l} className="rounded-2xl p-6 flex items-center gap-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(25,168,229,0.12)' }}><Icon size={22} color="#19A8E5" /></div>
            <div><div className="text-2xl font-extrabold" style={{ color: tk.text }}>{n}</div><div className="text-sm" style={{ color: tk.sub }}>{l}</div></div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4" style={{ color: tk.text }}>Order history</h2>
      {orders.length === 0 ? <p className="mb-10" style={{ color: tk.sub }}>No orders yet. <Link to="/shop" className="font-semibold" style={{ color: '#19A8E5' }}>Start shopping</Link></p> : (
        <div className="space-y-3 mb-10">
          {orders.map(o => (
            <div key={o.id} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
              <div><div className="font-semibold" style={{ color: tk.text }}>#{o.id.slice(0, 8).toUpperCase()}</div><div className="text-sm" style={{ color: tk.sub }}>{new Date(o.created_at).toLocaleDateString()}</div></div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white capitalize" style={{ background: o.status === 'delivered' ? '#2ED1C2' : o.status === 'shipped' ? '#19A8E5' : '#111' }}>{o.status}</span>
              <div className="font-bold" style={{ color: tk.text }}>{formatMAD(o.total)}</div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4" style={{ color: tk.text }}>Saved designs</h2>
      {designs.length === 0 ? <p style={{ color: tk.sub }}>No saved designs yet. <Link to="/ai-designer" className="font-semibold" style={{ color: '#19A8E5' }}>Design a room</Link></p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {designs.map((d, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tk.border}` }}>
              <img src={d.image} alt="" className="w-full h-40 object-cover" />
              <div className="p-3 text-sm" style={{ background: tk.surface, color: tk.text }}>{d.style} · {d.roomType}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
