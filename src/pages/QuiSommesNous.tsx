import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Globe, Building2, Users, Shield, Award, ExternalLink, Share2, Link, Play } from 'lucide-react'

const EQUIPE = [
  { nom:'Jean-Pierre ARTIGUEBIEILLE', role:'Président', initiales:'JA', color:'#60a5fa', desc:'Artisan maçon depuis 25 ans, défenseur des intérêts des artisans du Béarn et du Pays Basque.' },
  { nom:'Thierry JODAR', role:'Responsable Formation', initiales:'TJ', color:'#f472b6', desc:'Coordinateur de l\'offre de formation professionnelle pour les artisans adhérents.' },
  { nom:'Sophie MARTIN', role:'Conseillère Juridique', initiales:'SM', color:'#34d399', desc:'Spécialiste droit social et droit des affaires. Accompagne les artisans dans leurs démarches.' },
  { nom:'Marc LEBRUN', role:'Communication', initiales:'ML', color:'#f5c842', desc:'Anime la communication et accompagne les adhérents dans leur développement numérique.' },
  { nom:'Isabelle CAZENAVE', role:'Administration', initiales:'IC', color:'#a78bfa', desc:'Accueil des adhérents, gestion des adhésions et des dossiers administratifs.' },
]

const SERVICES = [
  { icon:Shield, titre:'Défense & Représentation', desc:'Représentation des artisans du bâtiment auprès des instances locales, régionales et nationales.', color:'#60a5fa' },
  { icon:Award, titre:'Qualifications & Labels', desc:'Accompagnement pour l\'obtention des labels Qualibat, RGE, Éco-Artisan et autres certifications.', color:'#f5c842' },
  { icon:Users, titre:'Formation Professionnelle', desc:'Catalogue complet de formations techniques, réglementaires et managériales toute l\'année.', color:'#34d399' },
  { icon:Building2, titre:'Conseil & Accompagnement', desc:'Conseillers experts sur les questions juridiques, sociales, fiscales et techniques.', color:'#fb923c' },
  { icon:Globe, titre:'Réseau & Partenariats', desc:'Intégrez un réseau de professionnels du bâtiment avec accès aux services exclusifs CAPEB nationale.', color:'#a78bfa' },
]

const KPI = [
  { val:'+2500', label:'Entreprises adhérentes', color:'#60a5fa' },
  { val:'64', label:'Pyrénées-Atlantiques', color:'#f472b6' },
  { val:'+70 ans', label:'D\'histoire', color:'#34d399' },
  { val:'200+', label:'Formations par an', color:'#f5c842' },
]

const fi = (i: number) => ({ initial:{ opacity:0, y:20 }, animate:{ opacity:1, y:0 }, transition:{ delay:i*0.07, duration:0.5 } })

export default function QuiSommesNous() {
  return (
    <div className="p-6 space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="text-center py-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-5"
          style={{ background:'rgba(0,81,212,0.15)', border:'1px solid rgba(0,81,212,0.3)' }}>
          <img src="https://www.capeb.fr/www/capeb/media//national/logo-adb-par-capeb-hd-copy.png" alt="CAPEB"
            className="h-6 object-contain" onError={e => (e.currentTarget.style.display='none')} />
        </div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight mb-3">CAPEB Adour-Pyrénées</h1>
        <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
          La Confédération de l'Artisanat et des Petites Entreprises du Bâtiment représente et défend
          les artisans du bâtiment en Béarn et au Pays Basque depuis plus de 70 ans.
        </p>
        <a href="https://www.capeb.fr/adour-pyrenees" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-capeb hover:opacity-90"
          style={{ boxShadow:'0 0 20px rgba(0,81,212,0.4)' }}>
          Visiter le site officiel <ExternalLink size={13}/>
        </a>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI.map((k, i) => (
          <motion.div key={k.label} {...fi(i)}
            className="glass-card rounded-2xl p-5 text-center">
            <div className="font-display text-3xl font-black mb-1" style={{ color:k.color, textShadow:`0 0 20px ${k.color}66` }}>{k.val}</div>
            <div className="text-xs text-white/40 leading-tight">{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Services */}
      <div>
        <motion.h2 {...fi(4)}
          className="font-display font-black text-white text-xl mb-4">Nos services</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div key={s.titre} {...fi(i+5)}
              className="glass-card rounded-2xl p-5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background:s.color+'18', border:`1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color:s.color }}/>
              </div>
              <h3 className="font-display font-bold text-white text-base mb-2">{s.titre}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Équipe */}
      <div>
        <motion.h2 {...fi(10)}
          className="font-display font-black text-white text-xl mb-4">Notre équipe</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {EQUIPE.map((m, i) => (
            <motion.div key={m.nom} {...fi(i+11)}
              className="glass-card rounded-2xl p-4 flex gap-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0 transition-all group-hover:scale-110"
                style={{ background:m.color+'20', border:`1px solid ${m.color}40`, color:m.color }}>
                {m.initiales}
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight">{m.nom}</div>
                <div className="text-xs font-semibold mb-1.5 mt-0.5" style={{ color:m.color }}>{m.role}</div>
                <p className="text-xs text-white/35 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div {...fi(16)}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, rgba(0,49,137,0.5), rgba(0,81,212,0.3))', border:'1px solid rgba(0,81,212,0.4)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background:'radial-gradient(ellipse at 80% 20%, #f5c842, transparent)' }}/>
          <h3 className="font-display font-bold text-white text-base mb-4 relative z-10">Coordonnées</h3>
          <div className="space-y-3 text-sm relative z-10">
            <div className="flex items-start gap-3 text-white/50">
              <MapPin size={14} className="shrink-0 mt-0.5" style={{ color:'#f5c842' }}/>
              Pyrénées-Atlantiques (64), Nouvelle-Aquitaine
            </div>
            <a href="tel:0559812860" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
              <Phone size={14} style={{ color:'#f5c842' }}/> 05 59 81 28 60
            </a>
            <a href="mailto:adour-pyrenees@capeb.fr" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
              <Mail size={14} style={{ color:'#f5c842' }}/> adour-pyrenees@capeb.fr
            </a>
            <a href="https://www.capeb.fr/adour-pyrenees" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
              <Globe size={14} style={{ color:'#f5c842' }}/> www.capeb.fr/adour-pyrenees
            </a>
          </div>
          <div className="flex items-center gap-2 mt-5 pt-4 relative z-10" style={{ borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            {[{icon:Share2,label:'Facebook'},{icon:Link,label:'LinkedIn'},{icon:Play,label:'YouTube'}].map(({icon:Icon,label}) => (
              <div key={label} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)' }}
                title={label}>
                <Icon size={14} className="text-white/50"/>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fi(17)} className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-white text-base mb-3">Devenir adhérent</h3>
          <p className="text-sm text-white/40 leading-relaxed mb-4">
            Rejoignez le réseau CAPEB Adour-Pyrénées et bénéficiez de tous nos services : conseils juridiques, formations, qualifications et réseau professionnel.
          </p>
          <div className="space-y-2 mb-5">
            {['Formations à tarif préférentiel','Conseils juridiques et sociaux','Labels et qualifications reconnus','Réseau de 2500+ professionnels'].map(a => (
              <div key={a} className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background:'#60a5fa' }}/>
                {a}
              </div>
            ))}
          </div>
          <a href="https://www.capeb.fr/adour-pyrenees" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white gradient-capeb hover:opacity-90 transition-all"
            style={{ boxShadow:'0 0 20px rgba(0,81,212,0.3)' }}>
            J'adhère à la CAPEB <ExternalLink size={13}/>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
