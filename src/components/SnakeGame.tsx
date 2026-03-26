import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused || !hasStarted) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, generateFood, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas - harsh black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid - jarring magenta
    ctx.strokeStyle = '#330033';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food - solid magenta block
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw snake - solid cyan blocks
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Inner border for pixelated look
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center w-full font-mono">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-[#0ff] pb-2">
        <div className="flex flex-col">
          <span className="text-[#0ff] text-lg uppercase">DATA_YIELD</span>
          <span className="text-3xl font-bold text-white glitch" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#f0f] text-lg uppercase">MAX_YIELD</span>
          <span className="text-3xl font-bold text-white glitch" data-text={highScore.toString().padStart(4, '0')}>{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#0ff] p-1 bg-black">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
            {!hasStarted ? (
              <>
                <h2 className="text-4xl font-display text-[#0ff] mb-6 glitch" data-text="INIT_SEQUENCE">INIT_SEQUENCE</h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#0ff] text-black font-bold uppercase hover:bg-white hover:text-black transition-none border-2 border-transparent hover:border-[#f0f]"
                >
                  [ EXECUTE ]
                </button>
              </>
            ) : gameOver ? (
              <>
                <h2 className="text-4xl font-display text-[#f0f] mb-2 glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-[#0ff] mb-6 text-xl">YIELD: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#f0f] text-black font-bold uppercase hover:bg-white hover:text-black transition-none border-2 border-transparent hover:border-[#0ff]"
                >
                  [ REBOOT ]
                </button>
              </>
            ) : isPaused ? (
              <>
                <h2 className="text-4xl font-display text-white mb-6 glitch" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-[#0ff] transition-none border-2 border-transparent hover:border-[#f0f]"
                >
                  [ RESUME ]
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-[#0ff] text-sm text-center uppercase">
        INPUT: [W,A,S,D] OR [ARROWS] <br/>
        INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
