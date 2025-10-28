import { useAuth } from '../hooks/auth';

const Home = () => {
    const { user } = useAuth();
    console.log('User data:', user);
    return (
        <div className="home-page">
            <h1>Welcome to the Home Page</h1>
            {user && <p>Hello, {user.name}!</p>}
        </div>
    );
};

export default Home;
