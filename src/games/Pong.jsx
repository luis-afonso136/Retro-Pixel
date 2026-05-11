import { useState, useEffect, useRef } from 'react'

export function PongGame() {
  const canvasRef = useRef(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const gameStateRef = useRef({
    ballX: 200,
    ballY: 150,
    ballSpeedX: 4,
    ballSpeedY: 4,
    paddleY: 150,
    computerPaddleY: 150,
    playerScore: 0,
    computerScore: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameRunning) return

    const ctx = canvas.getContext('2d')
    const state = gameStateRef.current
    const paddleHeight = 60
    const paddleWidth = 10

    const draw = () => {
      // Background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center line
      ctx.strokeStyle = '#00ff00'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Paddles
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(10, state.paddleY, paddleWidth, paddleHeight)
      ctx.fillRect(canvas.width - 20, state.computerPaddleY, paddleWidth, paddleHeight)

      // Ball
      ctx.fillStyle = '#ff0055'
      ctx.beginPath()
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Score
      ctx.fillStyle = '#00ff00'
      ctx.font = 'bold 24px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(state.playerScore, canvas.width / 4, 40)
      ctx.fillText(state.computerScore, (canvas.width * 3) / 4, 40)
    }

    const update = () => {
      const state = gameStateRef.current

      // Ball movement
      state.ballX += state.ballSpeedX
      state.ballY += state.ballSpeedY

      // Ball collision with top/bottom
      if (state.ballY - 5 < 0 || state.ballY + 5 > canvas.height) {
        state.ballSpeedY *= -1
      }

      // Ball collision with paddles
      if (
        state.ballX - 5 < 20 &&
        state.ballY > state.paddleY &&
        state.ballY < state.paddleY + paddleHeight
      ) {
        state.ballSpeedX *= -1
        state.ballX = 20
      }

      if (
        state.ballX + 5 > canvas.width - 20 &&
        state.ballY > state.computerPaddleY &&
        state.ballY < state.computerPaddleY + paddleHeight
      ) {
        state.ballSpeedX *= -1
        state.ballX = canvas.width - 20
      }

      // Ball out of bounds
      if (state.ballX < 0) {
        state.computerScore++
        resetBall()
      }
      if (state.ballX > canvas.width) {
        state.playerScore++
        resetBall()
      }

      // Computer AI
      const computerCenter = state.computerPaddleY + paddleHeight / 2
      if (computerCenter < state.ballY - 35) {
        state.computerPaddleY += 3
      } else if (computerCenter > state.ballY + 35) {
        state.computerPaddleY -= 3
      }

      state.computerPaddleY = Math.max(0, Math.min(state.computerPaddleY, canvas.height - paddleHeight))

      setScore({ player: state.playerScore, computer: state.computerScore })
      draw()
    }

    const resetBall = () => {
      const state = gameStateRef.current
      state.ballX = canvas.width / 2
      state.ballY = canvas.height / 2
      state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4
      state.ballSpeedY = (Math.random() - 0.5) * 4
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mouseY = e.clientY - rect.top
      gameStateRef.current.paddleY = Math.max(0, Math.min(mouseY - 30, canvas.height - 60))
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    draw()

    const interval = setInterval(update, 1000 / 60)

    return () => {
      clearInterval(interval)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gameRunning])

  const startGame = () => {
    gameStateRef.current = {
      ballX: 200,
      ballY: 150,
      ballSpeedX: 4,
      ballSpeedY: 4,
      paddleY: 150,
      computerPaddleY: 150,
      playerScore: 0,
      computerScore: 0,
    }
    setScore({ player: 0, computer: 0 })
    setGameRunning(true)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ border: '3px solid #00ff00', display: 'block', margin: '20px auto', cursor: 'none' }}
      />
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-green-400">
          {score.player} - {score.computer}
        </div>
        <button
          onClick={startGame}
          disabled={gameRunning}
          className="bg-green-500 text-black px-6 py-2 rounded font-bold hover:bg-green-400 disabled:opacity-50"
        >
          {gameRunning ? '🎮 Jogando...' : '▶ Começar'}
        </button>
        <p className="text-xs text-gray-400">🖱️ Mexe o rato para mover a raquete</p>
      </div>
    </div>
  )
}
