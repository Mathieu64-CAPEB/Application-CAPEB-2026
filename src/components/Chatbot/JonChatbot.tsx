import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'jon'
  content: string
  time: string
}

const JON_RESPONSES: Record<string, string> = {
  default: "Bonjour ! Je suis JON, votre assistant technique CAPEB. Je suis là pour répondre à vos questions sur les normes du bâtiment, la réglementation et les bonnes pratiques artisanales ! 🔨",
  dtu: "Les DTU (Documents Techniques Unifiés) sont des normes françaises qui définissent les règles de mise en œuvre dans le bâtiment. Chaque corps de métier a ses propres DTU. Par exemple : DTU 20.1 pour la maçonnerie, DTU 45.1 pour l'isolation thermique... Besoin d'un DTU spécifique ?",
  tva: "En tant qu'artisan du bâtiment, vous bénéficiez de taux de TVA réduits :\n• 5,5% : travaux d'amélioration énergétique (isolation, fenêtres...)\n• 10% : travaux de rénovation sur logements de + 2 ans\n• 20% : travaux neufs ou locaux professionnels\n\nN'oubliez pas de faire signer l'attestation de taux réduit à votre client !",
  artisan: "Pour obtenir ou conserver la qualité d'artisan, vous devez justifier d'une qualification professionnelle (CAP, BEP, brevet de maîtrise...) ou de 3 années d'expérience professionnelle dans votre métier. La CAPEB peut vous accompagner dans vos démarches !",
  assurance: "En tant qu'artisan, vous êtes soumis à plusieurs obligations d'assurance :\n• Assurance décennale (obligatoire) : couvre les dommages pendant 10 ans après réception\n• Responsabilité civile professionnelle\n• Assurance biennale pour certains équipements\n\nLa CAPEB Adour-Pyrénées peut vous orienter vers des assureurs partenaires.",
  devis: "Un bon devis doit contenir : coordonnées entreprise et client, description détaillée des travaux, matériaux utilisés, prix unitaires et total HT/TTC, délai d'exécution, conditions de paiement, durée de validité. La signature du devis par le client vaut acceptation et forme le contrat !",
  formation: "La CAPEB Adour-Pyrénées propose de nombreuses formations : facturation électronique, soudure, énergies renouvelables, numérique... Rendez-vous dans l'onglet 'Formations' pour consulter le calendrier et vous inscrire !",
  bonjour: "Bonjour ! Content de vous voir ! Comment puis-je vous aider aujourd'hui ? Normes, réglementation, devis, assurances... Je suis là ! 😊",
}

function getJonResponse(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('dtu') || lower.includes('norme')) return JON_RESPONSES.dtu
  if (lower.includes('tva') || lower.includes('taxe')) return JON_RESPONSES.tva
  if (lower.includes('artisan') || lower.includes('qualification') || lower.includes('certif')) return JON_RESPONSES.artisan
  if (lower.includes('assurance') || lower.includes('décennale') || lower.includes('garantie')) return JON_RESPONSES.assurance
  if (lower.includes('devis') || lower.includes('facture') || lower.includes('contrat')) return JON_RESPONSES.devis
  if (lower.includes('formation') || lower.includes('stage') || lower.includes('apprendre')) return JON_RESPONSES.formation
  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) return JON_RESPONSES.bonjour
  return "Je traite votre question... En tant qu'assistant CAPEB, je vous recommande de contacter votre conseiller CAPEB Adour-Pyrénées au 05 59 81 28 60 pour une réponse précise et personnalisée. Puis-je vous aider sur autre chose ?"
}

// Mascotte JON SVG
function JonMascot({ size = 48, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <motion.div
      animate={animated ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Corps */}
        <circle cx="50" cy="50" r="42" fill="#F5C842" stroke="#E5A500" strokeWidth="3" />
        {/* Casque de chantier */}
        <ellipse cx="50" cy="32" rx="28" ry="8" fill="#E2001A" />
        <rect x="22" y="24" width="56" height="12" rx="6" fill="#E2001A" />
        <rect x="38" y="16" width="24" height="16" rx="8" fill="#E2001A" />
        {/* Bande casque */}
        <rect x="22" y="32" width="56" height="4" rx="2" fill="#C00010" />
        {/* Yeux */}
        <circle cx="37" cy="50" r="8" fill="white" />
        <circle cx="63" cy="50" r="8" fill="white" />
        <circle cx="39" cy="51" r="4" fill="#003189" />
        <circle cx="65" cy="51" r="4" fill="#003189" />
        <circle cx="40" cy="49" r="1.5" fill="white" />
        <circle cx="66" cy="49" r="1.5" fill="white" />
        {/* Sourire */}
        <path d="M 36 66 Q 50 78 64 66" stroke="#E5A500" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Joues */}
        <circle cx="28" cy="62" r="6" fill="#FF9500" opacity="0.5" />
        <circle cx="72" cy="62" r="6" fill="#FF9500" opacity="0.5" />
        {/* Ceinture outils */}
        <rect x="30" y="80" width="40" height="8" rx="4" fill="#E5A500" />
        <rect x="46" y="78" width="8" height="10" rx="2" fill="#003189" />
      </svg>
    </motion.div>
  )
}

export default function JonChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0', role: 'jon',
      content: "👷 Bonjour ! Je suis **JON**, votre assistant technique CAPEB !\n\nJe peux vous aider sur :\n• Les DTU et normes du bâtiment\n• La TVA artisan\n• Les assurances obligatoires\n• La création de devis\n• Les formations CAPEB\n\nQue puis-je faire pour vous ?",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(), role: 'user', content: input,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800))
    const response = getJonResponse(input)
    setTyping(false)
    setMessages(m => [...m, {
      id: (Date.now() + 1).toString(), role: 'jon', content: response,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5C842, #E5A500)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <JonMascot size={48} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e2001a] rounded-full flex items-center justify-center text-white text-xs font-bold">!</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fenêtre chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-40 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5C842] to-[#E5A500]">
              <JonMascot size={44} animated />
              <div className="flex-1">
                <div className="font-bold text-gray-900">JON</div>
                <div className="text-xs text-gray-700">Assistant technique CAPEB</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                  <span className="text-xs text-gray-600">En ligne</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-xl hover:bg-black/10 transition-colors">
                <X size={16} className="text-gray-700" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'jon' && <JonMascot size={28} />}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#003189] text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                    }`}>
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2 items-center">
                  <JonMascot size={28} />
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 bg-[#F5C842] rounded-full"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions rapides */}
            <div className="flex gap-2 px-3 py-2 overflow-x-auto bg-white border-t border-gray-50">
              {['TVA artisan', 'Assurance décennale', 'DTU', 'Formations'].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="shrink-0 text-xs px-3 py-1.5 bg-[#003189]/10 text-[#003189] rounded-full hover:bg-[#003189]/20 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-100">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 text-sm outline-none text-gray-700 bg-gray-50 rounded-xl px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-xl bg-[#003189] flex items-center justify-center text-white hover:bg-[#0051d4] transition-colors shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
