import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './VideosLista.css';

const VideosLista = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevoVideo, setNuevoVideo] = useState({title: '', url: ''});
    const [modalAbierto, setModalAbierto] = useState(false);
    const [error, setError] = useState('');

    const headers = {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Videos', {headers});
            setVideos(response.data.videosResponse?.videos || []);
        } catch (err) {
            setError('Error al obtener los videos.');
        } finally {
            setLoading(false);
        }
    };

    const obtenerUrlEmbed = (url) => {
        if (!url) return '';

        const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
        const match = url.match(regex);

        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    const eliminarVideo = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar video?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Videos/${id}`, {headers});
                setVideos(videos.filter(video => video.id !== id));
                Swal.fire('Eliminado', 'El video ha sido eliminado.', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el video.', 'error');
            }
        }
    };

    const agregarVideo = async () => {
        const {title, url} = nuevoVideo;

        if (!title || !url) {
            Swal.fire('Campos requeridos', 'Por favor llena todos los campos.', 'warning');
            return;
        }

        const urlEmbed = obtenerUrlEmbed(url);

        try {
            await axios.post('http://localhost:8080/v1/Videos', {title, url: urlEmbed}, {headers});
            Swal.fire('¡Agregado!', 'El video ha sido añadido.', 'success');
            setNuevoVideo({title: '', url: ''});
            setModalAbierto(false);
            fetchVideos();
        } catch (err) {
            Swal.fire('Error', 'No se pudo agregar el video.', 'error');
        }
    };

    if (loading) return <div className="cargando">Cargando videos...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="videos-lista-container">
            <h2>Lista de Videos</h2>

            <button className="btn-abrir-modal" onClick={() => setModalAbierto(true)}>
                Agregar Video
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-contenido">
                        <h3>Nuevo Video</h3>
                        <input
                            type="text"
                            placeholder="Título del video"
                            value={nuevoVideo.title}
                            onChange={e => setNuevoVideo({...nuevoVideo, title: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="URL del video (normal o embed)"
                            value={nuevoVideo.url}
                            onChange={e => setNuevoVideo({...nuevoVideo, url: e.target.value})}
                        />
                        <div className="modal-botones">
                            <button onClick={agregarVideo}>Guardar</button>
                            <button className="btn-cerrar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="tabla-videos">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Vista previa</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {videos.map((video) => (
                    <tr key={video.id}>
                        <td>{video.id}</td>
                        <td>{video.title}</td>
                        <td>
                            <iframe
                                src={video.url}
                                title={video.title}
                                width="200"
                                height="150"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </td>
                        <td>
                            <button className="btn-eliminar" onClick={() => eliminarVideo(video.id)}>
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VideosLista;
