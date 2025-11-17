import { useContext } from 'react';
import Context from '../contexts/auth/Context';

export const useAuth = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
