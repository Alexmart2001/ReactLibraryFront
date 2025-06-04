import React, { useRef, useState, useEffect } from 'react';
import './EspacioDibujo.css';

function EspacioDibujo() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#ff69b4');
  const [size, setSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 400;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const context = canvasRef.current.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const context = canvasRef.current.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    const context = canvasRef.current.getContext('2d');
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "dibujo.png";
    link.href = image;
    link.click();
  };

  return (
    <div className="drawing-container">
      <h2>🎨 Espacio para Dibujar</h2>
      <p>¡Deja volar tu imaginación! Usa colores, formas y crea lo que sientas 🎈</p>
      <div className="controls">
        <label>
          🎨 Color del pincel:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          ✏️ Tamaño del pincel:
          <input type="range" min="1" max="30" value={size} onChange={(e) => setSize(e.target.value)} />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div className="buttons">
        <button onClick={clearCanvas}>🧽 Borrar Dibujo</button>
        <button onClick={saveImage}>💾 Guardar Dibujo</button>
      </div>
    </div>
  );
}

export default EspacioDibujo;
