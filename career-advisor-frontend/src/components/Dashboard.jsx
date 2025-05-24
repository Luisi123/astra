import React from 'react';

function Dashboard({ userEmail }) {
  return (
    <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard, {userEmail}!</h2>
      <p className="text-lg text-gray-600 mb-6">This is where you'll manage your profile, explore careers, and get support.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards for dashboard sections */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">My Profile</h3>
          <p className="text-gray-600">View and update your personal information, grades, and interests.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Go to Profile</button>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Career Orientation</h3>
          <p className="text-gray-600">Chat with our AI advisor to explore career paths and university options.</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Start Chat</button>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">University Search</h3>
          <p className="text-gray-600">Find suitable universities and study programs based on your preferences.</p>
          <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">Search Universities</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;