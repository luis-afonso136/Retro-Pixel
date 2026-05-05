import confetti from 'canvas-confetti'

export function playCoinSound() {
  if (typeof window === 'undefined') {
    return
  }

  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) {
    return
  }

  const audioContext = new Context()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.06)

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.12)

  oscillator.onended = () => {
    audioContext.close()
  }
}

export function triggerCoinConfetti(smallBurst = false) {
  confetti({
    particleCount: smallBurst ? 12 : 18,
    spread: smallBurst ? 36 : 48,
    startVelocity: 20,
    gravity: 1.12,
    scalar: 0.68,
    ticks: 110,
    colors: ['#FFD700', '#FFF4B0', '#FFFFFF'],
    origin: { y: 0.75 },
  })
}
