'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Users, 
  ArrowRight, 
  ChevronDown, 
  Filter,
  Search,
  Bolt,
  Bell,
  PieChart,
  MessageSquare,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router'

// Sample data for automation tasks
const taskCategories = [
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' },
  { id: 'customer', name: 'Customer Service' },
  { id: 'analytics', name: 'Analytics' }
];

const automationTasks = [
  {
    id: 1,
    title: "Send welcome emails to new leads",
    description: "Automatically send personalized welcome emails to new leads within 1 hour of signup",
    progress: 100,
    category: "marketing",
    status: "active",
    runCount: 127,
    lastRun: "2 hours ago",
    icon: MessageSquare
  },
  {
    id: 2,
    title: "Weekly sales performance report",
    description: "Generate and email weekly sales performance reports to team leaders every Monday at 9am",
    progress: 100,
    category: "sales",
    status: "active", 
    runCount: 42,
    lastRun: "3 days ago",
    icon: PieChart
  },
  {
    id: 3,
    title: "Customer satisfaction survey",
    description: "Send satisfaction surveys to customers 7 days after purchase completion",
    progress: 85,
    category: "customer",
    status: "active",
    runCount: 215,
    lastRun: "1 day ago",
    icon: Users
  },
  {
    id: 4,
    title: "Follow-up on abandoned carts",
    description: "Send reminder emails to customers who abandoned their shopping carts after 24 hours",
    progress: 75,
    category: "sales",
    status: "paused",
    runCount: 98,
    lastRun: "1 week ago",
    icon: Bell
  }
];

// Badge component
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-800 text-gray-300",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
    purple: "bg-amber-500/20 text-amber-400"
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Switch component
const Switch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
      enabled ? 'bg-amber-500' : 'bg-gray-700'
    }`}
  >
    <span className="sr-only">Toggle automation</span>
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Progress bar component
const ProgressBar = ({ value, className, status = "active" }) => (
  <div className={`h-2 bg-gray-800 rounded-full overflow-hidden ${className}`}>
    <motion.div
      className={`h-full rounded-full ${
        status === "active" 
          ? "bg-gradient-to-r bg-amber-500" 
          : "bg-gray-600"
      }`}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

// Task card component
const TaskCard = ({ task, onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(task.status === "active");
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = task.icon || Bolt;
  
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    if (onToggle) onToggle(task.id, !isEnabled);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-amber-500/30 rounded-xl overflow-hidden transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br bg-amber-500 flex items-center justify-center">
              <Icon className="text-white w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white">{task.title}</h3>
          </div>
          <Switch enabled={isEnabled} onChange={handleToggle} />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Badge variant={task.category === "marketing" ? "purple" : task.category === "sales" ? "info" : "success"}>
            {taskCategories.find(c => c.id === task.category)?.name}
          </Badge>
          <Badge variant={isEnabled ? "success" : "warning"}>
            {isEnabled ? "Active" : "Paused"}
          </Badge>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          {task.description}
        </p>
        
        <ProgressBar value={task.progress} status={isEnabled ? "active" : "paused"} className="mb-4" />
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bolt className="w-3 h-3" />
            <span>Ran {task.runCount} times</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last run {task.lastRun}</span>
          </span>
        </div>
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          className="mt-4 px-4 py-2 w-full rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm flex items-center justify-center transition-colors duration-300"
        >
          <span>{isExpanded ? "Hide Details" : "View Details"}</span>
          <ChevronDown 
            className={`ml-1 w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
          />
        </motion.button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Schedule</span>
                  <span className="text-gray-300 text-sm flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Recurring
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Creation Date</span>
                  <span className="text-gray-300 text-sm">Jan 15, 2023</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Modified By</span>
                  <span className="text-gray-300 text-sm flex items-center">
                    <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs mr-1">A</span>
                    Admin
                  </span>
                </div>
                <motion.button
                  onClick={() => navigate('/lead')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 px-4 py-2 w-full rounded-lg bg-gradient-to-r bg-amber-500 hover:from-amber-600 hover:to-amber-600 text-white text-sm font-medium transition-all duration-300 flex items-center justify-center"
                >
                  <span>Edit Automation</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Search input component
const SearchInput = ({ placeholder = "Search..." }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search className="w-4 h-4 text-gray-500" />
    </div>
    <input
      type="search"
      className="block w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      placeholder={placeholder}
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      <Filter className="w-4 h-4 text-gray-500" />
    </div>
  </div>
);

export function TaskAutomation() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredTasks = activeFilter === 'all' 
    ? automationTasks 
    : automationTasks.filter(task => task.category === activeFilter);

  function handleLead() {
    console.log("lead generation");
    navigate('/lead')
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column - Task information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <motion.h2 
                  className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-amber-300 to-amber-500 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Automate Your Marketing Workflow
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Setup intelligent automations to handle repetitive tasks and focus on what matters most for your business.
                </motion.p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Automation Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">Save Time</h4>
                      <p className="text-gray-400">Reduce manual work by automating repetitive marketing tasks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">Increase Engagement</h4>
                      <p className="text-gray-400">Reach your audience with timely, personalized communications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">Improve Consistency</h4>
                      <p className="text-gray-400">Ensure your marketing processes run consistently and error-free</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 px-6 py-3 w-full rounded-lg bg-gradient-to-r bg-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-medium transition-all duration-300 flex items-center justify-center"
                  onClick={handleLead}
                >
                  <span>Create New Automation</span>
                  <Plus className="ml-2 w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Automation Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white">{automationTasks.length}</div>
                    <div className="text-gray-400 text-sm">Active Automations</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white">482</div>
                    <div className="text-gray-400 text-sm">Tasks Automated</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white">24.5h</div>
                    <div className="text-gray-400 text-sm">Time Saved</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white">+18%</div>
                    <div className="text-gray-400 text-sm">Engagement ↑</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Tasks */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden h-full">
              <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Your Automations</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="purple">{filteredTasks.length} Active</Badge>
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              
              <div className="p-5">
                {/* Search and filter */}
                <div className="mb-6">
                  <SearchInput placeholder="Search automations..." />
                </div>
                
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge 
                    variant={activeFilter === 'all' ? 'purple' : 'default'}
                    children={
                      <button 
                        className="py-1" 
                        onClick={() => setActiveFilter('all')}
                      >
                        All
                      </button>
                    } 
                  />
                  {taskCategories.map(category => (
                    <Badge 
                      key={category.id}
                      variant={activeFilter === category.id ? 'purple' : 'default'}
                      children={
                        <button 
                          className="py-1" 
                          onClick={() => setActiveFilter(category.id)}
                        >
                          {category.name}
                        </button>
                      } 
                    />
                  ))}
                </div>
                
                {/* Task cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 border border-dashed border-gray-600 hover:border-amber-500/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                    onClick={handleLead}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-gray-300 font-medium text-lg mb-2">Create New Automation</h3>
                    <p className="text-gray-500 text-center">Build custom workflows to automate your marketing tasks</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
