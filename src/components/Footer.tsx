import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, themeTokens } from '@/contexts/AppContext';

const LOGO = 'https://d64gsuwffb70l.cloudfront.net/6a221bdc771f1cd2c6f9770d_1780620496494_fc9b2fa6.png';

export default function Footer() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('https://famous.ai/api/crm/6a221cd716d6a94b6f851f49/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-signup', tags: ['newsletter', 'dcrvv'] })
      });
    } catch (e) { /* ignore */ }
    setDone(true); setEmail('');
  };

  const cols = [
    { title: 'Shop', links: [['Living Room', '/collections/living-room'], ['Bedroom', '/collections/bedroom'], ['Dining', '/collections/dining-room'], ['Office', '/collections/office'], ['Lighting', '/collections/lighting'], ['Outdoor', '/collections/outdoor']] },
    { title: 'Information', links: [['Inspiration', '/inspiration'], ['Collections', '/shop'], ['Shipping Policy', '/about'], ['Return Policy', '/about']] },
    { title: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Order Tracking', '/contact'], ['Careers', '/about']] },
  ];

  return (
    <footer className="mt-24 pt-16 pb-8" style={{ background: tk.surface, borderTop: `1px solid ${tk.border}` }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={LOGO} alt="DCRVV" className="w-10 h-10 rounded-lg" />
              <span className="font-extrabold tracking-[0.28em] text-xl" style={{ color: tk.text }}>DCRVV</span>
            </div>
            <p className="text-sm max-w-xs mb-5" style={{ color: tk.sub }}>
              Premium furniture and interior design platform in Morocco. Elevate your living space with our curated collections.
            </p>
            <form onSubmit={subscribe} className="flex gap-2 max-w-sm">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email"
                className="flex-1 rounded-full px-4 h-11 text-sm outline-none" style={{ background: tk.bg, color: tk.text, border: `1px solid ${tk.border}` }} />
              <button className="px-5 h-11 rounded-full text-white text-sm font-semibold" style={{ background: '#19A8E5' }}>
                {done ? 'Joined ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <h4 className="font-bold mb-4 text-sm" style={{ color: tk.text }}>{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map(([l, to]) => (
                  <li key={l}><Link to={to} className="text-sm" style={{ color: tk.sub }}>{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: `1px solid ${tk.border}` }}>
          <p className="text-xs" style={{ color: tk.sub }}>© {new Date().getFullYear()} DCRVV. Crafted in Morocco. Cash on Delivery · Bank Cards · MAD</p>
        </div>
      </div>
    </footer>
  );
}
