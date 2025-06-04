import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Comentarios.css';

const ListComentarios = () => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComentarios();
    }, []);

    const fetchComentarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Request', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            setComentarios(response.data.necesitasAyudaResponse?.necesitasAyudas || []);
        } catch (err) {
            setError('Error al obtener los comentarios.');
        } finally {
            setLoading(false);
        }
    };

    const eliminarComentario = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará el comentario permanentemente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Request/${id}`, {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                });
                setComentarios(comentarios.filter(c => c.id !== id));

                Swal.fire(
                    'Eliminado',
                    'El comentario ha sido eliminado.',
                    'success'
                );
            } catch (err) {
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el comentario.',
                    'error'
                );
            }
        }
    };

    if (loading) return <div className="cargando">Cargando comentarios...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (comentarios.length === 0) return <div className="no-comentarios">No hay comentarios registrados.</div>;

    return (
        <div className="comentarios-container">
            <div className="comentarios-header">
                <h2>Lista de Comentarios</h2>
            </div>
            <div className="tabla-container">
                <table className="tabla-comentarios">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Comentario</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {comentarios.map((comentario) => (
                        <tr key={comentario.id}>
                            <td>{comentario.id}</td>
                            <td>{comentario.usuario?.nombre || 'Sin nombre'}</td>
                            <td className="comentario-col">{comentario.comentario}</td>
                            <td>{comentario.correoElectronico}</td>
                            <td>{comentario.numeroTelefono}</td>
                            <td>
                                <button
                                    className="btn-eliminar"
                                    onClick={() => eliminarComentario(comentario.id)}
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

export default ListComentarios;
