import React, { useState } from 'react';
import { Save, Shield, Mail, Bell, Lock, Globe, Database, Palette, Cloud, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PlatformSettings {
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expiryDays: number;
    };
    mfa: {
      enabled: boolean;
      required: boolean;
    };
    sessionTimeout: number;
  };
  email: {
    fromName: string;
    fromEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableInAppNotifications: boolean;
    digestFrequency: 'never' | 'daily' | 'weekly';
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    font: string;
    logoUrl: string;
    favicon: string;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageProvider: 'local' | 's3' | 'gcs';
  };
}

const defaultSettings: PlatformSettings = {
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    mfa: {
      enabled: true,
      required: false
    },
    sessionTimeout: 30
  },
  email: {
    fromName: 'TrainingHub',
    fromEmail: 'notifications@traininghub.com',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'smtp-user',
    smtpPassword: '********'
  },
  notifications: {
    enableEmailNotifications: true,
    enableInAppNotifications: true,
    digestFrequency: 'daily'
  },
  branding: {
    primaryColor: '#0089ad',
    secondaryColor: '#2c3e50',
    tertiaryColor: '#e74c3c',
    font: 'Inter',
    logoUrl: '',
    favicon: ''
  },
  storage: {
    maxFileSize: 50,
    allowedFileTypes: ['.pdf', '.mp4', '.jpg', '.png'],
    storageProvider: 'local'
  }
};

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('security');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof PlatformSettings],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section: string, parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof PlatformSettings],
        [parent]: {
          ...prev[section as keyof PlatformSettings][parent],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'email', label: 'Email', icon: <Mail size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'branding', label: 'Branding', icon: <Palette size={20} /> },
    { id: 'storage', label: 'Storage', icon: <Database size={20} /> }
  ];

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Platform Settings</h2>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Password Policy</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Require uppercase letters</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Require numbers</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Require special characters</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordPolicy.expiryDays}
                    onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Authentication</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.security.mfa.enabled}
                      onChange={(e) => handleNestedChange('security', 'mfa', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Enable Multi-Factor Authentication</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.security.mfa.required}
                      onChange={(e) => handleNestedChange('security', 'mfa', 'required', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Require MFA for all users</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Email Configuration</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => handleChange('email', 'fromName', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleChange('email', 'smtpHost', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleChange('email', 'smtpPort', parseInt(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpUser}
                    onChange={(e) => handleChange('email', 'smtpUser', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.enableEmailNotifications}
                    onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Enable Email Notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.enableInAppNotifications}
                    onChange={(e) => handleChange('notifications', 'enableInAppNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Enable In-App Notifications</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digest Frequency
                </label>
                <select
                  value={settings.notifications.digestFrequency}
                  onChange={(e) => handleChange('notifications', 'digestFrequency', e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                >
                  <option value="never">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Branding Settings */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Branding</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Brand Colors
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primary</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.branding.primaryColor}
                        onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
                        className="h-10 w-16 rounded shadow-neumorph-inset"
                      />
                      <input
                        type="text"
                        value={settings.branding.primaryColor}
                        onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Secondary</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
                        className="h-10 w-16 rounded shadow-neumorph-inset"
                      />
                      <input
                        type="text"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tertiary</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.branding.tertiaryColor}
                        onChange={(e) => handleChange('branding', 'tertiaryColor', e.target.value)}
                        className="h-10 w-16 rounded shadow-neumorph-inset"
                      />
                      <input
                        type="text"
                        value={settings.branding.tertiaryColor}
                        onChange={(e) => handleChange('branding', 'tertiaryColor', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Color Preview</h4>
                  <div className="flex gap-4">
                    <div
                      className="w-full h-16 rounded-lg shadow-neumorph-sm"
                      style={{ backgroundColor: settings.branding.primaryColor }}
                    />
                    <div
                      className="w-full h-16 rounded-lg shadow-neumorph-sm"
                      style={{ backgroundColor: settings.branding.secondaryColor }}
                    />
                    <div
                      className="w-full h-16 rounded-lg shadow-neumorph-sm"
                      style={{ backgroundColor: settings.branding.tertiaryColor }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Font
                </label>
                <select
                  value={settings.branding.font}
                  onChange={(e) => handleChange('branding', 'font', e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Nunito">Nunito</option>
                  <option value="Ubuntu">Ubuntu</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg" style={{ fontFamily: settings.branding.font }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  {settings.branding.logoUrl ? (
                    <img
                      src={settings.branding.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded-lg shadow-neumorph-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg shadow-neumorph-sm flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => {/* Handle logo upload */}}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Upload Logo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Storage Settings */}
        {activeTab === 'storage' && (
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Storage Configuration</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Provider
                </label>
                <select
                  value={settings.storage.storageProvider}
                  onChange={(e) => handleChange('storage', 'storageProvider', e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">Amazon S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.storage.maxFileSize}
                  onChange={(e) => handleChange('storage', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed File Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {settings.storage.allowedFileTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                    >
                      {type}
                      <button
                        onClick={() => {
                          const newTypes = settings.storage.allowedFileTypes.filter(t => t !== type);
                          handleChange('storage', 'allowedFileTypes', newTypes);
                        }}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newType = prompt('Enter file extension (e.g., .pdf)');
                      if (newType) {
                        handleChange('storage', 'allowedFileTypes', [...settings.storage.allowedFileTypes, newType]);
                      }
                    }}
                    className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:text-primary hover:border-primary"
                  >
                    Add Type
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;