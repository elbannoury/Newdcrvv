import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, themeTokens } from '@/contexts/AppContext';
import { X, Sparkles, Mail } from 'lucide-react';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp, magicLink } = useAuth();
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg('');
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (res.error) setMsg(res.error);
    else { setMsg(mode === 'signup' ? 'Check your email to confirm.' : ''); if (mode === 'signin') onClose(); }
  };
  const magic = async () => {
    if (!email) { setMsg('Enter your email first.'); return; }
    setLoading(true); const res = await magicLink(email); setLoading(false);
    setMsg(res.error || 'Magic link sent — check your inbox.');
  };
  const input = { background: tk.bg, color: tk.text, border: `1px solid ${tk.border}` };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl p-7" style={{ background: tk.surface }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#19A8E5' }}><Sparkles size={16} /> DCRVV ACCOUNT</span>
          <button onClick={onClose} style={{ color: tk.text }}><X size={20} /></button>
        </div>
        <h2 className="text-2xl font-extrabold mb-5" style={{ color: tk.text }}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="Email" className="w-full rounded-xl px-4 h-12 outline-none" style={input} value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" required placeholder="Password" className="w-full rounded-xl px-4 h-12 outline-none" style={input} value={password} onChange={e => setPassword(e.target.value)} />
          {msg && <p className="text-sm" style={{ color: '#19A8E5' }}>{msg}</p>}
          <button disabled={loading} className="w-full py-3.5 rounded-full font-semibold text-white" style={{ background: '#19A8E5' }}>{loading ? '…' : mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <button onClick={magic} className="w-full mt-3 py-3 rounded-full font-semibold flex items-center justify-center gap-2" style={{ background: tk.bg, color: tk.text, border: `1px solid ${tk.border}` }}><Mail size={16} /> Send Magic Link</button>
        <p className="text-sm text-center mt-4" style={{ color: tk.sub }}>
          {mode === 'signin' ? "No account?" : 'Have an account?'}{' '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(''); }} className="font-semibold" style={{ color: '#19A8E5' }}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</button>
        </p>
      </div>
    </div>
  );
}
