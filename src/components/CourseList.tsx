import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Clock, Edit, Archive, Trash2, BookOpen, ChevronDown, ChevronUp, GraduationCap, Target, Users, Share2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, Module, Topic } from '../types';
import ContentEditor from './ContentEditor';
import TopicsManager from './TopicsManager';
import CourseSharing from './CourseSharing';

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user: currentUser } = useAuth();
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | undefined>(undefined);
  const [showModuleEditor, setShowModuleEditor] = useState(false);
  const [sharingCourse, setSharingCourse] = useState<Course | null>(null);

  const handleCreateCourse = () => {
    setEditingCourse(undefined);
    setShowEditor(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditor(true);
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: courseData.id || `c${Date.now()}`,
      title: courseData.title || '',
      description: courseData.description || '',
      status: courseData.status || 'draft',
      modules: courseData.modules || [],
      customerId: currentUser?.customerId || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCourse) {
      // Update existing course
      setCourseList(prev => 
        prev.map(course => course.id === editingCourse.id ? { ...newCourse, id: course.id } : course)
      );
    } else {
      // Add new course
      setCourseList(prev => [...prev, newCourse]);
    }

    setShowEditor(false);
  };

  const calculateModuleProgress = (module: Module) => {
    const totalTopics = module.topics.length;
    const completedTopics = 3; // Mock data - replace with actual tracking
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const calculateCourseProgress = (course: Course) => {
    const totalModules = course.modules.length;
    const completedModules = course.modules.reduce((sum, module) => {
      return sum + (calculateModuleProgress(module) === 100 ? 1 : 0);
    }, 0);
    return Math.round((completedModules / totalModules) * 100);
  };

  const calculateCourseRating = (course: Course) => {
    const allRatings = course.modules.flatMap(module => 
      module.topics.flatMap(topic => topic.ratings || [])
    );
    
    if (allRatings.length === 0) return undefined;
    
    return Math.round(allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length * 10) / 10;
  };

  const getTotalDuration = (course: Course) => {
    return course.modules.reduce((sum, module) => {
      return sum + module.topics.reduce((topicSum, topic) => topicSum + topic.duration, 0);
    }, 0);
  };

  const getDifficultyLevel = (course: Course) => {
    const totalDuration = getTotalDuration(course);
    if (totalDuration > 300) return 'Advanced';
    if (totalDuration > 150) return 'Intermediate';
    return 'Beginner';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragStart = (e: React.DragEvent, type: string, id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.classList.add('bg-primary/5');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('bg-primary/5');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.classList.remove('bg-primary/5');
    // Here you would implement the logic to reorder items
    setDraggedItem(null);
  };

  const handleCreateModule = () => {
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: '',
      description: '',
      order: courseList.find(c => c.id === expandedCourse)?.modules.length || 0 + 1,
      topics: []
    };
    setEditingModule(undefined);
    setShowModuleEditor(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowModuleEditor(true);
  };

  const handleSaveModuleEdit = (moduleData: Module) => {
    setCourseList(prev => prev.map(course => {
      if (course.id === expandedCourse) {
        return {
          ...course,
          modules: editingModule
            ? course.modules.map(m => m.id === editingModule.id ? moduleData : m)
            : [...course.modules, moduleData]
        };
      }
      return course;
    }));
    setShowModuleEditor(false);
    setEditingModule(undefined);
  };

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleSaveModule = (updatedModule: Module) => {
    setCourseList(prev => prev.map(course => {
      if (course.id === expandedCourse) {
        return {
          ...course,
          modules: course.modules.map(m => 
            m.id === updatedModule.id ? updatedModule : m
          )
        };
      }
      return course;
    }));
    setSelectedModule(null);
  };

  const filteredCourses = courseList.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showEditor) {
    return (
      <ContentEditor
        course={editingCourse}
        onSave={handleSaveCourse}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  if (showModuleEditor) {
    return (
      <div className="bg-white rounded-xl shadow-neumorph p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModuleEditor(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingModule ? 'Edit Module' : 'Create Module'}
            </h2>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module Title
            </label>
            <input
              type="text"
              value={editingModule?.title || ''}
              onChange={(e) => setEditingModule(prev => ({ ...prev!, title: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter module title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editingModule?.description || ''}
              onChange={(e) => setEditingModule(prev => ({ ...prev!, description: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
              placeholder="Enter module description"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModuleEditor(false)}
              className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveModuleEdit(editingModule || {
                id: `m${Date.now()}`,
                title: '',
                description: '',
                order: 0,
                topics: []
              })}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <TopicsManager
        module={selectedModule}
        courseId={expandedCourse}
        onSave={handleSaveModule}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
        <button
          onClick={handleCreateCourse}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Course List */}
      <div className={`grid ${expandedCourse ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        {filteredCourses.map(course => (
          expandedCourse === null || expandedCourse === course.id ? (
          <div
            key={course.id}
            className={`bg-white rounded-xl shadow-neumorph-sm hover:shadow-neumorph transition-all duration-200 overflow-hidden
              ${expandedCourse === course.id ? 'col-span-1' : ''}`}
            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
          >
            {/* Course Card */}
            <div className="p-6 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-primary" size={24} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                </div>
                <div className="text-gray-400 p-1">
                  {expandedCourse === course.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSharingCourse(course);
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{getTotalDuration(course)}m</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GraduationCap size={16} />
                  <span>{getDifficultyLevel(course)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen size={16} />
                  <span>{course.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Target size={16} />
                  <span>{calculateCourseProgress(course)}% Complete</span>
                  {calculateCourseRating(course) && (
                    <div className="flex items-center gap-1 ml-4">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{calculateCourseRating(course)} ({course.modules.reduce((sum, m) => sum + (m.topics.reduce((s, t) => s + (t.ratings?.length || 0), 0)), 0)} ratings)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Course Details */}
            {expandedCourse === course.id && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Course Overview</h4>
                  <p className="text-gray-600">{course.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Course Modules</h4>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateModule();
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Create Module
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {course.modules.map(module => {
                      const progress = calculateModuleProgress(module);
                      const totalDuration = module.topics.reduce((sum, topic) => sum + topic.duration, 0);

                      return (
                        <div
                          key={module.id}
                          className="bg-white p-6 rounded-lg shadow-neumorph-sm hover:shadow-neumorph-sm cursor-pointer transition-all duration-200 min-h-[200px] flex flex-col"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleModuleClick(module);
                          }}
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 mb-2">{module.title}</h5>
                            <p className="text-sm text-gray-500 mb-4">{module.description}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <div className="flex items-center gap-4">
                                <span className="font-medium text-primary">{progress}%</span>
                                {module.topics.some(t => t.ratings?.length) && (
                                  <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span>
                                      {Math.round(module.topics.reduce((sum, t) => {
                                        const topicRatings = t.ratings || [];
                                        return topicRatings.length ? sum + (topicRatings.reduce((s, r) => s + r.rating, 0) / topicRatings.length) : sum;
                                      }, 0) / module.topics.filter(t => t.ratings?.length).length * 10) / 10}
                                    </span>
                                    <span className="text-gray-400">
                                      ({module.topics.reduce((sum, t) => sum + (t.ratings?.length || 0), 0)})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{totalDuration}m</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{module.topics.length} Topics</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditModule(module);
                              }}
                              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          ) : null
        ))}
      </div>
      
      {sharingCourse && (
        <CourseSharing
          course={sharingCourse}
          onClose={() => setSharingCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseList;