import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './TusEmociones.css';

const ListEmociones = () => {
    const [emociones, setEmociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const emojis = [
        { tipo: 'feliz', simbolo: '😊' },
        { tipo: 'triste', simbolo: '😢' },
        { tipo: 'enojado', simbolo: '😠' },
        { tipo: 'emocionado', simbolo: '🤩' },
        { tipo: 'calmado', simbolo: '😌' }
    ];

    useEffect(() => {
        fetchEmociones();
    }, []);

    const fetchEmociones = async () => {
        const usuario = localStorage.getItem('usuario');

        if (!usuario) {
            setError('No se encontró el ID del usuario.');
            setLoading(false);
            return;
        }

        try {
            const UserObj = JSON.parse(usuario);
            const userId = UserObj.usuarioResponse?.usuarios[0].id;
            const response = await axios.get(`http://localhost:8080/v1/Emocion/${userId}`, {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });

            setEmociones(response.data.emocionesResponse?.emociones || []);
        } catch (err) {
            setError('Error al obtener las emociones.');
        } finally {
            setLoading(false);
        }
    };

    const eliminarEmocion = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará la emoción permanentemente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Emocion/${id}`, {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                });
                // Actualizamos la lista removiendo la emoción eliminada
                setEmociones(emociones.filter(e => e.id !== id));

                Swal.fire(
                    'Eliminado',
                    'La emoción ha sido eliminada.',
                    'success'
                );
            } catch (err) {
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar la emoción.',
                    'error'
                );
            }
        }
    };

    if (loading) return <div className="cargando">Cargando emociones...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (emociones.length === 0) return <div className="no-comentarios">No hay emociones registradas.</div>;

    return (
        <div className="comentarios-container">
            <div className="comentarios-header">
                <h2>Lista de Emociones</h2>
            </div>
            <div className="tabla-container">
                <table className="tabla-comentarios">
                    <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Tipo de Emoji</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emociones.map((emocion) => (
                        <tr key={emocion.id}>
                            <td>{emocion.descripcion}</td>
                            <td>
                                {emojis.find(e => e.tipo === emocion.tipoEmoji)?.simbolo || emocion.tipoEmoji}
                            </td>
                            <td>
                                <button
                                    className="btn-eliminar"
                                    onClick={() => eliminarEmocion(emocion.id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListEmociones;

