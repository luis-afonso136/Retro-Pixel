import flappbird from './assets/previews/Flappy_Bird_logo.png'
import gridTacticsPreview from './assets/previews/grid-tactics.svg'
import voidJumperPreview from './assets/previews/void-jumper.svg'
import rogueKernelPreview from './assets/previews/rogue-kernel.svg'
import bitArenaPreview from './assets/previews/bit-arena.svg'
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
    title: 'Grid Tactics',
    genre: 'Strategy',
    description: 'Micro-turn tactical puzzle with fast sessions and combo streaks.',
    reward: 36,
    preview: gridTacticsPreview,
  },
  {
    id: '3',
    title: 'Void Jumper',
    genre: 'Platform',
    description: 'Precision jumps over void lanes in a minimalist motion field.',
    reward: 18,
    preview: voidJumperPreview,
  },
  {
    id: '4',
    title: 'Rogue Kernel',
    genre: 'Roguelite',
    description: 'Room-by-room runs with adaptive enemy logic and tiny loot drops.',
    reward: 42,
    preview: rogueKernelPreview,
  },
  {
    id: '5',
    title: 'Bit Arena',
    genre: 'PvE',
    description: 'Solo challenge waves tuned for low-latency reaction gameplay.',
    reward: 28,
    preview: bitArenaPreview,
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
