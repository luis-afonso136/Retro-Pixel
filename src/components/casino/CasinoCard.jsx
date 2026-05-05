import { Link } from 'react-router-dom'
import { Coins, Zap, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'

const ICONS = {
  coinflip: Coins,
  slots: Zap,
  roulette: Gamepad2,
}

export function CasinoCard({ mode, title, description }) {
  const Icon = ICONS[mode] || Coins
  return (
    <Link to={`/casino/${mode}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -8, scale: 1.02, borderColor: '#FFD700' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
        className="group aspect-square rounded-2xl border border-line bg-surface/85 p-6"
      >
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border border-accent/40 bg-black/60 shadow-[0_0_24px_rgba(255,215,0,0.18)]">
            <Icon className="h-14 w-14 text-accent" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-100">{title}</h4>
          <p className="mt-2 max-w-[18ch] text-sm text-zinc-400">{description}</p>
        </div>
      </motion.article>
    </Link>
  )
}
