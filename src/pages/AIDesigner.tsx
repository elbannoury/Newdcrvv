import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens } from '@/contexts/AppContext';
import BeforeAfter from '@/components/BeforeAfter';
import { Sparkles, Upload, Wand2, Download, Share2, Bookmark, Loader2 } from 'lucide-react';

const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Garden', 'Terrace', 'Dining Room', 'Bathroom'];
const styles = ['Modern', 'Minimal', 'Luxury', 'Moroccan', 'Scandinavian', 'Japandi', 'Industrial', 'Contemporary', 'Mediterranean', 'Custom'];

export default function AIDesigner() {
  const { theme } = useApp();
  const tk = themeTokens[theme];
  const [image, setImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState('Living Room');
  const [style, setStyle] = useState('Modern');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result as string); setResult(null); };
    reader.readAsDataURL(f);
  };

  const generate = async () => {
    if (!image) { setError('Please upload a room photo first.'); return; }
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const { data, error } = await supabase.functions.invoke('ai-redesign', {
        body: { roomType: roomType.toLowerCase(), style, notes, image }
      });
      if (error || !data?.success) throw new Error(data?.error || 'Generation failed. Please try again.');
      setResult(data.image);
      try {
        const saves = JSON.parse(localStorage.getItem('dcrvv_designs') || '[]');
        saves.unshift({ image: data.image, style, roomType, at: Date.now() });
        localStorage.setItem('dcrvv_designs', JSON.stringify(saves.slice(0, 20)));
      } catch (e) { /* ignore */ }
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-14 px-5 lg:px-8" style={{ background: 'linear-gradient(120deg,#111111,#13212a)' }}>
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: '#2ED1C2' }}><Sparkles size={16} /> DCRVV AI INTERIOR DESIGNER</span>
          <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight mb-3">Redesign any room with AI</h1>
          <p className="text-white/60 text-lg max-w-2xl">Upload a photo, pick a style, and watch DCRVV transform your space — realistic shadows, correct perspective, natural lighting.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* CONTROLS */}
        <div className="rounded-3xl p-6 h-fit lg:sticky lg:top-24" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: tk.text }}>1 · Upload your room</h3>
          <label className="block rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden mb-6" style={{ borderColor: tk.border }}>
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && onFile(e.target.files[0])} />
            {image ? (
              <img src={image} alt="room" className="w-full h-44 object-cover" />
            ) : (
              <div className="h-44 flex flex-col items-center justify-center gap-2" style={{ color: tk.sub }}>
                <Upload size={28} /><span className="text-sm font-medium">Click to upload a photo</span>
                <span className="text-xs">Living room, bedroom, garden…</span>
              </div>
            )}
          </label>

          <h3 className="font-bold text-lg mb-3" style={{ color: tk.text }}>2 · Room type</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {roomTypes.map(r => (
              <button key={r} onClick={() => setRoomType(r)} className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{ background: roomType === r ? '#19A8E5' : tk.bg, color: roomType === r ? '#fff' : tk.text, border: `1px solid ${tk.border}` }}>{r}</button>
            ))}
          </div>

          <h3 className="font-bold text-lg mb-3" style={{ color: tk.text }}>3 · Style</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {styles.map(s => (
              <button key={s} onClick={() => setStyle(s)} className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{ background: style === s ? '#2ED1C2' : tk.bg, color: style === s ? '#fff' : tk.text, border: `1px solid ${tk.border}` }}>{s}</button>
            ))}
          </div>

          <h3 className="font-bold text-lg mb-3" style={{ color: tk.text }}>4 · Notes (optional)</h3>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. warm tones, more plants, a large rug…"
            className="w-full rounded-xl p-3 text-sm outline-none mb-5 resize-none" style={{ background: tk.bg, color: tk.text, border: `1px solid ${tk.border}` }} />

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: '#19A8E5' }}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Designing…</> : <><Wand2 size={18} /> Generate Redesign</>}
          </button>
          {error && <p className="text-sm mt-3 text-red-500">{error}</p>}
        </div>

        {/* CANVAS */}
        <div>
          {!image && !result && (
            <div className="rounded-3xl h-[500px] flex flex-col items-center justify-center text-center px-6" style={{ background: tk.surface, border: `1px dashed ${tk.border}` }}>
              <Wand2 size={48} style={{ color: '#19A8E5' }} />
              <h3 className="text-2xl font-bold mt-4 mb-2" style={{ color: tk.text }}>Your AI canvas</h3>
              <p style={{ color: tk.sub }}>Upload a room to begin. Results appear here side-by-side.</p>
            </div>
          )}

          {image && !result && !loading && (
            <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${tk.border}` }}>
              <img src={image} alt="room" className="w-full h-[500px] object-cover" />
            </div>
          )}

          {loading && (
            <div className="rounded-3xl h-[500px] flex flex-col items-center justify-center" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#19A8E5', borderTopColor: 'transparent' }} />
                <Sparkles size={24} className="absolute inset-0 m-auto" color="#19A8E5" />
              </div>
              <p className="font-semibold" style={{ color: tk.text }}>Analyzing structure & generating {style} redesign…</p>
              <p className="text-sm mt-1" style={{ color: tk.sub }}>Detecting walls, floor, lighting & perspective</p>
            </div>
          )}

          {result && image && (
            <div>
              <BeforeAfter before={image} after={result} height="h-[500px]" />
              <div className="flex flex-wrap gap-3 mt-5">
                <a href={result} download="dcrvv-design.png" className="px-5 py-3 rounded-full font-semibold text-white flex items-center gap-2" style={{ background: '#111111' }}><Download size={16} /> Download</a>
                <button onClick={() => setSaved(true)} className="px-5 py-3 rounded-full font-semibold flex items-center gap-2" style={{ background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` }}><Bookmark size={16} fill={saved ? '#19A8E5' : 'none'} /> {saved ? 'Saved' : 'Save Design'}</button>
                <button onClick={() => navigator.share ? navigator.share({ title: 'DCRVV Design', url: result }).catch(() => {}) : navigator.clipboard.writeText(result)} className="px-5 py-3 rounded-full font-semibold flex items-center gap-2" style={{ background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` }}><Share2 size={16} /> Share</button>
                <button onClick={generate} className="px-5 py-3 rounded-full font-semibold text-white flex items-center gap-2" style={{ background: '#19A8E5' }}><Wand2 size={16} /> Generate Variation</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
