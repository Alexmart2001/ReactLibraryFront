import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ListaCategorias.css';

const ListaCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [categoriaEditar, setCategoriaEditar] = useState({ id: null, nombre: '' });

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Categoria', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            const lista = response.data.categoria?.categorias || [];
            setCategorias(lista);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    const agregarCategoria = async () => {
        if (!nuevaCategoria.trim()) return;

        try {
            const response = await axios.post(
                'http://localhost:8080/v1/Categoria',
                { nombre: nuevaCategoria },
                {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const nueva = response.data.categoria?.categorias?.[0];
            if (nueva) {
                setCategorias([...categorias, nueva]);
                setNuevaCategoria('');
                setMostrarModalAgregar(false);
            }
        } catch (error) {
            console.error('Error al agregar categoría:', error);
        }
    };

    // --- EDITAR ---

    const abrirModalEditar = (cat) => {
        setCategoriaEditar({ id: cat.id, nombre: cat.nombre });
        setMostrarModalEditar(true);
    };

    const actualizarCategoria = async () => {
        if (!categoriaEditar.nombre.trim()) return;

        try {
            await axios.put(
                `http://localhost:8080/v1/Categoria/${categoriaEditar.id}`,
                { nombre: categoriaEditar.nombre },
                {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                }
            );

            setCategorias(
                categorias.map(cat =>
                    cat.id === categoriaEditar.id ? { ...cat, nombre: categoriaEditar.nombre } : cat
                )
            );
            setMostrarModalEditar(false);
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
        }
    };

    // --- ELIMINAR ---

    const eliminarCategoria = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará la categoría permanentemente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Categoria/${id}`, {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                });

                setCategorias(categorias.filter(cat => cat.id !== id));

                Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al eliminar la categoría.', 'error');
            }
        }
    };

    return (
        <div className="cat-container">
            <div className="cat-card">
                <h2 className="cat-title">Categorías literarias</h2>

                <button className="cat-btn" onClick={() => setMostrarModalAgregar(true)}>
                    Añadir nueva categoría
                </button>

                <table className="cat-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.nombre}</td>
                            <td>
                                <button
                                    className="cat-btn"
                                    onClick={() => abrirModalEditar(cat)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="cat-btn-eliminar"
                                    onClick={() => eliminarCategoria(cat.id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {mostrarModalAgregar && (
                <div className="cat-modal-backdrop">
                    <div className="cat-modal">
                        <h3>Añadir nueva categoría</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la categoría"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                        />
                        <div className="cat-modal-buttons">
                            <button className="cat-btn" onClick={agregarCategoria}>
                                Guardar
                            </button>
                            <button className="cat-btn" onClick={() => setMostrarModalAgregar(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {mostrarModalEditar && (
                <div className="cat-modal-backdrop">
                    <div className="cat-modal">
                        <h3>Editar categoría</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la categoría"
                            value={categoriaEditar.nombre}
                            onChange={(e) =>
                                setCategoriaEditar({ ...categoriaEditar, nombre: e.target.value })
                            }
                        />
                        <div className="cat-modal-buttons">
                            <button className="cat-btn" onClick={actualizarCategoria}>
                                Actualizar
                            </button>
                            <button className="cat-btn" onClick={() => setMostrarModalEditar(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaCategorias;
