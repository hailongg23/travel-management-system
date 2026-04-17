import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SessionManager from './components/SessionManager';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TourManager from './pages/admin/TourManager';
import BookingManager from './pages/admin/BookingManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes - User only */}
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <SessionManager />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/tours" element={
            <AdminRoute>
              <TourManager />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <BookingManager />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
