import { useState, useEffect, useRef } from 'react'

const COLORS = ['#00ff00', '#00ffff', '#ff0055', '#ffff00', '#ff6600', '#0099ff', '#ff00ff']
const SHAPES = [
  [[1, 1], [1, 1]], // O
  [[1], [1], [1], [1]], // I
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 1, 1], [0, 1, 0]], // T
]

export function TetrisGame() {
  const canvasRef = useRef(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({
    board: Array(20).fill(null).map(() => Array(10).fill(0)),
    currentPiece: null,
    currentX: 0,
    currentY: 0,
    score: 0,
    gameOver: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameRunning) return

    const ctx = canvas.getContext('2d')
    const tileSize = 30
    const state = gameStateRef.current

    const spawnPiece = () => {
      const shapeIndex = Math.floor(Math.random() * SHAPES.length)
      state.currentPiece = SHAPES[shapeIndex]
      state.currentX = Math.floor(10 / 2 - state.currentPiece[0].length / 2)
      state.currentY = 0
      state.currentColor = COLORS[shapeIndex]

      // Check game over
      if (canPlacePiece(state.currentPiece, state.currentX, state.currentY)) {
        return true
      }
      return false
    }

    const canPlacePiece = (piece, x, y) => {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col]) {
            const boardX = x + col
            const boardY = y + row
            if (boardX < 0 || boardX >= 10 || boardY < 0 || boardY >= 20) {
              if (boardY >= 20) return false
              if (boardX < 0 || boardX >= 10) return false
            }
            if (boardY >= 0 && state.board[boardY][boardX]) {
              return false
            }
          }
        }
      }
      return true
    }

    const drawGame = () => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw board
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (state.board[row][col]) {
            ctx.fillStyle = state.board[row][col]
            ctx.fillRect(col * tileSize + 1, row * tileSize + 1, tileSize - 2, tileSize - 2)
            ctx.strokeStyle = '#00ff00'
            ctx.lineWidth = 1
            ctx.strokeRect(col * tileSize + 1, row * tileSize + 1, tileSize - 2, tileSize - 2)
          }
        }
      }

      // Draw current piece
      if (state.currentPiece) {
        ctx.fillStyle = state.currentColor
        for (let row = 0; row < state.currentPiece.length; row++) {
          for (let col = 0; col < state.currentPiece[row].length; col++) {
            if (state.currentPiece[row][col]) {
              const x = state.currentX + col
              const y = state.currentY + row
              if (y >= 0) {
                ctx.fillRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2)
                ctx.strokeStyle = '#00ff00'
                ctx.lineWidth = 1
                ctx.strokeRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2)
              }
            }
          }
        }
      }

      // Draw grid
      ctx.strokeStyle = '#2a2a4e'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath()
        ctx.moveTo(i * tileSize, 0)
        ctx.lineTo(i * tileSize, 20 * tileSize)
        ctx.stroke()
      }
    }

    const placePiece = () => {
      const state = gameStateRef.current
      for (let row = 0; row < state.currentPiece.length; row++) {
        for (let col = 0; col < state.currentPiece[row].length; col++) {
          if (state.currentPiece[row][col]) {
            const boardY = state.currentY + row
            const boardX = state.currentX + col
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              state.board[boardY][boardX] = state.currentColor
            }
          }
        }
      }
      clearLines()
    }

    const clearLines = () => {
      const state = gameStateRef.current
      let linesCleared = 0
      for (let row = 19; row >= 0; row--) {
        if (state.board[row].every(cell => cell)) {
          state.board.splice(row, 1)
          state.board.unshift(Array(10).fill(0))
          linesCleared++
        }
      }
      if (linesCleared > 0) {
        state.score += linesCleared * 100
        setScore(state.score)
      }
    }

    const update = () => {
      const state = gameStateRef.current
      if (!state.currentPiece) {
        if (!spawnPiece()) {
          state.gameOver = true
          setGameRunning(false)
          return
        }
      }

      if (canPlacePiece(state.currentPiece, state.currentX, state.currentY + 1)) {
        state.currentY++
      } else {
        placePiece()
        state.currentPiece = null
      }

      drawGame()
    }

    const handleKeyDown = (e) => {
      const state = gameStateRef.current
      if (!state.currentPiece) return

      switch (e.key) {
        case 'ArrowLeft':
          if (canPlacePiece(state.currentPiece, state.currentX - 1, state.currentY)) {
            state.currentX--
          }
          break
        case 'ArrowRight':
          if (canPlacePiece(state.currentPiece, state.currentX + 1, state.currentY)) {
            state.currentX++
          }
          break
        case 'ArrowDown':
          if (canPlacePiece(state.currentPiece, state.currentX, state.currentY + 1)) {
            state.currentY++
            state.score += 1
            setScore(state.score)
          }
          break
      }
    }

    spawnPiece()
    window.addEventListener('keydown', handleKeyDown)
    drawGame()

    const interval = setInterval(update, 500)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameRunning])

  const startGame = () => {
    gameStateRef.current = {
      board: Array(20).fill(null).map(() => Array(10).fill(0)),
      currentPiece: null,
      currentX: 0,
      currentY: 0,
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
        width={300}
        height={600}
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
        <p className="text-xs text-gray-400">⌨️ Setas = Mover | ⬇️ = Cair mais rápido</p>
      </div>
    </div>
  )
}
