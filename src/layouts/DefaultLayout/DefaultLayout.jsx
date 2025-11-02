import Header from '../../components/HeaderComponents/Header';
const DefaultLayout = ({ children }) => {
    return (
        <div className="default-layout min-h-screen min-w-screen">
            <Header />
            {children}
        </div>
    );
};

export default DefaultLayout;
