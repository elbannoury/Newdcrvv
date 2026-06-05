import { Link, useSearchParams } from 'react-router-dom';
import { useApp, themeTokens } from '@/contexts/AppContext';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function OrderConfirmation() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [params] = useSearchParams();
  const id = params.get('id');

  return (
    <div className="max-w-2xl mx-auto px-5 py-24 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(46,209,194,0.15)' }}>
        <CheckCircle2 size={44} color="#2ED1C2" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: tk.text }}>Order confirmed</h1>
      <p className="mb-2" style={{ color: tk.sub }}>Thank you for choosing DCRVV. A confirmation email is on its way.</p>
      {id && <p className="text-sm mb-8" style={{ color: tk.sub }}>Order ref: <span className="font-mono" style={{ color: tk.text }}>{id.slice(0, 8).toUpperCase()}</span></p>}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/shop" className="px-7 py-3.5 rounded-full font-semibold text-white flex items-center gap-2" style={{ background: '#19A8E5' }}>Continue Shopping <ArrowRight size={18} /></Link>
        <Link to="/ai-designer" className="px-7 py-3.5 rounded-full font-semibold flex items-center gap-2" style={{ background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` }}><Sparkles size={16} /> Design a Room</Link>
      </div>
    </div>
  );
}
