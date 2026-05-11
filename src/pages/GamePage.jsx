import { useParams, useNavigate } from 'react-router-dom'
import { games } from '../data'
import { SnakeGame, PongGame, TetrisGame, PacmanGame } from '../games'
import { useEconomyStore } from '../store'
import { triggerCoinConfetti, playCoinSound } from '../effects'

const gameComponents = {
  SnakeGame,
  PongGame,
  TetrisGame,
  PacmanGame,
}

export function GamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addCoins = useEconomyStore((s) => s.addCoins)

  const game = games.find((g) => String(g.id) === String(id))
  if (!game) {
    return (
      <div className="p-6 text-zinc-200">Jogo não encontrado.</div>
    )
  }

  const handlePlay = () => {
    addCoins(game.reward)
    playCoinSound()
    triggerCoinConfetti()
  }

  return (
    <div className="p-6">
      <button className="mb-4 text-sm text-accent" onClick={() => navigate(-1)}>
        ← Voltar
      </button>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-2">
          {game.type === 'custom' ? (
            <div className="rounded-xl border border-line overflow-hidden bg-black/60">
              <iframe 
                src="/games/flappybird/FlappyBird.html" 
                width="800" 
                height="600" 
                frameBorder="0"
              />
            </div>
          ) : game.type === 'js' ? (
            <div className="rounded-xl border border-line overflow-hidden bg-black/60 p-4">
              {gameComponents[game.component] && 
                (() => {
                  const GameComponent = gameComponents[game.component]
                  return <GameComponent />
                })()
              }
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">{game.title}</h2>
          <p className="text-sm text-zinc-400">{game.description}</p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handlePlay}
              className="rounded-full bg-accent px-4 py-2 font-semibold text-black hover:bg-opacity-90 transition"
            >
              Jogar (+{game.reward} coins)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
