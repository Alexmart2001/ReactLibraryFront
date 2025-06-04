import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalogo.css';

const obtenerEmoji = (emocion) => {
    switch (emocion) {
        case 'feliz': return '😊';
        case 'triste': return '😢';
        case 'valiente': return '🦁';
        case 'miedo': return '😱';
        case 'sorpresa': return '😲';
        case 'enojo': return '😠';
        case 'calma': return '😌';
        case 'amor': return '❤️';
        default: return '📘';
    }
};

const obtenerColorEmocion = (emocion) => {
    switch (emocion) {
        case 'feliz': return '#FFD166';
        case 'triste': return '#77AFDE';
        case 'valiente': return '#E09245';
        case 'miedo': return '#9C89B8';
        case 'sorpresa': return '#73D2DE';
        case 'enojo': return '#F46036';
        case 'calma': return '#06D6A0';
        case 'amor': return '#EF476F';
        default: return '#6A8FD4';
    }
};

const Catalogo = () => {
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');
    const [libroReproduciendo, setLibroReproduciendo] = useState(null);
    const [narradorActivo, setNarradorActivo] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const navigate = useNavigate();

    const synth = window.speechSynthesis;

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');

        if (!usuarioGuardado) {
            console.log('No se encontró usuario en localStorage');
            navigate('/login');
            return;
        }

        try {
            const usuarioObj = JSON.parse(usuarioGuardado);
            setUsuario(usuarioObj);

            fetch('http://localhost:8080/v1/Libros', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json',
                },
            })
                .then((respuesta) => {
                    if (!respuesta.ok) throw new Error('Error al obtener los libros');
                    return respuesta.json();
                })
                .then((data) => {
                    setTimeout(() => {
                        const librosRespuesta = data.libroResponse?.libro || [];
                        const librosConContenido = librosRespuesta.map((libro) => ({
                            ...libro,
                            contenido: libro.descripcion,
                        }));
                        setLibros(librosConContenido);
                        setCargando(false);
                    }, 800);
                })
                .catch((error) => {
                    console.error('Error al cargar libros:', error);
                    setError('No se pudieron cargar los libros. Intenta más tarde.');
                    setCargando(false);
                });

            fetch('http://localhost:8080/v1/Categoria', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Error al obtener las categorías');
                    return res.json();
                })
                .then((data) => {
                    const categoriasResponse = data?.categoria?.categorias || [];
                    setCategorias(categoriasResponse);
                })
                .catch((error) => {
                    console.error('Error al cargar categorías:', error);
                });
        } catch (error) {
            console.error('Error al procesar datos del usuario:', error);
            localStorage.removeItem('usuario');
            navigate('/login');
        }

        return () => {
            if (synth.speaking) synth.cancel();
        };
    }, [navigate]);

    const cerrarSesion = () => {
        if (synth.speaking) synth.cancel();

        document.body.classList.add('fade-out');
        setTimeout(() => {
            localStorage.removeItem('usuario');
            navigate('/login');
            document.body.classList.remove('fade-out');
        }, 300);
    };

    const leerEnVozAlta = (libro) => {
        if (synth.speaking) {
            synth.cancel();
            if (libroReproduciendo && libroReproduciendo.id === libro.id) {
                setLibroReproduciendo(null);
                setNarradorActivo(false);
                return;
            }
        }

        const utterance = new SpeechSynthesisUtterance(libro.contenido);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        const voces = synth.getVoices();
        const vozEspañol = voces.find(
            (voz) => voz.lang.includes('es') && voz.name.toLowerCase().includes('female')
        );
        if (vozEspañol) utterance.voice = vozEspañol;

        utterance.onend = () => {
            setLibroReproduciendo(null);
            setNarradorActivo(false);
        };

        utterance.onerror = (event) => {
            console.error('Error en la síntesis de voz:', event);
            setLibroReproduciendo(null);
            setNarradorActivo(false);
        };

        synth.speak(utterance);
        setLibroReproduciendo(libro);
        setNarradorActivo(true);
    };

    const LoadingScreen = () => (
        <div className="loading-screen">
            <div className="loading-animation">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
            </div>
            <p className="loading-text">Cargando libros mágicos...</p>
        </div>
    );

    return (
        <div className="main-container">
            <main className="content-area">
                {usuario && (
                    <div className="welcome-header">
                        <h2>¡Bienvenido a tu mundo mágico, {usuario.nombre}! 🌟</h2>
                    </div>
                )}

                {categorias.length > 0 && (
                    <div className="categoria-selector">
                        <label htmlFor="categoria">Filtrar por categoría:</label>
                        <select
                            id="categoria"
                            className="select-categoria"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {cargando ? (
                    <LoadingScreen />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="catalogo-container">
                        <h1 className="catalogo-titulo">Biblioteca de Emociones</h1>
                        {libros.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📚</div>
                                <p>¡Aún no hay libros en la biblioteca!</p>
                                <p>Pronto llegarán historias maravillosas.</p>
                            </div>
                        ) : (
                            libros
                                .filter((libro) => {
                                    if (!categoriaSeleccionada) return true;
                                    const nombreCategoria = libro.categoria?.nombre || '';
                                    return nombreCategoria.toLowerCase() === categoriaSeleccionada.toLowerCase();
                                })
                                .map((libro) => (
                                    <div
                                        key={libro.id}
                                        className={`catalogo-libro ${libroReproduciendo?.id === libro.id ? 'reproduciendo' : ''}`}
                                        style={{ backgroundColor: obtenerColorEmocion(libro.emocion) }}
                                    >
                                        <div className="libro-emoji">{obtenerEmoji(libro.emocion)}</div>
                                        <h3 className="libro-titulo">{libro.titulo}</h3>
                                        <p className="libro-autor">Autor: {libro.autor}</p>
                                        <p className="libro-contenido">{libro.contenido}</p>
                                        <p>
                                            <strong>Enlace: </strong>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(
                                                        libro.url,
                                                        'popup',
                                                        'width=1500,height=800,scrollbars=yes,resizable=yes'
                                                    );
                                                }}
                                                className="libro-enlace"
                                            >
                                                {libro.url}
                                            </a>
                                        </p>

                                        <button
                                            className="narrador-boton"
                                            onClick={() => leerEnVozAlta(libro)}
                                            aria-label={`Leer en voz alta el libro ${libro.titulo}`}
                                        >
                                            {libroReproduciendo?.id === libro.id && narradorActivo ? '🔊 Detener' : '🔈 Escuchar'}
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Catalogo;
