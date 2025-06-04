import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ListaLibros.css';

const ListLibros = () => {
    const [libros, setLibros] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [libroActual, setLibroActual] = useState({
        id: '',
        titulo: '',
        descripcion: '',
        autor: '',
        año: '',
        imagen: '',
        url: '',
        categoria: null
    });

    const [showModalNuevo, setShowModalNuevo] = useState(false);
    const [libroNuevo, setLibroNuevo] = useState({
        titulo: '',
        descripcion: '',
        autor: '',
        año: '',
        imagen: '',
        url: '',
        categoria: null
    });

    useEffect(() => {
        fetchLibros();
        fetchCategorias();
    }, []);

    const fetchLibros = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/v1/Libros', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            setLibros(response.data.libroResponse?.libro || []);
        } catch (err) {
            setError('Error al obtener la lista de libros.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Categoria', {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            setCategorias(response.data.categoria.categorias || []);
        } catch (error) {
            console.error('Error fetching categorias:', error);
        }
    };

    const manejarCambioNuevo = (e) => {
        const { name, value } = e.target;
        if(name === 'categoria') {
            setLibroNuevo((prev) => ({
                ...prev,
                categoria: { id: Number(value) }
            }));
        } else {
            setLibroNuevo((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const crearLibro = async () => {
        try {
            await axios.post('http://localhost:8080/v1/Libros', libroNuevo, {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire('Creado', 'El libro ha sido añadido con éxito.', 'success');
            setShowModalNuevo(false);
            setLibroNuevo({
                titulo: '',
                descripcion: '',
                autor: '',
                año: '',
                imagen: '',
                url: '',
                categoria: null
            });
            fetchLibros();
        } catch (err) {
            Swal.fire('Error', 'No se pudo añadir el libro.', 'error');
            console.error('Create error:', err);
        }
    };

    const eliminarLibro = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará el libro permanentemente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Libros/${id}`, {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        'Content-Type': 'application/json'
                    }
                });
                setLibros((prevLibros) => prevLibros.filter(l => l.id !== id));
                Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Hubo un problema al eliminar el libro.', 'error');
                console.error('Delete error:', err);
            }
        }
    };

    const abrirModalEditar = (libro) => {
        setLibroActual({
            ...libro,
            categoria: libro.categoria ? { id: libro.categoria.id } : null
        });
        setShowModal(true);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        if(name === 'categoria') {
            setLibroActual((prev) => ({
                ...prev,
                categoria: { id: Number(value) }
            }));
        } else {
            setLibroActual((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const guardarCambios = async () => {
        try {
            await axios.put(`http://localhost:8080/v1/Libros/${libroActual.id}`, libroActual, {
                headers: {
                    Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire('Actualizado', 'El libro ha sido actualizado con éxito.', 'success');
            setShowModal(false);
            fetchLibros();
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar el libro.', 'error');
            console.error('Update error:', err);
        }
    };

    if (loading) return <div className="cargando">Cargando libros...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (libros.length === 0) return <div className="no-libros">No hay libros registrados.</div>;

    return (
        <div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Libro</h3>
                        <input type="text" name="titulo" value={libroActual.titulo} onChange={manejarCambio}
                               placeholder="Título"/>
                        <textarea name="descripcion" value={libroActual.descripcion} onChange={manejarCambio}
                                  placeholder="Descripción"/>
                        <input type="text" name="autor" value={libroActual.autor} onChange={manejarCambio}
                               placeholder="Autor"/>
                        <input type="text" name="año" value={libroActual.año} onChange={manejarCambio}
                               placeholder="Año"/>
                        <input type="text" name="imagen" value={libroActual.imagen} onChange={manejarCambio}
                               placeholder="URL Imagen"/>
                        <input type="text" name="url" value={libroActual.url} onChange={manejarCambio}
                               placeholder="URL del libro"/>

                        <select name="categoria" value={libroActual.categoria?.id || ''} onChange={manejarCambio}>
                            <option value="">Seleccione categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>

                        <div className="modal-buttons">
                            <button onClick={guardarCambios} className="btn-guardar">Guardar</button>
                            <button onClick={() => setShowModal(false)} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showModalNuevo && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Libro</h3>
                        <input type="text" name="titulo" value={libroNuevo.titulo} onChange={manejarCambioNuevo}
                               placeholder="Título"/>
                        <textarea name="descripcion" value={libroNuevo.descripcion} onChange={manejarCambioNuevo}
                                  placeholder="Descripción"/>
                        <input type="text" name="autor" value={libroNuevo.autor} onChange={manejarCambioNuevo}
                               placeholder="Autor"/>
                        <input type="text" name="año" value={libroNuevo.año} onChange={manejarCambioNuevo}
                               placeholder="Año"/>
                        <input type="text" name="imagen" value={libroNuevo.imagen} onChange={manejarCambioNuevo}
                               placeholder="URL Imagen"/>
                        <input type="text" name="url" value={libroNuevo.url} onChange={manejarCambioNuevo}
                               placeholder="URL del libro"/>

                        <select name="categoria" value={libroNuevo.categoria?.id || ''} onChange={manejarCambioNuevo}>
                            <option value="">Seleccione categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>

                        <div className="modal-buttons">
                            <button onClick={crearLibro} className="btn-guardar">Guardar</button>
                            <button onClick={() => setShowModalNuevo(false)} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="divTable">
            <button onClick={() => setShowModalNuevo(true)} className="btn-nuevo">Nuevo Libro</button>

            <table className="tabla">
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Autor</th>
                    <th>Año</th>
                    <th>URL</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {libros.map((libro) => (
                    <tr key={libro.id}>
                        <td>{libro.titulo}</td>
                        <td>{libro.descripcion}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.año}</td>
                        <td><a href={libro.url} target="_blank" rel="noopener noreferrer">Link</a></td>
                        <td>
                            {libro.categoria
                                ? categorias.find(cat => cat.id === libro.categoria.id)?.nombre || 'N/A'
                                : 'N/A'
                            }
                        </td>
                        <td>
                            <button onClick={() => abrirModalEditar(libro)} className="btn-editar">✏️</button>
                            <button onClick={() => eliminarLibro(libro.id)} className="btn-eliminar">🗑️</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ListLibros;
