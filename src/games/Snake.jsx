import { useState, useEffect, useRef } from 'react'

export function SnakeGame() {
  const canvasRef = useRef(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const tileSize = 20
    const gridWidth = canvas.width / tileSize
    const gridHeight = canvas.height / tileSize

    const drawGame = () => {
      const state = gameStateRef.current
      
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

      // Snake
      state.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00'
        ctx.fillRect(segment.x * tileSize + 2, segment.y * tileSize + 2, tileSize - 4, tileSize - 4)
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        ctx.strokeRect(segment.x * tileSize + 2, segment.y * tileSize + 2, tileSize - 4, tileSize - 4)
      })

      // Food
      ctx.fillStyle = '#ff0055'
      ctx.beginPath()
      ctx.arc(state.food.x * tileSize + tileSize / 2, state.food.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
    }

    const updateGame = () => {
      const state = gameStateRef.current
      if (state.gameOver) return

      state.direction = state.nextDirection

      const head = { ...state.snake[0] }
      head.x += state.direction.x
      head.y += state.direction.y

      // Wrap around
      if (head.x < 0) head.x = gridWidth - 1
      if (head.x >= gridWidth) head.x = 0
      if (head.y < 0) head.y = gridHeight - 1
      if (head.y >= gridHeight) head.y = 0

      // Check collision with self
      if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        state.gameOver = true
        setGameRunning(false)
        return
      }

      state.snake.unshift(head)

      // Check food collision
      if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10
        setScore(state.score)
        state.food = {
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight),
        }
      } else {
        state.snake.pop()
      }

      drawGame()
    }

    const handleKeyDown = (e) => {
      const state = gameStateRef.current
      switch (e.key) {
        case 'ArrowUp':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 }
          break
        case 'ArrowDown':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
          if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 }
          break
        case 'ArrowRight':
          if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    if (gameRunning) {
      drawGame()
      const interval = setInterval(updateGame, 100)
      return () => {
        clearInterval(interval)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameRunning])

  const startGame = () => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
    }
    setScore(0)
    setGameRunning(true)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '3px solid #00ff00', display: 'block', margin: '20px auto', imageRendering: 'pixelated' }}
      />
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-green-400">Score: {score}</div>
        <button
          onClick={startGame}
          disabled={gameRunning}
          className="bg-green-500 text-black px-6 py-2 rounded font-bold hover:bg-green-400 disabled:opacity-50"
        >
          {gameRunning ? '🎮 Jogando...' : '▶ Começar'}
        </button>
        <p className="text-xs text-gray-400">⌨️ Setas = Movimento</p>
      </div>
    </div>
  )
}
