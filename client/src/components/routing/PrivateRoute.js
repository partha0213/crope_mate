import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../redux/slices/authSlice';
import Spinner from '../layout/Spinner';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading, token]);

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;