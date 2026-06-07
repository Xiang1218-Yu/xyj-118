import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyLoader } from '@/components/LazyLoader';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const PlanPage = lazy(() => import('@/pages/PlanPage').then(m => ({ default: m.PlanPage })));
const IdeasPage = lazy(() => import('@/pages/IdeasPage').then(m => ({ default: m.IdeasPage })));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LazyLoader fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
