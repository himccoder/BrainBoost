import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import GameHub from './pages/GameHub'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import MemoryGame from './pages/games/MemoryGame'
import StroopGame from './pages/games/StroopGame'
import SequenceGame from './pages/games/SequenceGame'
import PatternGame from './pages/games/PatternGame'
import { Loader2 } from 'lucide-react'

// Redirect to sign-in if not authenticated; show spinner while loading
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    )
  }
  return user ? children : <Navigate to="/signin" replace />
}

// Redirect away from auth page if already signed in
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    )
  }
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={
        <GuestRoute><AuthPage /></GuestRoute>
      } />

      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/games" element={<Layout><GameHub /></Layout>} />

      <Route path="/dashboard" element={
        <Layout>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/games/memory"   element={<Layout><MemoryGame /></Layout>} />
      <Route path="/games/stroop"   element={<Layout><StroopGame /></Layout>} />
      <Route path="/games/sequence" element={<Layout><SequenceGame /></Layout>} />
      <Route path="/games/pattern"  element={<Layout><PatternGame /></Layout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppRoutes />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
