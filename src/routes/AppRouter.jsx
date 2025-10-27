import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteGuard from './RouteGuard';
import publicRoutes from './publicRoutes';
import { Fragment } from 'react';
import DefaultLayout from '../layouts';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <RouteGuard requiresAuth={route.requiresAuth}>
                                    <Layout>
                                        <route.component />
                                    </Layout>
                                </RouteGuard>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
