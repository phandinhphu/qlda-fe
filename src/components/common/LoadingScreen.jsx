import Spinner from '../Spinner';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
