import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, CheckCircle, AlertTriangle, XCircle, Mail, Eye, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { PVChantier as PV } from '../store/useStore'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

const STATUTS = [
  { value: 'conforme', label: 'Conforme', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { value: 'avec-reserves', label: 'Avec réserves', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  { value: 'non-conforme', label: 'Non conforme', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
]

function PVPreview({ pv, client, onClose }: { pv: PV; client: any; onClose: () => void }) {
  const statut = STATUTS.find(s => s.value === pv.statut)!
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-5 rounded-t-2xl">
          <h3 className="font-bold text-gray-900">PV de fin de chantier — Aperçu</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toast.success(`PV envoyé par mail à ${pv.emailDestinataire} !`)
                onClose()
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4]"
            >
              <Mail size={15} /> Envoyer par mail
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
          </div>
        </div>
        <div className="p-8">
          {/* En-tête document */}
          <div className="flex items-start justify-between border-b-2 border-[#003189] pb-5 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <img src="https://www.capeb.fr/www/capeb/media//national/logo-adb-par-capeb-hd-copy.png" alt="CAPEB" className="h-10 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
              <div className="text-xl font-black text-[#003189] mt-2">PROCÈS-VERBAL DE FIN DE CHANTIER</div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="font-mono text-gray-800">N° PV-{pv.id.slice(0, 6).toUpperCase()}</div>
              <div>Date : {new Date(pv.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Client</div>
              {client && <div className="font-bold text-gray-800">{client.nom} {client.prenom}</div>}
              {client && <div className="text-sm text-gray-600">{client.email}</div>}
              {client && <div className="text-sm text-gray-600">{client.telephone}</div>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Chantier</div>
              <div className="font-bold text-gray-800">{pv.chantier}</div>
              <div className="text-sm text-gray-600">{pv.adresseChantier}</div>
              <div className="text-sm text-gray-500">Du {new Date(pv.dateDebut).toLocaleDateString('fr-FR')} au {new Date(pv.dateFin).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-1">Responsable des travaux</div>
            <div className="text-gray-800">{pv.responsable}</div>
          </div>

          {/* Statut */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">Résultat de la réception</div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statut.bg}`}>
              <statut.icon size={16} className={statut.color} />
              <span className={`font-bold ${statut.color}`}>{statut.label}</span>
            </div>
          </div>

          {pv.observations && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">Observations</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">{pv.observations}</div>
            </div>
          )}

          {pv.reserves && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-2">Réserves</div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">{pv.reserves}</div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-6">
            {['L\'entreprise', 'Le client'].map(sig => (
              <div key={sig}>
                <div className="text-sm text-gray-500 mb-12">{sig}</div>
                <div className="border-t border-gray-300 pt-1 text-xs text-gray-400">Signature, date et cachet</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PVChantierPage() {
  const { clients, pvChantiers, addPV } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [previewPV, setPreviewPV] = useState<PV | null>(null)
  const [form, setForm] = useState({
    clientId: '', chantier: '', adresseChantier: '', dateDebut: '', dateFin: '',
    responsable: '', observations: '', reserves: '', statut: 'conforme' as PV['statut'],
    emailDestinataire: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPV({ id: uuidv4(), ...form, createdAt: new Date().toISOString() })
    setShowForm(false)
    toast.success('PV de chantier créé avec succès !')
    setForm({ clientId: '', chantier: '', adresseChantier: '', dateDebut: '', dateFin: '', responsable: '', observations: '', reserves: '', statut: 'conforme', emailDestinataire: '' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PV de fin de chantier</h1>
          <p className="text-gray-500 text-sm">Générez et transmettez vos procès-verbaux</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#003189] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0051d4] transition-colors shadow-sm"
        >
          <Plus size={16} /> Nouveau PV
        </button>
      </div>

      {/* Liste des PV */}
      {pvChantiers.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-gray-200 mx-auto mb-4" />
          <div className="text-gray-400 font-medium">Aucun PV de chantier</div>
          <div className="text-gray-300 text-sm mt-1">Créez votre premier procès-verbal</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {pvChantiers.map(pv => {
            const client = clients.find(c => c.id === pv.clientId)
            const statut = STATUTS.find(s => s.value === pv.statut)!
            return (
              <motion.div key={pv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statut.bg}`}>
                    <statut.icon size={20} className={statut.color} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{pv.chantier}</div>
                    <div className="text-sm text-gray-500">{client?.nom} {client?.prenom} · {new Date(pv.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statut.bg} ${statut.color}`}>{statut.label}</span>
                  <button onClick={() => setPreviewPV(pv)} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#003189] transition-colors">
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => toast.success(`PV envoyé à ${pv.emailDestinataire}`)}
                    className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#003189] transition-colors"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-5 rounded-t-2xl">
                <h3 className="font-bold text-lg">Nouveau PV de chantier</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Client</label>
                    <select required value={form.clientId} onChange={e => {
                      const client = clients.find(c => c.id === e.target.value)
                      setForm(f => ({ ...f, clientId: e.target.value, emailDestinataire: client?.email || '' }))
                    }} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30">
                      <option value="">Sélectionner un client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Responsable</label>
                    <input required value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))}
                      placeholder="Nom du responsable"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Intitulé du chantier</label>
                  <input required value={form.chantier} onChange={e => setForm(f => ({ ...f, chantier: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse du chantier</label>
                  <input value={form.adresseChantier} onChange={e => setForm(f => ({ ...f, adresseChantier: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date de début</label>
                    <input type="date" required value={form.dateDebut} onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date de fin</label>
                    <input type="date" required value={form.dateFin} onChange={e => setForm(f => ({ ...f, dateFin: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Résultat de la réception</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUTS.map(s => (
                      <button key={s.value} type="button"
                        onClick={() => setForm(f => ({ ...f, statut: s.value as PV['statut'] }))}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${form.statut === s.value ? `${s.bg} border-current ${s.color}` : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                      >
                        <s.icon size={15} /> {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Observations</label>
                  <textarea rows={3} value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Réserves éventuelles</label>
                  <textarea rows={2} value={form.reserves} onChange={e => setForm(f => ({ ...f, reserves: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email destinataire</label>
                  <input type="email" required value={form.emailDestinataire} onChange={e => setForm(f => ({ ...f, emailDestinataire: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4]">Créer le PV</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <AnimatePresence>
        {previewPV && (
          <PVPreview
            pv={previewPV}
            client={clients.find(c => c.id === previewPV.clientId)}
            onClose={() => setPreviewPV(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
