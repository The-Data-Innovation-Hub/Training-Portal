import React, { useState } from 'react';
import { Mail, Building2, Clock, Shield, Save, Trash2, AlertTriangle, X, Eye, EyeOff, Check, AlertCircle, Award } from 'lucide-react';
import { UserAccount } from '../types';
import { toast } from 'react-hot-toast';
import CertificateViewer from './CertificateViewer';
import { mockCertificates } from '../mockData';

interface UserProfileProps {
  user: UserAccount & { customerName: string };
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (user: UserAccount & { customerName: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onDelete, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  const userCertificates = mockCertificates.filter(cert => cert.userId === user.id);

  if (showCertificates) {
    return (
      <CertificateViewer
        certificates={userCertificates}
        onBack={() => setShowCertificates(false)}
      />
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      toast.success('User updated successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(user.id);
    onClose();
  };

  const mockTrainingProgress = {
    completedCourses: 8,
    totalCourses: 12,
    averageScore: 92,
    timeSpent: 45,
    recentActivity: [
      { course: 'Advanced Cardiac Life Support', date: '2024-03-10', progress: 85 },
      { course: 'Infection Prevention', date: '2024-03-08', progress: 100 },
      { course: 'Emergency Response', date: '2024-03-05', progress: 75 }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-neumorph max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl font-bold">
                  {formData.firstName[0]}{formData.lastName[0]}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  Save Changes
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                Delete User
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-2 gap-6">
            {/* User Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                      disabled={formData.role === 'platform_admin'}
                    >
                      <option value="user">User</option>
                      <option value="customer_admin">Customer Admin</option>
                      {formData.role === 'platform_admin' && (
                        <option value="platform_admin">Platform Admin</option>
                      )}
                    </select>
                    {formData.role === 'platform_admin' && (
                      <p className="text-sm text-gray-500 mt-1">Platform Admin role can only be modified by other Platform Admins</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      readOnly
                      className="w-full p-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none shadow-neumorph-inset"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Training Progress */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Progress</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Completed Courses</div>
                    <div className="text-2xl font-bold text-primary">
                      {mockTrainingProgress.completedCourses}/{mockTrainingProgress.totalCourses}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Average Score</div>
                    <div className="text-2xl font-bold text-primary">
                      {mockTrainingProgress.averageScore}%
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(mockTrainingProgress.completedCourses / mockTrainingProgress.totalCourses) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {mockTrainingProgress.recentActivity.map((activity, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-800">{activity.course}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="text-primary font-medium">{activity.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5 transition-all duration-300"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-800">Certificates</h3>
                  </div>
                  <button
                    onClick={() => setShowCertificates(true)}
                    className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {userCertificates.length > 0 ? (
                    userCertificates.slice(0, 3).map(cert => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Award className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{cert.courseName}</div>
                            <div className="text-sm text-gray-500">
                              Issued on {new Date(cert.issueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {cert.grade && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            Grade: {cert.grade}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No certificates earned yet
                    </div>
                  )}
                  {userCertificates.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCertificates(true);
                      }}
                      className="w-full text-center text-primary hover:text-primary-dark text-sm py-2"
                    >
                      View {userCertificates.length - 3} more certificates
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-bold">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;