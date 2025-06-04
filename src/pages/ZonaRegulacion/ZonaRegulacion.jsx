import React, {useState, useEffect, useRef} from "react";
import "./ZonaRegulacion.css";
import axios from "axios";

function ZonaRegulacion() {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

    const seleccionarActividad = (actividad) => {
        setActividadSeleccionada(actividad);
    };

    const volverAlMenu = () => {
        setActividadSeleccionada(null);
    };

    const renderizarActividad = () => {
        switch (actividadSeleccionada) {
            case "musica":
                return <MusicaRelajante volverAlMenu={volverAlMenu}/>;
            case "respiracion":
                return <EjercicioRespiracion volverAlMenu={volverAlMenu}/>;
            case "cuento":
                return <LeerCuento volverAlMenu={volverAlMenu}/>;
            case "dibujar":
                return <DibujarActividad volverAlMenu={volverAlMenu}/>;
            default:
                return (
                    <div className="zona-menu">
                        <h2>Elige una actividad para relajarte:</h2>
                        <div className="actividades-grid">
                            <button
                                className="actividad-btn"
                                onClick={() => seleccionarActividad("musica")}
                            >
                                🎵 Escuchar música relajante
                            </button>
                            <button
                                className="actividad-btn"
                                onClick={() => seleccionarActividad("respiracion")}
                            >
                                🧘 Ejercicio de respiración
                            </button>
                            <button
                                className="actividad-btn"
                                onClick={() => seleccionarActividad("cuento")}
                            >
                                📚 Leer un cuento tranquilo
                            </button>
                            <button
                                className="actividad-btn"
                                onClick={() => seleccionarActividad("dibujar")}
                            >
                                🎨 Dibujar algo que te guste
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="zona-regulacion-container">
            <h1>Zona de Regulación Emocional</h1>
            {renderizarActividad()}
        </div>
    );
}

function MusicaRelajante({volverAlMenu}) {
    const [reproduciendo, setReproduciendo] = useState(false);
    const [canciones, setCanciones] = useState([]);
    const [cancionSeleccionada, setCancionSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCanciones = async () => {
            try {
                const response = await axios.get("http://localhost:8080/v1/cancion", {
                    headers: {
                        Authorization: "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4",
                        "Content-Type": "application/json"
                    },
                });
                const listaCanciones = response.data.musicaResponse.relajacion;
                setCanciones(listaCanciones);
                setCancionSeleccionada(listaCanciones[0]);
                setCargando(false);
            } catch (err) {
                setError(err.message || "Error al cargar las canciones");
                setCargando(false);
            }
        };

        fetchCanciones();

        return () => {
            const audio = document.getElementById("audio-player");
            if (audio) {
                audio.pause();
            }
        };
    }, []);

    const reproducirAudio = () => {
        const audio = document.getElementById("audio-player");
        if (reproduciendo) {
            audio.pause();
        } else {
            audio.play();
        }
        setReproduciendo(!reproduciendo);
    };

    if (cargando) return <p>Cargando música...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="actividad-container">
            <h2>Música Relajante</h2>
            <div className="musica-player">
                <select
                    value={cancionSeleccionada?.id || ""}
                    onChange={(e) =>
                        setCancionSeleccionada(
                            canciones.find((c) => c.id === parseInt(e.target.value))
                        )
                    }
                >
                    {canciones.map((cancion) => (
                        <option key={cancion.id} value={cancion.id}>
                            {cancion.nombre}
                        </option>
                    ))}
                </select>
                <audio id="audio-player" src={cancionSeleccionada?.src}/>
                <div className="buttonss">
                    <button onClick={reproducirAudio}>
                        {reproduciendo ? "Pausar" : "Reproducir"}
                    </button>
                    <button onClick={volverAlMenu}>Volver al menú</button>
                </div>
            </div>
            <div className="buttonss">
                <p>
                    Escuchar música relajante puede ayudarte a calmar tu mente y regular
                    tus emociones.
                </p>
            </div>
        </div>
    );
}


function EjercicioRespiracion({volverAlMenu}) {
    const [pasoActual, setPasoActual] = useState(0);
    const pasos = [
        "Siéntate cómodamente y relaja tus hombros",
        "Respira profundamente por la nariz contando hasta 4",
        "Mantén el aire contando hasta 7",
        "Exhala lentamente por la boca contando hasta 8",
        "Repite el proceso 4 veces más",
    ];

    const avanzarPaso = () => {
        if (pasoActual < pasos.length - 1) {
            setPasoActual(pasoActual + 1);
        } else {
            setPasoActual(0);
        }
    };

    return (
        <div className="actividad-container">
            <h2>Ejercicio de Respiración</h2>
            <div className="respiracion-container">
                <div className="respiracion-circulo">
                    <div className={`respiracion-animacion paso-${pasoActual}`}></div>
                </div>
                <p className="instruccion">{pasos[pasoActual]}</p>
                <div className="buttonss">
                    <button onClick={avanzarPaso}>Siguiente paso</button>
                </div>
            </div>
            <div className="buttonss">
                <button className="" onClick={volverAlMenu}>
                    Volver al menú
                </button>
            </div>
        </div>
    );
}

function LeerCuento({volverAlMenu}) {
    const [cuentos, setCuentos] = useState([]);
    const [cuentoSeleccionado, setCuentoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCuentos = async () => {
            try {
                const response = await axios.get("http://localhost:8080/v1/cuento", {
                    headers: {
                        Authorization: "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4",
                        "Content-Type": "application/json"
                    }
                });

                const cuentos = response.data.cuentosResponse.cuentos;

                setCuentos(cuentos);
                setCuentoSeleccionado(cuentos[0]);
                setCargando(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setCargando(false);
            }
        };

        fetchCuentos();
    }, []);

    if (cargando) return <p>Cargando cuentos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="actividad-container">
            <h2>Lectura Tranquila</h2>
            <div className="cuento-container">
                <select
                    value={cuentoSeleccionado?.id}
                    onChange={(e) =>
                        setCuentoSeleccionado(
                            cuentos.find((c) => c.id === parseInt(e.target.value))
                        )
                    }
                >
                    {cuentos.map((cuento) => (
                        <option key={cuento.id} value={cuento.id}>
                            {cuento.titulo}
                        </option>
                    ))}
                </select>
                <div className="cuento-texto">
                    <h3>{cuentoSeleccionado.titulo}</h3>
                    <p>{cuentoSeleccionado.contenido}</p>
                </div>
            </div>
            <div className="buttonss">
                <button onClick={volverAlMenu}>Volver al menú</button>
            </div>
        </div>
    );
}


function DibujarActividad({volverAlMenu}) {
    const [color, setColor] = useState("#000000");
    const [grosor, setGrosor] = useState(5);
    const [dibujando, setDibujando] = useState(false);
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        setCtx(context);
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
        };
    };

    const iniciarDibujo = (e) => {
        if (!ctx) return;
        const {offsetX, offsetY} = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setDibujando(true);
    };

    const dibujar = (e) => {
        if (!dibujando || !ctx) return;
        const {offsetX, offsetY} = getCoordinates(e);
        ctx.lineWidth = grosor;
        ctx.strokeStyle = color;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const finalizarDibujo = () => {
        setDibujando(false);
    };

    const limpiarCanvas = () => {
        if (!ctx) return;
        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png").replace("tu_dibujo/png", "image/octet-stream");
        const link = document.createElement("a");
        link.download = "Tu dibujo.png";
        link.href = image;
        link.click();
    };

    return (
        <div className="actividad-container">
            <h2>Espacio para Dibujar</h2>
            <div className="dibujo-controles">
                <div>
                    <label htmlFor="color">Color: </label>
                    <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="grosor">Grosor: </label>
                    <input
                        type="range"
                        id="grosor"
                        min="1"
                        max="20"
                        value={grosor}
                        onChange={(e) => setGrosor(parseInt(e.target.value))}
                    />
                </div>
                <button onClick={limpiarCanvas}>Limpiar</button>
            </div>
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="canvas-dibujo"
                onMouseDown={iniciarDibujo}
                onMouseMove={dibujar}
                onMouseUp={finalizarDibujo}
                onMouseLeave={finalizarDibujo}
                onTouchStart={iniciarDibujo}
                onTouchMove={dibujar}
                onTouchEnd={finalizarDibujo}
            />

            <div className="buttonss">
                <button className="" onClick={volverAlMenu}>
                    Volver al menú
                </button>

                <button onClick={saveImage}>💾 Guardar Dibujo</button>
            </div>
        </div>
    );
}

export default ZonaRegulacion;
