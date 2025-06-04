import React, { useState } from "react";
import axios from "axios";
import "./Help.css";

const Help = () => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    const userId = storedUser?.usuarioResponse?.usuarios?.[0]?.id;

    const [comentario, setComentario] = useState("");
    const [numeroTelefono, setNumeroTelefono] = useState("");
    const [correoElectronico, setCorreoElectronico] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            usuario: { id: userId },
            comentario,
            numeroTelefono,
            correoElectronico,
        };

        try {
            await axios.post(
                "http://localhost:8080/v1/Request",
                data,
                {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        "Content-Type": "application/json"
                    }
                }
            );
            setMensaje("¡Tu mensaje fue enviado con éxito!, Pronto uno de nuestros administradores se contactará  contigo");
            setComentario("");
            setNumeroTelefono("");
            setCorreoElectronico("");
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            setMensaje("Hubo un error. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="help-container">
            <h2 className="help-title">¿Necesitas ayuda?</h2>
            <p className="help-subtitle">Cuéntanos cómo podemos asistirte</p>

            <form onSubmit={handleSubmit} className="help-form">
                <label htmlFor="comentario">Comentario</label>
                <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí tu comentario..."
                    required
                />

                <label htmlFor="telefono">Número de Teléfono</label>
                <input
                    id="telefono"
                    type="tel"
                    value={numeroTelefono}
                    onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setNumeroTelefono(valor);
                    }}
                    placeholder="Ej: 3001234567"
                    required
                />


                <label htmlFor="correo">Correo Electrónico</label>
                <input
                    id="correo"
                    type="email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    placeholder="Ej: usuario@example.com"
                    required
                />

                <button type="submit" className="help-button">Enviar Ayuda</button>
            </form>

            {mensaje && <p className="help-message">{mensaje}</p>}
        </div>
    );
};

export default Help;
