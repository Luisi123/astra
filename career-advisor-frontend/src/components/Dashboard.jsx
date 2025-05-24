import React from 'react';

function Dashboard() {
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
                    <span className="text-white font-bold text-lg">AP</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Alex Payne</h2>
                  <p className="text-gray-600">17 years old</p>
                  <p className="text-gray-600">Central High School</p>
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
                  <li>Gaming</li>
                  <li>AI Software Testing</li>
                  <li>Building gaming PCs</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Achievements</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700">🏆 Robotics Competition Winner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mathematics</span>
                <span className="font-semibold text-gray-800">A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Computer Science Physics</span>
                <span className="font-semibold text-gray-800">B+</span>
              </div>
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
                <p className="text-xl font-bold">17</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Achievements</p>
                <p className="text-xl font-bold">5</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Grade</p>
                <p className="text-xl font-bold">B+</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-800">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-400 rounded-full h-2" 
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-600">Gaming</div>
              <div className="text-blue-600">AI</div>
              <div className="text-blue-600">Software Testing</div>
            </div>
          </div>

          {/* Interests Chart Visualization */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Interests & Hobbies</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Gaming</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-12 bg-orange-400 rounded"></div>
                  <div className="w-8 h-16 bg-orange-500 rounded"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Software Testing</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-10 bg-purple-400 rounded"></div>
                  <div className="w-8 h-14 bg-purple-500 rounded"></div>
                  <div className="w-8 h-18 bg-purple-600 rounded"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Robotics</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-8 bg-orange-400 rounded"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex justify-between">
              <span>Computer Science</span>
              <span>Physics B+</span>
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
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">State University</h4>
                  <span className="text-sm text-red-600">Deadline: Jan. 15</span>
                </div>
                <p className="text-gray-600">Computer Science Program</p>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Tech Institute</h4>
                  <span className="text-sm text-red-600">Deadline: Feb. 1</span>
                </div>
                <p className="text-gray-600">Artificial Intelligence Track</p>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">City College</h4>
                  <span className="text-sm text-red-600">Deadline: Mar. 10</span>
                </div>
                <p className="text-gray-600">Software Engineering Program</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Average Completion</span>
                  <span className="font-semibold text-gray-800">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 rounded-full h-2" 
                    style={{ width: '60%' }}
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

export default Dashboard;