import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/authenticate', { email, password });
        const { accessToken, refreshToken, user: userData } = response.data; // Assuming backend returns user info now?
        // Wait, backend AuthResponse only returns tokens. 
        // We might need to decode the token or fetch /my-bookings to verify.
        // For this demo, let's trust the token works and maybe simulate user data or decode JWT.

        localStorage.setItem('token', accessToken);
        // localStorage.setItem('refreshToken', refreshToken); // Bonus

        // Since backend register/login implementation might not return full User object in some versions,
        // Using email as identifier for now if userData missing.
        const userObj = { email };

        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        return true;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const { accessToken } = response.data;

        localStorage.setItem('token', accessToken);
        const userObj = { name, email };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
