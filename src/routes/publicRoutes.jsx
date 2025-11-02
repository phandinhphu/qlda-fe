import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));
const ProjectPage = lazy(() => import('../pages/Project'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const publicRoutes = [
    { path: '/login', component: LoginPage, layout: null, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: null, requiresAuth: false },
    { path: '/', component: HomePage, layout: DefaultLayout, requiresAuth: true },
    { path: '/project/:projectId', component: ProjectPage, layout: DefaultLayout, requiresAuth: true },
    { path: '/forgot-password', component: ForgotPasswordPage, layout: null, requiresAuth: false },
    { path: '/reset-password/:token', component: ResetPasswordPage, layout: null, requiresAuth: false },
    { path: '/profile', component: ProfilePage, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;
