import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, createBrowserRouter, RouterProvider, Navigate, useNavigate, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import confusedImage from './assets/confused.png'; // Import the image
import api from './services/api';

// Landing Page Component
const LandingPage = ({ isLoggedIn, userEmail, handleLogout }) => (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Navigation Bar */}
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">CareerCompass</Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">About Us</Link>
          <Link to="/students" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Our Students</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact Us</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">Log in</Link>
              <Link to="/signup" className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">Sign up</Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">Welcome, {userEmail.split('@')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Text content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Find Your Path to Success
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
            Get personalized guidance on choosing your career path and navigating the university application process.
          </p>
          {!isLoggedIn ? (
            <div className="space-x-4">
              <Link to="/signup" className="inline-block px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started
              </Link>
            </div>
          ) : (
            <Link to="/dashboard" className="inline-block px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Go to Dashboard
            </Link>
          )}
        </div>
        {/* Image */}
        <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
          <img src={confusedImage} alt="Career Advice Illustration" className="max-w-md transform hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">About Us</h3>
          <p className="text-gray-600 leading-relaxed">
            Learn about our mission to support students in their career and university choices.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Students</h3>
          <p className="text-gray-600 leading-relaxed">
            Read testimonials from students we've helped find their ideal career paths.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">University Reviews</h3>
          <p className="text-gray-600 leading-relaxed">
            Discover reviews and insights on a range of universities to help you decide.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Get in Touch</h3>
          <p className="text-gray-600 leading-relaxed">
            Reach out for personalized advice and answers to your questions.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-50 border-t border-gray-100 py-8">
      <div className="container mx-auto px-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} CareerCompass. All rights reserved.
      </div>
    </footer>
  </div>
);

// Auth Context Provider
export const AuthContext = React.createContext(null);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const navigate = useNavigate();

  // Validate token on mount and periodically
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setIsLoggedIn(false);
          setUserEmail('');
        }
        return;
      }

      try {
        const response = await api.get('/auth/validate');
        if (isMounted) {
          setIsLoggedIn(true);
          setUserEmail(response.data.email);
        }
      } catch (error) {
        console.log('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        if (isMounted) {
          setIsLoggedIn(false);
          setUserEmail('');
          if (!window.location.pathname.includes('/login')) {
            navigate('/login', { replace: true });
          }
        }
      }
    };

    // Initial validation
    validateToken();

    // Set up periodic token validation
    const scheduleNextValidation = () => {
      timeoutId = setTimeout(() => {
        validateToken();
        scheduleNextValidation();
      }, 5 * 60 * 1000); // Check every 5 minutes
    };

    scheduleNextValidation();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);

  const handleLoginSuccess = useCallback((token, email) => {
    if (!token || !email) {
      console.error('Invalid token or email provided to handleLoginSuccess');
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    setUserEmail(email);
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/', { replace: true });
  }, [navigate]);

  const value = useMemo(() => ({
    isLoggedIn,
    userEmail,
    handleLoginSuccess,
    handleLogout
  }), [isLoggedIn, userEmail, handleLoginSuccess, handleLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Public Route wrapper
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = React.useContext(AuthContext);
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Root Layout Component
const RootLayout = () => {
  const { isLoggedIn, userEmail, handleLogout } = React.useContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} userEmail={userEmail} handleLogout={handleLogout} />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<div>About Us Page</div>} />
        <Route path="/students" element={<div>Our Students Page</div>} />
        <Route path="/contact" element={<div>Contact Us Page</div>} />
      </Routes>
    </div>
  );
};

// Error Boundary Component
const ErrorBoundary = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Oops! Something went wrong
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-4 text-center">
          <Link to="/" className="text-indigo-600 hover:text-indigo-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: '*',
      element: (
        <AuthProvider>
          <RootLayout />
        </AuthProvider>
      ),
      errorElement: <ErrorBoundary />
    },
  ], {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });

  return <RouterProvider router={router} />;
}

export default App;