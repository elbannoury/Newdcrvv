import { useRef, useState } from 'react';

export default function BeforeAfter({ before, after, height = 'h-[420px]' }: { before: string; after: string; height?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  };

  return (
    <div ref={ref} className={`relative w-full ${height} rounded-3xl overflow-hidden select-none cursor-ew-resize`}
      onMouseMove={(e) => drag.current && move(e.clientX)}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onMouseUp={() => (drag.current = false)}
      onMouseLeave={() => (drag.current = false)}
      onTouchMove={(e) => move(e.touches[0].clientX)}>
      <img src={after} alt="after" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="before" className="absolute inset-0 h-full object-cover" style={{ width: ref.current?.offsetWidth || '100vw', maxWidth: 'none' }} />
        <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white">BEFORE</span>
      </div>
      <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: '#19A8E5' }}>AI AFTER</span>
      <div className="absolute top-0 bottom-0 w-1 -ml-0.5" style={{ left: `${pos}%`, background: '#fff' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg" style={{ border: '3px solid #19A8E5' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19A8E5" strokeWidth="2.5"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
        </div>
      </div>
    </div>
  );
}
