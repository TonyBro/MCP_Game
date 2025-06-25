import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class GameTemplateService {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../templates');
    this.knowledgeBase = {
      lastUpdated: new Date(),
      technologies: {
        'react-three-fiber': {
          version: 'latest',
          bestPractices: [
            'Use useFrame for animations',
            'Implement proper disposal of geometries and materials',
            'Use instances for repeated objects',
            'Optimize with LOD (Level of Detail)',
            'Use React.memo for performance',
          ],
        },
        'rapier': {
          version: 'latest',
          bestPractices: [
            'Use fixed timestep for physics',
            'Implement collision groups for optimization',
            'Use continuous collision detection for fast objects',
            'Properly configure mass and friction',
            'Use convex hulls for complex shapes',
          ],
        },
        'gsap': {
          version: 'latest',
          bestPractices: [
            'Use timeline for complex animations',
            'Kill animations on unmount',
            'Use gsap.context() for cleanup',
            'Optimize with will-change CSS',
            'Use RAF (requestAnimationFrame) sync',
          ],
        },
      },
      gamePatterns: {
        mobileFirst: [
          'Touch controls as primary input',
          'Viewport meta tag configuration',
          'Performance budgets for mobile',
          'Progressive enhancement',
          'Offline capability with PWA',
        ],
        performance: [
          'Texture atlasing',
          'Object pooling',
          'Frustum culling',
          'Draw call batching',
          'Asset lazy loading',
        ],
      },
    };
  }

  async updateKnowledge(topics) {
    // This would integrate with documentation APIs
    // For now, we'll simulate knowledge updates
    const updates = {};
    
    for (const topic of topics) {
      updates[topic] = {
        updated: new Date(),
        source: 'documentation',
        improvements: this.getTopicImprovements(topic),
      };
    }

    this.knowledgeBase.lastUpdated = new Date();
    return updates;
  }

  getTopicImprovements(topic) {
    const improvements = {
      'react-three-fiber': [
        'New hooks for performance optimization',
        'Better TypeScript support',
        'Improved React 18 concurrent features',
      ],
      'game-design': [
        'Mobile-first approach is now standard',
        'Focus on accessibility',
        'Progressive web app features',
      ],
      'performance': [
        'WebGPU support emerging',
        'Better mobile GPU optimization',
        'Improved asset streaming',
      ],
    };

    return improvements[topic] || ['General improvements'];
  }

  getAvailableTemplates() {
    return {
      platformer: {
        name: 'Platformer Game',
        description: 'Side-scrolling platform game with physics',
        features: ['Jump mechanics', 'Platform collision', 'Collectibles', 'Enemies'],
        difficulty: 'intermediate',
      },
      puzzle: {
        name: 'Puzzle Game',
        description: 'Grid-based puzzle game with matching mechanics',
        features: ['Grid system', 'Match detection', 'Score system', 'Combos'],
        difficulty: 'beginner',
      },
      'endless-runner': {
        name: 'Endless Runner',
        description: 'Infinite running game with obstacles',
        features: ['Auto-run', 'Obstacle generation', 'Score tracking', 'Power-ups'],
        difficulty: 'beginner',
      },
      'physics-based': {
        name: 'Physics Puzzle',
        description: 'Physics-based puzzle or sandbox game',
        features: ['Realistic physics', 'Object interaction', 'Puzzle elements'],
        difficulty: 'advanced',
      },
      arcade: {
        name: 'Arcade Game',
        description: 'Classic arcade-style game',
        features: ['Fast-paced action', 'Score attack', 'Power-ups', 'Combos'],
        difficulty: 'intermediate',
      },
    };
  }

  async generateGameTemplate(gameType, gameName, projectPath) {
    const template = this.getGameTemplate(gameType);
    const gameDir = path.join(projectPath, gameName.toLowerCase().replace(/\s+/g, '-'));

    // Create project structure
    await fs.ensureDir(gameDir);
    await fs.ensureDir(path.join(gameDir, 'src'));
    await fs.ensureDir(path.join(gameDir, 'src/components'));
    await fs.ensureDir(path.join(gameDir, 'src/screens'));
    await fs.ensureDir(path.join(gameDir, 'src/hooks'));
    await fs.ensureDir(path.join(gameDir, 'src/utils'));
    await fs.ensureDir(path.join(gameDir, 'src/assets'));
    await fs.ensureDir(path.join(gameDir, 'public'));

    // Generate files
    await this.createPackageJson(gameDir, gameName);
    await this.createViteConfig(gameDir);
    await this.createTsConfig(gameDir);
    await this.createTailwindConfig(gameDir);
    await this.createIndexHtml(gameDir, gameName);
    await this.createMainTsx(gameDir);
    await this.createApp(gameDir, gameType);
    await this.createGameScreens(gameDir, gameType);
    await this.createGameComponents(gameDir, gameType, template);
    
    return gameDir;
  }

  async createPackageJson(gameDir, gameName) {
    const packageJson = {
      name: gameName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.0.1',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        '@react-three/drei': '^9.88.0',
        '@react-three/fiber': '^8.15.0',
        '@react-three/rapier': '^1.2.0',
        'clsx': '^2.0.0',
        'gsap': '^3.12.0',
        'react': '^18.2.0',
        'react-confetti-explosion': '^2.1.2',
        'react-dom': '^18.2.0',
        'three': '^0.158.0',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@types/three': '^0.158.0',
        '@vitejs/plugin-react': '^4.2.0',
        'autoprefixer': '^10.4.0',
        'postcss': '^8.4.0',
        'tailwindcss': '^3.3.0',
        'typescript': '^5.3.0',
        'vite': '^5.0.0',
      },
    };

    await fs.writeJson(path.join(gameDir, 'package.json'), packageJson, { spaces: 2 });
  }

  async createViteConfig(gameDir) {
    const config = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@react-three/rapier'],
  },
})`;

    await fs.writeFile(path.join(gameDir, 'vite.config.ts'), config);
  }

  async createTsConfig(gameDir) {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    };

    await fs.writeJson(path.join(gameDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

    const tsConfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
      },
      include: ['vite.config.ts'],
    };

    await fs.writeJson(path.join(gameDir, 'tsconfig.node.json'), tsConfigNode, { spaces: 2 });
  }

  async createTailwindConfig(gameDir) {
    const config = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile(path.join(gameDir, 'tailwind.config.js'), config);

    const postcss = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    await fs.writeFile(path.join(gameDir, 'postcss.config.js'), postcss);
  }

  async createIndexHtml(gameDir, gameName) {
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${gameName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    await fs.writeFile(path.join(gameDir, 'index.html'), html);
  }

  async createMainTsx(gameDir) {
    const main = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    await fs.writeFile(path.join(gameDir, 'src/main.tsx'), main);

    const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  touch-action: none;
}`;

    await fs.writeFile(path.join(gameDir, 'src/index.css'), css);
  }

  async createApp(gameDir, gameType) {
    const app = `import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import StartScreen from './screens/StartScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'

type GameState = 'start' | 'playing' | 'gameOver'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)

  const handleStartGame = () => {
    setScore(0)
    setGameState('playing')
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)
    setGameState('gameOver')
  }

  const handlePlayAgain = () => {
    handleStartGame()
  }

  return (
    <div className="w-screen h-screen relative">
      {gameState === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 50 }}
          className="w-full h-full"
        >
          <Physics>
            <GameScreen onGameOver={handleGameOver} />
          </Physics>
        </Canvas>
      )}
      
      {gameState === 'gameOver' && (
        <GameOverScreen 
          score={score} 
          onPlayAgain={handlePlayAgain} 
        />
      )}
    </div>
  )
}

export default App`;

    await fs.writeFile(path.join(gameDir, 'src/App.tsx'), app);
  }

  async createGameScreens(gameDir, gameType) {
    // Start Screen
    const startScreen = `import React from 'react'

interface StartScreenProps {
  onStartGame: () => void
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-600">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-white mb-8 animate-pulse">
          Awesome Game
        </h1>
        <p className="text-xl text-white mb-8">
          Get ready for an amazing adventure!
        </p>
        <button
          onClick={onStartGame}
          className="px-8 py-4 bg-yellow-400 text-gray-800 font-bold text-xl rounded-full 
                     hover:bg-yellow-300 transform hover:scale-110 transition-all duration-200
                     shadow-lg active:scale-95"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

export default StartScreen`;

    await fs.writeFile(path.join(gameDir, 'src/screens/StartScreen.tsx'), startScreen);

    // Game Over Screen
    const gameOverScreen = `import React, { useEffect, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'

interface GameOverScreenProps {
  score: number
  onPlayAgain: () => void
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain }) => {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-pink-600">
      {showConfetti && (
        <ConfettiExplosion
          className="fixed bottom-[50vh] left-[50vw]"
          colors={['#FFD700', '#FF69B4', '#00CED1', '#32CD32']}
          particleCount={120}
          particleSize={20}
          duration={3500}
          zIndex={99999}
          force={2}
          height={'100vh'}
          width={1800}
        />
      )}
      
      <div className="text-center p-8 z-10">
        <h1 className="text-6xl font-bold text-white mb-4">
          Game Over!
        </h1>
        <div className="text-4xl text-yellow-300 mb-8">
          Score: {score}
        </div>
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 bg-green-400 text-gray-800 font-bold text-xl rounded-full 
                     hover:bg-green-300 transform hover:scale-110 transition-all duration-200
                     shadow-lg active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen`;

    await fs.writeFile(path.join(gameDir, 'src/screens/GameOverScreen.tsx'), gameOverScreen);

    // Game Screen (varies by game type)
    const gameScreen = this.getGameScreenTemplate(gameType);
    await fs.writeFile(path.join(gameDir, 'src/screens/GameScreen.tsx'), gameScreen);
  }

  getGameScreenTemplate(gameType) {
    const templates = {
      platformer: `import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import Player from '../components/Player'
import Platform from '../components/Platform'
import { useGameControls } from '../hooks/useGameControls'

interface GameScreenProps {
  onGameOver: (score: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0)
  const controls = useGameControls()

  // Simple platform positions
  const platforms = [
    { position: [0, -2, 0], size: [10, 0.5, 2] },
    { position: [5, 0, 0], size: [3, 0.5, 2] },
    { position: [-5, 1, 0], size: [3, 0.5, 2] },
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      <Player controls={controls} onFall={() => onGameOver(score)} />
      
      {platforms.map((platform, index) => (
        <Platform key={index} {...platform} />
      ))}
      
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  )
}

export default GameScreen`,

      puzzle: `import React, { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import PuzzleGrid from '../components/PuzzleGrid'
import { usePuzzleLogic } from '../hooks/usePuzzleLogic'

interface GameScreenProps {
  onGameOver: (score: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const { grid, score, makeMove, checkWinCondition } = usePuzzleLogic()

  const handleMove = (from: [number, number], to: [number, number]) => {
    makeMove(from, to)
    if (checkWinCondition()) {
      onGameOver(score)
    }
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <OrbitControls enablePan={false} />
      
      <PuzzleGrid 
        grid={grid} 
        onMove={handleMove}
      />
    </>
  )
}

export default GameScreen`,

      'endless-runner': `import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Runner from '../components/Runner'
import Obstacle from '../components/Obstacle'
import { useRunnerControls } from '../hooks/useRunnerControls'

interface GameScreenProps {
  onGameOver: (score: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0)
  const [obstacles, setObstacles] = useState<Array<{id: number, position: [number, number, number]}>>([])
  const controls = useRunnerControls()
  const speed = useRef(5)

  useFrame((state, delta) => {
    // Update score
    setScore(prev => prev + delta * 10)
    
    // Increase speed over time
    speed.current = Math.min(speed.current + delta * 0.1, 15)
    
    // Spawn obstacles
    if (Math.random() < 0.02) {
      setObstacles(prev => [...prev, {
        id: Date.now(),
        position: [Math.random() * 4 - 2, 0.5, 20]
      }])
    }
    
    // Move and cleanup obstacles
    setObstacles(prev => 
      prev.map(obs => ({
        ...obs,
        position: [obs.position[0], obs.position[1], obs.position[2] - speed.current * delta] as [number, number, number]
      }))
      .filter(obs => obs.position[2] > -5)
    )
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      <Runner 
        controls={controls} 
        onCollision={() => onGameOver(Math.floor(score))}
      />
      
      {obstacles.map(obstacle => (
        <Obstacle key={obstacle.id} position={obstacle.position} />
      ))}
      
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </>
  )
}

export default GameScreen`,

      'physics-based': `import React, { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import PhysicsObject from '../components/PhysicsObject'
import { usePhysicsInteraction } from '../hooks/usePhysicsInteraction'

interface GameScreenProps {
  onGameOver: (score: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0)
  const { objects, addObject, removeObject } = usePhysicsInteraction()

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <OrbitControls />
      
      {objects.map(obj => (
        <PhysicsObject 
          key={obj.id} 
          {...obj}
          onScore={(points) => setScore(prev => prev + points)}
        />
      ))}
      
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </>
  )
}

export default GameScreen`,

      arcade: `import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import PlayerShip from '../components/PlayerShip'
import Enemy from '../components/Enemy'
import Projectile from '../components/Projectile'
import { useArcadeControls } from '../hooks/useArcadeControls'

interface GameScreenProps {
  onGameOver: (score: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0)
  const [enemies, setEnemies] = useState<Array<{id: number, position: [number, number, number]}>>([])
  const [projectiles, setProjectiles] = useState<Array<{id: number, position: [number, number, number]}>>([])
  const controls = useArcadeControls()

  useFrame((state, delta) => {
    // Spawn enemies
    if (Math.random() < 0.02) {
      setEnemies(prev => [...prev, {
        id: Date.now(),
        position: [Math.random() * 10 - 5, 5, 0]
      }])
    }
    
    // Move enemies
    setEnemies(prev => 
      prev.map(enemy => ({
        ...enemy,
        position: [enemy.position[0], enemy.position[1] - delta * 2, enemy.position[2]] as [number, number, number]
      }))
      .filter(enemy => enemy.position[1] > -5)
    )
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <PlayerShip 
        controls={controls}
        onShoot={(position) => {
          setProjectiles(prev => [...prev, {
            id: Date.now(),
            position
          }])
        }}
      />
      
      {enemies.map(enemy => (
        <Enemy key={enemy.id} position={enemy.position} />
      ))}
      
      {projectiles.map(projectile => (
        <Projectile key={projectile.id} position={projectile.position} />
      ))}
    </>
  )
}

export default GameScreen`,
    };

    return templates[gameType] || templates.arcade;
  }

  async createGameComponents(gameDir, gameType, template) {
    // This would create game-specific components based on the template
    const componentsByType = {
      platformer: ['Player', 'Platform', 'Collectible'],
      puzzle: ['PuzzleGrid', 'PuzzlePiece', 'ScoreDisplay'],
      'endless-runner': ['Runner', 'Obstacle', 'PowerUp'],
      'physics-based': ['PhysicsObject', 'Launcher', 'Target'],
      arcade: ['PlayerShip', 'Enemy', 'Projectile'],
    };

    const components = componentsByType[gameType] || componentsByType.arcade;

    for (const component of components) {
      await this.createComponent(gameDir, component, gameType);
    }

    // Create hooks
    await this.createGameHooks(gameDir, gameType);
  }

  async createComponent(gameDir, componentName, gameType) {
    // Simplified component templates
    const template = `import React from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

interface ${componentName}Props {
  position?: [number, number, number]
}

const ${componentName}: React.FC<${componentName}Props> = ({ position = [0, 0, 0] }) => {
  return (
    <RigidBody position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  )
}

export default ${componentName}`;

    await fs.writeFile(
      path.join(gameDir, `src/components/${componentName}.tsx`),
      template
    );
  }

  async createGameHooks(gameDir, gameType) {
    const hooksByType = {
      platformer: 'useGameControls',
      puzzle: 'usePuzzleLogic',
      'endless-runner': 'useRunnerControls',
      'physics-based': 'usePhysicsInteraction',
      arcade: 'useArcadeControls',
    };

    const hookName = hooksByType[gameType] || 'useGameControls';
    const hookTemplate = `import { useEffect, useState } from 'react'

export const ${hookName} = () => {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(prev => ({ ...prev, forward: true }))
          break
        case 's':
        case 'arrowdown':
          setKeys(prev => ({ ...prev, backward: true }))
          break
        case 'a':
        case 'arrowleft':
          setKeys(prev => ({ ...prev, left: true }))
          break
        case 'd':
        case 'arrowright':
          setKeys(prev => ({ ...prev, right: true }))
          break
        case ' ':
          setKeys(prev => ({ ...prev, jump: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(prev => ({ ...prev, forward: false }))
          break
        case 's':
        case 'arrowdown':
          setKeys(prev => ({ ...prev, backward: false }))
          break
        case 'a':
        case 'arrowleft':
          setKeys(prev => ({ ...prev, left: false }))
          break
        case 'd':
        case 'arrowright':
          setKeys(prev => ({ ...prev, right: false }))
          break
        case ' ':
          setKeys(prev => ({ ...prev, jump: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}`;

    await fs.writeFile(
      path.join(gameDir, `src/hooks/${hookName}.ts`),
      hookTemplate
    );
  }

  getGameTemplate(gameType) {
    // Return specific template configuration based on game type
    return {
      type: gameType,
      structure: {
        components: this.getComponentsForType(gameType),
        hooks: this.getHooksForType(gameType),
        assets: this.getAssetsForType(gameType),
      },
    };
  }

  getComponentsForType(gameType) {
    const components = {
      platformer: ['Player', 'Platform', 'Enemy', 'Collectible'],
      puzzle: ['Grid', 'Piece', 'Timer', 'ScoreBoard'],
      'endless-runner': ['Runner', 'Obstacle', 'PowerUp', 'Background'],
      'physics-based': ['PhysicsObject', 'Constraint', 'Force', 'Trigger'],
      arcade: ['Ship', 'Enemy', 'Bullet', 'PowerUp'],
    };
    return components[gameType] || components.arcade;
  }

  getHooksForType(gameType) {
    const hooks = {
      platformer: ['usePlayerMovement', 'useCollisions', 'useScore'],
      puzzle: ['usePuzzleState', 'useTimer', 'useMoves'],
      'endless-runner': ['useSpeed', 'useObstacles', 'useScore'],
      'physics-based': ['usePhysics', 'useInteractions', 'useConstraints'],
      arcade: ['useControls', 'useProjectiles', 'useEnemies'],
    };
    return hooks[gameType] || hooks.arcade;
  }

  getAssetsForType(gameType) {
    const assets = {
      platformer: ['textures/player.png', 'textures/platform.png'],
      puzzle: ['textures/pieces.png', 'sounds/match.mp3'],
      'endless-runner': ['models/runner.glb', 'textures/road.jpg'],
      'physics-based': ['textures/wood.jpg', 'textures/metal.jpg'],
      arcade: ['sprites/ship.png', 'sounds/laser.mp3'],
    };
    return assets[gameType] || assets.arcade;
  }
} 