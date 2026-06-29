'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  ChevronDown, 
  ArrowRight, 
  Filter,
  Calendar,
  MoreHorizontal,
  Download,
  Share2,
  Zap,
  Eye,
  MousePointer,
  Repeat
} from 'lucide-react';

// Sample data for charts and metrics
const performanceData = [
  { month: 'Jan', visitors: 2800, conversions: 480, orders: 240 },
  { month: 'Feb', visitors: 3200, conversions: 590, orders: 310 },
  { month: 'Mar', visitors: 3600, conversions: 750, orders: 390 },
  { month: 'Apr', visitors: 4100, conversions: 820, orders: 450 },
  { month: 'May', visitors: 4900, conversions: 980, orders: 550 },
  { month: 'Jun', visitors: 5300, conversions: 1120, orders: 610 }
];

const channelsData = [
  { name: 'Organic Search', value: 38, color: '#F59E0B' },
  { name: 'Direct', value: 24, color: '#06b6d4' },
  { name: 'Social Media', value: 18, color: '#22c55e' },
  { name: 'Referral', value: 12, color: '#f97316' },
  { name: 'Email', value: 8, color: '#ec4899' }
];

const insightsData = [
  {
    id: 1,
    title: 'High engagement on landing page',
    description: 'Your landing page has 2.3x higher engagement than average',
    impact: 'high',
    type: 'positive'
  },
  {
    id: 2,
    title: 'Mobile conversion rate dropped',
    description: 'Mobile conversions decreased 12% compared to last month',
    impact: 'medium',
    type: 'negative'
  },
  {
    id: 3,
    title: 'Email campaign opportunity',
    description: 'Customers who received emails convert 32% more often',
    impact: 'high',
    type: 'opportunity'
  }
];

// Reusable components 
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

// Metric card component
const MetricCard = ({ title, value, change, icon: Icon, color = "purple" }) => {
  const colors = {
    purple: "bg-amber-500",
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    amber: "from-amber-500 to-orange-600"
  };
  
  const isPositive = change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="text-white w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </motion.div>
  );
};

// Chart component with animated bars
const BarChartComponent = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.visitors));
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-end space-x-6 pb-6 pt-6">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <motion.div 
              className="w-full bg-gradient-to-t bg-amber-500 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${(item.visitors / maxValue) * 100}%` }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            />
            <div className="text-xs text-gray-400 mt-2">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line chart component with animated path
const LineChartComponent = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.conversions));
  const points = data.map((d, i) => [i * (100 / (data.length - 1)), 100 - (d.conversions / maxValue) * 100]);
  const pathData = `M${points.map(p => p.join(',')).join(' L')}`;
  
  return (
    <div className="h-full w-full pt-6 pb-6">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#374151" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#374151" strokeWidth="0.5" />
        
        {/* Path for line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Dots for data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point[0]}
            cy={point[1]}
            r="3"
            fill="#F59E0B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Donut chart component
const DonutChartComponent = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-48 h-48">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            currentAngle += angle;
            
            return (
              <motion.path
                key={index}
                d={pathData}
                fill={item.color}
                initial={{ scale: 0, opacity: 0, transformOrigin: 'center' }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="#1f2937" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">100%</span>
          <span className="text-xs text-gray-400">Total Traffic</span>
        </div>
      </div>
    </div>
  );
};

// Card for visualizations with title and controls
const ChartCard = ({ title, children, fullWidth = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden ${fullWidth ? 'col-span-2' : ''}`}
  >
    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
      <h3 className="font-medium text-white">{title}</h3>
      <div className="flex items-center space-x-2">
        <button className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="p-4 h-64">
      {children}
    </div>
  </motion.div>
);

// Insight card component
const InsightCard = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getTypeStyles = (type) => {
    switch(type) {
      case 'positive':
        return {
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          icon: <TrendingUp className="w-4 h-4" />
        };
      case 'negative':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          icon: <TrendingUp className="w-4 h-4 transform rotate-180" />
        };
      case 'opportunity':
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          icon: <Zap className="w-4 h-4" />
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-800',
          icon: <TrendingUp className="w-4 h-4" />
        };
    }
  };
  
  const { color, bg, icon } = getTypeStyles(insight.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${color}`}>{insight.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{insight.description}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <Badge variant={insight.impact === 'high' ? 'purple' : 'info'}>
              {insight.impact === 'high' ? 'High Impact' : 'Medium Impact'}
            </Badge>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
            >
              {expanded ? 'Hide details' : 'View details'}
              <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <p className="text-sm text-gray-300">
                {insight.type === 'positive' 
                  ? 'This is a positive trend that contributes to your business goals. Continue to optimize this channel.' 
                  : insight.type === 'negative'
                    ? 'This negative trend may require attention. Consider reviewing your strategy in this area.'
                    : 'This opportunity could lead to significant growth. We recommend prioritizing this area.'}
              </p>
              <button className="mt-3 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center">
                View recommended actions
                <ArrowRight className="ml-1 w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Filter component
const FilterButton = ({ children }) => (
  <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors flex items-center gap-2">
    {children}
    <ChevronDown className="w-4 h-4" />
  </button>
);

export default function Analytics() {
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-amber-300 to-amber-500 text-transparent bg-clip-text">
              Marketing Analytics
            </h1>
            <p className="text-gray-400 mt-2">
              Gain insights into your marketing performance and customer behavior
            </p>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FilterButton>
              <Calendar className="w-4 h-4" />
              {selectedDateRange}
            </FilterButton>
            <FilterButton>
              <Filter className="w-4 h-4" />
              Filters
            </FilterButton>
            <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </motion.div>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard 
            title="Total Visitors" 
            value="24,521" 
            change={12.8} 
            icon={Eye} 
            color="purple"
          />
          <MetricCard 
            title="Conversion Rate" 
            value="18.3%" 
            change={-2.4} 
            icon={Repeat} 
            color="blue"
          />
          <MetricCard 
            title="Total Sales" 
            value="$34,853" 
            change={8.7} 
            icon={ShoppingCart} 
            color="green"
          />
          <MetricCard 
            title="Avg. Session Time" 
            value="4m 32s" 
            change={6.2} 
            icon={Clock} 
            color="amber"
          />
        </div>
        
        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Visitor Trends" fullWidth>
            <BarChartComponent data={performanceData} />
          </ChartCard>
          <ChartCard title="Conversion Trends">
            <LineChartComponent data={performanceData} />
          </ChartCard>
          <ChartCard title="Traffic Sources">
            <DonutChartComponent data={channelsData} />
          </ChartCard>
        </div>
        
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-white">AI-Powered Insights</h2>
            <button className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center">
              View all insights
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insightsData.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </motion.div>
        
        {/* Marketing performance details */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Campaign Performance</h2>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Active</Badge>
                <Badge variant="info">3 Running</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ROI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Summer Sale Promotion</div>
                          <div className="text-xs text-gray-400">Email, Social</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      28,450
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      3,582
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-300 mr-2">412</span>
                        <Badge variant="success">11.5%</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                      324%
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center mr-3">
                          <MousePointer className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Google Search Ads</div>
                          <div className="text-xs text-gray-400">PPC</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      51,244
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      4,872
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-300 mr-2">583</span>
                        <Badge variant="warning">8.2%</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                      186%
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center mr-3">
                          <DollarSign className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Remarketing Campaign</div>
                          <div className="text-xs text-gray-400">Display, Social</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="warning">Paused</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      18,752
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      2,145
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-300 mr-2">352</span>
                        <Badge variant="success">16.4%</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                      247%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

