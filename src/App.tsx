import React, { useState, useEffect } from 'react';
import { CheckSquare, Database, Moon, Sun, LogOut } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { TaskFilters } from './components/TaskFilters';
import { AuthForm } from './components/AuthForm';
import { taskDb, Task } from './database/db';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('taskapp_current_user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }

    // Check dark mode preference
    const savedDarkMode = localStorage.getItem('taskapp_dark_mode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    if (savedUser) {
      loadTasks(savedUser);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, priorityFilter]);

  useEffect(() => {
    // Update dark mode class on document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskapp_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskapp_dark_mode', 'false');
    }
  }, [isDarkMode]);

  const loadTasks = async (userId: string) => {
    try {
      setIsLoading(true);
      const allTasks = await taskDb.getAllTasks(userId);
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleLogin = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('taskapp_users') || '{}');
    if (users[username] && users[username] === password) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('taskapp_current_user', username);
      loadTasks(username);
      return true;
    }
    return false;
  };

  const handleSignup = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('taskapp_users') || '{}');
    if (users[username]) {
      return false; // User already exists
    }
    users[username] = password;
    localStorage.setItem('taskapp_users', JSON.stringify(users));
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('taskapp_current_user', username);
    loadTasks(username);
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setTasks([]);
    setFilteredTasks([]);
    localStorage.removeItem('taskapp_current_user');
  };

  const handleCreateTask = async (title: string, description: string, priority: Task['priority']) => {
    try {
      const newTask = await taskDb.createTask(title, description, priority, currentUser);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskDb.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const success = await taskDb.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    in_progress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'completed').length
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} onSignup={handleSignup} isDarkMode={isDarkMode} />;
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 p-2 rounded-lg transition-colors z-10 ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare size={32} className="text-blue-600" />
            <h1 className={`text-3xl font-bold transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Task Manager
            </h1>
          </div>
          <p className={`max-w-2xl mx-auto transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            A simple yet powerful task management application with full CRUD operations powered by SQLite database.
          </p>
          <div className={`flex items-center justify-center gap-2 mt-2 text-sm transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Database size={16} />
            <span>SQLite Database</span>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Welcome, {currentUser}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        <TaskForm onSubmit={handleCreateTask} isDarkMode={isDarkMode} />

        <TaskFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          taskCounts={taskCounts}
          isDarkMode={isDarkMode}
        />

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare size={48} className={`mx-auto mb-4 transition-colors ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className={`transition-colors ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {tasks.length === 0 
                  ? 'Create your first task to get started!' 
                  : 'Try adjusting your filters to see more tasks.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          )}
        </div>

        <footer className={`mt-12 text-center text-sm transition-colors ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <p>Built with React, TypeScript, Tailwind CSS, and SQLite</p>
        </footer>
      </div>
    </div>
  );
}

export default App;