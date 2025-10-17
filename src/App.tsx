
import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Home from './components/pages/main/Home';

import NotFound from './components/pages/main/NotFound404';
import About from './components/pages/main/About';
import Support from './components/pages/main/Support';
import MainHome from './components/layout/home/main-home';
import MainDashboard from './components/layout/dashboard/main-dashboard';
import MainDashboardPage from './components/pages/dashboard/main/DashboardPage';
import MainNotFound from './components/layout/home/notfound';
import MainDocsDashboard from './components/layout/dashboard/main-docs-dashboard';
import DocsDashboardPage from './components/pages/dashboard/docs/DocsDashboardPage';
import WikiDocs from './components/pages/main/WikiDocs';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { DevModeIndicator } from '@/components/dev-mode-indicator';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const location = useLocation();
  const isNotFound = location.pathname !== "/";
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", ""); // Ambil ID dari hash
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay dikit biar elemen udah ada sebelum scroll
      }
    }
  }, [location]); // Run setiap path berubah

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route element={<MainHome />}>
              <Route path="/" element={<Home />} />
              <Route path="/support" element={<Support />} />
              <Route path="/wiki" element={<WikiDocs />} />
            </Route>
            <Route element={<MainDashboard />}>
              <Route path='/dashboard' element={<MainDashboardPage />} />
            </Route>
            <Route element={<MainDocsDashboard/>}>
              <Route path='/dashboard-docs' element={<DocsDashboardPage />} />
            </Route>
            <Route element={<MainNotFound />}>
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
          {!isNotFound && <About />}
          
          {/* Development Mode Indicator - Only shows in dev mode */}
          <DevModeIndicator />
          
          {/* Toast notifications */}
          <Toaster position="top-right" duration={7000} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App