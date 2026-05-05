import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ConfirmModal } from './components/ui/ConfirmModal'
import { BetResultPopup } from './components/ui/BetResultPopup'
import { games, shopItems } from './data'
import { triggerCoinConfetti, playCoinSound } from './effects'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { CasinoPage } from './pages/CasinoPage'
import { CasinoGamePage } from './pages/CasinoGamePage'
import { GamePage } from './pages/GamePage'
import { useEconomyStore } from './store'

function App() {
  const location = useLocation()

  const {
    coins,
    level,
    isCoinFlicker,
    addCoins,
    buyGame,
  } = useEconomyStore()

  const handlePlay = useCallback(
    (game) => {
      addCoins(game.reward)
      playCoinSound()
      triggerCoinConfetti(false)
    },
    [addCoins],
  )

  const handleBuy = useCallback(
    (item) => {
      const result = buyGame(item)
      if (!result.ok) {
        return
      }

      triggerCoinConfetti(true)
    },
    [buyGame],
  )

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar
        coins={coins}
        level={level}
        isCoinFlicker={isCoinFlicker}
      />
      <ConfirmModal />
      <BetResultPopup />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage games={games} onPlay={handlePlay} />} />
          <Route path="/loja" element={<ShopPage items={shopItems} onBuy={handleBuy} />} />
          <Route path="/casino" element={<CasinoPage />} />
          <Route path="/casino/:mode" element={<CasinoGamePage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
