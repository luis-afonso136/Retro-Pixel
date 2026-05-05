import { useMemo } from 'react'
import { useEconomyStore } from '../../store'

export function BetHistory() {
  const betHistory = useEconomyStore((s) => s.betHistory)
  const simulate = useEconomyStore((s) => s.simulateMode)
  const toggleSimulate = useEconomyStore((s) => s.toggleSimulate)
  const clearHistory = useEconomyStore((s) => s.clearHistory)

  const recent = useMemo(() => betHistory.slice(0, 12), [betHistory])

  return (
    <aside className="rounded-2xl border border-line bg-surface/80 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-zinc-100">Bet History</h4>
        <div className="flex items-center gap-2">
          <button onClick={toggleSimulate} className={`text-xs rounded px-2 py-1 ${simulate ? 'bg-amber-500 text-zinc-100' : 'border border-line text-zinc-300'}`}>{simulate ? 'Simulação' : 'Simular'}</button>
          <button onClick={clearHistory} className="text-xs rounded border border-line px-2 py-1 text-zinc-300">Limpar</button>
        </div>
      </div>

      <ul className="mt-3 max-h-64 overflow-auto text-sm text-zinc-300">
        {recent.length === 0 && <li className="text-zinc-500">Sem apostas recentes</li>}
        {recent.map((b, i) => (
          <li key={i} className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">{new Date(b.time).toLocaleTimeString()}</div>
              <div className="text-sm">{b.mode} — {b.win ? 'Win' : 'Lose'}</div>
              <div className="text-xs text-zinc-400">{b.amount} → {b.payout}</div>
            </div>
            <div className={`text-sm ${b.win ? 'text-emerald-400' : 'text-rose-400'}`}>{b.payout}</div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
