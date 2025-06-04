import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiarioEmocional.css';

const emojis = [
    { tipo: 'feliz', simbolo: '😊' },
    { tipo: 'triste', simbolo: '😢' },
    { tipo: 'enojado', simbolo: '😠' },
    { tipo: 'emocionado', simbolo: '🤩' },
    { tipo: 'calmado', simbolo: '😌' }
];

function DiarioEmocionalPage() {
    const [descripcion, setDescripcion] = useState('');
    const [emocionSeleccionada, setEmocionSeleccionada] = useState(null);
    const [estado, setEstado] = useState({ mensaje: '', tipo: '' });
    const [registros, setRegistros] = useState([]);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("usuario");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const id = parsedData.usuarioResponse?.usuarios?.[0]?.id;
                console.log("ID del usuario cargado desde localStorage:", id);
                if (id) {
                    setUsuarioId(id);
                } else {
                    console.warn("ID de usuario no encontrado en el objeto");
                }
            } catch (error) {
                console.error("Error al parsear localStorage:", error);
            }
        }
    }, []);

    const seleccionarEmocion = (tipoEmoji) => {
        setEmocionSeleccionada(tipoEmoji);
    };

    const guardarDiario = () => {
        if (!emocionSeleccionada) {
            setEstado({ mensaje: 'Por favor selecciona una emoción primero', tipo: 'error' });
            return;
        }

        if (!descripcion.trim()) {
            setEstado({ mensaje: 'Por favor escribe algo antes de guardar.', tipo: 'error' });
            return;
        }

        // Leer usuarioId directamente de localStorage para evitar problemas con estado desactualizado
        let id = usuarioId;
        if (!id) {
            const storedData = localStorage.getItem("usuarioLogueado");
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    id = parsedData.usuarioResponse?.usuarios?.[0]?.id;
                } catch {
                    id = null;
                }
            }
        }

        if (!id) {
            setEstado({ mensaje: 'Usuario no identificado.', tipo: 'error' });
            return;
        }

        const emocion = {
            tipoEmoji: emocionSeleccionada,
            descripcion,
            fecha: new Date().toISOString().slice(0, 10),
            usuario: {
                id: id
            }
        };

        axios.post('http://localhost:8080/v1/Emocion', emocion, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4'
            }
        })
            .then(response => {
                setEstado({ mensaje: '¡Emoción registrada correctamente!', tipo: 'exito' });
                setRegistros([...registros, emocion]);
                setDescripcion('');
                setEmocionSeleccionada(null);
            })
            .catch(error => {
                console.error('Error al guardar:', error);
                setEstado({ mensaje: 'Error al guardar. Inténtalo nuevamente.', tipo: 'error' });
            });
    };

    return (
        <div className="diario-container">
            <h2>¿Cómo te sientes hoy?</h2>

            <div className="emoji-selector">
                {emojis.map(e => (
                    <button
                        key={e.tipo}
                        onClick={() => seleccionarEmocion(e.tipo)}
                        className={emocionSeleccionada === e.tipo ? 'seleccionado' : ''}
                        title={e.tipo}
                    >
                        {e.simbolo}
                    </button>
                ))}
            </div>

            {emocionSeleccionada && (
                <p className="seleccion">
                    Has seleccionado: {emojis.find(e => e.tipo === emocionSeleccionada)?.simbolo} {emocionSeleccionada}
                </p>
            )}

            <textarea
                placeholder="¿Quieres escribir algo más sobre cómo te sientes?"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
            />

            <button
                className="guardar"
                onClick={guardarDiario}
            >
                Guardar en mi diario
            </button>

            {estado.mensaje && (
                <div className={`mensaje ${estado.tipo}`}>
                    {estado.mensaje}
                </div>
            )}

            {registros.length > 0 && (
                <div className="registro-historial">
                    <h3>Registro de hoy</h3>
                    <ul>
                        {registros.map((reg, index) => (
                            <li key={index}>
                                {emojis.find(e => e.tipo === reg.tipoEmoji)?.simbolo} - {reg.fecha}
                                {reg.descripcion && <p>{reg.descripcion}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DiarioEmocionalPage;
