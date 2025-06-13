import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user', { 
                    withCredentials: true 
                });
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/login', 
                { username, password }, 
                { withCredentials: true }
            );
            setUser(res.data);
            navigate('/');
        } catch (err) {
            throw err;
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            navigate('/login');
        } catch (err) {
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
            setUser(null);
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;