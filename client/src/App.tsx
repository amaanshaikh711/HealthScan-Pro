import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BMIAnalysis } from './pages/BMIAnalysis';
import { Scanner } from './pages/Scanner';
import { MealPlanner } from './pages/MealPlanner';
import { ChatNova } from './pages/ChatNova';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Protected/Dashboard Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/bmi" element={<Layout><BMIAnalysis /></Layout>} />
        <Route path="/scanner" element={<Layout><Scanner /></Layout>} />
        <Route path="/meal-planner" element={<Layout><MealPlanner /></Layout>} />
        <Route path="/chat" element={<Layout><ChatNova /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
