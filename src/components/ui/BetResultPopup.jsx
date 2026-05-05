import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '../../stores/uiStore'
import { triggerCoinConfetti } from '../../effects'

export function BetResultPopup() {
  const betResult = useUIStore((s) => s.betResult)
  const closeBetResult = useUIStore((s) => s.closeBetResult)

  useEffect(() => {
    if (!betResult.open) return

    if (betResult.win) {
      triggerCoinConfetti()
    }

    const timeout = setTimeout(() => {
      closeBetResult()
    }, 2400)

    return () => clearTimeout(timeout)
  }, [betResult.open, betResult.win, closeBetResult])

  return (
    <AnimatePresence>
      {betResult.open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[60] w-[min(92vw,380px)] rounded-2xl border border-line bg-surface/95 p-4 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-xs uppercase tracking-[0.22em] ${betResult.win ? 'text-emerald-400' : 'text-rose-400'}`}>
                {betResult.win ? 'Vitória' : 'Derrota'}
              </p>
              <h4 className="mt-1 text-lg font-semibold text-zinc-100">{betResult.title}</h4>
              <p className="mt-1 text-sm text-zinc-300">{betResult.message}</p>
            </div>
            <button
              type="button"
              onClick={closeBetResult}
              className="rounded border border-line px-2 py-1 text-xs text-zinc-300 hover:border-accent hover:text-accent"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
