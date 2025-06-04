import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Carousel from '/src/pages/Carousel/Carousel.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';


const Home = () => {
    const [libros, setLibros] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState('');
    const [respuesta, setRespuesta] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/v1/Libros', {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4'
            }
        })
            .then(response => {
                setLibros(response.data.libroResponse.libro);
            })
            .catch(error => console.error('Error al cargar libros:', error));
    }, []);
    useEffect(() => {
        const UsuarioStr = localStorage.getItem('usuario');
        if (!UsuarioStr) return;

        const usuarioObj = JSON.parse(UsuarioStr);
        const usuarioId = usuarioObj?.usuarioResponse?.usuarios?.[0]?.id;

        console.log("usuario_id en localStorage:", usuarioId);

        if (!usuarioId) return;

        axios.get(`http://localhost:8080/v1/Conexion/Usuario/${usuarioId}`, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log("Respuesta de preguntas:", res.data);
                const preguntas = res.data.preguntasDeSeguridad?.preguntasDeSeguridad;
                if (!preguntas || preguntas.length === 0) {
                    setMostrarModal(true);
                    cargarPreguntasDisponibles();
                }
            })
            .catch(err => {
                console.error("Error consultando preguntas:", err);
                setMostrarModal(true);
                cargarPreguntasDisponibles();
            });
    }, []);

    const cargarPreguntasDisponibles = () => {
        axios.get('http://localhost:8080/v1/Preguntas', {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                setPreguntasDisponibles(res.data.preguntaResponse.preguntas || []);
            })
            .catch(err => {
                console.error("Error cargando preguntas disponibles:", err);
            });
    };

    const guardarPreguntaDeSeguridad = () => {
        const usuarioStr = localStorage.getItem('usuario');
        if (!usuarioStr || !preguntaSeleccionada || !respuesta) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        const usuarioObj = JSON.parse(usuarioStr);
        const usuarioId = usuarioObj?.usuarioResponse?.usuarios?.[0]?.id;

        if (!usuarioId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el id del usuario.',
            });
            return;
        }

        axios.post('http://localhost:8080/v1/Conexion', {
            usuario: { id: usuarioId },
            pregunta: { id: parseInt(preguntaSeleccionada) },
            respuesta: respuesta.toLowerCase()
        }, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setMostrarModal(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Pregunta registrada exitosamente',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(err => {
                console.error("Error guardando pregunta:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar la pregunta',
                });
            });
    }


    return (
        <div className="home-container">
            <h1 className="titulo-principal">🔴 Bienvenidos a la Biblioteca Virtual 🔵</h1>

            <div className="carousel-wrapper">
                <Carousel />
            </div>

            <div className="subtitulo-container">
                <p className="subtitulo">🔶 Niños con autismo</p>
            </div>

            <h2 className="libros-destacados">📚 Libros Destacados</h2>

            <div className="libros-container">
                {libros.slice(0, 3).map((libro, index) => (
                    <div className="libro-card" key={index}>
                        <img src={libro.imagen} alt={libro.titulo} />
                        <h3>{libro.titulo}</h3>
                        <p><strong>Autor:</strong> {libro.autor}</p>
                        <p><strong>Año:</strong> {libro.año}</p>
                        <p className="libro-descripcion">{libro.descripcion}</p>
                        <p>
                            <strong>Enlace: </strong>
                            <a
                                href={libro.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="libro-enlace"
                            >
                                {libro.url}
                            </a>
                        </p>
                    </div>
                ))}
            </div>

            <Link to="/catalogo" className="boton-catalogo">
                <span>✨ Explorar Todos los Libros ✨</span>
            </Link>

            <div className="caracteristicas">
                <div className="caracteristica-card">
                    <div className="caracteristica-icono">📖</div>
                    <h3>Lecturas Adaptadas</h3>
                    <p>Libros seleccionados especialmente para niños con autismo</p>
                </div>
                <div className="caracteristica-card">
                    <div className="caracteristica-icono">🎨</div>
                    <h3>Zona de Dibujo</h3>
                    <p>Espacio para expresión artística y desarrollo creativo</p>
                </div>
                <div className="caracteristica-card">
                    <div className="caracteristica-icono">🧩</div>
                    <h3>Actividades Sensoriales</h3>
                    <p>Ejercicios complementarios para cada libro</p>
                </div>
            </div>

            {mostrarModal && (
                <div className="modal-fondo">
                    <div className="modal-contenido">
                        <h2>🔐 Seguridad Adicional</h2>
                        <p>Por favor, selecciona una pregunta de seguridad y responde:</p>

                        <select
                            value={preguntaSeleccionada}
                            onChange={(e) => setPreguntaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccione una pregunta</option>
                            {preguntasDisponibles.map(p => (
                                <option key={p.id} value={p.id}>{p.pregunta}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Tu respuesta"
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                        />

                        <button onClick={guardarPreguntaDeSeguridad}>Guardar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
