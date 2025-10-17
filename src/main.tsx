import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'

// Use StrictMode only in development for better debugging
// In production, skip it for optimal performance
const isDevelopment = import.meta.env.DEV;

const AppWrapper = isDevelopment ? (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
) : (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(document.getElementById('root')!).render(AppWrapper)
