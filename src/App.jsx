import { AuthProvider } from './contexts/auth/AuthProvider';
import SocketProvider from './contexts/socket/SocketProvider';
import AppRouters from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <AppRouters />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
