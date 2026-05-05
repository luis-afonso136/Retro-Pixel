import { useState } from 'react'
import { useEconomyStore } from '../../store'
import { useUIStore } from '../../stores/uiStore'
import { triggerCoinConfetti, playCoinSound } from '../../effects'
import { motion } from 'framer-motion'

const wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])

function colorForNumber(value) {
  if (value === 0) return 'green'
  return redNumbers.has(value) ? 'red' : 'black'
}

const colorMap = {
  red: '#ef4444',
  black: '#111827',
  green: '#22c55e',
}

const segmentAngle = 360 / wheelNumbers.length

const wheelGradient = `conic-gradient(${wheelNumbers
  .map((value, index) => {
    const segment = colorForNumber(value)
    const start = index * segmentAngle
    const end = (index + 1) * segmentAngle
    return `${colorMap[segment]} ${start}deg ${end}deg`
  })
  .join(', ')})`

export function Roulette() {
  const [bet, setBet] = useState(10)
  const [choice, setChoice] = useState('red')
  const [result, setResult] = useState(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
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

    const confirmText = simulate ? `Simular roleta com ${bet} moedas em ${choice}?` : `Confirmar roleta com ${bet} moedas em ${choice}?`
    const ok = await showConfirm({ title: 'Confirmar roleta', message: confirmText, confirmText: 'Spin', cancelText: 'Cancelar' })
    if (!ok) return

    if (!placeBet(bet, 'roulette')) {
      setResult({ ok: false, msg: 'Erro ao apostar' })
      return
    }

    setSpinning(true)

    const targetIndex = Math.floor(Math.random() * wheelNumbers.length)
    const winningNumber = wheelNumbers[targetIndex]
    const outcome = colorForNumber(winningNumber)
    const landingAngle = targetIndex * segmentAngle + segmentAngle / 2
    const jitter = (Math.random() - 0.5) * segmentAngle * 0.35
    const spins = 360 * (7 + Math.floor(Math.random() * 3))
    const targetRotation = spins + (360 - landingAngle) + jitter
    setWheelRotation((current) => current + targetRotation)

    await new Promise((resolve) => setTimeout(resolve, 3450))

    let win = false
    let multiplier = 0
    if (choice === 'number') {
      // not implemented number betting — treat as lose
      win = false
    } else if (choice === outcome) {
      win = true
      multiplier = outcome === 'green' ? 35 : 2
    }

    const payout = settleBet({ mode: 'roulette', amount: bet, win, multiplier })
    if (win) {
      triggerCoinConfetti()
      playCoinSound()
    }

    setResult({ ok: win, outcome, number: winningNumber, payout })
    showBetResult({
      win,
      title: win ? 'Ganhaste na Roleta!' : 'Perdeste na Roleta',
      message: win
        ? `Cor ${outcome}, número ${winningNumber}. Recebeste ${payout} coins.`
        : `Saiu ${outcome} (número ${winningNumber}).`,
    })
    setSpinning(false)
  }

  return (
    <motion.div className="mx-auto w-full max-w-6xl rounded-2xl border border-line bg-surface/80 p-6 text-center shadow-card md:p-10">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Roulette</p>
      <h3 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">Color Bet</h3>

      <div className="mt-6 flex justify-center">
        <div className="relative">
          <div className="absolute -top-2 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-t-[14px] border-l-transparent border-r-transparent border-t-accent" />
          <motion.div
            animate={{ rotate: wheelRotation }}
            transition={{ duration: 3.4, ease: [0.08, 0.9, 0.2, 1] }}
            className="relative h-72 w-72 rounded-full border-4 border-accent/75 shadow-[0_0_28px_rgba(255,215,0,0.22)] md:h-80 md:w-80"
            style={{ background: wheelGradient }}
          >
            {wheelNumbers.map((value, index) => {
              const angle = index * segmentAngle + segmentAngle / 2
              const textColor = value === 0 ? 'text-emerald-200' : 'text-zinc-100'
              return (
                <div
                  key={value}
                  className="absolute left-1/2 top-1/2 origin-center"
                  style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-152px)` }}
                >
                  <span
                    className={`block text-[11px] font-semibold ${textColor}`}
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    {value}
                  </span>
                </div>
              )
            })}
            <div className="absolute inset-[34%] rounded-full border border-zinc-900/50 bg-zinc-950/90" />
          </motion.div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={() => setChoice('red')} className={`rounded px-5 py-2 text-base ${choice === 'red' ? 'bg-red-500 text-zinc-100' : 'border border-line text-zinc-200'}`}>Red</button>
        <button onClick={() => setChoice('black')} className={`rounded px-5 py-2 text-base ${choice === 'black' ? 'bg-black text-zinc-100' : 'border border-line'}`}>Black</button>
        <button onClick={() => setChoice('green')} className={`rounded px-5 py-2 text-base ${choice === 'green' ? 'bg-green-500 text-zinc-100' : 'border border-line text-zinc-200'}`}>Green</button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <input type="number" value={bet} onChange={(e) => setBet(Math.max(1, Number(e.target.value || 0)))} className="w-28 rounded border border-line bg-black/60 px-3 py-2 text-center text-base text-zinc-100" />
        <button onClick={onSpin} disabled={spinning} className="rounded-full bg-amber-500 px-6 py-2 text-base text-zinc-100 disabled:opacity-60">Spin</button>
      </div>

      {result && (
        <p className={`mt-5 text-base ${result.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
          {result.ok ? `Ganhaste ${result.payout} coins!` : `Perdeste — saiu ${result.outcome}`}
          {` (número ${result.number})`}
        </p>
      )}
    </motion.div>
  )
}
