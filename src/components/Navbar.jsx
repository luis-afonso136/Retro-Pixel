import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Coins, Gamepad2, Menu, Sparkles, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function Navbar({ coins, level, isCoinFlicker }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition md:px-3.5 md:text-[10px] ${
      isActive
        ? 'border-accent bg-accent text-black shadow-[0_0_0_1px_rgba(255,215,0,0.35)]'
        : 'border-line text-zinc-300 hover:border-accent hover:text-accent'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-2xl border px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
      isActive
        ? 'border-accent bg-accent text-black'
        : 'border-line bg-black/40 text-zinc-200 hover:border-accent hover:text-accent'
    }`

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-20 border-b border-line/90 bg-base/85 backdrop-blur-xl"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6 md:px-8 md:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 leading-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-surface shadow-glow md:hidden">
              <Gamepad2 className="h-4 w-4 text-accent" />
            </div>
            <div className="flex flex-col justify-center leading-none md:hidden">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent/80">Retro Pixel</p>
              <p className="mt-0.5 text-xs text-zinc-400">Coin-first arcade hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <div className="rounded-full border border-line bg-surface px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-3.5 w-3.5 text-accent" />
                <span className={`font-medium text-zinc-100 ${isCoinFlicker ? 'animate-coin-flicker' : ''}`}>
                  {coins.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface text-zinc-100 transition hover:border-accent hover:text-accent"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-2 hidden items-center justify-between gap-3 md:flex md:gap-6">
          <div className="flex items-center gap-3 leading-none">
            <Gamepad2 className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-200 leading-none">Retro Pixel</p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Jogos
            </NavLink>
            <NavLink to="/loja" className={linkClass}>
              Loja
            </NavLink>
            <NavLink to="/casino" className={linkClass}>
              Casino
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="rounded-full border border-line bg-surface px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-3.5 w-3.5 text-accent" />
                <span className={`font-medium text-zinc-100 ${isCoinFlicker ? 'animate-coin-flicker' : ''}`}>
                  {coins.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-[10px] text-zinc-300 sm:flex">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="font-arcade text-[9px] tracking-wide text-accent">Level {level}</span>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-3 overflow-hidden md:hidden"
            >
              <div className="rounded-3xl border border-line bg-surface/95 p-3 shadow-card">
                <nav className="grid gap-2">
                  <NavLink to="/" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                    <span>Jogos</span>
                    <span className="text-[10px] tracking-[0.22em] text-zinc-500">01</span>
                  </NavLink>
                  <NavLink to="/loja" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                    <span>Loja</span>
                    <span className="text-[10px] tracking-[0.22em] text-zinc-500">02</span>
                  </NavLink>
                  <NavLink to="/casino" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                    <span>Casino</span>
                    <span className="text-[10px] tracking-[0.22em] text-zinc-500">03</span>
                  </NavLink>
                </nav>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-line bg-black/35 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Coins</p>
                    <p className="mt-1 text-base font-semibold text-zinc-100">{coins.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-black/35 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Level</p>
                    <p className="mt-1 text-base font-semibold text-zinc-100">{level}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
