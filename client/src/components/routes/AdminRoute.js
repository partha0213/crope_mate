import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user && user.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default AdminRoute;