import React from "react";
import {Routes, Route, useLocation, Navigate} from "react-router-dom";

import Home from "./Home/Home.jsx";
import Register from "./Register/Register.jsx";
import Catalogo from "./Catalogo/Catalogo.jsx";
import Usuarios from "../components/Usuarios/Usuarios.jsx";
import Login from "./Login/Login.jsx";
import DiarioEmocional from "./DiarioEmocional/DiarioEmocionalPage.jsx";
import ZonaRegulacion from "./ZonaRegulacion/ZonaRegulacion.jsx";
import EspacioDibujo from "../components/EspacioDibujo/EspacioDibujo.jsx";
import Navigation from "../components/Navigation/Navigation.jsx";
import LogoutButton from "../pages/LogoutButton/LogoutButton.jsx";
import Help from "./Help/Help.jsx";
import Comentarios from "./Comentarios/Comentarios.jsx";
import ListaLibros from "./ListaLibros/ListaLibros.jsx";
import TusEmociones from "./TusEmociones/TusEmociones.jsx";
import Cuentos from "./Cuentos/Cuentos.jsx";
import Canciones from "./Canciones/Canciones.jsx";
import Videos from "./videos/Videos.jsx";
import Juegos from "./Juegos/Juegos.jsx";
import VideosLista from "./VideosLista/VideosLista.jsx";
import JuegosLista from "./JuegosLista/JuegosLista.jsx";
import ListaCategorias from "./ListaCategorias/ListaCategorias.jsx"

import "./App.css";

function App() {
    const location = useLocation();

    const rutasSinNavegacion = ["/login", "/registro"];
    const hideNavigation = rutasSinNavegacion.includes(location.pathname);
    const showLogout = !rutasSinNavegacion.includes(location.pathname);

    const isAuthenticated = () => !!localStorage.getItem("token");

    if (!isAuthenticated() && !rutasSinNavegacion.includes(location.pathname)) {
        return <Navigate to="/login" replace/>;
    }

    const getActivePage = () => {
        if (location.pathname === "/") return "login";
        if (location.pathname.startsWith("/catalogo")) return "catalogo";
        if (location.pathname.startsWith("/usuarios")) return "usuarios";
        if (location.pathname.startsWith("/diario")) return "diario";
        if (location.pathname.startsWith("/zona")) return "zona";
        if (location.pathname.startsWith("/dibujo")) return "dibujo";
        if (location.pathname.startsWith("/Help")) return "Help";
        if (location.pathname.startsWith("/Comentarios")) return "Comentarios";
        if (location.pathname.startsWith("/ListaLibros")) return "ListaLibros";
        if (location.pathname.startsWith("/TusEmociones")) return "TusEmociones";
        if (location.pathname.startsWith("/Cuentos")) return "Cuentos";
        if (location.pathname.startsWith("/Canciones")) return "Canciones";
        if (location.pathname.startsWith("/Videos")) return "Videos";
        if (location.pathname.startsWith("/Juegos")) return "Juegos";
        if (location.pathname.startsWith("/VideosLista")) return "VideosLista";
        if (location.pathname.startsWith("/JuegosLista")) return "JuegosLista";
        if (location.pathname.startsWith("/ListaCategorias")) return "ListaCategorias";
        return "";
    };

    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                minHeight: "100vh",
                backgroundColor: "#f6e5e5"
            }}
        >
            {!hideNavigation && (
                <Navigation activePage={getActivePage()}/>
            )}

            <div
                style={{
                    marginLeft: hideNavigation ? "0" : "180px",
                    padding: "20px",
                    flex: 1,
                    position: "relative",
                }}
            >
                {showLogout && (
                    <div
                        style={{
                            position: "fixed",
                            top: "15px",
                            right: hideNavigation ? "15px" : "195px",
                            zIndex: 1000,
                            backgroundColor: "transparent"
                        }}
                    >
                        <LogoutButton/>
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/registro" element={<Register/>}/>
                    <Route path="/catalogo" element={<Catalogo/>}/>
                    <Route path="/usuarios" element={<Usuarios/>}/>
                    <Route path="/diario" element={<DiarioEmocional/>}/>
                    <Route path="/zona" element={<ZonaRegulacion/>}/>
                    <Route path="/dibujo" element={<EspacioDibujo/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/help" element={<Help/>}/>
                    <Route path="/Comentarios" element={<Comentarios/>}/>
                    <Route path="/ListaLibros" element={<ListaLibros/>}/>
                    <Route path="/TusEmociones" element={<TusEmociones/>}/>
                    <Route path="/Cuentos" element={<Cuentos/>}/>
                    <Route path="/Canciones" element={<Canciones/>}/>
                    <Route path="/Videos" element={<Videos/>}/>
                    <Route path="/Juegos" element={<Juegos/>}/>
                    <Route path="/VideosLista" element={<VideosLista/>}/>
                    <Route path="/JuegosLista" element={<JuegosLista/>}/>
                    <Route path="/ListaCategorias" element={<ListaCategorias/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;
