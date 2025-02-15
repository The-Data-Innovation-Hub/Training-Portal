import React, { useState } from 'react';
import { Share2, Users2, Building2, Check, X, Search } from 'lucide-react';
import { Course, Customer } from '../types';
import { toast } from 'react-hot-toast';
import { getMockCustomers } from '../mockData';

interface CourseSharingProps {
  course: Course;
  onClose: () => void;
}

type IndustryType = 
  | 'All Industries'
  | 'NHS Trust'
  | 'Primary Care Organisation'
  | 'Ambulance Service'
  | 'Care Home'
  | 'Education'
  | 'Private Care'
  | 'Charity'
  | 'Private Patient'
  | 'Pharmaceutical Company';

const industries: IndustryType[] = [
  'All Industries',
  'NHS Trust',
  'Primary Care Organisation',
  'Ambulance Service',
  'Care Home',
  'Education',
  'Private Care',
  'Charity',
  'Private Patient',
  'Pharmaceutical Company'
];

const CourseSharing: React.FC<CourseSharingProps> = ({ course, onClose }) => {
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const customers = getMockCustomers();

  const handleIndustrySelect = (industry: IndustryType) => {
    if (industry === 'All Industries') {
      setSelectedIndustries(selectedIndustries.length === industries.length - 1 ? [] : industries);
      return;
    }

    setSelectedIndustries(prev => {
      if (prev.includes(industry)) {
        const newSelection = prev.filter(i => i !== industry);
        if (prev.includes('All Industries')) {
          return newSelection.filter(i => i !== 'All Industries');
        }
        return newSelection;
      } else {
        const newSelection = [...prev, industry];
        if (newSelection.length === industries.length - 1) {
          return industries;
        }
        return newSelection;
      }
    });
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleShare = () => {
    const industriesText = selectedIndustries.length > 0 
      ? `Shared with ${selectedIndustries.length} industries`
      : '';
    const customersText = selectedCustomers.length > 0
      ? `and ${selectedCustomers.length} specific customers`
      : '';
    
    toast.success(`Course shared successfully. ${industriesText} ${customersText}`);
    onClose();
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-neumorph max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Share Course</h2>
                <p className="text-gray-500">{course.title}</p>
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

        <div className="p-6 grid grid-cols-2 gap-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Industries */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Share by Industry
            </h3>
            <div className="space-y-2">
              {industries.map(industry => (
                <label
                  key={industry}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry)}
                      onChange={() => handleIndustrySelect(industry)}
                      className="w-5 h-5 border-2 border-gray-300 rounded-md text-primary focus:ring-primary"
                    />
                    {selectedIndustries.includes(industry) && (
                      <Check className="w-4 h-4 text-primary absolute left-0.5 top-0.5" />
                    )}
                  </div>
                  <span className="text-gray-700">{industry}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Customers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-primary" />
              Share with Specific Customers
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredCustomers.map(customer => (
                <label
                  key={customer.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                      className="w-5 h-5 border-2 border-gray-300 rounded-md text-primary focus:ring-primary"
                    />
                    {selectedCustomers.includes(customer.id) && (
                      <Check className="w-4 h-4 text-primary absolute left-0.5 top-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-700">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Share2 size={20} />
              Share Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSharing;