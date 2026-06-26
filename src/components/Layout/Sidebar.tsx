import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, FileText, Users,
  GraduationCap, Info, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useStore } from '../../store/useStore'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', color: '#60a5fa' },
  { to: '/planning', icon: Calendar, label: 'Planning équipe', color: '#a78bfa' },
  { to: '/pv-chantier', icon: FileText, label: 'PV de chantier', color: '#34d399' },
  { to: '/clients', icon: Users, label: 'Clients & Devis', color: '#f5c842' },
  { to: '/formations', icon: GraduationCap, label: 'Formations', color: '#fb923c' },
  { to: '/qui-sommes-nous', icon: Info, label: 'Qui sommes-nous', color: '#f472b6' },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 68 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="sidebar-bg relative flex flex-col shrink-0 z-20"
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 mb-2 ${sidebarOpen ? '' : 'justify-center'}`}>
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-capeb flex items-center justify-center glow-blue">
            <span className="font-display text-white font-black text-sm tracking-tight">C</span>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#f5c842] border-2 border-[#070d1f]" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            >
              <div className="font-display text-white font-black text-base tracking-tight leading-none">CAPEB</div>
              <div className="text-[11px] text-[#f5c842] font-semibold tracking-wider leading-none mt-1 uppercase">Adour-Pyrénées</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
              } ${sidebarOpen ? '' : 'justify-center'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)`, borderLeft: `2px solid ${color}` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <div className="relative z-10 shrink-0 w-5 h-5 flex items-center justify-center">
                  <Icon size={18} style={{ color: isActive ? color : undefined }} />
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                      className="relative z-10 text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Tooltip quand fermé */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50"
                    style={{ background: '#0d1530', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f4ff' }}>
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle */}
      <div className="p-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-white/30 hover:text-white/70 transition-colors`}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {sidebarOpen ? <><ChevronLeft size={15} /><span className="text-xs font-medium">Réduire</span></> : <ChevronRight size={15} />}
        </button>
      </div>
    </motion.aside>
  )
}
