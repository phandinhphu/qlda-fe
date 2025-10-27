import { useState, useEffect } from 'react';
import * as authServices from '../../services/authServices';
import Context from './Context';
import LoadingScreen from '../../components/common/LoadingScreen';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await authServices.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogin = async (username, password) => {
        // handle login logic here
        console.log('Logging in with:', username, password);
        try {
            await authServices.login(username, password);
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed: ' + error.message);
        }
    };

    const handleLogout = async () => {
        // handle logout logic here
        console.log('Logging out');
        await authServices.logout();
        setUser(null);
    };

    const handleRegister = async (userData) => {
        // handle registration logic here
        console.log('Registering user:', userData);
        try {
            await authServices.register(userData);
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed: ' + error.message);
        }
    };

    const handleSaveUser = (userData) => {
        setUser(userData);
    };

    const handleUpdateUser = async (updatedUser) => {
        // handle user update logic here
        console.log('Updating user:', updatedUser);
        setUser(updatedUser);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Context.Provider
            value={{
                user,
                login: handleLogin,
                logout: handleLogout,
                register: handleRegister,
                updateUser: handleUpdateUser,
                saveUser: handleSaveUser,
            }}
        >
            {children}
        </Context.Provider>
    );
};
