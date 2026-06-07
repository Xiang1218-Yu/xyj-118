import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyLoader } from '@/components/LazyLoader';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const PlanPage = lazy(() => import('@/pages/PlanPage').then(m => ({ default: m.PlanPage })));
const IdeasPage = lazy(() => import('@/pages/IdeasPage').then(m => ({ default: m.IdeasPage })));
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LazyLoader fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
