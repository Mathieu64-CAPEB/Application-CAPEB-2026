import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Client {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  codePostal: string
  siret?: string
  notes?: string
  createdAt: string
}

export interface Devis {
  id: string
  clientId: string
  numero: string
  titre: string
  lignes: DevisLigne[]
  tvaRate: number
  statut: 'brouillon' | 'envoyé' | 'validé' | 'refusé'
  createdAt: string
  montantHT: number
  montantTTC: number
}

export interface DevisLigne {
  id: string
  description: string
  quantite: number
  unite: string
  prixUnitaire: number
  total: number
}

export interface PVChantier {
  id: string
  clientId: string
  chantier: string
  adresseChantier: string
  dateDebut: string
  dateFin: string
  responsable: string
  observations: string
  reserves: string
  statut: 'conforme' | 'avec-reserves' | 'non-conforme'
  createdAt: string
  emailDestinataire: string
}

export interface PlanningEvent {
  id: string
  titre: string
  employe: string
  couleur: string
  date: string
  heureDebut: string
  heureFin: string
  chantier: string
  type: 'chantier' | 'reunion' | 'formation' | 'conge' | 'autre'
}

export interface Milestone {
  seuil: number
  label: string
  emoji: string
  message: string
}

interface AppState {
  clients: Client[]
  devis: Devis[]
  pvChantiers: PVChantier[]
  planningEvents: PlanningEvent[]
  caActuel: number
  lastCelebration: number | null
  sidebarOpen: boolean

  addClient: (client: Client) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void

  addDevis: (devis: Devis) => void
  updateDevis: (id: string, devis: Partial<Devis>) => void
  deleteDevis: (id: string) => void

  addPV: (pv: PVChantier) => void
  updatePV: (id: string, pv: Partial<PVChantier>) => void

  addEvent: (event: PlanningEvent) => void
  updateEvent: (id: string, event: Partial<PlanningEvent>) => void
  deleteEvent: (id: string) => void

  setLastCelebration: (seuil: number) => void
  setSidebarOpen: (open: boolean) => void
}

export const MILESTONES: Milestone[] = [
  { seuil: 10000, label: '10 000 €', emoji: '🎉', message: 'Premier cap de 10k€ franchi ! Beau départ !' },
  { seuil: 25000, label: '25 000 €', emoji: '🚀', message: '25 000€ ! Vous êtes sur la bonne voie !' },
  { seuil: 50000, label: '50 000 €', emoji: '🏆', message: 'INCROYABLE ! 50 000€ de CA validé ! Félicitations !' },
  { seuil: 75000, label: '75 000 €', emoji: '💎', message: '75 000€ ! Vous dépassez vos objectifs !' },
  { seuil: 100000, label: '100 000 €', emoji: '👑', message: 'CAP DES 100 000€ ! Vous êtes exceptionnel !' },
  { seuil: 150000, label: '150 000 €', emoji: '🌟', message: '150 000€ ! Une performance remarquable !' },
  { seuil: 200000, label: '200 000 €', emoji: '🦁', message: '200 000€ ! Le lion du bâtiment artisanal !' },
]

const DEMO_CLIENTS: Client[] = [
  { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', telephone: '05 59 12 34 56', adresse: '12 rue des Fleurs', ville: 'Pau', codePostal: '64000', createdAt: new Date().toISOString() },
  { id: '2', nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', telephone: '05 59 98 76 54', adresse: '5 avenue de la Gare', ville: 'Bayonne', codePostal: '64100', createdAt: new Date().toISOString() },
]

const DEMO_DEVIS: Devis[] = [
  {
    id: '1', clientId: '1', numero: 'DEV-2026-001', titre: 'Rénovation salle de bain',
    lignes: [
      { id: '1', description: 'Main d\'œuvre plomberie', quantite: 16, unite: 'h', prixUnitaire: 65, total: 1040 },
      { id: '2', description: 'Fournitures sanitaires', quantite: 1, unite: 'forfait', prixUnitaire: 850, total: 850 },
      { id: '3', description: 'Carrelage pose', quantite: 12, unite: 'm²', prixUnitaire: 45, total: 540 },
    ],
    tvaRate: 10, statut: 'validé', createdAt: new Date().toISOString(), montantHT: 2430, montantTTC: 2673,
  },
  {
    id: '2', clientId: '2', numero: 'DEV-2026-002', titre: 'Extension maison individuelle',
    lignes: [
      { id: '1', description: 'Gros œuvre extension 20m²', quantite: 20, unite: 'm²', prixUnitaire: 1200, total: 24000 },
      { id: '2', description: 'Charpente couverture', quantite: 1, unite: 'forfait', prixUnitaire: 8500, total: 8500 },
      { id: '3', description: 'Isolation thermique', quantite: 20, unite: 'm²', prixUnitaire: 85, total: 1700 },
    ],
    tvaRate: 20, statut: 'validé', createdAt: new Date().toISOString(), montantHT: 34200, montantTTC: 41040,
  },
]

const DEMO_EVENTS: PlanningEvent[] = [
  { id: '1', titre: 'Chantier Dupont', employe: 'Pierre Martin', couleur: '#003189', date: new Date().toISOString().split('T')[0], heureDebut: '08:00', heureFin: '17:00', chantier: 'Rénovation SdB - Pau', type: 'chantier' },
  { id: '2', titre: 'Visite client', employe: 'Marc Leblanc', couleur: '#10b981', date: new Date().toISOString().split('T')[0], heureDebut: '09:00', heureFin: '11:00', chantier: 'Extension Martin - Bayonne', type: 'reunion' },
]

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      clients: DEMO_CLIENTS,
      devis: DEMO_DEVIS,
      pvChantiers: [],
      planningEvents: DEMO_EVENTS,
      caActuel: DEMO_DEVIS.filter(d => d.statut === 'validé').reduce((sum, d) => sum + d.montantHT, 0),
      lastCelebration: null,
      sidebarOpen: true,

      addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
      updateClient: (id, client) => set((s) => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...client } : c) })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter(c => c.id !== id) })),

      addDevis: (devis) => set((s) => {
        const newDevis = [...s.devis, devis]
        const ca = newDevis.filter(d => d.statut === 'validé').reduce((sum, d) => sum + d.montantHT, 0)
        return { devis: newDevis, caActuel: ca }
      }),
      updateDevis: (id, devis) => set((s) => {
        const updated = s.devis.map(d => d.id === id ? { ...d, ...devis } : d)
        const ca = updated.filter(d => d.statut === 'validé').reduce((sum, d) => sum + d.montantHT, 0)
        return { devis: updated, caActuel: ca }
      }),
      deleteDevis: (id) => set((s) => {
        const updated = s.devis.filter(d => d.id !== id)
        const ca = updated.filter(d => d.statut === 'validé').reduce((sum, d) => sum + d.montantHT, 0)
        return { devis: updated, caActuel: ca }
      }),

      addPV: (pv) => set((s) => ({ pvChantiers: [...s.pvChantiers, pv] })),
      updatePV: (id, pv) => set((s) => ({ pvChantiers: s.pvChantiers.map(p => p.id === id ? { ...p, ...pv } : p) })),

      addEvent: (event) => set((s) => ({ planningEvents: [...s.planningEvents, event] })),
      updateEvent: (id, event) => set((s) => ({ planningEvents: s.planningEvents.map(e => e.id === id ? { ...e, ...event } : e) })),
      deleteEvent: (id) => set((s) => ({ planningEvents: s.planningEvents.filter(e => e.id !== id) })),

      setLastCelebration: (seuil) => set({ lastCelebration: seuil }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: 'capeb-storage' }
  )
)
