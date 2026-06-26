import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Clock, ExternalLink, Mail, Phone, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const FORMATIONS = [
  {
    id: 1,
    titre: 'Facturation électronique pour les petites entreprises artisanales',
    description: 'Préparez-vous à la réforme de la facture électronique obligatoire. Maîtrisez les outils et les process pour votre entreprise artisanale.',
    dates: [
      { lieu: 'Anglet', date: '15 janvier 2026', horaires: '9h00 - 17h00', places: 12 },
      { lieu: 'Laruns', date: '22 janvier 2026', horaires: '9h00 - 17h00', places: 8 },
    ],
    duree: '1 journée (7h)',
    categorie: 'Numérique',
    couleur: '#003189',
    niveau: 'Débutant',
  },
  {
    id: 2,
    titre: 'Soudure cuivre et acier — Perfectionnement',
    description: 'Formation pratique aux techniques de soudure cuivre et acier pour plombiers et chauffagistes. Travaux pratiques en atelier.',
    dates: [
      { lieu: 'Pau', date: '2 février 2026', horaires: '8h00 - 17h30', places: 6 },
      { lieu: 'Pau', date: '3 mars 2026', horaires: '8h00 - 17h30', places: 10 },
    ],
    duree: '2 jours (15h)',
    categorie: 'Technique',
    couleur: '#e2001a',
    niveau: 'Intermédiaire',
  },
  {
    id: 3,
    titre: 'Réglementation Environnementale RE2020',
    description: 'Comprendre et appliquer la RE2020 dans vos chantiers. Impact sur la construction neuve et les rénovations importantes.',
    dates: [
      { lieu: 'Bayonne', date: '10 mars 2026', horaires: '9h00 - 17h00', places: 15 },
    ],
    duree: '1 journée (7h)',
    categorie: 'Réglementation',
    couleur: '#10b981',
    niveau: 'Tous niveaux',
  },
  {
    id: 4,
    titre: 'Prévention des risques professionnels — PRAP BTP',
    description: 'Acteur de Prévention des Risques liés à l\'Activité Physique dans le BTP. Formation certifiante reconnue par l\'INRS.',
    dates: [
      { lieu: 'Pau', date: '18 mars 2026', horaires: '8h30 - 17h30', places: 12 },
    ],
    duree: '2 jours',
    categorie: 'Sécurité',
    couleur: '#f59e0b',
    niveau: 'Tous niveaux',
  },
  {
    id: 5,
    titre: 'Photovoltaïque et énergies renouvelables',
    description: 'Maîtrisez l\'installation de panneaux solaires photovoltaïques. Réglementation, techniques et certification QualiPV.',
    dates: [
      { lieu: 'Pau', date: '6 avril 2026', horaires: '8h00 - 18h00', places: 8 },
    ],
    duree: '3 jours',
    categorie: 'Énergie',
    couleur: '#8b5cf6',
    niveau: 'Intermédiaire',
  },
]

const CATEGORIE_COLORS: Record<string, string> = {
  'Numérique': 'bg-blue-50 text-blue-600',
  'Technique': 'bg-red-50 text-red-600',
  'Réglementation': 'bg-emerald-50 text-emerald-600',
  'Sécurité': 'bg-amber-50 text-amber-600',
  'Énergie': 'bg-purple-50 text-purple-600',
}

const MAIL_FORMATION = 'thierry.jodar@adour-pyrenees-conseil.fr'

function handleInscription(formation: typeof FORMATIONS[0], date: typeof FORMATIONS[0]['dates'][0]) {
  const subject = encodeURIComponent(`Inscription formation : ${formation.titre} — ${date.lieu} ${date.date}`)
  const body = encodeURIComponent(`Bonjour,\n\nJe souhaite m'inscrire à la formation suivante :\n\nIntitulé : ${formation.titre}\nDate : ${date.date}\nLieu : ${date.lieu}\nHoraires : ${date.horaires}\n\nMes coordonnées :\nNom : \nPrénom : \nEntreprise : \nTéléphone : \n\nCordialement,`)
  window.open(`mailto:${MAIL_FORMATION}?subject=${subject}&body=${body}`)
  toast.success('Votre client mail va s\'ouvrir !')
}

export default function Formation() {
  return (
    <div className="p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#003189] flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formations CAPEB</h1>
            <p className="text-gray-500 text-sm">Adour-Pyrénées — Programme 2026</p>
          </div>
        </div>

        {/* Bandeau contact */}
        <div className="mt-5 bg-gradient-to-r from-[#003189] to-[#0051d4] rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-bold text-lg">Thierry JODAR — Responsable Formation</div>
            <div className="text-white/70 text-sm mt-1">Pour toute demande de renseignement ou d'inscription personnalisée</div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a href="tel:0559812860" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition-colors">
              <Phone size={15} /> 05 59 81 28 60
            </a>
            <a href={`mailto:${MAIL_FORMATION}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition-colors">
              <Mail size={15} /> Envoyer un mail
            </a>
          </div>
        </div>
      </motion.div>

      {/* Liste formations */}
      <div className="space-y-5">
        {FORMATIONS.map((formation, i) => (
          <motion.div
            key={formation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden card-hover"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORIE_COLORS[formation.categorie]}`}>
                      {formation.categorie}
                    </span>
                    <span className="text-xs text-gray-400 border border-gray-100 px-2.5 py-1 rounded-full">
                      {formation.niveau}
                    </span>
                    <span className="text-xs text-gray-400">
                      <Clock size={11} className="inline mr-1" />{formation.duree}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mb-2">{formation.titre}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{formation.description}</p>
                </div>
                <div className="w-1.5 h-full min-h-[60px] rounded-full shrink-0" style={{ backgroundColor: formation.couleur }} />
              </div>

              {/* Dates de session */}
              <div className="mt-4 grid gap-3">
                {formation.dates.map((session, j) => (
                  <div key={j} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-5 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={14} className="text-gray-400" />
                        {session.lieu}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        {session.horaires}
                      </div>
                      <div className="text-xs text-gray-400">{session.places} places</div>
                    </div>
                    <button
                      onClick={() => handleInscription(formation, session)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl hover:opacity-90 transition-all"
                      style={{ backgroundColor: formation.couleur }}
                    >
                      S'inscrire <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lien site officiel */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <a
          href="https://www.capeb.fr/adour-pyrenees"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#003189] font-medium hover:underline text-sm"
        >
          Voir toutes les formations sur capeb.fr <ExternalLink size={14} />
        </a>
      </motion.div>
    </div>
  )
}
