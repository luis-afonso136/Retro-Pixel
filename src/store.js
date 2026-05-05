import { create } from 'zustand'

let flickerTimeoutId

const LS_KEY = 'retropixel:economy'
const COOKIE_KEY = 'retropixel_coins'

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persisted = typeof window !== 'undefined' ? loadFromStorage() : null
const cookieCoins = typeof document !== 'undefined' ? readCookie(COOKIE_KEY) : null

function normalizeCoins(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 420
}

export const useEconomyStore = create((set, get) => ({
  coins: normalizeCoins(cookieCoins ?? persisted?.coins),
  level: (persisted && persisted.level) || 2,
  isCoinFlicker: false,
  // Betting history and simulation
  betHistory: (persisted && persisted.betHistory) || [],
  simulateMode: false,
  // min/max bet guidance
  minBet: 1,
  maxBet: 10000,
  addCoins: (amount) => {
    if (amount <= 0) {
      return
    }

    const nextCoins = get().coins + amount
    const nextLevel = Math.max(1, Math.floor(nextCoins / 250) + 1)

    clearTimeout(flickerTimeoutId)
    set({
      coins: nextCoins,
      level: nextLevel,
      isCoinFlicker: true,
    })

    writeCookie(COOKIE_KEY, String(nextCoins))

    flickerTimeoutId = setTimeout(() => {
      set({ isCoinFlicker: false })
    }, 380)
  },
  spendCoins: (amount) => {
    if (amount <= 0) {
      return true
    }

    const currentCoins = get().coins
    if (currentCoins < amount) {
      return false
    }
    const nextCoins = currentCoins - amount
    set({ coins: nextCoins })
    writeCookie(COOKIE_KEY, String(nextCoins))
    return true
  },
  // Betting API
  lastBet: null,
  placeBet: (amount, mode) => {
    if (amount <= 0) return false
    const current = get().coins
    const simulate = get().simulateMode
    if (!simulate && current < amount) return false

    if (!simulate) {
      const nextCoins = current - amount
      set({ coins: nextCoins })
      writeCookie(COOKIE_KEY, String(nextCoins))
    }

    set({ lastBet: { mode, amount, status: 'placed', simulated: simulate } })
    return true
  },
  settleBet: ({ mode, amount, win, multiplier = 0 }) => {
    const payout = win ? Math.round(amount * multiplier) : 0
    const timestamp = Date.now()
    const entry = { mode, amount, win: !!win, multiplier, payout, time: timestamp }

    if (payout > 0) {
      const nextCoins = get().coins + payout
      clearTimeout(flickerTimeoutId)
      set((state) => ({
        coins: nextCoins,
        isCoinFlicker: true,
        lastBet: { mode, amount, status: win ? 'win' : 'lose', payout },
        betHistory: [entry, ...state.betHistory].slice(0, 200),
      }))
      writeCookie(COOKIE_KEY, String(nextCoins))

      flickerTimeoutId = setTimeout(() => {
        set({ isCoinFlicker: false })
      }, 380)
    } else {
      set((state) => ({ lastBet: { mode, amount, status: 'lose', payout: 0 }, betHistory: [entry, ...state.betHistory].slice(0, 200) }))
    }
    return payout
  },
  toggleSimulate: () => set((s) => ({ simulateMode: !s.simulateMode })),
  setSimulate: (v) => set({ simulateMode: !!v }),
  canPlaceBet: (amount) => {
    const simulate = get().simulateMode
    const current = get().coins
    if (amount < get().minBet || amount > get().maxBet) return false
    if (simulate) return true
    return current >= amount
  },
  clearHistory: () => set({ betHistory: [] }),

  unlockedGames: (persisted && persisted.unlockedGames) || [],
  buyGame: (game) => {
    const currentCoins = get().coins
    if (currentCoins < game.price) return { ok: false, reason: 'Saldo insuficiente' }

    const unlockedGames = get().unlockedGames
    if (unlockedGames.includes(game.id)) {
      return { ok: false, reason: 'Jogo já comprado' }
    }

    const nextCoins = currentCoins - game.price
    const nextUnlocked = [...unlockedGames, game.id]
    set({ coins: nextCoins, unlockedGames: nextUnlocked })
    writeCookie(COOKIE_KEY, String(nextCoins))
    return { ok: true }
  },
}))

// Persist selected state to localStorage
useEconomyStore.subscribe((state) => {
  try {
    const snapshot = {
      coins: state.coins,
      level: state.level,
      betHistory: state.betHistory,
      unlockedGames: state.unlockedGames,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(snapshot))
  } catch {
    /* ignore */
  }
})
