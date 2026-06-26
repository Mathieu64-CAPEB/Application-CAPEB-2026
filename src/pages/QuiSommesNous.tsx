import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Globe, Share2, Link, Play, Building2, Users, Shield, Award, ExternalLink } from 'lucide-react'

const EQUIPE = [
  { nom: 'Jean-Pierre ARTIGUEBIEILLE', role: 'Président CAPEB Adour-Pyrénées', initiales: 'JA', couleur: '#003189', description: 'Artisan maçon depuis 25 ans, défenseur des intérêts des artisans du bâtiment du Béarn et du Pays Basque.' },
  { nom: 'Thierry JODAR', role: 'Responsable Formation', initiales: 'TJ', couleur: '#e2001a', description: 'Coordinateur de l\'offre de formation professionnelle pour les artisans adhérents de la fédération.' },
  { nom: 'Sophie MARTIN', role: 'Conseillère Juridique', initiales: 'SM', couleur: '#10b981', description: 'Spécialiste droit social et droit des affaires, accompagne les artisans dans leurs démarches administratives et juridiques.' },
  { nom: 'Marc LEBRUN', role: 'Chargé de Communication', initiales: 'ML', couleur: '#f59e0b', description: 'Anime la communication de la fédération et accompagne les adhérents dans leur développement numérique.' },
  { nom: 'Isabelle CAZENAVE', role: 'Assistante Administrative', initiales: 'IC', couleur: '#8b5cf6', description: 'Accueil et accompagnement administratif des adhérents, gestion des adhésions et des dossiers.' },
]

const SERVICES = [
  {
    icon: Shield,
    titre: 'Défense & Représentation',
    description: 'La CAPEB représente et défend les intérêts des artisans du bâtiment auprès des instances locales, régionales et nationales. Votre voix dans les négociations collectives.',
    couleur: '#003189',
  },
  {
    icon: Award,
    titre: 'Qualifications & Labels',
    description: 'Obtenez les labels Qualibat, RGE, Éco-Artisan... La CAPEB vous accompagne dans l\'obtention et le renouvellement de vos qualifications professionnelles.',
    couleur: '#e2001a',
  },
  {
    icon: Users,
    titre: 'Formation Professionnelle',
    description: 'Un catalogue complet de formations techniques, réglementaires et managériales. Développez vos compétences et celles de vos équipes tout au long de l\'année.',
    couleur: '#10b981',
  },
  {
    icon: Building2,
    titre: 'Conseil & Accompagnement',
    description: 'Nos conseillers vous accompagnent sur les questions juridiques, sociales, fiscales et techniques. Un soutien expert pour toutes les étapes de votre activité.',
    couleur: '#f59e0b',
  },
  {
    icon: Globe,
    titre: 'Réseau & Partenariats',
    description: 'Intégrez un réseau de professionnels du bâtiment. Échanges de bonnes pratiques, partenariats locaux et accès aux services exclusifs CAPEB nationale.',
    couleur: '#8b5cf6',
  },
]

export default function QuiSommesNous() {
  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex items-center justify-center mb-5">
          <img
            src="https://www.capeb.fr/www/capeb/media//national/logo-adb-par-capeb-hd-copy.png"
            alt="CAPEB Artisans du Bâtiment"
            className="h-16 object-contain"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">CAPEB Adour-Pyrénées</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          La Confédération de l'Artisanat et des Petites Entreprises du Bâtiment représente et défend
          les intérêts des artisans du bâtiment en Béarn et au Pays Basque. Depuis plus de 70 ans,
          nous accompagnons les professionnels du bâtiment dans le développement de leur activité.
        </p>
        <a
          href="https://www.capeb.fr/adour-pyrenees"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4] transition-colors"
        >
          Visiter notre site <ExternalLink size={14} />
        </a>
      </motion.div>

      {/* Chiffres clés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { valeur: '+2500', label: 'Entreprises adhérentes', couleur: '#003189' },
          { valeur: '64', label: 'Département des Pyrénées-Atlantiques', couleur: '#e2001a' },
          { valeur: '+70', label: 'Ans d\'histoire', couleur: '#10b981' },
          { valeur: '200+', label: 'Formations par an', couleur: '#f59e0b' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-50 card-hover">
            <div className="text-3xl font-black mb-1" style={{ color: kpi.couleur }}>{kpi.valeur}</div>
            <div className="text-xs text-gray-500 leading-tight">{kpi.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Nos services */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Nos services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.titre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 card-hover"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: service.couleur + '20' }}>
                <service.icon size={20} style={{ color: service.couleur }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{service.titre}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Équipe */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Notre équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {EQUIPE.map((membre, i) => (
            <motion.div
              key={membre.nom}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 card-hover flex gap-4"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
                style={{ backgroundColor: membre.couleur }}
              >
                {membre.initiales}
              </div>
              <div>
                <div className="font-bold text-gray-900">{membre.nom}</div>
                <div className="text-sm font-medium mb-1.5" style={{ color: membre.couleur }}>{membre.role}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{membre.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Nous contacter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-[#003189] to-[#0051d4] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Coordonnées</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#f5c842] shrink-0 mt-0.5" />
                <div>Siège social CAPEB Adour-Pyrénées<br />Pyrénées-Atlantiques (64), Nouvelle-Aquitaine</div>
              </div>
              <a href="tel:0559812860" className="flex items-center gap-3 hover:text-[#f5c842] transition-colors">
                <Phone size={16} className="text-[#f5c842]" />
                05 59 81 28 60
              </a>
              <a href="mailto:thierry.jodar@adour-pyrenees-conseil.fr" className="flex items-center gap-3 hover:text-[#f5c842] transition-colors">
                <Mail size={16} className="text-[#f5c842]" />
                adour-pyrenees@capeb.fr
              </a>
              <a href="https://www.capeb.fr/adour-pyrenees" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#f5c842] transition-colors">
                <Globe size={16} className="text-[#f5c842]" />
                www.capeb.fr/adour-pyrenees
              </a>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/10">
              {[
                { icon: Share2, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Link, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Play, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title={label}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-900 mb-4">Devenir adhérent</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Rejoignez le réseau CAPEB Adour-Pyrénées et bénéficiez de tous nos services :
              accompagnement juridique, formations, défense de vos intérêts et accès aux partenariats exclusifs.
            </p>
            <div className="space-y-2 text-sm mb-5">
              {['Accès aux formations à tarif préférentiel', 'Conseils juridiques et sociaux', 'Réseau de professionnels', 'Qualifications et labels reconnus', 'Protection et représentation'].map(avantage => (
                <div key={avantage} className="flex items-center gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#003189]" />
                  {avantage}
                </div>
              ))}
            </div>
            <a
              href="https://www.capeb.fr/adour-pyrenees"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#003189] text-white rounded-xl text-sm font-medium hover:bg-[#0051d4] transition-colors"
            >
              J'adhère à la CAPEB <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
