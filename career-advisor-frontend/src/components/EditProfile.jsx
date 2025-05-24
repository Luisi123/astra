import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';

function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    interests: '',
    achievements: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response?.data) {
          setProfile(response.data);
          setFormData({
            name: response.data.name || '',
            age: response.data.age || '',
            interests: response.data.interests?.join(', ') || '',
            achievements: response.data.achievements?.join(', ') || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        name: formData.name,
        age: parseInt(formData.age, 10),
        interests: formData.interests.split(',').map(item => item.trim()),
        achievements: formData.achievements.split(',').map(item => item.trim())
      };

      const response = await profileAPI.updateProfile(updatedProfile);
      if (response?.data) {
        setProfile(response.data);
        alert('Profile updated successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interests">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="achievements">
              Achievements (comma-separated)
            </label>
            <input
              type="text"
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 