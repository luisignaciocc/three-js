"use client";

import React, { useEffect, useRef, useState } from "react";

// Definición de la interfaz para un coche
interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

const RacingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Coche del jugador
  const playerCar = useRef<Car>({
    x: 175, // Centrado en un canvas de 400px
    y: 500,
    width: 50,
    height: 100,
    speed: 0,
    color: "blue",
  });

  // Obstáculos (coches enemigos)
  const obstacles = useRef<Car[]>([]);
  const obstacleFrequency = useRef<number>(2000); // Tiempo en ms entre obstáculos
  const lastObstacleTime = useRef<number>(0);

  const gameWidth = 400;
  const gameHeight = 600;

  // Incrementar el número de carriles a 5
  const lanes = [50, 150, 250, 350, 450];

  // Manejo de teclas
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Reiniciar el juego
  const handleRestart = () => {
    playerCar.current.x = 175;
    playerCar.current.y = 500;
    playerCar.current.speed = 0;
    obstacles.current = [];
    obstacleFrequency.current = 2000;
    lastObstacleTime.current = 0;
    setScore(0);
    setGameOver(false);
  };

  // Funciones para manejar las teclas de flecha
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      keysPressed.current[e.code] = true;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      keysPressed.current[e.code] = false;
    }
  };

  // Función para manejar la entrada del usuario (clic y barra espaciadora para reiniciar)
  const handleInput = (e: KeyboardEvent | MouseEvent) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" && (e as KeyboardEvent).code === "Space")
    ) {
      e.preventDefault();
      if (gameOver) {
        handleRestart();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    // Configurar el canvas
    canvas.width = gameWidth;
    canvas.height = gameHeight;

    // Añadir listeners de teclado para movimiento
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Añadir listeners de teclado y clic para reiniciar
    window.addEventListener("keydown", handleInput);
    window.addEventListener("click", handleInput);

    // Función para crear obstáculos
    const createObstacle = () => {
      // Seleccionar un carril aleatorio
      const lane = lanes[Math.floor(Math.random() * lanes.length)];

      const enemyCar: Car = {
        x: lane - 25, // Centrado en el carril (obstáculo de 50px de ancho)
        y: -100, // Aparece fuera de la pantalla
        width: 50,
        height: 100,
        speed: 3 + Math.random() * 2, // Velocidad aleatoria entre 3 y 5
        color: "red",
      };

      obstacles.current.push(enemyCar);
    };

    // Función de actualización del juego
    const gameLoop = (timestamp: number) => {
      if (gameOver) return;

      // Generar obstáculos en intervalos
      if (timestamp - lastObstacleTime.current > obstacleFrequency.current) {
        createObstacle();
        lastObstacleTime.current = timestamp;

        // Aumentar la dificultad reduciendo el tiempo entre obstáculos
        if (obstacleFrequency.current > 800) {
          obstacleFrequency.current -= 50;
        }
      }

      // Mover el coche del jugador basado en las teclas presionadas
      if (keysPressed.current["ArrowLeft"]) {
        playerCar.current.x -= 5;
        if (playerCar.current.x < 0) playerCar.current.x = 0;
      }
      if (keysPressed.current["ArrowRight"]) {
        playerCar.current.x += 5;
        if (playerCar.current.x + playerCar.current.width > gameWidth)
          playerCar.current.x = gameWidth - playerCar.current.width;
      }

      // Actualizar posición de los obstáculos
      obstacles.current.forEach((obstacle) => {
        obstacle.y += obstacle.speed;
      });

      // Eliminar obstáculos que han salido de la pantalla
      obstacles.current = obstacles.current.filter(
        (obstacle) => obstacle.y < gameHeight,
      );

      // Detectar colisiones
      for (const obstacle of obstacles.current) {
        if (
          playerCar.current.x < obstacle.x + obstacle.width &&
          playerCar.current.x + playerCar.current.width > obstacle.x &&
          playerCar.current.y < obstacle.y + obstacle.height &&
          playerCar.current.y + playerCar.current.height > obstacle.y
        ) {
          setGameOver(true);
        }
      }

      // Actualizar puntaje
      setScore((prevScore) => prevScore + 1);

      // Dibujar
      ctx.clearRect(0, 0, gameWidth, gameHeight);

      // Dibujar carretera
      ctx.fillStyle = "#555";
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      ctx.fillStyle = "#FFF";
      // Líneas divisorias
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(gameWidth / 2, 0);
      ctx.lineTo(gameWidth / 2, gameHeight);
      ctx.stroke();
      ctx.setLineDash([]); // Restablecer dash

      // Dibujar coche del jugador
      ctx.fillStyle = playerCar.current.color;
      ctx.fillRect(
        playerCar.current.x,
        playerCar.current.y,
        playerCar.current.width,
        playerCar.current.height,
      );

      // Dibujar obstáculos
      obstacles.current.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Dibujar puntaje
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Puntaje: ${score}`, 10, 30);

      // Continuar el loop
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Iniciar el loop del juego
    animationFrameId = requestAnimationFrame(gameLoop);

    // Limpieza al desmontar el componente
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("click", handleInput);
    };
  }, [gameOver, score]);

  // Reiniciar con la barra espaciadora cuando el juego ha terminado
  useEffect(() => {
    const handleRestartKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameOver) {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleRestartKey);
    return () => {
      window.removeEventListener("keydown", handleRestartKey);
    };
  }, [gameOver]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-green-700">
      <canvas ref={canvasRef} className="border-4 border-white" />
      {gameOver && (
        <div className="absolute flex flex-col items-center justify-center bg-black bg-opacity-75 w-full h-full">
          <div className="text-4xl font-bold text-white mb-4">¡Game Over!</div>
          <div className="text-2xl text-white mb-4">Puntaje: {score}</div>
          <button
            onClick={handleRestart}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Reiniciar
          </button>
          <div className="text-white">
            Presiona la barra espaciadora para reiniciar
          </div>
        </div>
      )}
      {!gameOver && (
        <div className="absolute top-10 left-10 text-white font-bold">
          Usa las flechas ← → para moverte
        </div>
      )}
    </div>
  );
};

export default RacingGame;
