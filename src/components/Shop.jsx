import { motion } from 'framer-motion'
import { Coins, Gamepad2, Lock, Play } from 'lucide-react'

const iconByType = {
  game: Gamepad2,
}

export function Shop({ items, onBuy, unlockedGameIds = [] }) {
  return (
    <section className="mt-14 pb-14">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Game Shop</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Unlock games with your coins</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, idx) => {
          const ItemIcon = iconByType[item.type] ?? Gamepad2
          const owned = unlockedGameIds.includes(item.id)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: idx * 0.06 }}
              className="shop-item flex h-full flex-col justify-between rounded-2xl border border-line bg-surface/80 p-5 transition"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-xl border border-line bg-black/70 p-3">
                    <ItemIcon className="h-5 w-5 text-accent" />
                  </div>
                  {owned ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      <Play className="h-3 w-3" />
                      Owned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">{item.genre}</p>
                  <p className="mt-2 text-base font-semibold text-zinc-100">{item.title}</p>
                  <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm text-accent">
                  <Coins className="h-4 w-4" />
                  <span>{item.price}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onBuy(item)}
                  disabled={owned}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.15em] text-zinc-200 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {owned ? 'Owned' : 'Buy'}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
