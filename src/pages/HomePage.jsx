import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GameGrid } from '../components/GameGrid'

export function HomePage({ games, onPlay }) {
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
          Level Up Economy
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
          Premium retro game hub with a focused coin economy.
        </h1>
        <div className="mt-6">
          <Link
            to="/loja"
            className="btn-primary inline-flex items-center rounded-full border border-accent/75 bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-yellow-300"
          >
            Ir Para Loja
          </Link>
        </div>
      </section>

      <GameGrid games={games} onPlay={onPlay} />
    </motion.main>
  )
}
