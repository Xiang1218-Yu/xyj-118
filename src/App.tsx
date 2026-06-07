import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyLoader } from '@/components/LazyLoader';
import { useThemeStore } from '@/store/useThemeStore';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const PlanPage = lazy(() => import('@/pages/PlanPage').then(m => ({ default: m.PlanPage })));
const IdeasPage = lazy(() => import('@/pages/IdeasPage').then(m => ({ default: m.IdeasPage })));
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const AnniversaryPage = lazy(() => import('@/pages/AnniversaryPage').then(m => ({ default: m.AnniversaryPage })));
const LoveMessagesPage = lazy(() => import('@/pages/LoveMessagesPage').then(m => ({ default: m.LoveMessagesPage })));

function AppContent() {
  const { primaryColor } = useThemeStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    };
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
      document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }, [primaryColor]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/ideas" element={<IdeasPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/anniversary" element={<AnniversaryPage />} />
      <Route path="/love-messages" element={<LoveMessagesPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LazyLoader fullScreen />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
