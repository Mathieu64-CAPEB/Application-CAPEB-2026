import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useStore, MILESTONES } from '../../store/useStore'

export default function CelebrationModal() {
  const { caActuel, lastCelebration, setLastCelebration } = useStore()
  const [show, setShow] = useState(false)
  const [milestone, setMilestone] = useState<typeof MILESTONES[0] | null>(null)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const reached = MILESTONES.filter(m => caActuel >= m.seuil)
    if (reached.length === 0) return

    const highestReached = reached[reached.length - 1]
    if (highestReached.seuil !== lastCelebration) {
      setMilestone(highestReached)
      setShow(true)
      setLastCelebration(highestReached.seuil)

      const timer = setTimeout(() => setShow(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [caActuel])

  return (
    <AnimatePresence>
      {show && milestone && (
        <>
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            colors={['#003189', '#f5c842', '#e2001a', '#ffffff', '#0051d4']}
            recycle={false}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md mx-4 text-center celebration-glow pointer-events-auto">
              {/* Emoji animé */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-8xl mb-4"
              >
                {milestone.emoji}
              </motion.div>

              {/* Titre */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-black text-[#003189] mb-1">
                  {milestone.label} atteints !
                </div>
                <div className="text-gray-600 text-lg mb-6">{milestone.message}</div>
              </motion.div>

              {/* Barre de progression dorée */}
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full gold-gradient rounded-full"
                />
              </div>

              <button
                onClick={() => setShow(false)}
                className="px-8 py-3 bg-[#003189] text-white rounded-xl font-bold hover:bg-[#0051d4] transition-colors"
              >
                Continuer sur ma lancée ! 💪
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
