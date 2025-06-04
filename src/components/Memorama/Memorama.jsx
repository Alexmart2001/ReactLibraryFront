import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Memorama.css";

const Memorama = () => {
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/memorama/caras")
      .then((res) => {
        const duplicadas = [...res.data, ...res.data];
        const mezcladas = duplicadas.sort(() => 0.5 - Math.random());
        setCartas(mezcladas.map((carta, index) => ({
          ...carta,
          id: index,
          volteada: false,
          encontrada: false
        })));
      });
  }, []);

  const manejarClick = (carta) => {
    if (carta.volteada || carta.encontrada || seleccionadas.length === 2) return;

    const nuevasCartas = cartas.map(c =>
      c.id === carta.id ? { ...c, volteada: true } : c
    );
    const nuevasSeleccionadas = [...seleccionadas, carta];

    setCartas(nuevasCartas);
    setSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === 2) {
      setTimeout(() => {
        const [a, b] = nuevasSeleccionadas;
        if (a.imagenUrl === b.imagenUrl) {
          setCartas(prev =>
            prev.map(c =>
              c.imagenUrl === a.imagenUrl ? { ...c, encontrada: true } : c
            )
          );
        } else {
          setCartas(prev =>
            prev.map(c =>
              c.id === a.id || c.id === b.id ? { ...c, volteada: false } : c
            )
          );
        }
        setSeleccionadas([]);
      }, 800);
    }
  };

  return (
    <div className="grid">
      {cartas.map(carta => (
        <div
          key={carta.id}
          className={`carta ${carta.volteada || carta.encontrada ? "volteada" : ""}`}
          onClick={() => manejarClick(carta)}
        >
          {carta.volteada || carta.encontrada ? (
            <img src={carta.imagenUrl} alt="carta" />
          ) : (
            <div className="reverso">🧠</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Memorama;
