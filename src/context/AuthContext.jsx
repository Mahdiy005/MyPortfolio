import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await authAPI.verify();
            if (response.data.valid) {
                setIsAuthenticated(true);
                setUser(response.data.user);
            } else {
                localStorage.removeItem('adminToken');
            }
        } catch (error) {
            localStorage.removeItem('adminToken');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await authAPI.login(username, password);
        localStorage.setItem('adminToken', response.data.token);
        setIsAuthenticated(true);
        setUser({ username });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
