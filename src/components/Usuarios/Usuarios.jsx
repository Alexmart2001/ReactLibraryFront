import React, { useEffect, useState } from "react";
import axios from "axios";
import './Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  function detectarDispositivo() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "Móvil";
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
    return "PC";
  }

  const abrirModalEditar = (usuario) => {
    setUsuarioAEditar({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol?.id?.toString() || ""
    });
    setShowEditModal(true);
  };

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: ""
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios.get("http://localhost:8080/v1/Usuario", {
      headers: {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4'
      }
    })
        .then((response) => {
          setUsuarios(response.data.usuarioResponse.usuarios);
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios:", error);
        });
  };

  const handleEliminar = () => {
    if (!usuarioAEliminar) return;

    axios.delete(`http://localhost:8080/v1/Usuario/${usuarioAEliminar.id}`, {
      headers: {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4'
      }
    })
        .then(() => {
          setShowDeleteModal(false);
          setUsuarioAEliminar(null);
          fetchUsuarios();
        })
        .catch((error) => {
          console.error("Error al eliminar el usuario:", error);
          alert("No se pudo eliminar el usuario.");
        });
  };

  const handleAgregarUsuario = () => {
    const rolId = parseInt(nuevoUsuario.rol, 10);

    const fechaRegistro = new Date().toISOString().slice(0, 19);
    const metodoRegistro = "Panel del administrador";
    const dispositivo = detectarDispositivo();

    const usuarioAEnviar = {
      ...nuevoUsuario,
      rol: {
        id: rolId,
        nombre: rolId === 1 ? "administrador" : "usuario"
      },
      password: nuevoUsuario.password,
      fechaRegistro,
      metodoRegistro,
      dispositivo
    };

    axios.post("http://localhost:8080/v1/Usuario", usuarioAEnviar, {
      headers: {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
        "Content-Type": "application/json"
      }
    })
        .then(() => {
          setShowAddModal(false);
          setNuevoUsuario({nombre: "", email: "", password: "", rol: ""});
          fetchUsuarios();
        })
        .catch((error) => {
          console.error("Error al agregar el usuario:", error);
          alert("No se pudo agregar el usuario. Verifica los datos.");
        });
  };

  const handleEditarUsuario = () => {
    const rolId = parseInt(usuarioAEditar.rol, 10);

    const usuarioActualizado = {
      nombre: usuarioAEditar.nombre,
      email: usuarioAEditar.email,
      password: usuarioAEditar.password,
      rol: {
        id: rolId
      }
    };

    axios.put(`http://localhost:8080/v1/Usuario/${usuarioAEditar.id}`, usuarioActualizado, {
      headers: {
        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
        "Content-Type": "application/json"
      }
    })
        .then(() => {
          setShowEditModal(false);
          setUsuarioAEditar(null);
          fetchUsuarios();
        })
        .catch((error) => {
          console.error("Error al editar el usuario:", error);
          alert("No se pudo editar el usuario.");
        });
  };

  return (
      <div className="usuarios-container">
        <div className="usuarios-header">
          <h2>Lista de Usuarios</h2>
          <button className="btn-agregar" onClick={() => setShowAddModal(true)}>
            + Agregar Usuario
          </button>
        </div>

        {usuarios.length === 0 ? (
            <p className="no-usuarios">No hay usuarios registrados.</p>
        ) : (
            <div className="tabla-container">
              <table className="tabla-usuarios">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de creación</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td className="email-col">{usuario.email}</td>
                      <td>{usuario.rol?.nombre || "Sin rol"}</td>
                      <td>
                        {usuario.fechaRegistro
                            ? `${new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}, ${new Date(usuario.fechaRegistro).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}`
                            : "Sin fecha"}
                      </td>
                      <td>
                        <button className="btn-editar" onClick={() => abrirModalEditar(usuario)}>
                          ✏️
                        </button>
                        <button className="btn-eliminar" onClick={() => {
                          setUsuarioAEliminar(usuario);
                          setShowDeleteModal(true);
                        }}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
        {showEditModal && usuarioAEditar && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Editar Usuario</h3>
                <input
                    type="text"
                    value={usuarioAEditar.nombre}
                    onChange={(e) => setUsuarioAEditar({...usuarioAEditar, nombre: e.target.value})}
                    placeholder="Nombre"
                />
                <input
                    type="email"
                    value={usuarioAEditar.email}
                    onChange={(e) => setUsuarioAEditar({...usuarioAEditar, email: e.target.value})}
                    placeholder="Email"
                />
                <input
                    type="text"
                    value={usuarioAEditar.password}
                    onChange={(e) => setUsuarioAEditar({...usuarioAEditar, password: e.target.value})}
                    placeholder="Password"
                />
                <select
                    className="select-rol"
                    value={usuarioAEditar.rol}
                    onChange={(e) => setUsuarioAEditar({...usuarioAEditar, rol: e.target.value})}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                </select>
                <div className="modal-buttons">
                  <button className="btn-agregar" onClick={handleEditarUsuario}>Guardar</button>
                  <button className="btn-agregar" onClick={() => setShowEditModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
        )}

        {/* Modal Eliminar */}
        {showDeleteModal && usuarioAEliminar && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Confirmar Eliminación</h3>
                <p>¿Estás seguro de que deseas eliminar al usuario <strong>{usuarioAEliminar.nombre}</strong> con ID <strong>{usuarioAEliminar.id}</strong>?</p>
                <div className="modal-buttons">
                  <button className="btn-eliminar-modal" onClick={handleEliminar}>Eliminar</button>
                  <button className="btn-cancelar" onClick={() => {
                    setShowDeleteModal(false);
                    setUsuarioAEliminar(null);
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
                <h3>Agregar Nuevo Usuario</h3>
                <input
                    type="text"
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                    placeholder="Nombre"
                />
                <input
                    type="email"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                    placeholder="Email"
                />
                <input
                    type="text"
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                    placeholder="Password"
                />
                <select
                    className="select-rol"
                    value={nuevoUsuario.rol}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                </select>
                <div className="modal-buttons">
                  <button className="btn-agregar" onClick={handleAgregarUsuario}>Agregar</button>
                  <button className="btn-agregar" onClick={() => setShowAddModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default Usuarios;
