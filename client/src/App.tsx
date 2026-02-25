import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BMIAnalysis } from './pages/BMIAnalysis';
import { Scanner } from './pages/Scanner';
import { MealPlanner } from './pages/MealPlanner';
import { MealDetailPage } from './pages/MealDetail';
import { ChatNova } from './pages/ChatNova';
import { TalkToNova } from './pages/TalkToNova';
import { LandingPage } from './pages/LandingPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ReactNode } from 'react';

const ROUTES = {
  root: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  bmi: '/bmi',
  scanner: '/scanner',
  mealPlanner: '/meal-planner',
  mealDetail: '/meal-planner/meal/:mealId',
  chat: '/chat',
  talkToNova: '/talk-to-nova',
  about: '/about',
  contact: '/contact',
} as const;

// Avoids auth flicker-based redirects by waiting until Clerk auth is loaded.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to={ROUTES.signIn} replace />;
  }

  return <>{children}</>;
};

const AppFallback = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  return <Navigate to={isSignedIn ? ROUTES.dashboard : ROUTES.root} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.root} element={<LandingPage />} />

        {/* Clerk Hosted Auth UI */}
        <Route
          path={`${ROUTES.signIn}/*`}
          element={
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
              <SignIn routing="path" path={ROUTES.signIn} afterSignInUrl={ROUTES.dashboard} />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
              <SignUp routing="path" path="/sign-up" afterSignUpUrl={ROUTES.dashboard} />
            </div>
          }
        />

        {/* Protected Routes */}
        <Route path={ROUTES.dashboard} element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.bmi} element={<ProtectedRoute><Layout><BMIAnalysis /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.scanner} element={<ProtectedRoute><Layout><Scanner /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.mealPlanner} element={<ProtectedRoute><Layout><MealPlanner /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.mealDetail} element={<ProtectedRoute><Layout><MealDetailPage /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.chat} element={<ProtectedRoute><Layout><ChatNova /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.talkToNova} element={<ProtectedRoute><Layout><TalkToNova /></Layout></ProtectedRoute>} />
        <Route path={`${ROUTES.talkToNova}/*`} element={<Navigate to={ROUTES.talkToNova} replace />} />
        <Route path={ROUTES.about} element={<ProtectedRoute><Layout><About /></Layout></ProtectedRoute>} />
        <Route path={ROUTES.contact} element={<ProtectedRoute><Layout><Contact /></Layout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<AppFallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
