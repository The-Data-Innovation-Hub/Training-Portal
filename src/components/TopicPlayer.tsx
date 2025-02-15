import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Video, FileText, CheckCircle, Star, X } from 'lucide-react';
import { Topic } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { mockCourses, mockCertificates } from '../mockData';

interface TopicPlayerProps {
  topic: Topic;
  moduleId: string;
  courseId: string;
  onBack: () => void;
  onComplete: (topicId: string) => void;
}

const TopicPlayer: React.FC<TopicPlayerProps> = ({ topic, moduleId, courseId, onBack, onComplete }) => {
  const { user } = useAuth();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);

  const userRating = topic.ratings?.find(r => r.userId === user?.id);
  const averageRating = topic.ratings?.length 
    ? Math.round(topic.ratings.reduce((sum, r) => sum + r.rating, 0) / topic.ratings.length * 10) / 10
    : undefined;

  useEffect(() => {
    // Show rating prompt after 30 seconds of video playback
    if (!userRating && !showRating && !showRatingPrompt) {
      const timer = setTimeout(() => {
        setShowRatingPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [userRating, showRating, showRatingPrompt]);

  const checkCourseCompletion = () => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;

    // Check if all topics in all modules are completed
    const allTopicsCompleted = course.modules.every(module =>
      module.topics.every(topic => topic.completed)
    );

    if (allTopicsCompleted && user) {
      // Generate certificate
      const certificateNumber = `${course.title.slice(0, 4).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const newCertificate = {
        id: `cert${Date.now()}`,
        userId: user.id,
        courseId: course.id,
        courseName: course.title,
        userName: `${user.firstName} ${user.lastName}`,
        customerName: user.customerId ? mockCustomers.find(c => c.id === user.customerId)?.name || '' : '',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
        certificateNumber,
        grade: 'Distinction',
        signatures: [
          {
            name: 'Dr. James Wilson',
            title: 'Course Director',
            signature: 'https://example.com/signatures/jwilson.png'
          },
          {
            name: 'Dr. Emma Thompson',
            title: 'Medical Director',
            signature: 'https://example.com/signatures/ethompson.png'
          }
        ]
      };

      mockCertificates.push(newCertificate);
      toast.success('Course completed! Certificate generated successfully');
    }
  };
  const handleComplete = () => {
    onComplete(topic.id);
    toast.success('Topic completed successfully');
    if (!userRating) {
      setShowRating(true);
    }
    checkCourseCompletion();
  };

  const handleRate = () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    const newRating = {
      userId: user!.id,
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const existingRatings = topic.ratings || [];
    const updatedRatings = [...existingRatings.filter(r => r.userId !== user?.id), newRating];
    const newAverageRating = Math.round(updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length * 10) / 10;

    // In a real app, this would be an API call
    topic.ratings = updatedRatings;
    topic.averageRating = newAverageRating;

    setShowRating(false);
    toast.success('Thank you for your rating!');
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
            <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{topic.duration} minutes</span>
              </div>
              {averageRating !== undefined && (
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span>{averageRating} ({topic.ratings?.length || 0} ratings)</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Video size={16} />
                <span>Video Lesson</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
        {topic.videoUrl ? (
          <video
            id="topic-video"
            className="w-full h-full"
            controls
            autoPlay
            src={topic.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Video size={48} className="mx-auto mb-2 opacity-50" />
              <p>Video not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Description</h3>
          </div>
          <p className="text-gray-600">{topic.description}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Ratings & Reviews</h3>
            </div>
            {!userRating && (
              <button
                onClick={() => setShowRating(true)}
                className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors"
              >
                Rate this Topic
              </button>
            )}
          </div>
          
          {topic.ratings && topic.ratings.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-gray-800">{averageRating}</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={16}
                        className={`${
                          value <= averageRating!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {topic.ratings.length} {topic.ratings.length === 1 ? 'rating' : 'ratings'}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {topic.ratings.slice(0, 3).map((r, index) => (
                  <div key={index} className="border-t border-gray-200 pt-3">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={12}
                          className={`${
                            value <= r.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {r.comment && (
                      <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No ratings yet. Be the first to rate this topic!
            </div>
          )}
        </div>
      </div>
      
      {/* Completion Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleComplete}
          disabled={topic.completed}
          className={`px-4 py-2 rounded-lg shadow-neumorph-sm flex items-center gap-2 ${
            topic.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-primary text-white hover:bg-primary-dark'
          } transition-colors`}
        >
          <CheckCircle size={20} />
          {topic.completed ? 'Completed' : 'Mark as Complete'}
        </button>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rate this Topic</h3>
            <p className="text-gray-600 mb-6">How would you rate your experience with this topic?</p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={32}
                    className={`${
                      (hoverRating || rating) >= value
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                placeholder="Share your thoughts about this topic..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRating(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleRate}
                className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Prompt */}
      {showRatingPrompt && !userRating && !showRating && (
        <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-neumorph p-4 max-w-sm animate-slide-up">
          <div className="flex items-start gap-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">How's the lesson?</h4>
              <p className="text-sm text-gray-600 mb-3">Would you like to rate this topic?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRating(true);
                    setShowRatingPrompt(false);
                  }}
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors"
                >
                  Rate Now
                </button>
                <button
                  onClick={() => setShowRatingPrompt(false)}
                  className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowRatingPrompt(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicPlayer;