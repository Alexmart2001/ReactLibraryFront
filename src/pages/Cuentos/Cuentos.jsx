import React, { useEffect, useState } from "react";
import axios from "axios";
import './Cuentos.css';

function Cuentos() {
    const [cuentos, setCuentos] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [cuentoAEliminar, setCuentoAEliminar] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [cuentoAEditar, setCuentoAEditar] = useState(null);

    useEffect(() => {
        fetchCuentos();
    }, []);

    const fetchCuentos = () => {
        axios.get("http://localhost:8080/v1/cuento", {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4' // Pon la que uses si hace falta
            }
        })
            .then(response => {
                setCuentos(response.data.cuentosResponse?.cuentos || []);
            })
            .catch(error => {
                console.error("Error al obtener los cuentos:", error);
            });
    };

    const abrirModalEditar = (cuento) => {
        setCuentoAEditar({
            id: cuento.id,
            titulo: cuento.titulo,
            contenido: cuento.contenido
        });
        setShowEditModal(true);
    };

    const [nuevoCuento, setNuevoCuento] = useState({
        titulo: "",
        contenido: ""
    });

    const handleEliminar = () => {
        if (!cuentoAEliminar) return;

        axios.delete(`http://localhost:8080/v1/cuento/${cuentoAEliminar.id}`, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4'
            }
        })
            .then(() => {
                setShowDeleteModal(false);
                setCuentoAEliminar(null);
                fetchCuentos();
            })
            .catch(error => {
                console.error("Error al eliminar el cuento:", error);
                alert("No se pudo eliminar el cuento.");
            });
    };

    const handleAgregarCuento = () => {
        const cuentoAEnviar = {
            titulo: nuevoCuento.titulo,
            contenido: nuevoCuento.contenido
        };

        axios.post("http://localhost:8080/v1/cuento", cuentoAEnviar, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setShowAddModal(false);
                setNuevoCuento({ titulo: "", contenido: "" });
                fetchCuentos();
            })
            .catch(error => {
                console.error("Error al agregar el cuento:", error);
                alert("No se pudo agregar el cuento. Verifica los datos.");
            });
    };

    const handleEditarCuento = () => {
        const cuentoActualizado = {
            titulo: cuentoAEditar.titulo,
            contenido: cuentoAEditar.contenido
        };

        axios.put(`http://localhost:8080/v1/cuento/${cuentoAEditar.id}`, cuentoActualizado, {
            headers: {
                Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setShowEditModal(false);
                setCuentoAEditar(null);
                fetchCuentos();
            })
            .catch(error => {
                console.error("Error al editar el cuento:", error);
                alert("No se pudo editar el cuento.");
            });
    };

    return (
        <div className="cuentos-container">
            <div className="cuentos-header">
                <h2>Lista de Cuentos</h2>
            </div>
                <div className="contenedor-boton">
                    <button className="btn-agregar" onClick={() => setShowAddModal(true)}>
                        + Agregar Cuento
                    </button>
                </div>

                {cuentos.length === 0 ? (
                    <p className="no-cuentos">No hay cuentos registrados.</p>
                ) : (
                    <div className="tabla-container">
                        <table className="tabla-cuentos">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Contenido</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cuentos.map((cuento) => (
                                <tr key={cuento.id}>
                                    <td>{cuento.id}</td>
                                    <td>{cuento.titulo}</td>
                                    <td>{cuento.contenido}</td>
                                    <td>
                                        <div className="acciones-botones">
                                            <button className="btn-editar" onClick={() => abrirModalEditar(cuento)}>✏️
                                            </button>
                                            <button className="btn-eliminar" onClick={() => {
                                                setCuentoAEliminar(cuento);
                                                setShowDeleteModal(true);
                                            }}>🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showEditModal && cuentoAEditar && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Editar Cuento</h3>
                            <input
                                type="text"
                                value={cuentoAEditar.titulo}
                                onChange={(e) => setCuentoAEditar({...cuentoAEditar, titulo: e.target.value})}
                                placeholder="Título"
                            />
                            <textarea
                                value={cuentoAEditar.contenido}
                                onChange={(e) => setCuentoAEditar({...cuentoAEditar, contenido: e.target.value})}
                                placeholder="Contenido"
                                rows={5}
                            />
                            <div className="modal-buttons">
                                <button className="btn-agregar" onClick={handleEditarCuento}>Guardar</button>
                                <button className="btn-agregar" onClick={() => setShowEditModal(false)}>Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && cuentoAEliminar && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Confirmar Eliminación</h3>
                            <p>¿Estás seguro de que deseas eliminar el
                                cuento <strong>{cuentoAEliminar.titulo}</strong> con
                                ID <strong>{cuentoAEliminar.id}</strong>?</p>
                            <div className="modal-buttons">
                                <button className="btn-eliminar-modal" onClick={handleEliminar}>Eliminar</button>
                                <button className="btn-cancelar" onClick={() => {
                                    setShowDeleteModal(false);
                                    setCuentoAEliminar(null);
                                }}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Agregar */}
                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Agregar Nuevo Cuento</h3>
                            <input
                                type="text"
                                value={nuevoCuento.titulo}
                                onChange={(e) => setNuevoCuento({...nuevoCuento, titulo: e.target.value})}
                                placeholder="Título"
                            />
                            <textarea
                                value={nuevoCuento.contenido}
                                onChange={(e) => setNuevoCuento({...nuevoCuento, contenido: e.target.value})}
                                placeholder="Contenido"
                                rows={5}
                            />
                            <div className="modal-buttons">
                                <button className="btn-agregar" onClick={handleAgregarCuento}>Agregar</button>
                                <button className="btn-agregar" onClick={() => setShowAddModal(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            );
            }

            export default Cuentos;
