import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addDays, startOfWeek, format, isSameDay, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, X, User, MapPin, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { PlanningEvent } from '../store/useStore'
import { v4 as uuidv4 } from 'uuid'

const HOURS = Array.from({ length: 11 }, (_, i) => i + 7)
const EMPLOYES = ['Pierre Martin', 'Marc Leblanc', 'Julie Roux', 'Thomas Faure', 'Laura Blanc']
const EVENT_TYPES = ['chantier', 'reunion', 'formation', 'conge', 'autre'] as const
const TYPE_COLORS: Record<string, string> = {
  chantier: '#60a5fa', reunion: '#34d399', formation: '#f5c842', conge: '#a78bfa', autre: '#64748b'
}
const TYPE_LABELS: Record<string, string> = {
  chantier: 'Chantier', reunion: 'Réunion', formation: 'Formation', conge: 'Congé', autre: 'Autre'
}

function getWeekDays(base: Date) {
  const start = startOfWeek(base, { weekStartsOn: 1 })
  return Array.from({ length: 5 }, (_, i) => addDays(start, i))
}

interface EventFormData {
  titre: string; employe: string; date: string; heureDebut: string
  heureFin: string; chantier: string; type: typeof EVENT_TYPES[number]; couleur: string
}

const emptyForm = (): EventFormData => ({
  titre: '', employe: EMPLOYES[0], date: new Date().toISOString().split('T')[0],
  heureDebut: '08:00', heureFin: '17:00', chantier: '', type: 'chantier', couleur: '#60a5fa'
})

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm input-dark"

export default function Planning() {
  const { planningEvents, addEvent, deleteEvent } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<PlanningEvent | null>(null)
  const [form, setForm] = useState<EventFormData>(emptyForm())

  const weekDays = getWeekDays(currentDate)
  const eventsForDay = (day: Date) => planningEvents.filter(e => isSameDay(parseISO(e.date), day))
  const hourToY = (h: string) => { const [hh,mm] = h.split(':').map(Number); return ((hh-7)+mm/60)/11*100 }
  const durPct = (s: string, e: string) => { const [sh,sm]=s.split(':').map(Number); const [eh,em]=e.split(':').map(Number); return ((eh+em/60)-(sh+sm/60))/11*100 }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEvent({ id: uuidv4(), ...form })
    setShowForm(false); setForm(emptyForm())
  }

  return (
    <div className="p-6 flex flex-col" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">Planning équipe</h1>
          <p className="text-white/40 text-sm">Semaine du {format(weekDays[0],'d MMMM',{locale:fr})} au {format(weekDays[4],'d MMMM yyyy',{locale:fr})}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setCurrentDate(d => addDays(d,-7))} className="p-2.5 hover:bg-white/5 transition-colors text-white/60"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 text-sm font-semibold text-[#60a5fa]">Aujourd'hui</button>
            <button onClick={() => setCurrentDate(d => addDays(d,7))} className="p-2.5 hover:bg-white/5 transition-colors text-white/60"><ChevronRight size={16}/></button>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all gradient-capeb hover:opacity-90"
            style={{ boxShadow: '0 0 20px rgba(0,81,212,0.4)' }}>
            <Plus size={15}/> Ajouter
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-5 mb-4">
        {EVENT_TYPES.map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }}/>
            <span className="text-xs text-white/40 font-medium">{TYPE_LABELS[t]}</span>
          </div>
        ))}
      </div>

      {/* Grille */}
      <div className="flex-1 rounded-2xl overflow-auto glass-card" style={{ minHeight: 500 }}>
        {/* En-têtes */}
        <div className="grid grid-cols-[52px_repeat(5,1fr)] sticky top-0 z-10"
          style={{ background: 'rgba(6,11,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div />
          {weekDays.map(day => (
            <div key={day.toISOString()} className={`py-3 px-2 text-center ${isSameDay(day,new Date()) ? 'bg-blue-500/10' : ''}`}
              style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{format(day,'EEE',{locale:fr})}</div>
              <div className={`text-lg font-black mt-0.5 w-9 h-9 mx-auto flex items-center justify-center rounded-full ${
                isSameDay(day,new Date()) ? 'gradient-capeb text-white' : 'text-white/70'}`}>
                {format(day,'d')}
              </div>
            </div>
          ))}
        </div>

        {/* Corps */}
        <div className="grid grid-cols-[52px_repeat(5,1fr)] relative" style={{ height: 660 }}>
          {/* Heures */}
          <div className="relative" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            {HOURS.map(h => (
              <div key={h} className="absolute text-[10px] text-white/20 text-right pr-2 w-full font-mono"
                style={{ top: `${(h-7)/11*100}%`, transform:'translateY(-50%)' }}>{h}h</div>
            ))}
          </div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="relative" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              {HOURS.map(h => (
                <div key={h} className="absolute w-full" style={{ top:`${(h-7)/11*100}%`, borderTop:'1px solid rgba(255,255,255,0.04)' }} />
              ))}
              {eventsForDay(day).map(event => (
                <motion.div key={event.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="absolute mx-1 rounded-lg px-2 py-1.5 cursor-pointer hover:brightness-110 transition-all"
                  style={{
                    top:`${hourToY(event.heureDebut)}%`,
                    height:`${Math.max(durPct(event.heureDebut,event.heureFin),5)}%`,
                    left:4, right:4,
                    background: event.couleur + '18',
                    borderLeft: `2px solid ${event.couleur}`,
                    boxShadow: `0 0 12px ${event.couleur}22`,
                  }}>
                  <div className="text-xs font-bold truncate leading-tight" style={{ color: event.couleur }}>{event.titre}</div>
                  <div className="text-xs text-white/40 truncate">{event.employe}</div>
                  <div className="text-[10px] text-white/25">{event.heureDebut}–{event.heureFin}</div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal ajout */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}
            onClick={e => e.target===e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              className="rounded-2xl shadow-2xl w-full max-w-md p-6"
              style={{ background:'#0d1530', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-white text-lg">Nouvel événement</h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">Titre</label>
                  <input required value={form.titre} onChange={e => setForm(f=>({...f,titre:e.target.value}))} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">Employé</label>
                    <select value={form.employe} onChange={e => setForm(f=>({...f,employe:e.target.value}))} className={inputCls}>
                      {EMPLOYES.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">Type</label>
                    <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value as any,couleur:TYPE_COLORS[e.target.value]}))} className={inputCls}>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['heureDebut','Début'],['heureFin','Fin']].map(([k,l]) => (
                    <div key={k}>
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">{l}</label>
                      <input type="time" value={form[k as keyof EventFormData] as string} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} className={inputCls} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">Chantier / Lieu</label>
                  <input value={form.chantier} onChange={e => setForm(f=>({...f,chantier:e.target.value}))} placeholder="Ex: Rénovation SdB - Pau" className={inputCls} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>Annuler</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white gradient-capeb hover:opacity-90">Ajouter</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}
            onClick={() => setSelectedEvent(null)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              className="rounded-2xl shadow-2xl w-full max-w-sm p-6"
              style={{ background:'#0d1530', border:'1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="tag" style={{
                  background: selectedEvent.couleur+'20', color: selectedEvent.couleur,
                  border:`1px solid ${selectedEvent.couleur}40`
                }}>{TYPE_LABELS[selectedEvent.type]}</div>
                <button onClick={() => setSelectedEvent(null)} className="text-white/30 hover:text-white"><X size={16}/></button>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-4">{selectedEvent.titre}</h3>
              <div className="space-y-3">
                {[
                  { icon: User, text: selectedEvent.employe },
                  { icon: Clock, text: `${selectedEvent.heureDebut} – ${selectedEvent.heureFin}` },
                  ...(selectedEvent.chantier ? [{ icon: MapPin, text: selectedEvent.chantier }] : [])
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-white/50">
                    <Icon size={14} className="text-white/25 shrink-0" />{text}
                  </div>
                ))}
              </div>
              <button onClick={() => { deleteEvent(selectedEvent.id); setSelectedEvent(null) }}
                className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background:'rgba(226,0,26,0.1)', border:'1px solid rgba(226,0,26,0.2)', color:'#ff6b6b' }}>
                Supprimer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
