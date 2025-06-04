import React, { useEffect, useState } from "react";
import axios from "axios";
import './Canciones.css';

function Canciones() {
    const [canciones, setCanciones] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [cancionAEliminar, setCancionAEliminar] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [cancionAEditar, setCancionAEditar] = useState(null);

    useEffect(() => {
        fetchCanciones();
    }, []);

    const fetchCanciones = () => {
        axios.get("http://localhost:8080/v1/cancion", {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                setCanciones(response.data.musicaResponse.relajacion);
            })
            .catch((error) => {
                console.error("Error al obtener las canciones:", error);
            });
    };

    const abrirModalEditar = (cancion) => {
        setCancionAEditar({
            id: cancion.id,
            nombre: cancion.nombre
        });
        setShowEditModal(true);
    };

    const [nuevaCancion, setNuevaCancion] = useState({
        nombre: ""
    });

    const handleEliminar = () => {
        if (!cancionAEliminar) return;

        axios.delete(`http://localhost:8080/v1/cancion/${cancionAEliminar.id}`, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setShowDeleteModal(false);
                setCancionAEliminar(null);
                fetchCanciones();
            })
            .catch((error) => {
                console.error("Error al eliminar la canción:", error);
                alert("No se pudo eliminar la canción.");
            });
    };

    const handleAgregarCancion = () => {
        if (!nuevaCancion.nombre.trim()) {
            alert("El nombre no puede estar vacío");
            return;
        }

        const cancionAEnviar = {
            nombre: nuevaCancion.nombre,
            src: `/audios/${nuevaCancion.nombre}.mp3`
        };

        axios.post("http://localhost:8080/v1/cancion", cancionAEnviar, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setShowAddModal(false);
                setNuevaCancion({ nombre: "" });
                fetchCanciones();
            })
            .catch((error) => {
                console.error("Error al agregar la canción:", error);
                alert("No se pudo agregar la canción. Verifica los datos.");
            });
    };

    const handleEditarCancion = () => {
        if (!cancionAEditar.nombre.trim()) {
            alert("El nombre no puede estar vacío");
            return;
        }

        const cancionActualizada = {
            nombre: cancionAEditar.nombre,
            src: `/audios/${cancionAEditar.nombre}.mp3`
        };

        axios.put(`http://localhost:8080/v1/cancion/${cancionAEditar.id}`, cancionActualizada, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setShowEditModal(false);
                setCancionAEditar(null);
                fetchCanciones();
            })
            .catch((error) => {
                console.error("Error al editar la canción:", error);
                alert("No se pudo editar la canción.");
            });
    };

    return (
        <div className="canciones-container">
            <div className="canciones-header">
                <h2>Lista de Canciones</h2>
            </div>
            <div className="contenedor-boton">
                <button className="btn-agregar" onClick={() => setShowAddModal(true)}>
                    + Agregar Canción
                </button>
            </div>

            {canciones.length === 0 ? (
                <p className="no-canciones">No hay canciones registradas.</p>
            ) : (
                <div className="tabla-container">
                    <table className="tabla-canciones">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Archivo (src)</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {canciones.map((cancion) => (
                            <tr key={cancion.id}>
                                <td>{cancion.id}</td>
                                <td>{cancion.nombre}</td>
                                <td>{cancion.src}</td>
                                <td>
                                    <button className="btn-editar" onClick={() => abrirModalEditar(cancion)}>✏️</button>
                                    <button className="btn-eliminar" onClick={() => {
                                        setCancionAEliminar(cancion);
                                        setShowDeleteModal(true);
                                    }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showEditModal && cancionAEditar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Canción</h3>
                        <input
                            type="text"
                            value={cancionAEditar.nombre}
                            onChange={(e) => setCancionAEditar({ ...cancionAEditar, nombre: e.target.value })}
                            placeholder="Nombre"
                        />
                        <div className="modal-buttons">
                            <button className="btn-agregar" onClick={handleEditarCancion}>Guardar</button>
                            <button className="btn-agregar" onClick={() => setShowEditModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && cancionAEliminar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que deseas eliminar la
                            canción <strong>{cancionAEliminar.nombre}</strong> con
                            ID <strong>{cancionAEliminar.id}</strong>?</p>
                        <div className="modal-buttons">
                            <button className="btn-eliminar-modal" onClick={handleEliminar}>Eliminar</button>
                            <button className="btn-cancelar" onClick={() => {
                                setShowDeleteModal(false);
                                setCancionAEliminar(null);
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nueva Canción</h3>
                        <input
                            type="text"
                            value={nuevaCancion.nombre}
                            onChange={(e) => setNuevaCancion({ nombre: e.target.value })}
                            placeholder="Nombre"
                        />
                        <div className="modal-buttons">
                            <button className="btn-agregar" onClick={handleAgregarCancion}>Agregar</button>
                            <button className="btn-agregar" onClick={() => setShowAddModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Canciones;
