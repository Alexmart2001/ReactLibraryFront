import React, { useState } from "react";
import "./Register.css";

function detectarDispositivo() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "Móvil";
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
    return "PC";
}

function Register() {
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [estado, setEstado] = useState(""); // "success" o "error"

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fechaRegistro = new Date().toISOString().slice(0, 19);
        const metodoRegistro = "Google";
        const dispositivo = detectarDispositivo();

        const datosConRol = {
            ...formulario,
            fechaRegistro: fechaRegistro,
            metodoRegistro: metodoRegistro,
            dispositivo: dispositivo,
            rol: {
                id: 2,
                nombre: "usuario",
            },
        };

        try {
            const respuesta = await fetch("http://localhost:8080/v1/Usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic WWVubnk6WWVubnlNYXJ0aW5lejk4",
                },
                body: JSON.stringify(datosConRol),
            });

            const data = await respuesta.json(); // Analizamos como JSON
            const mensajeServidor = data?.metadata?.[0]?.date || "Operación realizada.";

            if (respuesta.ok) {
                setMensaje(`✅ ${mensajeServidor + ", tu usuario se ha creado exitosamente"}`);
                setEstado("success");
                setFormulario({ nombre: "", email: "", password: "" });

                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setMensaje(`❌ ${mensajeServidor}`);
                setEstado("error");
            }
        } catch (error) {
            setMensaje("❌ Error de conexión con el servidor.");
            setEstado("error");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>¡Bienvenido a la Biblioteca!</h2>
                    <div className="register-icons">
                        <span>📚</span>
                        <span>🌈</span>
                        <span>✨</span>
                        <span>🖍️</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ingresa tu nombre"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formulario.email}
                            onChange={handleChange}
                            required
                            placeholder="Ingresa tu correo"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formulario.password}
                            onChange={handleChange}
                            required
                            placeholder="Crea una contraseña"
                        />
                    </div>

                    <button type="submit" className="register-button">
                        🚀 Unirme a la Biblioteca
                    </button>

                    <button
                        type="button"
                        className="register-button"
                        onClick={() => (window.location.href = "/login")}
                    >
                        🔙 Volver
                    </button>

                    {mensaje && <div className={`mensaje ${estado}`}>{mensaje}</div>}
                </form>

                <div className="register-footer">
                    <p>
                        🎉 Al registrarte podrás acceder a libros mágicos diseñados para ti ✨
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
