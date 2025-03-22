
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './components/pages/Home'
import NavBar from './components/navbar/NavBar'
import NotFound from './components/pages/NotFound404'
import { useEffect } from 'react'
import About from './components/pages/About'
import Support from './components/pages/Support'

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
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/support" element={<Support />}/>
      </Routes>
      {!isNotFound && <About />}
    </div>
  )
}

export default App
