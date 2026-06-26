import { motion } from 'framer-motion'
import { Bell, Search, ChevronRight, Zap } from 'lucide-react'
import { useStore, MILESTONES } from '../../store/useStore'

export default function Header() {
  const { caActuel } = useStore()
  const nextMilestone = MILESTONES.find(m => m.seuil > caActuel)
  const prevSeuil = [...MILESTONES].reverse().find(m => m.seuil <= caActuel)?.seuil ?? 0
  const progress = nextMilestone
    ? Math.min(100, ((caActuel - prevSeuil) / (nextMilestone.seuil - prevSeuil)) * 100)
    : 100

  return (
    <header className="h-14 flex items-center justify-between px-5 shrink-0"
      style={{ background: 'rgba(6,11,24,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Recherche */}
      <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 w-64"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Search size={14} className="text-white/30" />
        <input placeholder="Rechercher…" className="bg-transparent text-sm outline-none w-full text-white/70 placeholder-white/25" />
        <kbd className="text-[10px] text-white/20 font-mono">⌘K</kbd>
      </div>

      {/* Palier CA */}
      {nextMilestone && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-[#f5c842]" />
            <span className="text-xs text-white/40">Prochain palier</span>
            <span className="text-xs font-bold text-[#f5c842]">{nextMilestone.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full progress-shine"
                style={{ background: 'linear-gradient(90deg, #003189, #f5c842)' }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: '#f5c842' }}>{progress.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Droite */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl text-white/40 hover:text-white/80 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e2001a]" />
        </button>

        <div className="flex items-center gap-2 pl-2 ml-1" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-7 h-7 rounded-lg gradient-capeb flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-white/80 leading-none">Artisan CAPEB</div>
            <div className="text-[10px] text-white/30 leading-none mt-0.5">Adhérent</div>
          </div>
          <ChevronRight size={12} className="text-white/20" />
        </div>
      </div>
    </header>
  )
}
