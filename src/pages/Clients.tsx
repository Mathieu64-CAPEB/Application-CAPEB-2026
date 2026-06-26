import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, X, Trash2, FileText, Wand2,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Client, Devis, DevisLigne } from '../store/useStore'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

const TVA_OPTIONS = [10, 20]

function DevisForm({ client, onClose }: { client: Client; onClose: () => void }) {
  const { addDevis } = useStore()
  const [titre, setTitre] = useState('')
  const [tvaRate, setTvaRate] = useState(10)
  const [generating, setGenerating] = useState(false)
  const [lignes, setLignes] = useState<DevisLigne[]>([
    { id: uuidv4(), description: '', quantite: 1, unite: 'h', prixUnitaire: 0, total: 0 }
  ])

  const addLigne = () => setLignes(l => [...l, { id: uuidv4(), description: '', quantite: 1, unite: 'h', prixUnitaire: 0, total: 0 }])
  const removeLigne = (id: string) => setLignes(l => l.filter(x => x.id !== id))
  const updateLigne = (id: string, field: keyof DevisLigne, value: string | number) => {
    setLignes(l => l.map(x => {
      if (x.id !== id) return x
      const updated = { ...x, [field]: value }
      updated.total = Number(updated.quantite) * Number(updated.prixUnitaire)
      return updated
    }))
  }

  const montantHT = lignes.reduce((s, l) => s + l.total, 0)
  const montantTTC = montantHT * (1 + tvaRate / 100)

  const generateWithAI = async () => {
    if (!titre) { toast.error('Renseignez d\'abord l\'intitulé des travaux'); return }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1800))
    const aiLignes: DevisLigne[] = [
      { id: uuidv4(), description: 'Main d\'œuvre qualification', quantite: 16, unite: 'h', prixUnitaire: 65, total: 1040 },
      { id: uuidv4(), description: 'Fournitures et matériaux', quantite: 1, unite: 'forfait', prixUnitaire: 480, total: 480 },
      { id: uuidv4(), description: 'Déplacements et frais', quantite: 1, unite: 'forfait', prixUnitaire: 120, total: 120 },
    ]
    setLignes(aiLignes)
    setGenerating(false)
    toast.success('Devis généré par IA !')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = `DEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
    addDevis({
      id: uuidv4(), clientId: client.id, numero: num, titre, lignes,
      tvaRate, statut: 'brouillon', createdAt: new Date().toISOString(), montantHT, montantTTC
    })
    toast.success('Devis créé ! 🎉')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-5 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-lg">Nouveau devis</h3>
            <p className="text-sm text-gray-500">{client.nom} {client.prenom}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Intitulé des travaux</label>
              <input required value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Rénovation salle de bain"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">TVA</label>
              <select value={tvaRate} onChange={e => setTvaRate(Number(e.target.value))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30 h-full">
                {TVA_OPTIONS.map(t => <option key={t} value={t}>{t}%</option>)}
              </select>
            </div>
          </div>

          {/* Bouton IA */}
          <button type="button" onClick={generateWithAI} disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#003189]/30 rounded-xl text-[#003189] text-sm font-medium hover:bg-[#003189]/5 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-[#003189] border-t-transparent rounded-full animate-spin" />Génération en cours...</>
            ) : (
              <><Wand2 size={16} />Générer les lignes avec l'IA</>
            )}
          </button>

          {/* Lignes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Lignes du devis</label>
              <button type="button" onClick={addLigne} className="text-xs text-[#003189] font-medium flex items-center gap-1 hover:underline">
                <Plus size={13} /> Ajouter une ligne
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[2fr_80px_80px_100px_100px_32px] gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase">
                <span>Description</span><span>Qté</span><span>Unité</span><span>P.U. (€)</span><span>Total</span><span />
              </div>
              {lignes.map((ligne) => (
                <div key={ligne.id} className="grid grid-cols-[2fr_80px_80px_100px_100px_32px] gap-2 px-4 py-2.5 border-t border-gray-50 items-center">
                  <input value={ligne.description} onChange={e => updateLigne(ligne.id, 'description', e.target.value)} placeholder="Description"
                    className="text-sm border border-gray-100 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#003189]/30 w-full" />
                  <input type="number" value={ligne.quantite} onChange={e => updateLigne(ligne.id, 'quantite', e.target.value)} min={0}
                    className="text-sm border border-gray-100 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#003189]/30 w-full" />
                  <select value={ligne.unite} onChange={e => updateLigne(ligne.id, 'unite', e.target.value)}
                    className="text-sm border border-gray-100 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#003189]/30 w-full">
                    {['h', 'jour', 'm²', 'm³', 'ml', 'u', 'forfait', 'kg'].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <input type="number" value={ligne.prixUnitaire} onChange={e => updateLigne(ligne.id, 'prixUnitaire', e.target.value)} min={0}
                    className="text-sm border border-gray-100 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#003189]/30 w-full" />
                  <div className="text-sm font-semibold text-gray-800">{ligne.total.toLocaleString('fr-FR')} €</div>
                  <button type="button" onClick={() => removeLigne(ligne.id)} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="bg-[#003189]/5 rounded-xl p-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>Total HT</span><span className="font-semibold">{montantHT.toLocaleString('fr-FR')} €</span></div>
            <div className="flex justify-between text-gray-500"><span>TVA {tvaRate}%</span><span>{(montantTTC - montantHT).toLocaleString('fr-FR')} €</span></div>
            <div className="flex justify-between text-[#003189] font-bold text-base border-t border-[#003189]/20 pt-2 mt-2">
              <span>Total TTC</span><span>{montantTTC.toLocaleString('fr-FR')} €</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4]">Créer le devis</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ClientsPage() {
  const { clients, devis, addClient, deleteClient, updateDevis } = useStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDevisForm, setShowDevisForm] = useState<Client | null>(null)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Client>>({ nom: '', prenom: '', email: '', telephone: '', adresse: '', ville: '', codePostal: '' })

  const filtered = clients.filter(c =>
    `${c.nom} ${c.prenom} ${c.email} ${c.ville}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _ignore, ...rest } = form as Client
    addClient({ id: uuidv4(), ...rest, createdAt: new Date().toISOString() })
    setShowForm(false)
    setForm({ nom: '', prenom: '', email: '', telephone: '', adresse: '', ville: '', codePostal: '' })
    toast.success('Client ajouté !')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients & Devis</h1>
          <p className="text-gray-500 text-sm">{clients.length} clients · {devis.length} devis</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#003189] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0051d4] transition-colors shadow-sm"
        >
          <Plus size={16} /> Nouveau client
        </button>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm mb-5 max-w-md">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..."
          className="bg-transparent text-sm outline-none text-gray-600 w-full" />
      </div>

      {/* Liste clients */}
      <div className="space-y-3">
        {filtered.map(client => {
          const clientDevis = devis.filter(d => d.clientId === client.id)
          const caClient = clientDevis.filter(d => d.statut === 'validé').reduce((s, d) => s + d.montantHT, 0)
          const isExpanded = expandedClient === client.id
          return (
            <motion.div key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpandedClient(isExpanded ? null : client.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#003189] flex items-center justify-center text-white font-bold text-sm">
                    {client.nom[0]}{client.prenom[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{client.nom} {client.prenom}</div>
                    <div className="text-sm text-gray-400">{client.email} · {client.ville}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">CA validé</div>
                    <div className="font-bold text-[#003189]">{caClient.toLocaleString('fr-FR')} €</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Devis</div>
                    <div className="font-bold text-gray-700">{clientDevis.length}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setShowDevisForm(client) }}
                      className="p-2 rounded-xl hover:bg-[#003189]/10 text-[#003189] transition-colors" title="Créer un devis">
                      <FileText size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteClient(client.id) }}
                      className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <div className="text-sm font-semibold text-gray-600 mt-4 mb-3">Devis</div>
                      {clientDevis.length === 0 ? (
                        <p className="text-sm text-gray-400">Aucun devis pour ce client.</p>
                      ) : (
                        <div className="space-y-2">
                          {clientDevis.map(d => (
                            <div key={d.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                              <div>
                                <div className="text-sm font-medium text-gray-800">{d.titre}</div>
                                <div className="text-xs text-gray-400">{d.numero}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-bold">{d.montantTTC.toLocaleString('fr-FR')} € TTC</div>
                                <select value={d.statut} onChange={e => { updateDevis(d.id, { statut: e.target.value as Devis['statut'] }); toast.success('Statut mis à jour') }}
                                  className={`text-xs px-3 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${
                                    d.statut === 'validé' ? 'bg-emerald-50 text-emerald-600' :
                                    d.statut === 'envoyé' ? 'bg-amber-50 text-amber-600' :
                                    d.statut === 'refusé' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                  <option value="brouillon">Brouillon</option>
                                  <option value="envoyé">Envoyé</option>
                                  <option value="validé">Validé</option>
                                  <option value="refusé">Refusé</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Modal nouveau client */}
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
                <h3 className="font-bold text-lg">Nouveau client</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[['nom', 'Nom *'], ['prenom', 'Prénom *']].map(([f, l]) => (
                    <div key={f}>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">{l}</label>
                      <input required value={form[f as keyof typeof form] || ''} onChange={e => setForm(v => ({ ...v, [f]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                    </div>
                  ))}
                </div>
                {[['email', 'Email *', 'email'], ['telephone', 'Téléphone', 'tel'], ['adresse', 'Adresse', 'text']].map(([f, l, t]) => (
                  <div key={f}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{l}</label>
                    <input type={t} required={f === 'email'} value={form[f as keyof typeof form] || ''} onChange={e => setForm(v => ({ ...v, [f]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {[['codePostal', 'Code postal'], ['ville', 'Ville']].map(([f, l]) => (
                    <div key={f}>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">{l}</label>
                      <input value={form[f as keyof typeof form] || ''} onChange={e => setForm(v => ({ ...v, [f]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#003189]/30" />
                    </div>
                  ))}
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

      {/* Modal devis */}
      <AnimatePresence>
        {showDevisForm && <DevisForm client={showDevisForm} onClose={() => setShowDevisForm(null)} />}
      </AnimatePresence>
    </div>
  )
}
