import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Booking = lazy(() => import('./pages/Booking'));
const TicketReceipt = lazy(() => import('./pages/TicketReceipt'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const CreateEvent = lazy(() => import('./pages/admin/CreateEvent'));
const EditEvent = lazy(() => import('./pages/admin/EditEvent'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-bold uppercase tracking-widest text-sm">Loading...</p>
        </div>
    </div>
);

// Protected Route Component
function ProtectedRoute({ children, requireAdmin, blockAdmin }) {
    const { user, loading } = useAuth();

    if (loading) return <PageLoader />;
    if (!user) return <Navigate to="/login" />;

    // Redirect non-admins trying to access admin pages
    if (requireAdmin && user.role !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    // Redirect admins trying to access user pages
    if (blockAdmin && user.role === 'ADMIN') {
        return <Navigate to="/admin" />;
    }

    return children;
}

// Component to redirect admins from public pages
function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <PageLoader />;

    // If user is admin, redirect to admin dashboard
    if (user && user.role === 'ADMIN') {
        return <Navigate to="/admin" />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes - Redirect admins to /admin */}
                        <Route path="/" element={
                            <PublicRoute>
                                <Layout><Home /></Layout>
                            </PublicRoute>
                        } />
                        <Route path="/events" element={
                            <PublicRoute>
                                <Layout><Events /></Layout>
                            </PublicRoute>
                        } />
                        <Route path="/events/:id" element={
                            <PublicRoute>
                                <Layout><EventDetail /></Layout>
                            </PublicRoute>
                        } />

                        {/* Auth Routes - Accessible by all */}
                        <Route path="/login" element={<Layout><Login /></Layout>} />
                        <Route path="/register" element={<Layout><Register /></Layout>} />

                        {/* Protected User Routes - Block Admins */}
                        <Route path="/profile" element={
                            <Layout>
                                <ProtectedRoute blockAdmin={true}>
                                    <Profile />
                                </ProtectedRoute>
                            </Layout>
                        } />
                        <Route path="/my-bookings" element={
                            <Layout>
                                <ProtectedRoute blockAdmin={true}>
                                    <MyBookings />
                                </ProtectedRoute>
                            </Layout>
                        } />
                        <Route path="/booking/:id" element={
                            <Layout>
                                <ProtectedRoute blockAdmin={true}>
                                    <Booking />
                                </ProtectedRoute>
                            </Layout>
                        } />
                        <Route path="/tickets/:id" element={
                            <Layout>
                                <ProtectedRoute blockAdmin={true}>
                                    <TicketReceipt />
                                </ProtectedRoute>
                            </Layout>
                        } />

                        {/* Protected Admin Routes - Admin Only */}
                        <Route path="/admin" element={
                            <AdminLayout>
                                <ProtectedRoute requireAdmin={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            </AdminLayout>
                        } />
                        <Route path="/admin/events/new" element={
                            <AdminLayout>
                                <ProtectedRoute requireAdmin={true}>
                                    <CreateEvent />
                                </ProtectedRoute>
                            </AdminLayout>
                        } />
                        <Route path="/admin/events/edit/:id" element={
                            <AdminLayout>
                                <ProtectedRoute requireAdmin={true}>
                                    <EditEvent />
                                </ProtectedRoute>
                            </AdminLayout>
                        } />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
