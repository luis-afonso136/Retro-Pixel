import { motion } from 'framer-motion'
import { Shop } from '../components/Shop'
import { useEconomyStore } from '../store'

export function ShopPage({ items, onBuy }) {
  const unlockedGameIds = useEconomyStore((s) => s.unlockedGames)

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8"
    >
      <section className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8">
        <p className="font-arcade text-[9px] uppercase tracking-[0.25em] text-accent/90 animate-pulse-retro">
          Store Access
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
          Spend coins to unlock new games.
        </h1>
      </section>

      <Shop items={items} onBuy={onBuy} unlockedGameIds={unlockedGameIds} />
    </motion.main>
  )
}
