import { useState } from 'react';
import { useApp, themeTokens } from '@/contexts/AppContext';

const LOGO = 'https://d64gsuwffb70l.cloudfront.net/6a221bdc771f1cd2c6f9770d_1780620496494_fc9b2fa6.png';

const languages = [
  { key: 'ar', label: 'العربية', sub: 'Arabic' },
  { key: 'dr', label: 'الدارجة', sub: 'Darija' },
  { key: 'fr', label: 'Français', sub: 'French' },
  { key: 'en', label: 'English', sub: 'English' },
] as const;

const themes = [
  { key: 'desert', name: 'Desert AI', desc: 'Sand + Cyan', preview: 'linear-gradient(135deg,#E8CCB2,#F6E8DA)', dot: '#19A8E5' },
  { key: 'modern', name: 'Modern AI', desc: 'Dark + Cyan', preview: 'linear-gradient(135deg,#0c0f12,#16191d)', dot: '#19A8E5' },
  { key: 'studio', name: 'Light Studio', desc: 'White + Sand', preview: 'linear-gradient(135deg,#ffffff,#F6E8DA)', dot: '#2ED1C2' },
] as const;

export default function Onboarding() {
  const { setOnboarded, setTheme, setLang, theme } = useApp();
  const [step, setStep] = useState(1);
  const [selLang, setSelLang] = useState<string | null>(null);
  const tk = themeTokens[theme];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" style={{ background: 'radial-gradient(circle at 30% 20%, #1a2a33, #0a0d10)' }}>
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <img src={LOGO} alt="DCRVV" className="w-10 h-10 rounded-lg" />
        <span className="text-white font-bold tracking-[0.3em] text-lg">DCRVV</span>
      </div>

      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 mb-10 justify-center">
          {[1, 2].map(n => (
            <div key={n} className="h-1 rounded-full transition-all duration-500" style={{ width: step === n ? 48 : 20, background: step >= n ? '#19A8E5' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-[fadeIn_0.5s_ease]">
            <p className="text-[#19A8E5] text-sm font-medium tracking-widest uppercase mb-3 text-center">Step 1</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-3">Choose your language</h1>
            <p className="text-white/50 text-center mb-10">اختر لغتك · Choisissez votre langue</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map(l => (
                <button key={l.key} onClick={() => { setSelLang(l.key); setLang(l.key as any); setTimeout(() => setStep(2), 250); }}
                  className="group rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.03]"
                  style={{ borderColor: selLang === l.key ? '#19A8E5' : 'rgba(255,255,255,0.12)', background: selLang === l.key ? 'rgba(25,168,229,0.12)' : 'rgba(255,255,255,0.04)' }}>
                  <div className="text-white text-2xl font-bold mb-1">{l.label}</div>
                  <div className="text-white/40 text-sm">{l.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-[fadeIn_0.5s_ease]">
            <p className="text-[#19A8E5] text-sm font-medium tracking-widest uppercase mb-3 text-center">Step 2</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-3">Choose your appearance</h1>
            <p className="text-white/50 text-center mb-10">Personalize the studio to your taste</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {themes.map(t => (
                <button key={t.key} onClick={() => { setTheme(t.key as any); }}
                  className="rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.03] text-left"
                  style={{ borderColor: theme === t.key ? '#19A8E5' : 'rgba(255,255,255,0.12)' }}>
                  <div className="h-28 w-full relative" style={{ background: t.preview }}>
                    <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full" style={{ background: t.dot }} />
                  </div>
                  <div className="p-5 bg-white/[0.04]">
                    <div className="text-white font-bold text-lg">{t.name}</div>
                    <div className="text-white/40 text-sm">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <button onClick={() => setOnboarded(true)}
                className="px-10 py-4 rounded-full font-semibold text-white transition-transform hover:scale-105"
                style={{ background: '#19A8E5', boxShadow: '0 10px 40px rgba(25,168,229,0.4)' }}>
                Enter DCRVV
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
