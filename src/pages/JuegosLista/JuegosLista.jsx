import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './JuegosLista.css';

const JuegosLista = () => {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const headers = {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        fetchJuegos();
    }, []);

    const fetchJuegos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Juegos', {headers});
            setJuegos(response.data.juegosResponse?.juegos || []);
        } catch (err) {
            setError('Error al obtener los juegos.');
        } finally {
            setLoading(false);
        }
    };

    const eliminarJuego = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará el juego!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/v1/Juegos/${id}`, {headers});
                setJuegos(juegos.filter(j => j.id !== id));
                Swal.fire('Eliminado', 'El juego ha sido eliminado.', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el juego.', 'error');
            }
        }
    };

    const abrirModalAgregarJuego = async () => {
        const {value: formValues} = await Swal.fire({
            title: 'Agregar nuevo juego',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Nombre del juego">` +
                `<input id="swal-input2" class="swal2-input" placeholder="URL del juego">`,
            focusConfirm: false,
            preConfirm: () => {
                const nombre = document.getElementById('swal-input1').value;
                const url = document.getElementById('swal-input2').value;
                if (!nombre || !url) {
                    Swal.showValidationMessage('Por favor completa ambos campos');
                    return null;
                }
                return {nombre, url};
            }
        });

        if (formValues) {
            try {
                await axios.post('http://localhost:8080/v1/Juegos', formValues, {headers});
                await fetchJuegos();
                Swal.fire('Agregado', 'El juego ha sido añadido con éxito.', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo agregar el juego.', 'error');
            }
        }
    };

    if (loading) return <div className="cargando">Cargando juegos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (juegos.length === 0) return <div className="no-datos">No hay juegos registrados.</div>;

    return (
        <div className="juegos-container">
            <h2>Lista de Juegos</h2>

            <button className="btn-agregar" onClick={abrirModalAgregarJuego}>Añadir Juego</button>

            <div className="tabla-container">
                <table className="tabla-juegos">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>URL</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {juegos.map(juego => (
                        <tr key={juego.id}>
                            <td>{juego.id}</td>
                            <td>{juego.nombre}</td>
                            <td>
                                <a href={juego.url} target="_blank" rel="noopener noreferrer">
                                    Ver juego
                                </a>
                            </td>
                            <td>
                                <button className="btn-eliminar" onClick={() => eliminarJuego(juego.id)}>
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

export default JuegosLista;
