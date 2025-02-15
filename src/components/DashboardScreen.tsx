import React, { useMemo } from 'react';
import { Users2, Building2, BookOpen, Target, TrendingUp, Clock, Award, ChevronUp, ChevronDown, BarChart3, LineChart, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getMockCustomers, platformStats, mockCourses, mockCertificates } from '../mockData';
import { useAuth } from '../context/AuthContext';

const formatChartData = (data: number[]) => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => ({
    month,
    value: data[index]
  }));
};

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const customer = getMockCustomers().find(c => c.id === user?.customerId);
  
  const stats = useMemo(() => {
    if (user?.role === 'user') {
      const userCourses = mockCourses.filter(c => 
        c.customerId === user.customerId || c.sharedWith?.includes(user.customerId)
      );
      
      const completedTopics = userCourses.reduce((sum, course) => 
        sum + course.modules.reduce((moduleSum, module) => 
          moduleSum + module.topics.filter(topic => topic.completed).length, 0
        ), 0
      );
      
      const totalTopics = userCourses.reduce((sum, course) => 
        sum + course.modules.reduce((moduleSum, module) => 
          moduleSum + module.topics.length, 0
        ), 0
      );
      
      const certificates = mockCertificates.filter(cert => cert.userId === user.id);
      
      return {
        totalCourses: userCourses.length,
        completedCourses: certificates.length,
        completionRate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
        totalLearningTime: userCourses.reduce((sum, course) => 
          sum + course.modules.reduce((moduleSum, module) => 
            moduleSum + module.topics.reduce((topicSum, topic) => 
              topicSum + (topic.completed ? topic.duration : 0), 0
            ), 0
          ), 0
        ),
        monthlyStats: {
          completion: [65, 70, 75, 78, 82, 85, 88, 90],
          learningTime: [120, 150, 140, 160, 180, 200, 190, 210]
        },
        recentActivity: userCourses
          .flatMap(course => course.modules
            .flatMap(module => module.topics
              .filter(topic => topic.completed)
              .map(topic => ({
                course: course.title,
                topic: topic.title,
                completedAt: topic.completedAt
              }))
            )
          )
          .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
          .slice(0, 5)
      };
    }
    
    return {
      totalUsers: customer?.totalUsers || 0,
      totalCustomers: 1,
      totalCourses: customer?.activeCourses || 0,
      averageCompletion: customer?.completionRate || 0,
      revenueGrowth: 28,
      activeUsers: 1250,
      averageEngagement: 45,
      customerSatisfaction: 4.8,
      ...platformStats
    };
  }, [user, customer]);

  const getPercentageChange = (current: number, previous: number = 0) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      trend: change >= 0 ? 'up' : 'down'
    };
  };

  const isUser = user?.role === 'user';
  const userChange = getPercentageChange(isUser ? stats.completedCourses : stats.activeUsers);
  const courseChange = getPercentageChange(stats.totalCourses);
  const completionChange = getPercentageChange(isUser ? stats.completionRate : stats.averageCompletion);
  const timeChange = getPercentageChange(isUser ? stats.totalLearningTime : stats.averageEngagement);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome{user?.firstName ? `, ${user.firstName}` : ' to TrainingHub'}
          </h2>
          <p className="text-gray-500">
            {isUser ? 'Your Learning Dashboard' : 'Platform Overview'}
          </p>
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-neumorph p-6 hover:shadow-neumorph-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-inner">
              {isUser ? (
                <BookOpen className="w-7 h-7 text-primary" strokeWidth={1.5} />
              ) : (
                <Users2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
              )}
            </div>
            <div className={`flex items-center gap-1 text-sm ${userChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {userChange.trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {userChange.value}%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">
            {isUser ? 'Completed Courses' : 'Active Users'}
          </h3>
          <p className="text-3xl font-bold text-gray-800 text-center">
            {isUser ? stats.completedCourses : stats.activeUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-neumorph p-6 hover:shadow-neumorph-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-inner">
              <BookOpen className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${courseChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {courseChange.trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {courseChange.value}%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">
            {isUser ? 'Available Courses' : 'Total Courses'}
          </h3>
          <p className="text-3xl font-bold text-gray-800 text-center">
            {stats.totalCourses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-neumorph p-6 hover:shadow-neumorph-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-inner">
              <Target className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${completionChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {completionChange.trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {completionChange.value}%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">
            {isUser ? 'Your Completion Rate' : 'Average Completion Rate'}
          </h3>
          <p className="text-3xl font-bold text-gray-800 text-center">
            {isUser ? stats.completionRate : stats.averageCompletion}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-neumorph p-6 hover:shadow-neumorph-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-inner">
              <Clock className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${timeChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {timeChange.trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {timeChange.value}%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">
            {isUser ? 'Learning Time (mins)' : 'Avg. Engagement (mins)'}
          </h3>
          <p className="text-3xl font-bold text-gray-800 text-center">
            {isUser ? stats.totalLearningTime : stats.averageEngagement}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">
                {isUser ? 'Your Progress' : 'User Growth'}
              </h3>
            </div>
            <select className="text-sm text-gray-500 bg-transparent">
              {isUser ? (
                <>
                  <option value="completion">Completion Rate</option>
                  <option value="time">Learning Time</option>
                </>
              ) : (
                <>
                  <option value="users">Active Users</option>
                  <option value="new">New Users</option>
                </>
              )}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formatChartData(isUser ? stats.monthlyStats.completion : platformStats.monthlyStats.users)}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0089ad" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0089ad" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [
                    isUser ? `${value}%` : `${value.toLocaleString()} users`,
                    isUser ? 'Completion Rate' : 'Active Users'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0089ad"
                  fill="url(#userGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">
                {isUser ? 'Learning Time' : 'Course Completion'}
              </h3>
            </div>
            <select className="text-sm text-gray-500 bg-transparent">
              {isUser ? (
                <>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </>
              ) : (
                <>
                  <option value="completion">Completion Rate</option>
                  <option value="engagement">Engagement</option>
                </>
              )}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatChartData(isUser ? stats.monthlyStats.learningTime : platformStats.monthlyStats.completion)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [
                    isUser ? `${value} mins` : `${value}%`,
                    isUser ? 'Learning Time' : 'Completion Rate'
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="#0089ad"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">
              {isUser ? 'Recent Achievements' : 'Top Performing Customers'}
            </h3>
          </div>
          <div className="space-y-4">
            {(isUser ? stats.recentActivity : platformStats.topPerformers).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-gray-700">
                      {isUser ? item.topic : item.name}
                    </span>
                    {isUser && (
                      <div className="text-sm text-gray-500">{item.course}</div>
                    )}
                  </div>
                </div>
                {!isUser && <span className="font-medium text-primary">{item.score}%</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {!isUser && (
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {platformStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="text-gray-700">{activity.user} <span className="text-gray-500">{activity.action}</span></p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Engagement Metrics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {isUser ? 'Course Progress' : 'Average Session Time'}
                </span>
                <span className="font-medium text-primary">
                  {isUser ? `${stats.completionRate}%` : `${stats.averageEngagement} mins`}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${isUser ? stats.completionRate : (stats.averageEngagement / 60) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {isUser ? 'Learning Time' : 'Customer Satisfaction'}
                </span>
                <span className="font-medium text-primary">
                  {isUser ? `${stats.totalLearningTime} mins` : `${stats.customerSatisfaction}/5.0`}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${isUser ? (stats.totalLearningTime / 300) * 100 : (stats.customerSatisfaction / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {isUser ? 'Completed Topics' : 'Course Completion'}
                </span>
                <span className="font-medium text-primary">
                  {isUser ? `${stats.completedCourses}/${stats.totalCourses}` : `${stats.averageCompletion}%`}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${isUser ? (stats.completedCourses / stats.totalCourses) * 100 : stats.averageCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;