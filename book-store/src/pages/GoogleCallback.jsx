import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // Guarda el token provisionalmente
            localStorage.setItem('token', token);

            // Llama a /api/me para obtener los datos del usuario
            axios.get('http://localhost:8000/api/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const user = response.data;
                    localStorage.setItem('userProfile', JSON.stringify(user));
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error al obtener el perfil del usuario:', error);
                    localStorage.removeItem('token');
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, []);

    return <div>Procesando inicio de sesión con Google...</div>;
};

export default GoogleCallback;
