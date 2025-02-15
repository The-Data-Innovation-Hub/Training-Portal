import React, { useState } from 'react';
import { Search, Users2, Plus, Check, X, UserPlus, UserMinus } from 'lucide-react';
import { Group, UserAccount } from '../types';
import { getMockCustomers } from '../mockData';
import { toast } from 'react-hot-toast';

interface GroupMemberManagerProps {
  group: Group;
  onSave: (updatedGroup: Group) => void;
  onClose: () => void;
}

const GroupMemberManager: React.FC<GroupMemberManagerProps> = ({ group, onSave, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(group.members);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'current' | 'available'>('current');

  // Get all users from the customer
  const customer = getMockCustomers().find(c => c.id === group.customerId);
  const allUsers = customer?.users || [];

  // Get current members and available users
  const currentMembers = allUsers.filter(user => selectedUsers.includes(user.id));
  const availableUsers = allUsers.filter(user => !selectedUsers.includes(user.id));

  // Filter users based on search term and current view
  const filteredUsers = (view === 'current' ? currentMembers : availableUsers).filter(user => {
    const searchMatch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedGroup: Group = {
        ...group,
        members: selectedUsers,
        updatedAt: new Date().toISOString()
      };
      onSave(updatedGroup);
      toast.success('Group members updated successfully');
    } catch (error) {
      toast.error('Failed to update group members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-neumorph max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Members</h2>
                <p className="text-gray-500">{group.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium transition-colors relative ${
                view === 'current'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('current')}
            >
              Current Members
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {currentMembers.length}
              </span>
              {view === 'current' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors relative ${
                view === 'available'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('available')}
            >
              Available Users
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {availableUsers.length}
              </span>
              {view === 'available' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleUser(user.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                    view === 'current'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {view === 'current' ? (
                    <>
                      <UserMinus size={16} />
                      Remove
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Add
                    </>
                  )}
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Users2 size={20} className="text-primary" />
                <span>{selectedUsers.length} members selected</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={20} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMemberManager;