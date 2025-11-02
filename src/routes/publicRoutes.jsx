import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));

const publicRoutes = [
    { path: '/login', component: LoginPage, layout: null, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: null, requiresAuth: false },
    { path: '/', component: HomePage, layout: DefaultLayout, requiresAuth: true },
    { path: '/projects', component: ProjectsPage, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;
