import { useState } from 'react'
import { useEconomyStore } from '../../store'
import { useUIStore } from '../../stores/uiStore'
import { triggerCoinConfetti, playCoinSound } from '../../effects'
import { motion } from 'framer-motion'

export function CoinFlip() {
  const [choice, setChoice] = useState('heads')
  const [bet, setBet] = useState(10)
  const [result, setResult] = useState(null)
  const [coinFace, setCoinFace] = useState('heads')
  const [spinKey, setSpinKey] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const placeBet = useEconomyStore((s) => s.placeBet)
  const settleBet = useEconomyStore((s) => s.settleBet)
  const canPlaceBet = useEconomyStore((s) => s.canPlaceBet)
  const minBet = useEconomyStore((s) => s.minBet)
  const maxBet = useEconomyStore((s) => s.maxBet)
  const simulate = useEconomyStore((s) => s.simulateMode)

  const showConfirm = useUIStore((s) => s.showConfirm)
  const showBetResult = useUIStore((s) => s.showBetResult)

  const onPlay = async () => {
    if (bet < minBet || bet > maxBet) {
      setResult({ ok: false, msg: `Aposta entre ${minBet} e ${maxBet}` })
      return
    }

    if (!canPlaceBet(bet)) {
      setResult({ ok: false, msg: 'Saldo insuficiente' })
      return
    }

    const confirmText = simulate ? `Simular aposta de ${bet} moedas em ${choice}?` : `Confirmar aposta de ${bet} moedas em ${choice}?`
    const ok = await showConfirm({ title: 'Confirma aposta', message: confirmText, confirmText: 'Confirmar', cancelText: 'Cancelar' })
    if (!ok) return

    if (!placeBet(bet, 'coinflip')) {
      setResult({ ok: false, msg: 'Erro ao apostar' })
      return
    }

    setIsFlipping(true)
    setSpinKey((value) => value + 1)
    await new Promise((resolve) => setTimeout(resolve, 1050))

    const r = Math.random() < 0.5 ? 'heads' : 'tails'
    setCoinFace(r)
    setIsFlipping(false)
    const win = r === choice
    const payout = settleBet({ mode: 'coinflip', amount: bet, win, multiplier: win ? 2 : 0 })

    if (win) {
      triggerCoinConfetti()
      playCoinSound()
    }

    setResult({ ok: win, rolled: r, payout })
    showBetResult({
      win,
      title: win ? 'Ganhaste no Coin Flip!' : 'Perdeste no Coin Flip',
      message: win ? `Recebeste ${payout} coins.` : `Saiu ${r}. Tenta novamente!`,
    })
  }

  return (
    <motion.div className="mx-auto w-full max-w-5xl rounded-2xl border border-line bg-surface/80 p-6 text-center shadow-card md:p-10">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Coin Flip</p>
      <h3 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">Heads or Tails</h3>

      <div className="mt-6 flex justify-center">
        <motion.div
          key={spinKey}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 1440 }}
          transition={{ duration: 1.05, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-40 w-40 md:h-48 md:w-48"
        >
          <div className="absolute inset-0 rounded-full border border-accent/60 bg-gradient-to-br from-[#FFD700] via-[#e4b900] to-[#9d7a00] shadow-[0_0_30px_rgba(255,215,0,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-black md:text-5xl">
            {coinFace === 'heads' ? 'H' : 'T'}
          </div>
          {isFlipping && <div className="absolute inset-0 rounded-full border border-white/30" />}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={() => setChoice('heads')} className={`rounded px-5 py-2 text-base ${choice === 'heads' ? 'bg-amber-500 text-zinc-100' : 'border border-line text-zinc-200'}`}>Heads</button>
        <button onClick={() => setChoice('tails')} className={`rounded px-5 py-2 text-base ${choice === 'tails' ? 'bg-amber-500 text-zinc-100' : 'border border-line text-zinc-200'}`}>Tails</button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <input type="number" value={bet} onChange={(e) => setBet(Math.max(1, Number(e.target.value || 0)))} className="w-28 rounded border border-line bg-black/60 px-3 py-2 text-center text-base text-zinc-100" />
        <button onClick={onPlay} className="rounded-full bg-amber-500 px-6 py-2 text-base text-zinc-100">Bet</button>
      </div>

      {result && (
        <p className={`mt-5 text-base ${result.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
          {result.ok ? `Ganhaste ${result.payout} coins!` : `Perdeste — saiu ${result.rolled}`}
        </p>
      )}
    </motion.div>
  )
}
