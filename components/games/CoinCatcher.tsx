'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  onComplete: (score: number, seeds: number) => void
  childAge: number
}

type Coin = { x: number; y: number; speed: number; value: number; id: number }

export default function CoinCatcher({ onComplete, childAge }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const coinsRef   = useRef<Coin[]>([])
  const basketRef  = useRef({ x: 150, width: 80 })
  const scoreRef   = useRef(0)
  const frameRef   = useRef(0)
  const tickRef    = useRef(0)
  const livesRef   = useRef(3)
  const runningRef = useRef(false)

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [displayScore, setDisplayScore]   = useState(0)
  const [displayLives, setDisplayLives]   = useState(3)
  const [displayTime, setDisplayTime]     = useState(30)
  const timeRef = useRef(30)

  const spawnCoin = useCallback((canvasW: number) => {
    const value = Math.random() < 0.15 ? 10 : Math.random() < 0.35 ? 5 : 1
    coinsRef.current.push({
      x: Math.random() * (canvasW - 40) + 20,
      y: -20,
      speed: 2 + Math.random() * (childAge < 9 ? 1.5 : 3),
      value,
      id: Date.now() + Math.random(),
    })
  }, [childAge])

  const startGame = useCallback(() => {
    coinsRef.current   = []
    scoreRef.current   = 0
    livesRef.current   = 3
    timeRef.current    = 30
    tickRef.current    = 0
    runningRef.current = true
    setDisplayScore(0); setDisplayLives(3); setDisplayTime(30)
    setGameState('playing')
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height

    // Mouse/touch move
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX
      if (clientX === undefined) return
      // Pointer coordinates are CSS pixels; the canvas game runs in intrinsic pixels.
      const canvasX = (clientX - rect.left) * (W / rect.width)
      basketRef.current.x = Math.min(Math.max(canvasX - basketRef.current.width / 2, 0), W - basketRef.current.width)
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove as EventListener, { passive: true })

    // Timer
    const timer = setInterval(() => {
      if (!runningRef.current) return
      timeRef.current -= 1
      setDisplayTime(timeRef.current)
      if (timeRef.current <= 0) {
        runningRef.current = false
        setGameState('done')
        const seeds = Math.min(50, Math.floor(scoreRef.current / 2))
        onComplete(scoreRef.current, seeds)
      }
    }, 1000)

    const loop = () => {
      if (!runningRef.current) return
      tickRef.current++

      // Spawn every ~60 frames
      if (tickRef.current % Math.max(20, 60 - Math.floor((30 - timeRef.current) * 1.2)) === 0) {
        spawnCoin(W)
      }

      ctx.clearRect(0, 0, W, H)

      // Background grid
      ctx.fillStyle = '#F0FBF4'
      ctx.fillRect(0, 0, W, H)

      // Draw coins
      coinsRef.current = coinsRef.current.filter(coin => {
        coin.y += coin.speed
        const bx = basketRef.current.x, bw = basketRef.current.width

        if (coin.y > H - 55 && coin.y < H - 30 && coin.x > bx && coin.x < bx + bw) {
          // Caught
          scoreRef.current += coin.value
          setDisplayScore(scoreRef.current)
          return false
        }
        if (coin.y > H + 10) {
          // Missed
          livesRef.current = Math.max(0, livesRef.current - 1)
          setDisplayLives(livesRef.current)
          if (livesRef.current <= 0) {
            runningRef.current = false
            setGameState('done')
            const seeds = Math.min(50, Math.floor(scoreRef.current / 2))
            onComplete(scoreRef.current, seeds)
          }
          return false
        }

        // Draw coin
        const colors: Record<number, string> = { 1: '#FBBF24', 5: '#C0C0C0', 10: '#F59E0B' }
        ctx.beginPath()
        ctx.arc(coin.x, coin.y, coin.value === 10 ? 16 : coin.value === 5 ? 13 : 10, 0, Math.PI * 2)
        ctx.fillStyle   = colors[coin.value] ?? '#FBBF24'
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.lineWidth   = 1
        ctx.stroke()
        ctx.fillStyle = 'rgba(0,0,0,0.4)'
        ctx.font      = `bold ${coin.value === 10 ? 10 : 9}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(`+${coin.value}`, coin.x, coin.y + 3.5)
        return true
      })

      // Draw basket
      const bx = basketRef.current.x, bw = basketRef.current.width
      ctx.fillStyle   = '#2D6A4F'
      ctx.beginPath()
      ctx.roundRect(bx, H - 50, bw, 24, 8)
      ctx.fill()
      ctx.fillStyle = '#40916C'
      ctx.fillText('🧺', bx + bw / 2, H - 33)

      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(timer)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove as EventListener)
    }
  }, [gameState, onComplete, spawnCoin])

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {gameState === 'idle' && (
        <div className="text-center">
          <div className="text-5xl mb-3">🪙</div>
          <h3 className="font-black text-xl text-bark-600 mb-2">Coin Catcher!</h3>
          <p className="text-bark-400 text-sm mb-5 max-w-xs">Move your mouse (or finger on mobile) to catch falling coins. Don't let them hit the ground!</p>
          <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
            <div className="bg-yellow-50 rounded-xl p-2"><div className="text-xl mb-1">🟡</div>+1 Seed</div>
            <div className="bg-gray-50 rounded-xl p-2"><div className="text-xl mb-1">⚪</div>+5 Seeds</div>
            <div className="bg-amber-50 rounded-xl p-2"><div className="text-xl mb-1">🟠</div>+10 Seeds</div>
          </div>
          <Button size="lg" onClick={startGame}>Start Game!</Button>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="flex items-center gap-6 text-sm font-bold text-bark-600">
            <span>🌱 {displayScore}</span>
            <span>❤️ {'❤️'.repeat(displayLives)}{'🖤'.repeat(3 - displayLives)}</span>
            <span>⏱️ {displayTime}s</span>
          </div>
          <canvas
            ref={canvasRef}
            width={340}
            height={420}
            className="rounded-2xl border-2 border-sprout-200 cursor-none touch-none"
          />
        </>
      )}

      {gameState === 'done' && (
        <div className="text-center py-4">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="font-black text-2xl text-bark-600 mb-1">Score: {displayScore}</h3>
          <p className="text-sprout-600 font-bold mb-4">+{Math.min(50, Math.floor(displayScore / 2))} Seeds earned!</p>
          <Button onClick={startGame} variant="secondary">Play Again</Button>
        </div>
      )}
    </div>
  )
}
