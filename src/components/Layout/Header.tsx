import { motion } from 'framer-motion'
import { Bell, Search, User } from 'lucide-react'
import { useStore, MILESTONES } from '../../store/useStore'

export default function Header() {
  const { caActuel } = useStore()
  const nextMilestone = MILESTONES.find(m => m.seuil > caActuel)
  const progress = nextMilestone
    ? ((caActuel / nextMilestone.seuil) * 100).toFixed(0)
    : '100'

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 w-72 border border-gray-100">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="bg-transparent text-sm outline-none text-gray-600 w-full placeholder-gray-400"
        />
      </div>

      {/* CA Progress */}
      {nextMilestone && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">CA vers {nextMilestone.label}</div>
            <div className="text-sm font-bold text-[#003189]">
              {caActuel.toLocaleString('fr-FR')} €
            </div>
          </div>
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Number(progress))}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-[#003189] to-[#f5c842]"
            />
          </div>
          <span className="text-xs font-bold text-[#003189]">{progress}%</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e2001a] rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#003189] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-gray-800">Artisan CAPEB</div>
            <div className="text-xs text-gray-400">Adhérent</div>
          </div>
        </div>
      </div>
    </header>
  )
}
