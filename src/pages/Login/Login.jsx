import React, {useState} from 'react';
import './Login.css';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();


    const [showModal, setShowModal] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryUser, setRecoveryUser] = useState(null);
    const [preguntaSeguridad, setPreguntaSeguridad] = useState('');
    const [respuestaUsuario, setRespuestaUsuario] = useState('');
    const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [idPregunta, setIdPregunta] = useState(null);


    const [intentosFallidos, setIntentosFallidos] = useState(0);


    const [showHelpModal, setShowHelpModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [numeroTelefono, setNumeroTelefono] = useState('');
    const [correoAyuda, setCorreoAyuda] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/v1/Usuario/validar', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4",
                },
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const usuario = await response.json();

                localStorage.setItem('usuario', JSON.stringify(usuario));
                localStorage.setItem('token', 'sesion_activa');

                setMensaje(`🎉 ¡Bienvenid@ ${usuario.usuarioResponse.usuarios[0].nombre}! 🌟`);

                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            } else {
                setMensaje('❌ Correo o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            setMensaje('❌ Error al conectar con el servidor');
        }
    };

    const handleBuscarPregunta = async () => {
        try {
            const response = await fetch(`http://localhost:8080/v1/Usuario/correo/${recoveryEmail}`, {
                headers: {
                    "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4"
                }
            });

            if (response.ok) {
                const data = await response.json();
                const usuario = data.usuarioResponse?.usuarios[0];

                if (!usuario) {
                    setMensaje("⚠️ Usuario no encontrado.");
                    return;
                }
                setRecoveryUser(usuario);
                setCorreoAyuda(usuario.email);
                const responsePregunta = await fetch(`http://localhost:8080/v1/Conexion/Usuario/${usuario.id}`, {
                    headers: {
                        "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4"
                    }
                });

                if (responsePregunta.ok) {
                    const dataPregunta = await responsePregunta.json();
                    const preguntaData = dataPregunta.preguntasDeSeguridad?.preguntasDeSeguridad[0];
                    setIdPregunta(preguntaData.pregunta.id);

                    if (preguntaData) {
                        setPreguntaSeguridad(preguntaData.pregunta.pregunta);
                        setRespuestaCorrecta(preguntaData.respuesta);
                        setMensaje('');
                        setIntentosFallidos(0); // resetear contador
                    } else {
                        setMensaje("⚠️ No se encontró una pregunta de seguridad.");
                    }
                } else {
                    setMensaje("❌ Error al recuperar la pregunta de seguridad.");
                }
            } else {
                setMensaje("❌ No se encontró el usuario.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMensaje("❌ Error al recuperar los datos.");
        }
    };

    const validarRespuesta = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/v1/validarRespuesta?usuarioId=${recoveryUser.id}&idPregunta=${idPregunta}&respuestaUsuario=${respuestaUsuario}`,
                {},
                {
                    headers: {
                        "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4",
                        'Content-Type': 'application/json'
                    }
                }
            );

            const esValida = response.data;

            if (esValida === true) {
                setShowPasswordField(true);
                setMensaje("✅ Respuesta correcta. Ahora ingresa tu nueva contraseña.");
                setIntentosFallidos(0);
            } else {
                const nuevosIntentos = intentosFallidos + 1;
                setIntentosFallidos(nuevosIntentos);
                setMensaje(`❌ Respuesta incorrecta. Intento ${nuevosIntentos} de 3.`);

                if (nuevosIntentos >= 3) {
                    setShowModal(false);
                    setShowHelpModal(true);
                    setMensaje('');
                    setRespuestaUsuario('');
                    setPreguntaSeguridad('');
                    setRespuestaCorrecta('');
                }
            }
        } catch (error) {
            console.error("Error al validar la respuesta:", error);
            setMensaje("⚠️ Ocurrió un error al validar la respuesta.");
        }
    };

    const handleCambiarPassword = async () => {
        try {
            const body = {
                nombre: recoveryUser.nombre,
                email: recoveryUser.email,
                password: nuevaPassword,
                rol: recoveryUser.rol,
                metodoRegistro: recoveryUser.metodoRegistro || '',
                dispositivo: recoveryUser.dispositivo || ''
            };

            const response = await fetch(`http://localhost:8080/v1/Usuario/${recoveryUser.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setMensaje("✅ Contraseña actualizada correctamente.");
                setTimeout(() => {
                    setShowModal(false);
                    resetModal();
                }, 2000);
            } else {
                setMensaje("❌ Error al actualizar la contraseña.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMensaje("❌ Error de conexión.");
        }
    };


    const enviarSolicitudAyuda = async () => {
        if (!comentario || !numeroTelefono || !correoAyuda) {
            setMensaje("❌ Por favor completa todos los campos.");
            return;
        }

        const body = {
            usuario: {
                id: recoveryUser?.id || null,
            },
            comentario: comentario,
            numeroTelefono: numeroTelefono,
            correoElectronico: correoAyuda
        };

        try {
            const response = await fetch('http://localhost:8080/v1/Request', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setMensaje("✅ Solicitud enviada correctamente. Un administrador se pondrá en contacto contigo.");
                setTimeout(() => {
                    setShowHelpModal(false);
                    resetModal();
                    setMensaje('');
                }, 3000);
            } else {
                setMensaje("❌ Error al enviar la solicitud.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMensaje("❌ Error de conexión.");
        }
    };

    const resetModal = () => {
        setRecoveryEmail('');
        setRecoveryUser(null);
        setPreguntaSeguridad('');
        setRespuestaUsuario('');
        setRespuestaCorrecta('');
        setNuevaPassword('');
        setShowPasswordField(false);
        setIntentosFallidos(0);
        setComentario('');
        setNumeroTelefono('');
        setCorreoAyuda('');
        setMensaje('');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-card">
                <h2>🌞 Iniciar Sesión</h2>

                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn-login">🌈 Entrar</button>
                <button
                    type="button"
                    className="btn-register"
                    onClick={() => navigate('/registro')}
                >
                    📝 Registrarse
                </button>

                <button
                    type="button"
                    className="btn-register-forget"
                    onClick={() => {
                        setShowModal(true);
                        resetModal();
                    }}
                >
                    ¿Olvidaste tu contraseña?
                </button>

                {mensaje && <div className="mensaje-bienvenida">{mensaje}</div>}
            </form>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>🔐 Recuperar contraseña</h3>

                        {!preguntaSeguridad ? (
                            <>
                                <input
                                    type="email"
                                    placeholder="Ingresa tu correo"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                />
                                <button onClick={handleBuscarPregunta}>Buscar</button>
                            </>
                        ) : (
                            <>
                                <p><strong>{preguntaSeguridad}</strong></p>
                                <input
                                    type="text"
                                    placeholder="Tu respuesta"
                                    value={respuestaUsuario}
                                    onChange={(e) => setRespuestaUsuario(e.target.value)}
                                />
                                <button onClick={validarRespuesta}>Validar respuesta</button>
                            </>
                        )}

                        {showPasswordField && (
                            <>
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={nuevaPassword}
                                    onChange={(e) => setNuevaPassword(e.target.value)}
                                />
                                <button onClick={handleCambiarPassword}>Actualizar contraseña</button>
                            </>
                        )}

                        <button onClick={() => setShowModal(false)}>❌ Cerrar</button>
                        {mensaje && <p>{mensaje}</p>}
                    </div>
                </div>
            )}
            {showHelpModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>🆘 Solicitar ayuda para restablecer contraseña</h3>

                        <label>Comentario:</label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Explica brevemente tu problema"
                            rows={3}
                        />

                        <label>Teléfono de contacto:</label>
                        <input
                            type="tel"
                            value={numeroTelefono}
                            onChange={(e) => {
                                const valor = e.target.value;
                                if (/^\d{0,10}$/.test(valor)) {
                                    setNumeroTelefono(valor);
                                }
                            }}
                            placeholder="1234567890"
                        />

                        <label>Correo electrónico:</label>
                        <input
                            type="email"
                            value={correoAyuda}
                            onChange={(e) => setCorreoAyuda(e.target.value)}
                            placeholder="usuario@example.com"
                        />

                        <button onClick={enviarSolicitudAyuda}>Enviar solicitud</button>
                        <button onClick={() => setShowHelpModal(false)}>❌ Cerrar</button>
                        {mensaje && <p>{mensaje}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
