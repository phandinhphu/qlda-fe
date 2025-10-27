import { AuthProvider } from './contexts/auth/AuthProvider';
import AppRouters from './routes/AppRouter';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <AppRouters />
        </AuthProvider>
    );
}

export default App;
