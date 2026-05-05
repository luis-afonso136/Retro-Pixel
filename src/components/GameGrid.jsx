import { motion } from 'framer-motion'
import { GameCard } from './GameCard'

export function GameGrid({ games, onPlay }) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Arcade List</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Featured Retro Sessions</h2>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <GameCard game={game} onPlay={onPlay} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
