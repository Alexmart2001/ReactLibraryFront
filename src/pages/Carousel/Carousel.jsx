import React, {useState, useEffect} from 'react';
import './Carousel.css';

const images = [
    '/galeria/autismo.jpg',
    '/galeria/elmostrodecolores.jpg',
    '/galeria/elcazodelorenzo.jpg',
    '/galeria/imagenporyecto.jpg'
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="carousel-container">
            <div
                className="carousel-slide"
                style={{transform: `translateX(-${current * 100}%)`}}
            >
                {images.map((src, index) => (
                    <img key={index} src={src} alt={`Slide ${index + 1}`} className="carousel-image"/>
                ))}
            </div>
        </div>
    );
}
