import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));

const publicRoutes = [
    { path: '/login', component: LoginPage, layout: DefaultLayout, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: DefaultLayout, requiresAuth: false },
    { path: '/', component: HomePage, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;
