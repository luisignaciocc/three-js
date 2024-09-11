"use client";

import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const bird = useRef({
    x: 50,
    y: 200,
    radius: 20,
    velocity: 0,
    gravity: 0.6,
    jump: -10,
  });

  const pipe = useRef({
    x: 400,
    width: 50,
    gap: 150,
    topHeight: 200,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId = -1;

    const handleJump = (e: MouseEvent | KeyboardEvent) => {
      if (
        e.type === "click" ||
        (e.type === "keydown" && (e as KeyboardEvent).code === "Space")
      ) {
        e.preventDefault(); // Prevenir el comportamiento por defecto del espaciador
        bird.current.velocity = bird.current.jump;
      }
    };

    canvas.addEventListener("click", handleJump);
    document.addEventListener("keydown", handleJump);

    const gameLoop = () => {
      // Lógica del juego
      bird.current.velocity += bird.current.gravity;
      bird.current.y += bird.current.velocity;

      pipe.current.x -= 2;
      if (pipe.current.x < -pipe.current.width) {
        pipe.current.x = 400;
        pipe.current.topHeight =
          Math.random() * (canvas.height - pipe.current.gap);
        setScore((prevScore) => prevScore + 1);
      }

      // Colisiones
      if (
        bird.current.y + bird.current.radius > canvas.height ||
        bird.current.y - bird.current.radius < 0 ||
        (bird.current.x + bird.current.radius > pipe.current.x &&
          bird.current.x - bird.current.radius <
            pipe.current.x + pipe.current.width &&
          (bird.current.y - bird.current.radius < pipe.current.topHeight ||
            bird.current.y + bird.current.radius >
              pipe.current.topHeight + pipe.current.gap))
      ) {
        setGameOver(true);
      }

      // Dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar bola
      ctx.beginPath();
      ctx.arc(
        bird.current.x,
        bird.current.y,
        bird.current.radius,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();

      // Dibujar tubería
      ctx.fillStyle = "green";
      ctx.fillRect(
        pipe.current.x,
        0,
        pipe.current.width,
        pipe.current.topHeight,
      );
      ctx.fillRect(
        pipe.current.x,
        pipe.current.topHeight + pipe.current.gap,
        pipe.current.width,
        canvas.height,
      );

      // Dibujar puntaje
      ctx.font = "24px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`Score: ${score}`, 10, 30);

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", handleJump);
      document.removeEventListener("keydown", handleJump);
    };
  }, [gameOver, score]);

  const handleRestart = () => {
    bird.current = {
      x: 50,
      y: 200,
      radius: 20,
      velocity: 0,
      gravity: 0.6,
      jump: -10,
    };
    pipe.current = {
      x: 400,
      width: 50,
      gap: 150,
      topHeight: 200,
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-200">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="border-4 border-black"
      />
      {gameOver && (
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            Game Over! Score: {score}
          </div>
          <button
            onClick={handleRestart}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Restart
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        Click or press Spacebar to jump
      </div>
    </div>
  );
};

export default Page;
