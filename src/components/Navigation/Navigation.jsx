import React, {useState, useEffect} from 'react';
import {
    FaHome,
    FaBook,
    FaUsers,
    FaRegCalendarAlt,
    FaPuzzlePiece,
    FaPaintBrush,
    FaQuestionCircle,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import './Navigation.css';

function Navigation({activePage}) {
    const [animate, setAnimate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [rolId, setRolId] = useState(null);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [activePage]);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('usuario');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const usuario = parsed?.usuarioResponse?.usuarios?.[0];
                if (usuario?.rol?.id) {
                    setRolId(usuario.rol.id);
                }
            }
        } catch (error) {
            console.error('Error leyendo usuarioResponse del localStorage:', error);
        }
    }, []);

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const navLinks = [
        {href: '/home', icon: FaHome, label: 'Inicio', key: 'inicio'},
        {href: '/catalogo', icon: FaBook, label: 'Catálogo', key: 'catalogo'},
        {href: '/usuarios', icon: FaUsers, label: 'Usuarios', key: 'usuarios'},
        {href: '/diario', icon: FaRegCalendarAlt, label: 'Diario Emocional', key: 'diario'},
        {href: '/zona', icon: FaPuzzlePiece, label: 'Zona de Regulación', key: 'zona'},
        {href: '/dibujo', icon: FaPaintBrush, label: 'Espacio de Dibujo', key: 'dibujo'},
        {href: '/TusEmociones', icon: FaPuzzlePiece, label: "Tus emociones", key: 'TusEmociones'},
        {href: '/Videos', icon: FaPuzzlePiece, label: "Videos interesantes", key: 'Videos'},
        {href: '/Juegos', icon: FaPuzzlePiece, label: "Juegos para ti!", key: 'Juegos'},
        {href: '/help', icon: FaQuestionCircle, label: '¿Necesitas ayuda?', key: 'help'},
        {href: '/Comentarios', icon: FaBars, label: "Comentarios de ayuda", key: 'Comentarios'},
        {href: '/ListaLibros', icon: FaBook, label: 'Lista de libros', key: 'ListaLibros'},
        {href: '/Cuentos', icon: FaPaintBrush, label: "Añade cuentos", key: 'Cuentos'},
        {href: '/Canciones', icon: FaPaintBrush, label: "Añade canciones", key: 'Canciones'},
        {href: '/VideosLista', icon: FaPuzzlePiece, label: "Añade videos", key: 'VideosLista'},
        {href: '/JuegosLista', icon: FaPuzzlePiece, label: "Añade juegos", key: 'JuegosLista'},
        {href: '/ListaCategorias', icon: FaBook, label: "Añade categorias", key: 'ListaCategorias'},
    ];

    const filteredLinks = navLinks.filter(link => {
        if (rolId === 1) return true;
        if (rolId === 2) return !['usuarios', 'Comentarios', 'ListaLibros', 'Cuentos', 'Canciones', 'JuegosLista', 'VideosLista', 'ListaCategorias'].includes(link.key);
        return true;
    });

    return (
        <>
            {!isOpen && (
                <button
                    className="sidebar-toggle-button"
                    onClick={toggleSidebar}
                    aria-label="Abrir menú"
                    aria-expanded={isOpen}
                >
                    <FaBars size={24}/>
                </button>
            )}

            <nav className={`navigation ${isOpen ? 'open' : 'closed'}`} aria-hidden={!isOpen}>
                <button
                    className="sidebar-close-button"
                    onClick={toggleSidebar}
                    aria-label="Cerrar menú"
                    aria-expanded={isOpen}
                >
                    <FaTimes size={24}/>
                </button>

                <div className="nav-links">
                    {filteredLinks.map(({href, icon: Icon, label, key}) => (
                        <a
                            key={key}
                            href={href}
                            className={`${activePage === key ? 'active' : ''} ${animate && activePage === key ? 'animate' : ''}`}
                        >
                            <Icon className="nav-icon"/>
                            <span>{label}</span>
                        </a>
                    ))}
                </div>
            </nav>
        </>
    );
}

export default Navigation;
