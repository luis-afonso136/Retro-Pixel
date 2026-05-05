import { motion } from 'framer-motion'
import { ArrowUpRight, CirclePlay, Coins } from 'lucide-react'
import { Link } from 'react-router-dom'

export function GameCard({ game, onPlay }) {
  return (
    <Link to={`/game/${game.id}`} className="block">
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="pixel-hover group rounded-2xl border border-line bg-surface/85 p-5 shadow-card"
      >
        {/* Container da Imagem Ajustado */}
        <div className="mb-4 aspect-square overflow-hidden rounded-xl border border-line/80 bg-black/60">
          <img
            src={game.preview}
            alt={`Preview de ${game.title}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
            loading="lazy"
          />
        </div>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-300">{game.genre}</p>
            <h3 className="text-lg font-semibold text-zinc-100">{game.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-300 line-clamp-2">{game.description}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-500 transition group-hover:text-accent" />
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4 opacity-95 transition group-hover:opacity-100">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-accent">
            <Coins className="h-3.5 w-3.5" />
            <span>+{game.reward} coins</span>
          </div>

          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onPlay && onPlay(game)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-zinc-200 transition hover:border-accent hover:text-accent"
            >
              <CirclePlay className="h-3.5 w-3.5" />
              Play
            </button>
            <ArrowUpRight className="h-4 w-4 text-zinc-500 transition group-hover:text-accent" />
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
