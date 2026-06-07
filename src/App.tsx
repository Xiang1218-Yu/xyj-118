import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { PlanPage } from '@/pages/PlanPage';
import { IdeasPage } from '@/pages/IdeasPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
      </Routes>
    </Router>
  );
}
