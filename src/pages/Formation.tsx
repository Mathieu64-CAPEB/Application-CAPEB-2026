import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ExternalLink, Mail, Phone, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const FORMATIONS = [
  { id:1, titre:'Facturation électronique pour les PME artisanales', description:'Préparez-vous à la réforme de la facture électronique obligatoire. Maîtrisez les outils adaptés à votre entreprise artisanale.', dates:[{lieu:'Anglet',date:'15 jan. 2026',horaires:'9h–17h',places:12},{lieu:'Laruns',date:'22 jan. 2026',horaires:'9h–17h',places:8}], duree:'1 jour', categorie:'Numérique', color:'#60a5fa', niveau:'Débutant' },
  { id:2, titre:'Soudure cuivre et acier — Perfectionnement', description:'Formation pratique en atelier aux techniques de soudure cuivre et acier pour plombiers et chauffagistes.', dates:[{lieu:'Pau',date:'2 fév. 2026',horaires:'8h–17h30',places:6},{lieu:'Pau',date:'3 mars 2026',horaires:'8h–17h30',places:10}], duree:'2 jours', categorie:'Technique', color:'#f472b6', niveau:'Intermédiaire' },
  { id:3, titre:'Réglementation Environnementale RE2020', description:'Comprendre et appliquer la RE2020 dans vos chantiers de construction neuve et de rénovation.', dates:[{lieu:'Bayonne',date:'10 mars 2026',horaires:'9h–17h',places:15}], duree:'1 jour', categorie:'Réglementation', color:'#34d399', niveau:'Tous niveaux' },
  { id:4, titre:'Prévention des risques — PRAP BTP', description:'Formation certifiante INRS : Acteur de Prévention des Risques liés à l\'Activité Physique dans le BTP.', dates:[{lieu:'Pau',date:'18 mars 2026',horaires:'8h30–17h30',places:12}], duree:'2 jours', categorie:'Sécurité', color:'#fb923c', niveau:'Tous niveaux' },
  { id:5, titre:'Photovoltaïque & Énergies renouvelables', description:'Maîtrisez l\'installation de panneaux solaires. Réglementation, techniques et certification QualiPV.', dates:[{lieu:'Pau',date:'6 avr. 2026',horaires:'8h–18h',places:8}], duree:'3 jours', categorie:'Énergie', color:'#a78bfa', niveau:'Intermédiaire' },
]

const MAIL = 'thierry.jodar@adour-pyrenees-conseil.fr'

const fi = (i: number) => ({ initial:{ opacity:0, y:20 }, animate:{ opacity:1, y:0 }, transition:{ delay:i*0.07, duration:0.5 } })

export default function Formation() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">Formations CAPEB</h1>
          <p className="text-white/40 text-sm mt-0.5">Adour-Pyrénées — Programme 2026</p>
        </div>
        <a href="https://www.capeb.fr/adour-pyrenees" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-semibold text-[#60a5fa] hover:underline">
          Site officiel <ExternalLink size={12}/>
        </a>
      </motion.div>

      {/* Bandeau contact */}
      <motion.div {...fi(0)}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg, rgba(0,49,137,0.4), rgba(0,81,212,0.2))', border:'1px solid rgba(0,81,212,0.3)' }}>
        <div className="absolute inset-0 opacity-10" style={{ background:'radial-gradient(ellipse at 80% 50%, #f5c842, transparent)' }}/>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-display font-bold text-white text-base">Thierry JODAR — Responsable Formation</div>
            <div className="text-white/40 text-sm mt-0.5">Renseignements et inscriptions personnalisées</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a href="tel:0559812860"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <Phone size={13}/> 05 59 81 28 60
            </a>
            <a href={`mailto:${MAIL}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <Mail size={13}/> Envoyer un mail
            </a>
          </div>
        </div>
      </motion.div>

      {/* Formations */}
      <div className="space-y-4">
        {FORMATIONS.map((f, i) => (
          <motion.div key={f.id} {...fi(i+1)}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Barre colorée */}
                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background:f.color, boxShadow:`0 0 12px ${f.color}66` }}/>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="tag" style={{ background:f.color+'20', color:f.color, border:`1px solid ${f.color}40` }}>{f.categorie}</span>
                    <span className="tag" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)' }}>{f.niveau}</span>
                    <span className="text-xs text-white/30"><Clock size={10} className="inline mr-1"/>{f.duree}</span>
                  </div>
                  <h2 className="font-display font-bold text-white text-base mb-1.5 leading-tight">{f.titre}</h2>
                  <p className="text-sm text-white/40 leading-relaxed">{f.description}</p>
                </div>
              </div>

              {/* Sessions */}
              <div className="mt-4 space-y-2.5">
                {f.dates.map((session, j) => (
                  <div key={j} className="flex items-center justify-between rounded-xl px-4 py-3 flex-wrap gap-3"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-5 text-sm flex-wrap">
                      <div className="flex items-center gap-1.5 text-white/70 font-semibold">
                        <Calendar size={13} style={{ color:f.color }}/>{session.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/40">
                        <MapPin size={12}/>{session.lieu}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Clock size={12}/>{session.horaires}
                      </div>
                      <span className="text-xs text-white/25">{session.places} places</span>
                    </div>
                    <button
                      onClick={() => {
                        const subj = encodeURIComponent(`Inscription : ${f.titre} — ${session.lieu} ${session.date}`)
                        const body = encodeURIComponent(`Bonjour,\n\nJe souhaite m'inscrire à la formation :\n\n${f.titre}\nDate : ${session.date} — ${session.lieu}\nHoraires : ${session.horaires}\n\nNom :\nPrénom :\nEntreprise :\nTél :\n\nCordialement,`)
                        window.open(`mailto:${MAIL}?subject=${subj}&body=${body}`)
                        toast.success('Client mail ouvert !')
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background:f.color, boxShadow:`0 0 16px ${f.color}44` }}>
                      S'inscrire <ArrowRight size={13}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
