import React from 'react';
import { Filter, List, Clock, AlertCircle, Check } from 'lucide-react';
import { Task } from '../database/db';

interface TaskFiltersProps {
  statusFilter: Task['status'] | 'all';
  priorityFilter: Task['priority'] | 'all';
  onStatusFilterChange: (status: Task['status'] | 'all') => void;
  onPriorityFilterChange: (priority: Task['priority'] | 'all') => void;
  taskCounts: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  taskCounts
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: List, count: taskCounts.total },
    { value: 'pending', label: 'Pending', icon: Clock, count: taskCounts.pending },
    { value: 'in_progress', label: 'In Progress', icon: AlertCircle, count: taskCounts.in_progress },
    { value: 'completed', label: 'Completed', icon: Check, count: taskCounts.completed }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filter Tasks</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value as Task['status'] | 'all')}
                  className={`flex items-center gap-2 p-3 rounded-md text-sm transition-colors ${
                    statusFilter === option.value
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                  <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="space-y-2">
            {priorityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onPriorityFilterChange(option.value as Task['priority'] | 'all')}
                className={`w-full flex items-center gap-2 p-3 rounded-md text-sm transition-colors ${
                  priorityFilter === option.value
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  option.value === 'high' ? 'bg-red-500' :
                  option.value === 'medium' ? 'bg-yellow-500' :
                  option.value === 'low' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};