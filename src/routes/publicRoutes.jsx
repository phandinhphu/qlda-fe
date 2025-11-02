import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));
const ProjectsPage = lazy(() => import('../pages/Projects'));
const ProjectPage = lazy(() => import('../pages/Project'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'));
const publicRoutes = [
    { path: '/login', component: LoginPage, layout: null, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: null, requiresAuth: false },
    { path: '/', component: HomePage, layout: DefaultLayout, requiresAuth: true },
    { path: '/projects', component: ProjectsPage, layout: DefaultLayout, requiresAuth: true },
    { path: '/profile', component: ProfilePage, layout: DefaultLayout, requiresAuth: true },
    { path: '/projects/:projectId', component: ProjectPage, layout: null, requiresAuth: true },
    { path: '/reset-password/:token', component: ResetPasswordPage, layout: null, requiresAuth: false },
    { path: '/forgot-password', component: ForgotPasswordPage, layout: null, requiresAuth: false },
];

export default publicRoutes;
