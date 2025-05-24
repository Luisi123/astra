import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  // If logged in, redirect to dashboard
  if (isLoggedIn) {
    // Get the redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // If not logged in, render the public component
  return children;
};

export default PublicRoute; 