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
    speed: 2,
  });

  // Reiniciar el juego
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
      speed: 2,
    };
    setScore(0);
    setGameOver(false);
  };

  // Manejar salto o reinicio
  const handleInput = (e: KeyboardEvent | MouseEvent) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" && (e as KeyboardEvent).code === "Space")
    ) {
      e.preventDefault();
      if (gameOver) {
        handleRestart();
      } else {
        bird.current.velocity = bird.current.jump;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    // Añadir eventos
    canvas.addEventListener("click", handleInput);
    document.addEventListener("keydown", handleInput);

    const gameLoop = () => {
      // Actualizar física del pájaro
      bird.current.velocity += bird.current.gravity;
      bird.current.y += bird.current.velocity;

      // Mover tubería
      pipe.current.x -= pipe.current.speed;
      if (pipe.current.x < -pipe.current.width) {
        pipe.current.x = 400;
        pipe.current.topHeight =
          Math.random() * (canvas.height - pipe.current.gap - 100) + 50;
        setScore((prev) => prev + 1);
      }

      // Detectar colisiones
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

      // Dibujar pájaro
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

      // Dibujar tuberías
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
        canvas.height - pipe.current.topHeight - pipe.current.gap,
      );

      // Dibujar puntaje
      ctx.font = "24px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`Puntaje: ${score}`, 10, 30);

      // Continuar el loop si el juego no ha terminado
      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    // Limpiar eventos y animación al desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", handleInput);
      document.removeEventListener("keydown", handleInput);
    };
  }, [gameOver, score]);

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
            ¡Game Over! Puntaje: {score}
          </div>
          <button
            onClick={handleRestart}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reiniciar
          </button>
          <div className="mt-2 text-sm text-gray-600">
            También puedes presionar la barra espaciadora para reiniciar.
          </div>
        </div>
      )}
      {!gameOver && (
        <div className="mt-4 text-sm text-gray-600">
          Haz clic o presiona la barra espaciadora para saltar
        </div>
      )}
    </div>
  );
};

export default Page;
