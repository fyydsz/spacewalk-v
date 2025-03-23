
import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Home from './components/pages/main/Home'

import NotFound from './components/pages/main/NotFound404'
import About from './components/pages/main/About'
import Support from './components/pages/main/Support'
import MainHome from './components/layout/home/main-home'
import MainDashboard from './components/layout/dashboard/main-dashboard'
import DashboardHome from './components/pages/dashboard/DashboardHome'
import MainNotFound from './components/layout/home/notfound'

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
    <div className="App">
      <Routes>
        <Route element={<MainHome />}>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route element={<MainDashboard />}>
          <Route path='/dashboard' element={<DashboardHome />} />
        </Route>
        <Route element={<MainNotFound />}>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      {!isNotFound && <About />}
    </div>
  )
}

export default App
