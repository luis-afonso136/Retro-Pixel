import flappbird from './assets/previews/Flappy_Bird_logo.png'
import pong from './assets/previews/pong.png'
import pacman from './assets/previews/pacman.svg'
import snake from './assets/previews/snake.png'
import tetris from './assets/previews/tetris-logo.png'
import tapeRunnerPreview from './assets/previews/tape-runner.svg'

export const games = [
  {
    id: '1',
    title: 'Flappy Bird',
    genre: 'Arcade',
    description: 'Short burst drift runs with sharp turns and high-score loops.',
    reward: 24,
    preview: flappbird,
  },
  {
    id: '2',
    title: 'Pong',
    genre: 'Arcade',
    description: 'Classic two-player paddle game with simple controls and fast-paced action.',
    reward: 36,
    preview: pong,
  },
  {
    id: '3',
    title: 'Pac-Man',
    genre: 'Platform',
    description: 'Precision jumps over void lanes in a minimalist motion field.',
    reward: 18,
    preview: pacman,
  },
  {
    id: '4',
    title: 'Snake',
    genre: 'Roguelite',
    description: 'Room-by-room runs with adaptive enemy logic and tiny loot drops.',
    reward: 42,
    preview: snake,
  },
  {
    id: '5',
    title: 'Tetris',
    genre: 'PvE',
    description: 'Solo challenge waves tuned for low-latency reaction gameplay.',
    reward: 28,
    preview: tetris,
  },
  {
    id: '6',
    title: 'Tape Runner',
    genre: 'Endless',
    description: 'Infinite sprint with escalating speed and rhythm gate moments.',
    reward: 20,
    preview: tapeRunnerPreview,
  },
]

export const shopItems = [
  {
    id: '1',
    title: 'Neon Drifter',
    genre: 'Arcade Racer',
    description: 'Short burst drift runs with sharp turns and high-score loops.',
    price: 120,
    type: 'game',
  },
  {
    id: '2',
    title: 'Grid Tactics',
    genre: 'Strategy',
    description: 'Micro-turn tactical puzzle with fast sessions and combo streaks.',
    price: 160,
    type: 'game',
  },
  {
    id: '3',
    title: 'Void Jumper',
    genre: 'Platform',
    description: 'Precision jumps over void lanes in a minimalist motion field.',
    price: 110,
    type: 'game',
  },
  {
    id: '4',
    title: 'Rogue Kernel',
    genre: 'Roguelite',
    description: 'Room-by-room runs with adaptive enemy logic and tiny loot drops.',
    price: 190,
    type: 'game',
  },
]
