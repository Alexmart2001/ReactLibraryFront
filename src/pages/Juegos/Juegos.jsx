import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Juegos.css';

const Juegos = () => {
    const [juegos, setJuegos] = useState([]);

    useEffect(() => {
        const fetchJuegos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/v1/Juegos', {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        "Content-Type": "application/json"
                    }
                });

                const fetchedJuegos = response.data?.juegosResponse?.juegos || [];
                setJuegos(fetchedJuegos);
            } catch (error) {
                console.error('Error al cargar los juegos:', error);
            }
        };

        fetchJuegos();
    }, []);

    const abrirJuego = (url) => {
        window.open(url, 'popup', 'width=800,height=600');
    };

    return (
        <div className="juegos-container">
            <h2 className="juegos-title">Juegos interactivos</h2>
            <div className="juegos-grid">
                {juegos.map((juego) => (
                    <div key={juego.id} className="juego-card">
                        <button onClick={() => abrirJuego(juego.url)}>
                            {juego.nombre}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Juegos;
