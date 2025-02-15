import React, { useState } from 'react';
import { Upload, X, Plus, Save, ArrowLeft, Video, Clock, FileText } from 'lucide-react';
import { Course, Module, Topic } from '../types';

interface ContentEditorProps {
  course?: Course;
  onSave: (data: Partial<Course>) => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ course, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<Partial<Course>>(
    course || {
      title: '',
      description: '',
      status: 'draft',
      modules: []
    }
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [draggedModuleIndex, setDraggedModuleIndex] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      newModules[index] = { ...newModules[index], [field]: value };
      return { ...prev, modules: newModules };
    });
  };

  const handleTopicChange = (moduleIndex: number, topicIndex: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      const newTopics = [...(newModules[moduleIndex].topics || [])];
      newTopics[topicIndex] = { ...newTopics[topicIndex], [field]: value };
      newModules[moduleIndex] = { ...newModules[moduleIndex], topics: newTopics };
      return { ...prev, modules: newModules };
    });
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
        {
          id: `m${Date.now()}`,
          title: '',
          description: '',
          order: (prev.modules?.length || 0) + 1,
          topics: []
        }
      ]
    }));
  };

  const addTopic = (moduleIndex: number) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      const module = newModules[moduleIndex];
      module.topics = [
        ...(module.topics || []),
        {
          id: `t${Date.now()}`,
          title: '',
          description: '',
          duration: 0,
          order: (module.topics?.length || 0) + 1
        }
      ];
      return { ...prev, modules: newModules };
    });
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index)
    }));
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        topics: newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex)
      };
      return { ...prev, modules: newModules };
    });
  };

  const simulateVideoUpload = (moduleIndex: number, topicIndex: number) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleTopicChange(moduleIndex, topicIndex, 'videoUrl', 'https://example.com/video.mp4');
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDragStart = (index: number) => {
    setDraggedModuleIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedModuleIndex === null) return;

    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      const [draggedModule] = newModules.splice(draggedModuleIndex, 1);
      newModules.splice(targetIndex, 0, draggedModule);
      return { ...prev, modules: newModules };
    });
    setDraggedModuleIndex(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {course ? 'Edit Course' : 'Create New Course'}
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Save Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'details'
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Course Details
          {activeTab === 'details' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'content'
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content
          {activeTab === 'content' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Course Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter course description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Modules */}
          <div className="space-y-4">
            {formData.modules?.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow-neumorph-sm p-4"
                draggable
                onDragStart={() => handleDragStart(moduleIndex)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(moduleIndex)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset mb-2"
                      placeholder="Module Title"
                    />
                    <textarea
                      value={module.description}
                      onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                      placeholder="Module Description"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => removeModule(moduleIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Topics */}
                <div className="space-y-4 ml-6">
                  {module.topics?.map((topic, topicIndex) => (
                    <div key={topic.id} className="bg-white rounded-lg shadow-neumorph-sm p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={topic.title}
                            onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'title', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                            placeholder="Topic Title"
                          />
                          <textarea
                            value={topic.description}
                            onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'description', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                            placeholder="Topic Description"
                            rows={2}
                          />
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-gray-400" />
                                <label className="text-sm font-medium text-gray-700">
                                  Duration (minutes)
                                </label>
                              </div>
                              <input
                                type="number"
                                value={topic.duration}
                                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'duration', parseInt(e.target.value))}
                                className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                                min="0"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Video size={16} className="text-gray-400" />
                                <label className="text-sm font-medium text-gray-700">
                                  Video Upload
                                </label>
                              </div>
                              {topic.videoUrl ? (
                                <div className="flex items-center gap-2">
                                  <FileText size={16} className="text-primary" />
                                  <span className="text-sm text-gray-600">Video uploaded</span>
                                  <button
                                    onClick={() => handleTopicChange(moduleIndex, topicIndex, 'videoUrl', '')}
                                    className="text-red-500 hover:text-red-600 ml-2"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {uploadProgress > 0 ? (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-primary rounded-full h-2 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                      />
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => simulateVideoUpload(moduleIndex, topicIndex)}
                                      className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2"
                                    >
                                      <Upload size={16} />
                                      Upload Video
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTopic(moduleIndex, topicIndex)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addTopic(moduleIndex)}
                    className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Topic
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addModule}
            className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Module
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;