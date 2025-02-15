import React from 'react';
import { Users2, BookOpen, Target, Clock, Award, ChevronUp, ChevronDown, LineChart, BarChart3, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Customer, CustomerStats } from '../types';
import { getCustomerStats } from '../mockData';

interface CustomerAdminDashboardProps {
  customer: Customer;
}

const formatChartData = (data: number[]) => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => ({
    month,
    value: data[index]
  }));
};

const CustomerAdminDashboard: React.FC<CustomerAdminDashboardProps> = ({ customer }) => {
  const stats: CustomerStats = getCustomerStats(customer.id);

  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      trend: change >= 0 ? 'up' : 'down'
    };
  };

  const userChange = getPercentageChange(customer.totalUsers, customer.totalUsers - 20);
  const courseChange = getPercentageChange(customer.activeCourses, customer.activeCourses - 2);
  const completionChange = getPercentageChange(customer.completionRate, customer.completionRate - 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {customer.name}</h2>
          <p className="text-gray-500">{customer.industry}</p>
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-neumorph p-6 hover:shadow-neumorph-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-inner">
              <Users2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${userChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {userChange.trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {userChange.value}%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">Active Users</h3>
          <p className="text-3xl font-bold text-gray-800 text-center">{customer.totalUsers.toLocaleString()}</p>
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
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">Active Courses</h3>
          <p className="text-3xl font-bold text-gray-800 text-center">{customer.activeCourses.toLocaleString()}</p>
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
          <h3 className="text-gray-500 text-sm font-medium mb-2 text-center">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-800 text-center">{customer.completionRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">User Activity</h3>
            </div>
            <select className="text-sm text-gray-500 bg-transparent">
              <option value="users">Active Users</option>
              <option value="new">New Users</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formatChartData(stats.monthlyStats.users)}>
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
                  formatter={(value) => [`${value.toLocaleString()} users`, 'Active Users']}
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
              <h3 className="font-semibold text-gray-800">Course Progress</h3>
            </div>
            <select className="text-sm text-gray-500 bg-transparent">
              <option value="completion">Completion Rate</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatChartData(stats.monthlyStats.completion)}>
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
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
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
            <h3 className="font-semibold text-gray-800">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {stats.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{performer.name}</span>
                </div>
                <span className="font-medium text-primary">{performer.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
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

        {/* Course Progress */}
        <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">Course Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">ACLS Certification</span>
                <span className="font-medium text-primary">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Infection Prevention</span>
                <span className="font-medium text-primary">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Emergency Response</span>
                <span className="font-medium text-primary">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAdminDashboard;