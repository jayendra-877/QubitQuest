import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Learning from './pages/Learning/Learning'
import Challenges from './pages/Challenges/Challenges'
import ChallengeDetail from './pages/Challenges/ChallengeDetail'
import Sandbox from './pages/Sandbox/Sandbox'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/challenges') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Core Modules - Publicly viewable */}
        <Route path="learning" element={<Learning />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="challenges/:id" element={<ChallengeDetail />} />
        <Route path="sandbox" element={<Sandbox />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
