import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Users, Clock, ArrowUpRight, Trophy, Target, Zap, CheckCircle, FileText } from 'lucide-react'
import { useStore, MILESTONES } from '../store/useStore'
import CelebrationModal from '../components/Dashboard/CelebrationModal'

const CHART_DATA = [
  { mois: 'Jan', CA: 8200 }, { mois: 'Fév', CA: 12400 }, { mois: 'Mar', CA: 9800 },
  { mois: 'Avr', CA: 15600 }, { mois: 'Mai', CA: 18200 }, { mois: 'Juin', CA: 36630 },
]

const PIE_COLORS: Record<string, string> = {
  validé: '#34d399', envoyé: '#f5c842', brouillon: '#475569', refusé: '#e2001a'
}

const fi = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.5 }
})

function StatCard({ label, value, sub, icon: Icon, color, i }: {
  label: string; value: string | number; sub: string; icon: any; color: string; i: number
}) {
  return (
    <motion.div {...fi(i)} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color, filter: 'blur(30px)' }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: color + '22', border: `1px solid ${color}44` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#34d399' }}>
            <ArrowUpRight size={12} />{sub}
          </div>
        </div>
        <div className="stat-number text-3xl text-white mb-1">{value}</div>
        <div className="text-sm text-white/40 font-medium">{label}</div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { clients, devis, pvChantiers: _pv, caActuel } = useStore()

  const devisValides = devis.filter(d => d.statut === 'validé')
  const devisEnAttente = devis.filter(d => d.statut === 'envoyé')
  const tauxConv = devis.length > 0 ? Math.round(devisValides.length / devis.length * 100) : 0

  const nextMilestone = MILESTONES.find(m => m.seuil > caActuel)
  const prevSeuil = [...MILESTONES].reverse().find(m => m.seuil <= caActuel)?.seuil ?? 0
  const milestoneProgress = nextMilestone
    ? Math.min(100, ((caActuel - prevSeuil) / (nextMilestone.seuil - prevSeuil)) * 100)
    : 100

  const statutsData = Object.entries(
    devis.reduce((acc, d) => ({ ...acc, [d.statut]: (acc[d.statut] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const stats = [
    { label: 'Chiffre d\'affaires', value: `${caActuel.toLocaleString('fr-FR')} €`, sub: '+12%', icon: TrendingUp, color: '#60a5fa' },
    { label: 'Clients actifs', value: clients.length, sub: '+2 ce mois', icon: Users, color: '#a78bfa' },
    { label: 'Devis en attente', value: devisEnAttente.length, sub: `${devisEnAttente.reduce((s, d) => s + d.montantHT, 0).toLocaleString('fr-FR')} €`, icon: Clock, color: '#f5c842' },
    { label: 'Taux de conversion', value: `${tauxConv}%`, sub: 'Objectif 80%', icon: TrendingUp, color: '#34d399' },
  ]

  return (
    <div className="p-6 space-y-6 min-h-full">
      <CelebrationModal />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">Tableau de bord</h1>
          <p className="text-white/40 text-sm mt-0.5">Bienvenue — voici votre activité du moment.</p>
        </div>
        <div className="text-xs text-white/25 font-medium">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* Palier CA Hero */}
      <motion.div {...fi(0)}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(0,49,137,0.45) 0%, rgba(0,81,212,0.25) 50%, rgba(245,200,66,0.08) 100%)', border: '1px solid rgba(0,81,212,0.35)' }}
      >
        <div className="absolute right-0 top-0 w-80 h-full opacity-5 flex items-center justify-end pr-8 pointer-events-none">
          <Trophy size={160} className="text-[#f5c842]" />
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(245,200,66,0.3), transparent)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,200,66,0.2)', border: '1px solid rgba(245,200,66,0.3)' }}>
              <Target size={13} className="text-[#f5c842]" />
            </div>
            <span className="text-sm text-white/50 font-medium">
              Prochain palier : {nextMilestone?.emoji} <span className="text-[#f5c842] font-bold">{nextMilestone?.label}</span>
            </span>
          </div>
          <div className="flex items-end gap-4 mb-5">
            <div>
              <div className="stat-number text-5xl text-white leading-none" style={{ textShadow: '0 0 30px rgba(245,200,66,0.4)' }}>
                {caActuel.toLocaleString('fr-FR')} €
              </div>
              <div className="text-white/40 text-sm mt-1 font-medium">Chiffre d'affaires validé (HT)</div>
            </div>
            {nextMilestone && (
              <div className="pb-1 text-right">
                <div className="text-xs text-white/30">sur {nextMilestone.seuil.toLocaleString('fr-FR')} €</div>
                <div className="text-lg font-black" style={{ background: 'linear-gradient(135deg,#f5c842,#ff9f00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {milestoneProgress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>
          {nextMilestone && (
            <>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${milestoneProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="h-full rounded-full progress-shine"
                  style={{ background: 'linear-gradient(90deg, #003189, #0051d4 40%, #f5c842)' }}
                />
              </div>
              <div className="text-xs text-white/30 font-medium">
                <span className="text-[#f5c842] font-bold">{(nextMilestone.seuil - caActuel).toLocaleString('fr-FR')} €</span> restants pour déclencher la célébration {nextMilestone.emoji}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} i={i + 1} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <motion.div {...fi(5)} className="xl:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-white text-base">Évolution du CA</h2>
              <p className="text-white/30 text-xs mt-0.5">Mensuel HT</p>
            </div>
            <div className="tag" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
              <Zap size={10} className="mr-1" /> +35% ce mois
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0051d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0051d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#0d1530', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, color: '#f0f4ff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                formatter={(v: unknown) => [`${Number(v).toLocaleString('fr-FR')} €`, 'CA HT']}
              />
              <Area type="monotone" dataKey="CA" stroke="#0051d4" strokeWidth={2} fill="url(#areaGrad)" dot={false}
                activeDot={{ r: 4, fill: '#60a5fa', stroke: '#0d1530', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fi(6)} className="glass-card rounded-2xl p-5">
          <h2 className="font-display font-bold text-white text-base mb-1">Statuts devis</h2>
          <p className="text-white/30 text-xs mb-4">Répartition par statut</p>
          {statutsData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={statutsData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {statutsData.map(entry => <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#475569'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, color: '#f0f4ff' }}
                    formatter={(v: unknown) => [`${v} devis`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {statutsData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[d.name] || '#475569' }} />
                      <span className="text-white/50 capitalize">{d.name}</span>
                    </div>
                    <span className="font-bold text-white/70">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-white/20 text-sm">Aucun devis</div>
          )}
        </motion.div>
      </div>

      {/* Derniers devis */}
      <motion.div {...fi(7)} className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-display font-bold text-white text-base">Derniers devis</h2>
          <a href="/clients" className="text-xs text-white/40 hover:text-[#60a5fa] transition-colors font-medium flex items-center gap-1">
            Voir tout <ArrowUpRight size={12} />
          </a>
        </div>
        <div>
          {devis.slice(0, 5).map((d, i) => {
            const client = useStore.getState().clients.find(c => c.id === d.clientId)
            const statusColors: Record<string, { bg: string; color: string; border: string }> = {
              validé:   { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
              envoyé:   { bg: 'rgba(245,200,66,0.15)', color: '#f5c842', border: 'rgba(245,200,66,0.3)' },
              refusé:   { bg: 'rgba(226,0,26,0.15)',   color: '#ff6b6b', border: 'rgba(226,0,26,0.3)' },
              brouillon:{ bg: 'rgba(71,85,105,0.3)',    color: '#64748b', border: 'rgba(71,85,105,0.3)' },
            }
            const sc = statusColors[d.statut] || statusColors.brouillon
            return (
              <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
                style={{ borderBottom: i < devis.slice(0,5).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.15)' }}>
                    <FileText size={13} className="text-[#60a5fa]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{d.titre}</div>
                    <div className="text-xs text-white/30">{client?.nom} {client?.prenom} · {d.numero}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-white/70">{d.montantTTC.toLocaleString('fr-FR')} €</div>
                  <span className="tag" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {d.statut === 'validé' && <CheckCircle size={9} className="mr-1" />}
                    {d.statut.charAt(0).toUpperCase() + d.statut.slice(1)}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
