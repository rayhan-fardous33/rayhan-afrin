"use client"
import React, { useState } from 'react';
import { ShieldUser, Trash2, UserRound } from 'lucide-react';

// Mock Data matching the theme vibe
const initialUsers = [
  { id: 1, name: 'RayHan Afrin', email: 'rayhan@orbit.com', role: 'Admin', avatar: 'https://i.ibb.co.com/HTPVgFy0/file-00000000acb471fdaf64588a35799ec3.jpg' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'User', avatar: 'https://i.ibb.co.com/HTPVgFy0/file-00000000acb471fdaf64588a35799ec3.jpg' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatar: 'https://i.ibb.co.com/HTPVgFy0/file-00000000acb471fdaf64588a35799ec3.jpg' },
  { id: 4, name: 'Alex Karim', email: 'alex@orbit.com', role: 'Moderator', avatar: 'https://i.ibb.co.com/HTPVgFy0/file-00000000acb471fdaf64588a35799ec3.jpg' },
];

const AllUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  // Example handler to change roles
  const handleMakeAdmin = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: 'Admin' } : user));
  };

  return (
    <div className="p-6 bg-[#FFF9FA] min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Registered Users</h1>
        <p className="text-sm text-gray-500">Total Users: {users.length}</p>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF0F2] text-[#FF2E63] font-semibold text-sm uppercase tracking-wider">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 text-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FFF9FA] transition-colors">
                  {/* Name & Avatar */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full border border-pink-200 object-cover"
                    />
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </td>
                  
                  {/* Email */}
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  
                  {/* Role Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'Admin' 
                        ? 'bg-pink-100 text-[#FF2E63]' 
                        : user.role === 'Moderator'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'Admin' ? <ShieldUser className="mr-1" /> : <UserRound className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {user.role !== 'Admin' && (
                        <button 
                          onClick={() => handleMakeAdmin(user.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-[#FF2E63] hover:bg-[#e02454] rounded-lg shadow-sm transition-all"
                        >
                          Make Admin
                        </button>
                      )}
                      <button 
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;