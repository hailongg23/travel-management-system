import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
