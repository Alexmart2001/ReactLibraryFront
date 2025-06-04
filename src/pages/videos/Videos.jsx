import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Videos.css';

const Videos = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/v1/Videos', {
                    headers: {
                        Authorization: 'Basic WWVubnk6WWVubnlNYXJ0aW5lejk4',
                        "Content-Type": "application/json"
                    }
                });

                const fetchedVideos = response.data?.videosResponse?.videos || [];
                setVideos(fetchedVideos);
            } catch (error) {
                console.error('Error al cargar los videos:', error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="videos-container">
            <h2 className="videos-title">Videos educativos</h2>
            <div className="video-grid">
                {videos.map((video) => (
                    <div key={video.id} className="video-card">
                        <h3>{video.title}</h3>
                        <div className="video-wrapper">
                            <iframe
                                width="100%"
                                height="200"
                                src={video.url}
                                title={video.title}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Videos;
