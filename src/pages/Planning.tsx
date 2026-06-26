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
  chantier: '#003189', reunion: '#10b981', formation: '#f59e0b', conge: '#8b5cf6', autre: '#64748b'
}
const TYPE_LABELS: Record<string, string> = {
  chantier: 'Chantier', reunion: 'Réunion', formation: 'Formation', conge: 'Congé', autre: 'Autre'
}

function getWeekDays(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 })
  return Array.from({ length: 5 }, (_, i) => addDays(start, i))
}

interface EventFormData {
  titre: string; employe: string; date: string; heureDebut: string;
  heureFin: string; chantier: string; type: typeof EVENT_TYPES[number]; couleur: string
}

const emptyForm = (): EventFormData => ({
  titre: '', employe: EMPLOYES[0], date: new Date().toISOString().split('T')[0],
  heureDebut: '08:00', heureFin: '17:00', chantier: '', type: 'chantier', couleur: '#003189'
})

export default function Planning() {
  const { planningEvents, addEvent, deleteEvent } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<PlanningEvent | null>(null)
  const [form, setForm] = useState<EventFormData>(emptyForm())

  const weekDays = getWeekDays(currentDate)
  const prevWeek = () => setCurrentDate(d => addDays(d, -7))
  const nextWeek = () => setCurrentDate(d => addDays(d, 7))

  const eventsForDay = (day: Date) =>
    planningEvents.filter(e => isSameDay(parseISO(e.date), day))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEvent({ id: uuidv4(), ...form })
    setShowForm(false)
    setForm(emptyForm())
  }

  const hourToY = (h: string) => {
    const [hh, mm] = h.split(':').map(Number)
    return ((hh - 7) + mm / 60) / 11 * 100
  }
  const durationPct = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    return ((eh + em / 60) - (sh + sm / 60)) / 11 * 100
  }

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning équipe</h1>
          <p className="text-gray-500 text-sm">Semaine du {format(weekDays[0], 'd MMMM', { locale: fr })} au {format(weekDays[4], 'd MMMM yyyy', { locale: fr })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={prevWeek} className="p-2.5 hover:bg-gray-50 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 text-sm font-medium text-[#003189]">Aujourd'hui</button>
            <button onClick={nextWeek} className="p-2.5 hover:bg-gray-50 transition-colors"><ChevronRight size={18} /></button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#003189] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0051d4] transition-colors shadow-sm"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mb-4">
        {EVENT_TYPES.map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
            {TYPE_LABELS[t]}
          </div>
        ))}
      </div>

      {/* Grille planning */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
        {/* En-têtes jours */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-gray-100">
          <div />
          {weekDays.map((day) => (
            <div key={day.toISOString()} className={`py-3 px-2 text-center border-l border-gray-50 ${isSameDay(day, new Date()) ? 'bg-[#003189]/5' : ''}`}>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{format(day, 'EEE', { locale: fr })}</div>
              <div className={`text-lg font-bold mt-0.5 w-9 h-9 mx-auto flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-[#003189] text-white' : 'text-gray-800'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Corps avec heures */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] relative" style={{ minHeight: 660 }}>
          {/* Colonne heures */}
          <div className="relative border-r border-gray-50">
            {HOURS.map(h => (
              <div key={h} className="text-xs text-gray-400 text-right pr-2 absolute w-full" style={{ top: `${(h - 7) / 11 * 100}%`, transform: 'translateY(-50%)' }}>
                {h}h
              </div>
            ))}
          </div>

          {/* Colonnes jours */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className={`relative border-l border-gray-50 ${isSameDay(day, new Date()) ? 'bg-[#003189]/3' : ''}`}>
              {/* Lignes d'heures */}
              {HOURS.map(h => (
                <div key={h} className="absolute w-full border-t border-gray-50" style={{ top: `${(h - 7) / 11 * 100}%` }} />
              ))}
              {/* Événements */}
              {eventsForDay(day).map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="absolute mx-1 rounded-lg px-2 py-1 cursor-pointer hover:brightness-95 transition-all overflow-hidden"
                  style={{
                    top: `${hourToY(event.heureDebut)}%`,
                    height: `${Math.max(durationPct(event.heureDebut, event.heureFin), 5)}%`,
                    backgroundColor: event.couleur + '22',
                    borderLeft: `3px solid ${event.couleur}`,
                    left: 4, right: 4,
                  }}
                >
                  <div className="text-xs font-semibold truncate" style={{ color: event.couleur }}>{event.titre}</div>
                  <div className="text-xs text-gray-500 truncate">{event.employe}</div>
                  <div className="text-xs text-gray-400">{event.heureDebut}-{event.heureFin}</div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal ajout */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-gray-900">Nouvel événement</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Titre</label>
                  <input required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30 focus:border-[#003189]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Employé</label>
                    <select value={form.employe} onChange={e => setForm(f => ({ ...f, employe: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30">
                      {EMPLOYES.map(emp => <option key={emp}>{emp}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type, couleur: TYPE_COLORS[e.target.value] }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30">
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Début</label>
                    <input type="time" value={form.heureDebut} onChange={e => setForm(f => ({ ...f, heureDebut: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Fin</label>
                    <input type="time" value={form.heureFin} onChange={e => setForm(f => ({ ...f, heureFin: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Chantier / Lieu</label>
                  <input value={form.chantier} onChange={e => setForm(f => ({ ...f, chantier: e.target.value }))}
                    placeholder="Ex: Rénovation SdB - Pau"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4]">Ajouter</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail event */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedEvent.couleur }} />
                  <span className="text-xs font-medium text-gray-500">{TYPE_LABELS[selectedEvent.type]}</span>
                </div>
                <button onClick={() => setSelectedEvent(null)}><X size={18} className="text-gray-400" /></button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedEvent.titre}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><User size={15} className="text-gray-400" />{selectedEvent.employe}</div>
                <div className="flex items-center gap-2"><Clock size={15} className="text-gray-400" />{selectedEvent.heureDebut} – {selectedEvent.heureFin}</div>
                {selectedEvent.chantier && <div className="flex items-center gap-2"><MapPin size={15} className="text-gray-400" />{selectedEvent.chantier}</div>}
              </div>
              <button
                onClick={() => { deleteEvent(selectedEvent.id); setSelectedEvent(null) }}
                className="mt-5 w-full py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Supprimer cet événement
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
