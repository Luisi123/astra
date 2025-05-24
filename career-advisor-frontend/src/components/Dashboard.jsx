import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response?.data) {
          setProfile(response.data);
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{profile?.name?.charAt(0) || 'U'}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.name || 'User'}</h2>
                  <p className="text-gray-600">{profile?.age || 'N/A'} years old</p>
                  <p className="text-gray-600">{profile?.school || 'N/A'}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                Edit Profile
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Interests & Hobbies</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {profile?.interests?.map((interest, index) => (
                    <li key={index}>{interest}</li>
                  )) || <li>No interests listed</li>}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Achievements</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  {profile?.achievements?.map((achievement, index) => (
                    <p key={index} className="text-yellow-700">🏆 {achievement}</p>
                  )) || <p className="text-yellow-700">No achievements listed</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Grades Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Progress</h3>
            <div className="space-y-3">
              {profile?.grades?.map((grade, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{grade.subject}</span>
                  <span className="font-semibold text-gray-800">{grade.grade}</span>
                </div>
              )) || <p>No grades recorded yet.</p>}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Chat with Assistant</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="w-full p-2 bg-transparent border-0 focus:outline-none placeholder-gray-500"
              />
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Enhanced Profile Stats */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-xl font-bold">{profile?.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Achievements</p>
                <p className="text-xl font-bold">{profile?.achievements?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Grade</p>
                <p className="text-xl font-bold">{profile?.grades?.length ? 'B+' : 'N/A'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-800">{profile?.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-400 rounded-full h-2" 
                  style={{ width: `${profile?.progress || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {profile?.interests?.map((interest, index) => (
                <div key={index} className="text-blue-600">{interest}</div>
              )) || <div className="text-blue-600">No interests listed</div>}
            </div>
          </div>

          {/* Interests Chart Visualization */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Interests & Hobbies</h3>
            <div className="space-y-3">
              {profile?.interests?.map((interest, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{interest}</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-12 bg-orange-400 rounded"></div>
                    <div className="w-8 h-16 bg-orange-500 rounded"></div>
                  </div>
                </div>
              )) || <p>No interests listed</p>}
            </div>
          </div>

          {/* AI Assistant CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl shadow-md text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ask AI</h3>
                <p className="text-purple-100">Help with your studies</p>
              </div>
            </div>
          </div>

          {/* Application Button */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Begin application</span>
              <span className="text-xl">→</span>
            </div>
          </div>

          {/* University Applications */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">University Applications</h3>
            <div className="space-y-4">
              {profile?.applications?.map((app, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{app.university}</h4>
                    <span className="text-sm text-red-600">Deadline: {new Date(app.deadline).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600">{app.program}</p>
                </div>
              )) || <p>No applications yet.</p>}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Average Completion</span>
                  <span className="font-semibold text-gray-800">{profile?.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 rounded-full h-2" 
                    style={{ width: `${profile?.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-700">📝 Software Testing Class Project - Following SWE 30S Guidelines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;