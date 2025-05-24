import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const handleLoginSuccess = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Router>
      {/* Changed to solid white background */}
      <div className="min-h-screen bg-white flex flex-col font-sans">

        {/* New Navigation Bar - simpler design */}
        <nav className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-700">CareerCompass</Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/about" className="text-gray-700 hover:text-indigo-600">About Us</Link>
              <Link to="/students" className="text-gray-700 hover:text-indigo-600">Our Students</Link>
              <Link to="/contact" className="text-gray-700 hover:text-indigo-600">Contact Us</Link>
            </div>
            <div className="flex space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600">Log in</Link>
                  <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">SIGN UP</Link>
                </>
              ) : (
                <>
                  <span className="text-gray-700">Welcome, {userEmail.split('@')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-grow">
          <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="container mx-auto text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                CAREER ADVICE & ORIENTATION
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Get guidance on choosing your career path and navigating the university application process.
              </p>
              {!isLoggedIn ? (
                <div className="space-x-4">
                  <Link to="/signup" className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                    GET STARTED
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard" className="inline-block px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">About Us</h3>
                <p className="text-gray-600">
                  Learn about our mission to support students in their career and university choices.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Our Students</h3>
                <p className="text-gray-600">
                  Read testimonials from students we've helped find their ideal career paths.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">University Reviews</h3>
                <p className="text-gray-600">
                  Discover reviews and insights on a range of universities to help you decide.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
                <p className="text-gray-600">
                  Reach out for personalized advice and answers to your questions.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Career Advice: All rights reserved.
          </div>
        </footer>

        {/* Routes - unchanged from your original */}
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard userEmail={userEmail} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          {/* Add these new routes if you implement these pages */}
          <Route path="/about" element={<div>About Us Page</div>} />
          <Route path="/students" element={<div>Our Students Page</div>} />
          <Route path="/contact" element={<div>Contact Us Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;