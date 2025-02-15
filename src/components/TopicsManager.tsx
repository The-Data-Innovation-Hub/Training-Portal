import React, { useState } from 'react';
import { ArrowLeft, Plus, Clock, Video, FileText, Trash2, Edit2, Save, X, Star } from 'lucide-react';
import { Module, Topic } from '../types';
import TopicPlayer from './TopicPlayer';
import { mockCourses } from '../mockData';

interface TopicsManagerProps {
  module: Module;
  courseId: string;
  onSave: (updatedModule: Module) => void;
  onBack: () => void;
}

const TopicsManager: React.FC<TopicsManagerProps> = ({ module, courseId, onSave, onBack }) => {
  const [topics, setTopics] = useState<Topic[]>(module.topics);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  if (selectedTopic) {
    return (
      <TopicPlayer
        moduleId={module.id}
        courseId={courseId}
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onComplete={(topicId) => {
          setTopics(prev => prev.map(t => 
            t.id === topicId 
              ? { ...t, completed: true, completedAt: new Date().toISOString() }
              : t
          ));
        }}
      />
    );
  }

  const handleAddTopic = () => {
    const newTopic: Topic = {
      id: `t${Date.now()}`,
      title: '',
      description: '',
      duration: 0,
      order: topics.length + 1
    };
    setTopics([...topics, newTopic]);
    setEditingTopic(newTopic.id);
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(topics.filter(t => t.id !== topicId));
    if (editingTopic === topicId) {
      setEditingTopic(null);
    }
  };

  const handleEditTopic = (topicId: string) => {
    setEditingTopic(topicId);
  };

  const handleSaveTopic = (topic: Topic) => {
    setTopics(prev => prev.map(t => t.id === topic.id ? topic : t));
    setEditingTopic(null);
  };

  const simulateVideoUpload = (topicId: string) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTopics(prev => prev.map(t => 
            t.id === topicId 
              ? { ...t, videoUrl: 'https://example.com/video.mp4' }
              : t
          ));
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSaveModule = () => {
    onSave({ ...module, topics });
  };

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
            <p className="text-gray-500">{module.description}</p>
          </div>
        </div>
        <button
          onClick={handleSaveModule}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-lg shadow-neumorph-sm p-4"
          >
            {editingTopic === topic.id ? ( 
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(e) => handleSaveTopic({ ...topic, title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    placeholder="Enter topic title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={topic.description}
                    onChange={(e) => handleSaveTopic({ ...topic, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    placeholder="Enter topic description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={topic.duration}
                      onChange={(e) => handleSaveTopic({ ...topic, duration: parseInt(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video
                    </label>
                    {topic.videoUrl ? (
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="text-sm text-gray-600">Video uploaded</span>
                        <button
                          onClick={() => handleSaveTopic({ ...topic, videoUrl: undefined })}
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
                            onClick={() => simulateVideoUpload(topic.id)}
                            className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2"
                          >
                            <Video size={16} />
                            Upload Video
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingTopic(null)}
                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveTopic(topic)}
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Video size={20} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-800">{topic.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{topic.description}</p>
                  {topic.ratings && topic.ratings.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {Math.round(topic.ratings.reduce((sum, r) => sum + r.rating, 0) / topic.ratings.length * 10) / 10}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({topic.ratings.length} {topic.ratings.length === 1 ? 'rating' : 'ratings'})
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} />
                    <span>{topic.duration}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTopic(topic.id)}
                      className="text-gray-400 hover:text-primary"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="col-span-2">
          <button
            onClick={handleAddTopic}
            className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicsManager;