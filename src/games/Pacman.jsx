import { useState, useEffect, useRef } from 'react'

export function PacmanGame() {
  const canvasRef = useRef(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({
    pacmanX: 5,
    pacmanY: 5,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    pellets: [],
    score: 0,
    gameOver: false,
    ghostX: 15,
    ghostY: 15,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameRunning) return

    const ctx = canvas.getContext('2d')
    const tileSize = 30
    const gridWidth = canvas.width / tileSize
    const gridHeight = canvas.height / tileSize
    const state = gameStateRef.current

    // Initialize pellets
    if (state.pellets.length === 0) {
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (Math.random() > 0.15) {
            state.pellets.push({ x, y })
          }
        }
      }
    }

    const drawGame = () => {
      // Background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = '#2a2a4e'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath()
        ctx.moveTo(i * tileSize, 0)
        ctx.lineTo(i * tileSize, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i <= gridHeight; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * tileSize)
        ctx.lineTo(canvas.width, i * tileSize)
        ctx.stroke()
      }

      // Pellets
      ctx.fillStyle = '#ffff88'
      state.pellets.forEach(pellet => {
        ctx.fillRect(pellet.x * tileSize + 12, pellet.y * tileSize + 12, 6, 6)
      })

      // Pacman
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      const pacX = state.pacmanX * tileSize + tileSize / 2
      const pacY = state.pacmanY * tileSize + tileSize / 2
      const angle = Date.now() * 0.01
      ctx.arc(pacX, pacY, tileSize / 2 - 3, angle, Math.PI * 2 - angle)
      ctx.lineTo(pacX, pacY)
      ctx.fill()

      // Ghost
      ctx.fillStyle = '#ff0055'
      ctx.fillRect(state.ghostX * tileSize + 2, state.ghostY * tileSize + 2, tileSize - 4, tileSize - 4)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(state.ghostX * tileSize + 5, state.ghostY * tileSize + 5, 5, 5)
      ctx.fillRect(state.ghostX * tileSize + tileSize - 10, state.ghostY * tileSize + 5, 5, 5)
    }

    const updateGame = () => {
      const state = gameStateRef.current
      if (state.gameOver) return

      state.direction = state.nextDirection

      let newX = state.pacmanX + state.direction.x
      let newY = state.pacmanY + state.direction.y

      // Wrap around
      if (newX < 0) newX = gridWidth - 1
      if (newX >= gridWidth) newX = 0
      if (newY < 0) newY = gridHeight - 1
      if (newY >= gridHeight) newY = 0

      state.pacmanX = newX
      state.pacmanY = newY

      // Check pellet collision
      const pelletIndex = state.pellets.findIndex(p => p.x === state.pacmanX && p.y === state.pacmanY)
      if (pelletIndex !== -1) {
        state.pellets.splice(pelletIndex, 1)
        state.score += 10
        setScore(state.score)
      }

      // Ghost AI
      if (Math.random() > 0.7) {
        const dirs = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 },
        ]
        const randomDir = dirs[Math.floor(Math.random() * dirs.length)]
        state.ghostX += randomDir.x
        state.ghostY += randomDir.y
        if (state.ghostX < 0) state.ghostX = gridWidth - 1
        if (state.ghostX >= gridWidth) state.ghostX = 0
        if (state.ghostY < 0) state.ghostY = gridHeight - 1
        if (state.ghostY >= gridHeight) state.ghostY = 0
      }

      // Check ghost collision
      if (state.pacmanX === state.ghostX && state.pacmanY === state.ghostY) {
        state.gameOver = true
        setGameRunning(false)
      }

      // Check win
      if (state.pellets.length === 0) {
        alert(`Ganhaste! Score: ${state.score}`)
        setGameRunning(false)
      }

      drawGame()
    }

    const handleKeyDown = (e) => {
      const state = gameStateRef.current
      switch (e.key) {
        case 'ArrowUp':
          state.nextDirection = { x: 0, y: -1 }
          break
        case 'ArrowDown':
          state.nextDirection = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
          state.nextDirection = { x: -1, y: 0 }
          break
        case 'ArrowRight':
          state.nextDirection = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    drawGame()

    const interval = setInterval(updateGame, 200)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameRunning])

  const startGame = () => {
    gameStateRef.current = {
      pacmanX: 5,
      pacmanY: 5,
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      pellets: [],
      score: 0,
      gameOver: false,
      ghostX: 15,
      ghostY: 15,
    }
    setScore(0)
    setGameRunning(true)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        width={600}
        height={420}
        style={{ border: '3px solid #ffff00', display: 'block', margin: '20px auto', imageRendering: 'pixelated' }}
      />
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-yellow-400">Score: {score}</div>
        <button
          onClick={startGame}
          disabled={gameRunning}
          className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-400 disabled:opacity-50"
        >
          {gameRunning ? '🎮 Jogando...' : '▶ Começar'}
        </button>
        <p className="text-xs text-gray-400">⌨️ Setas = Movimento | Começa pellets!</p>
      </div>
    </div>
  )
}
