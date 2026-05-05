import { motion } from 'framer-motion'
import { CasinoCard } from '../components/casino/CasinoCard'
import { BetHistory } from '../components/casino/BetHistory'
import { useEconomyStore } from '../store'

export function CasinoPage() {
  const { coins } = useEconomyStore()

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8"
    >
      <section className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8 mb-6">
        <p className="font-arcade text-[9px] uppercase tracking-[0.25em] text-accent/90">Casino Modes</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Bet your coins — play casino modes</h1>
        <p className="mt-2 text-sm text-zinc-400">Balance: <span className="font-medium text-zinc-100">{coins}</span></p>
      </section>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 grid gap-6 md:grid-cols-3">
          <CasinoCard mode="coinflip" title="Coin Flip" description="Heads or tails — 50/50" />
          <CasinoCard mode="slots" title="Slots" description="3-reel slot machine" />
          <CasinoCard mode="roulette" title="Roulette" description="Bet colors — red/black/green" />
        </div>
        <div>
          <BetHistory />
        </div>
      </div>
    </motion.main>
  )
}
