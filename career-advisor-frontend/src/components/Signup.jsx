import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../App';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    school: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLoginSuccess } = useContext(AuthContext);

  // Clear previous logs
  const addLog = (message, data = null) => {
    const logs = JSON.parse(localStorage.getItem('signupLogs') || '[]');
    const log = { timestamp: new Date().toISOString(), message, data };
    logs.push(log);
    console.log(message, data);
    localStorage.setItem('signupLogs', JSON.stringify(logs));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Clear previous logs
    localStorage.removeItem('signupLogs');
    const logs = [];

    addLog('Form validation - Checking required fields:', {
      email: formData.email ? 'present' : 'missing',
      password: formData.password ? 'present' : 'missing',
      confirmPassword: formData.confirmPassword ? 'present' : 'missing',
      name: formData.name ? 'present' : 'missing',
      age: formData.age ? 'present' : 'missing',
      school: formData.school ? 'present' : 'missing'
    });

    // Validate required fields
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.age || !formData.school) {
      addLog('Validation failed - Missing required fields');
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      addLog('Validation failed - Passwords do not match');
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 100) {
      addLog('Validation failed - Invalid age');
      setError('Age must be between 13 and 100');
      setIsLoading(false);
      return;
    }

    try {
      addLog('Attempting signup with data:', {
        email: formData.email,
        name: formData.name,
        age: formData.age,
        school: formData.school,
        passwordLength: formData.password.length
      });

      const response = await api.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: parseInt(formData.age),
        school: formData.school
      });

      addLog('Signup response:', {
        status: response.status,
        hasToken: !!response.data.token,
        message: response.data.message
      });

      if (response.data.token) {
        // Use the handleLoginSuccess from AuthContext
        handleLoginSuccess(response.data.token, response.data.user.email);
        navigate('/dashboard');
      } else {
        addLog('No token in response');
        setError('Signup successful but no token received');
      }
    } catch (error) {
      addLog('Signup error details:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        request: error.request ? 'Request was made' : 'No request made'
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        if (error.response.data.message === 'User with this email already exists') {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else {
          setError(error.response.data.message || 'Please check your input and try again.');
        }
      } else {
        setError('An error occurred during signup. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <div className="mt-1">
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="13"
                  max="100"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                School
              </label>
              <div className="mt-1">
                <input
                  id="school"
                  name="school"
                  type="text"
                  required
                  value={formData.school}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
          
          {/* Debug Section */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <button
              onClick={() => {
                const logs = JSON.parse(localStorage.getItem('signupLogs') || '[]');
                console.log('Signup Logs:', logs);
                alert(JSON.stringify(logs, null, 2));
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Show Debug Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;