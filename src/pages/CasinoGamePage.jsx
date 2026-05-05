import { useParams, useNavigate } from 'react-router-dom'
import { CoinFlip } from '../components/casino/CoinFlip'
import { Slots } from '../components/casino/Slots'
import { Roulette } from '../components/casino/Roulette'

export function CasinoGamePage() {
  const { mode } = useParams()
  const navigate = useNavigate()

  let Component = null
  if (mode === 'coinflip') Component = CoinFlip
  else if (mode === 'slots') Component = Slots
  else if (mode === 'roulette') Component = Roulette

  if (!Component) {
    return <div className="p-6 text-zinc-200">Modo de casino desconhecido.</div>
  }

  const modeTitle =
    mode === 'coinflip' ? 'Coin Flip Arena' :
    mode === 'slots' ? 'Slots Arena' :
    mode === 'roulette' ? 'Roulette Arena' :
    'Casino Arena'

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
      <button className="mb-4 text-sm text-accent" onClick={() => navigate(-1)}>
        ← Voltar
      </button>
      <section className="rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
        <p className="font-arcade text-[9px] uppercase tracking-[0.24em] text-accent">Casino Mode</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-4xl">{modeTitle}</h1>
        <div className="mt-6">
          <Component />
        </div>
      </section>
    </main>
  )
}
