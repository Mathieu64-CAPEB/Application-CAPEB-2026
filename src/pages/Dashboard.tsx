import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  TrendingUp, Users, FileText, CheckCircle, Clock,
  ArrowUpRight, Trophy, Target
} from 'lucide-react'
import { useStore, MILESTONES } from '../store/useStore'
import CelebrationModal from '../components/Dashboard/CelebrationModal'

const CHART_DATA = [
  { mois: 'Jan', CA: 8200 }, { mois: 'Fév', CA: 12400 }, { mois: 'Mar', CA: 9800 },
  { mois: 'Avr', CA: 15600 }, { mois: 'Mai', CA: 18200 }, { mois: 'Juin', CA: 22100 },
]

const STATUTS_COLORS: Record<string, string> = {
  validé: '#10b981', envoyé: '#f5c842', brouillon: '#94a3b8', refusé: '#e2001a'
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function Dashboard() {
  const { clients, devis, pvChantiers, caActuel } = useStore()

  const devisValides = devis.filter(d => d.statut === 'validé')
  const devisEnAttente = devis.filter(d => d.statut === 'envoyé')
  const tauxConversion = devis.length > 0 ? ((devisValides.length / devis.length) * 100).toFixed(0) : '0'
  void pvChantiers

  const nextMilestone = MILESTONES.find(m => m.seuil > caActuel)
  const prevMilestone = [...MILESTONES].reverse().find(m => m.seuil <= caActuel)
  const milestoneProgress = nextMilestone
    ? ((caActuel - (prevMilestone?.seuil ?? 0)) / (nextMilestone.seuil - (prevMilestone?.seuil ?? 0))) * 100
    : 100

  // Pie chart data
  const statutsData = Object.entries(
    devis.reduce((acc, d) => ({ ...acc, [d.statut]: (acc[d.statut] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const stats = [
    { label: 'CA validé (HT)', value: `${caActuel.toLocaleString('fr-FR')} €`, icon: TrendingUp, color: 'from-[#003189] to-[#0051d4]', delta: '+12%' },
    { label: 'Clients', value: clients.length, icon: Users, color: 'from-emerald-500 to-emerald-600', delta: '+2 ce mois' },
    { label: 'Devis en attente', value: devisEnAttente.length, icon: Clock, color: 'from-amber-400 to-amber-500', delta: `${devisEnAttente.reduce((s, d) => s + d.montantHT, 0).toLocaleString('fr-FR')} €` },
    { label: 'Taux de conversion', value: `${tauxConversion}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-600', delta: 'Objectif 80%' },
  ]

  return (
    <div className="p-6 space-y-6">
      <CelebrationModal />

      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-0.5">Bienvenue ! Voici votre activité du moment.</p>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* Palier CA */}
      {nextMilestone && (
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-gradient-to-r from-[#003189] to-[#0051d4] rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <Trophy size={180} className="absolute -right-10 -top-8 text-[#f5c842]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-[#f5c842]" />
              <span className="text-sm font-medium text-white/80">Prochain palier : {nextMilestone.emoji} {nextMilestone.label}</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-black">{caActuel.toLocaleString('fr-FR')} €</span>
              <span className="text-white/60 mb-1">/ {nextMilestone.seuil.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, milestoneProgress)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#f5c842] to-[#fbbf24] rounded-full relative"
              >
                <div className="absolute inset-0 shimmer rounded-full" />
              </motion.div>
            </div>
            <div className="text-xs text-white/60 mt-1.5">
              Encore {(nextMilestone.seuil - caActuel).toLocaleString('fr-FR')} € pour atteindre le palier {nextMilestone.label} !
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <ArrowUpRight size={12} />
                {stat.delta}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-50"
        >
          <h2 className="font-bold text-gray-800 mb-4">Évolution du CA (HT)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003189" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003189" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                formatter={(v: unknown) => [`${Number(v).toLocaleString('fr-FR')} €`, 'CA HT']}
              />
              <Area type="monotone" dataKey="CA" stroke="#003189" strokeWidth={2.5} fill="url(#caGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          custom={6} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50"
        >
          <h2 className="font-bold text-gray-800 mb-4">Statuts des devis</h2>
          {statutsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statutsData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statutsData.map((entry) => (
                    <Cell key={entry.name} fill={STATUTS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip formatter={(v: unknown) => [`${v} devis`]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Aucun devis</div>
          )}
        </motion.div>
      </div>

      {/* Derniers devis */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-sm border border-gray-50">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Derniers devis</h2>
          <a href="/clients" className="text-sm text-[#003189] font-medium hover:underline">Voir tout →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {devis.slice(0, 5).map((d) => {
            const client = useStore.getState().clients.find(c => c.id === d.clientId)
            return (
              <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#003189]/10 flex items-center justify-center">
                    <FileText size={14} className="text-[#003189]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{d.titre}</div>
                    <div className="text-xs text-gray-400">{client?.nom} {client?.prenom} · {d.numero}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-gray-800">{d.montantTTC.toLocaleString('fr-FR')} € TTC</div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    d.statut === 'validé' ? 'bg-emerald-50 text-emerald-600' :
                    d.statut === 'envoyé' ? 'bg-amber-50 text-amber-600' :
                    d.statut === 'refusé' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {d.statut === 'validé' && <CheckCircle size={10} className="inline mr-1" />}
                    {d.statut.charAt(0).toUpperCase() + d.statut.slice(1)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
