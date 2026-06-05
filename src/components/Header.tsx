import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, themeTokens } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import { Menu, X, ShoppingBag, Heart, Search, Sparkles, User } from 'lucide-react';

const LOGO = 'https://d64gsuwffb70l.cloudfront.net/6a221bdc771f1cd2c6f9770d_1780620496494_fc9b2fa6.png';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Rooms', to: '/collections/living-room' },
  { label: 'Outdoor', to: '/collections/outdoor' },

  { label: 'Inspiration', to: '/inspiration' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const { theme, cartCount, wishlist } = useApp();
  const { user } = useAuth();
  const tk = themeTokens[theme];
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: tk.bg + 'd9', borderBottom: `1px solid ${tk.border}` }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO} alt="DCRVV" className="w-9 h-9 rounded-lg" />
            <span className="font-extrabold tracking-[0.28em] text-lg" style={{ color: tk.text }}>DCRVV</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className="px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
                style={{ color: n.ai ? '#19A8E5' : tk.text }}>
                {n.ai && <Sparkles size={14} />}{n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <form onSubmit={submitSearch} className="hidden md:flex items-center rounded-full px-3 h-9" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
              <Search size={15} style={{ color: tk.sub }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Modern sofa under 5000 MAD"
                className="bg-transparent outline-none text-sm px-2 w-44" style={{ color: tk.text }} />
            </form>
            {user ? (
              <Link to="/account" className="p-2 rounded-full" style={{ color: tk.text }}><User size={20} /></Link>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="p-2 rounded-full" style={{ color: tk.text }}><User size={20} /></button>
            )}
            <Link to="/wishlist" className="relative p-2 rounded-full" style={{ color: tk.text }}>
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#2ED1C2' }}>{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full" style={{ color: tk.text }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#19A8E5' }}>{cartCount}</span>}
            </Link>
            <button className="lg:hidden p-2 rounded-full" style={{ color: tk.text }} onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-5 pb-5" style={{ borderTop: `1px solid ${tk.border}` }}>
          <form onSubmit={submitSearch} className="flex items-center rounded-full px-3 h-10 my-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <Search size={16} style={{ color: tk.sub }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search furniture..." className="bg-transparent outline-none text-sm px-2 flex-1" style={{ color: tk.text }} />
          </form>
          {nav.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium" style={{ color: n.ai ? '#19A8E5' : tk.text, borderBottom: `1px solid ${tk.border}` }}>
              {n.label}
            </Link>
          ))}
          {user ? <Link to="/account" onClick={() => setOpen(false)} className="block py-3 text-base font-medium" style={{ color: tk.text }}>My Account</Link>
            : <button onClick={() => { setOpen(false); setAuthOpen(true); }} className="block py-3 text-base font-medium" style={{ color: tk.text }}>Sign In</button>}
        </div>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
