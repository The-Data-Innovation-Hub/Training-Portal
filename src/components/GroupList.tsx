import React, { useState } from 'react';
import { Search, Plus, Users2, Building2, GraduationCap, Users, X, Edit, Save, AlertTriangle, ArrowLeft, Clock, UserPlus } from 'lucide-react';
import { Group, UserAccount } from '../types';
import { mockGroups, getMockCustomers } from '../mockData';
import { toast } from 'react-hot-toast';
import GroupMemberManager from './GroupMemberManager';

interface GroupListProps {
  customerId: string;
}

const GroupList: React.FC<GroupListProps> = ({ customerId }) => {
  const [groups, setGroups] = useState<Group[]>(mockGroups.filter(g => g.customerId === customerId));
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMemberManager, setShowMemberManager] = useState(false);
  const [managingGroup, setManagingGroup] = useState<Group | null>(null);

  const [formData, setFormData] = useState<Partial<Group>>({
    name: '',
    type: 'location',
    description: '',
    members: []
  });

  const handleCreateGroup = () => {
    setEditingGroup(undefined);
    setFormData({
      name: '',
      type: 'location',
      description: '',
      members: []
    });
    setShowEditor(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setFormData(group);
    setShowEditor(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    toast.success('Group deleted successfully');
  };

  const handleSaveGroup = () => {
    const newGroup: Group = {
      id: editingGroup?.id || `g${Date.now()}`,
      name: formData.name || '',
      type: formData.type as 'location' | 'class' | 'team',
      description: formData.description || '',
      members: formData.members || [],
      createdAt: editingGroup?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId
    };

    if (editingGroup) {
      setGroups(prev => prev.map(g => g.id === editingGroup.id ? newGroup : g));
      toast.success('Group updated successfully');
    } else {
      setGroups(prev => [...prev, newGroup]);
      toast.success('Group created successfully');
    }

    setShowEditor(false);
  };

  const handleUpdateMembers = (updatedGroup: Group) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    setSelectedGroup(null);
    setShowMemberManager(false);
    setManagingGroup(null);
    toast.success('Group members updated successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <Building2 className="w-5 h-5 text-primary" />;
      case 'class':
        return <GraduationCap className="w-5 h-5 text-primary" />;
      case 'team':
        return <Users className="w-5 h-5 text-primary" />;
      default:
        return <Users2 className="w-5 h-5 text-primary" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'location':
        return 'bg-blue-100 text-blue-800';
      case 'class':
        return 'bg-green-100 text-green-800';
      case 'team':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGroups = groups.filter(group => {
    const searchMatch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === 'all' || group.type === typeFilter;
    return searchMatch && typeMatch;
  });

  if (showEditor) {
    return (
      <div className="bg-white rounded-xl shadow-neumorph p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingGroup ? 'Edit Group' : 'Create New Group'}
            </h2>
          </div>
          <button
            onClick={handleSaveGroup}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Save Group
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'location' | 'class' | 'team' }))}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
            >
              <option value="location">Location</option>
              <option value="class">Class</option>
              <option value="team">Team</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter group description"
              rows={4}
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedGroup) {
    return (
      <div className="bg-white rounded-xl shadow-neumorph p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h2>
                <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getTypeColor(selectedGroup.type)}`}>
                  {selectedGroup.type.charAt(0).toUpperCase() + selectedGroup.type.slice(1)}
                </span>
              </div>
              <p className="text-gray-500">{selectedGroup.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEditGroup(selectedGroup)}
              className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit size={20} />
              Edit Group
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setEditingGroup(selectedGroup);
              }}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Delete Group
            </button>
          </div>
        </div>

        {/* Group Details */}
        <div className="grid grid-cols-2 gap-6">
          {/* Members Section */}
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-800">Members</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedGroup.members.length} members</span>
                <button
                  onClick={() => {
                    setManagingGroup(selectedGroup);
                    setShowMemberManager(true);
                  }}
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Manage Members
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {selectedGroup.members.map((memberId) => {
                const customer = getMockCustomers().find(c => c.id === selectedGroup.customerId);
                const user = customer?.users?.find(u => u.id === memberId);
                
                return user ? (
                  <div key={memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
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
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Group Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-800">Group Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Created</label>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedGroup.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Last Updated</label>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedGroup.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Groups</h2>
        <button
          onClick={handleCreateGroup}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="location">Locations</option>
          <option value="class">Classes</option>
          <option value="team">Teams</option>
        </select>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl shadow-neumorph-sm p-6 hover:shadow-neumorph transition-all duration-200"
            onClick={() => setSelectedGroup(group)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getTypeIcon(group.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(group.type)}`}>
                    {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGroup(group);
                  }}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                    setEditingGroup(group);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{group.description}</p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users2 size={16} />
              <span>{group.members.length} members</span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-bold">Delete Group</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this group? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingGroup) {
                    handleDeleteGroup(editingGroup.id);
                  }
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <X size={20} />
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Manager Modal */}
      {showMemberManager && managingGroup && (
        <GroupMemberManager
          group={managingGroup}
          onSave={handleUpdateMembers}
          onClose={() => {
            setShowMemberManager(false);
            setManagingGroup(null);
          }}
        />
      )}
    </div>
  );
};

export default GroupList;