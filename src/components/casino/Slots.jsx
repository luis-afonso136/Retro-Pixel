import { useState } from 'react'
import { useEconomyStore } from '../../store'
import { useUIStore } from '../../stores/uiStore'
import { triggerCoinConfetti, playCoinSound } from '../../effects'
import { motion } from 'framer-motion'

const symbols = ['★', '◆', '●', '■']

function spinReels() {
  return [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ]
}

export function Slots() {
  const [bet, setBet] = useState(10)
  const [reels, setReels] = useState(['-', '-', '-'])
  const [result, setResult] = useState(null)
  const placeBet = useEconomyStore((s) => s.placeBet)
  const settleBet = useEconomyStore((s) => s.settleBet)
  const canPlaceBet = useEconomyStore((s) => s.canPlaceBet)
  const minBet = useEconomyStore((s) => s.minBet)
  const maxBet = useEconomyStore((s) => s.maxBet)
  const simulate = useEconomyStore((s) => s.simulateMode)

  const showConfirm = useUIStore((s) => s.showConfirm)
  const showBetResult = useUIStore((s) => s.showBetResult)

  const onSpin = async () => {
    if (bet < minBet || bet > maxBet) {
      setResult({ ok: false, msg: `Aposta entre ${minBet} e ${maxBet}` })
      return
    }

    if (!canPlaceBet(bet)) {
      setResult({ ok: false, msg: 'Saldo insuficiente' })
      return
    }

    const confirmText = simulate ? `Simular spin com ${bet} moedas?` : `Confirmar spin com ${bet} moedas?`
    const ok = await showConfirm({ title: 'Confirmar spin', message: confirmText, confirmText: 'Spin', cancelText: 'Cancelar' })
    if (!ok) return

    if (!placeBet(bet, 'slots')) {
      setResult({ ok: false, msg: 'Erro ao apostar' })
      return
    }

    // simple spin animation
    for (let i = 0; i < 8; i++) {
      setReels(spinReels())
      // small delay
      await new Promise((r) => setTimeout(r, 60))
    }

    const final = spinReels()
    setReels(final)

    const unique = new Set(final)
    let win = false
    let multiplier = 0
    if (unique.size === 1) {
      win = true
      multiplier = 10
    } else if (unique.size === 2) {
      win = true
      multiplier = 2
    }

    const payout = settleBet({ mode: 'slots', amount: bet, win, multiplier })
    if (win) {
      triggerCoinConfetti()
      playCoinSound()
    }

    setResult({ ok: win, payout })
    showBetResult({
      win,
      title: win ? 'Jackpot nos Slots!' : 'Não foi desta nos Slots',
      message: win ? `Recebeste ${payout} coins.` : 'A casa ganhou esta rodada.',
    })
  }

  return (
    <motion.div className="mx-auto w-full max-w-5xl rounded-2xl border border-line bg-surface/80 p-6 text-center shadow-card md:p-10">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Slots</p>
      <h3 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">3-Reel Slot</h3>

      <div className="mt-6 flex items-center justify-center gap-3 text-4xl md:text-5xl">
        <div className="w-20 rounded-xl border border-line bg-black/70 py-4 md:w-24">{reels[0]}</div>
        <div className="w-20 rounded-xl border border-line bg-black/70 py-4 md:w-24">{reels[1]}</div>
        <div className="w-20 rounded-xl border border-line bg-black/70 py-4 md:w-24">{reels[2]}</div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <input type="number" value={bet} onChange={(e) => setBet(Math.max(1, Number(e.target.value || 0)))} className="w-28 rounded border border-line bg-black/60 px-3 py-2 text-center text-base text-zinc-100" />
        <button onClick={onSpin} className="rounded-full bg-amber-500 px-6 py-2 text-base text-zinc-100">Spin</button>
      </div>

      {result && (
        <p className={`mt-5 text-base ${result.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
          {result.ok ? `Ganhaste ${result.payout} coins!` : 'Perdeste'}
        </p>
      )}
    </motion.div>
  )
}
