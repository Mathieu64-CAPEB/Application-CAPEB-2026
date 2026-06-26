import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import JonChatbot from './components/Chatbot/JonChatbot'
import Dashboard from './pages/Dashboard'
import Planning from './pages/Planning'
import PVChantier from './pages/PVChantier'
import Clients from './pages/Clients'
import Formation from './pages/Formation'
import QuiSommesNous from './pages/QuiSommesNous'
import './index.css'

export default function App() {
  return (
    <BrowserRouter basename="/Application-CAPEB-2026">
      <div className="flex h-screen overflow-hidden app-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/pv-chantier" element={<PVChantier />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/formations" element={<Formation />} />
              <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
            </Routes>
          </main>
        </div>
        <JonChatbot />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d1530',
              color: '#f0f4ff',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#060b18' } },
            error: { iconTheme: { primary: '#e2001a', secondary: '#fff' } },
          }}
        />
      </div>
    </BrowserRouter>
  )
}
