import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Onboarding from '@/components/Onboarding';
import { useApp, themeTokens } from '@/contexts/AppContext';

// Full app layout shell: onboarding gate, header, page content (Outlet) and footer.
// Routing/providers are configured in src/App.tsx.
export default function AppLayout() {
  const { onboarded, theme } = useApp();
  const tk = themeTokens[theme];
  if (!onboarded) return <Onboarding />;
  return (
    <div style={{ background: tk.bg, color: tk.text, minHeight: '100vh' }}>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
