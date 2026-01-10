import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Booking from './pages/Booking';
import TicketReceipt from './pages/TicketReceipt';
import AdminDashboard from './pages/admin/Dashboard';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin, blockAdmin }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div></div>;
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

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div></div>;

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
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
