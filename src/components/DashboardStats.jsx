import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity, Info, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import WhatsAppNotification from './WhatsappNotification';
import ZoomInEffect from '@/Visuals/ZoomInEffect';

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const stepDuration = duration / steps;
    const increment = (value - displayValue) / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(prev => prev + increment);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return Math.round(displayValue).toLocaleString();
};

const DashboardStats = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [data, setData] = useState({
    revenue: 58420,
    users: 2345,
    conversion: 3.8,
    session: 272,
    lineChartData: [
      { name: 'Jan', total: 4500 },
      { name: 'Feb', total: 4700 },
      { name: 'Mar', total: 4900 },
      { name: 'Apr', total: 5200 },
      { name: 'May', total: 5500 },
      { name: 'Jun', total: 5800 },
      { name: 'Jul', total: 6100 },
      { name: 'Aug', total: 5900 },
      { name: 'Sep', total: 5700 },
      { name: 'Oct', total: 5600 },
      { name: 'Nov', total: 5300 },
      { name: 'Dec', total: 5000 },
    ],
    barChartData: [
      { name: 'Mon', total: 850 },
      { name: 'Tue', total: 900 },
      { name: 'Wed', total: 950 },
      { name: 'Thu', total: 1000 },
      { name: 'Fri', total: 1050 },
      { name: 'Sat', total: 1025 },
      { name: 'Sun', total: 975 },
    ]
  });

  const generateRandomData = (base, variance) => {
    return base + (Math.random() - 0.5) * variance;
  };

  useEffect(() => {
    const updateData = () => {
      setData(prevData => {
        const newRevenue = generateRandomData(58000, 2000);
        const newUsers = generateRandomData(2300, 200);
        const newConversion = generateRandomData(3.8, 0.4);
        const newSession = generateRandomData(270, 30);

        const newLineData = prevData.lineChartData.map(item => ({
          ...item,
          total: generateRandomData(item.total, 300)
        }));

        const newBarData = prevData.barChartData.map(item => ({
          ...item,
          total: generateRandomData(item.total, 100)
        }));

        return {
          revenue: newRevenue,
          users: newUsers,
          conversion: newConversion,
          session: newSession,
          lineChartData: newLineData,
          barChartData: newBarData
        };
      });
    };

    const interval = setInterval(updateData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes} ${remainingSeconds}`;
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${Math.round(data.revenue).toLocaleString()}`,
      increase: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/20',
      chartData: [35, 60, 30, 70, 40, 80, 50],
    },
    {
      title: 'Weekly sales',
      value: Math.round(data.users).toLocaleString(),
      increase: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-amber-500 to-amber-500',
      shadowColor: 'shadow-amber-500/20',
      chartData: [55, 30, 60, 40, 75, 45, 70],
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversion.toFixed(1)}%`,
      increase: '+5.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      shadowColor: 'shadow-green-500/20',
      chartData: [40, 70, 55, 30, 60, 45, 75],
    },
    {
      title: 'Avg. sale',
      value: formatSessionTime(data.session),
      increase: '-2.3%',
      trend: 'down',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/20',
      chartData: [70, 50, 65, 40, 55, 30, 60],
    },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'week':
        return data.barChartData;
      case 'month':
        return data.lineChartData.slice(0, 7);
      case 'year':
        return data.lineChartData;
      default:
        return data.barChartData;
    }
  };

  const tabOptions = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg shadow-md">
          <p className="text-gray-400 text-xs">{label}</p>
          <p className="text-white font-medium">
            {`$${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ZoomInEffect>
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header with date picker */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
            <p className="text-gray-400">Track your business performance and growth</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-2 bg-gray-900/50 p-1 rounded-lg">
            <div className="relative inline-block">
              <select className="appearance-none bg-transparent text-gray-300 py-2 pl-3 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
              <Info size={18} />
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors duration-300 ${stat.shadowColor}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <h4 className="text-2xl font-bold text-white mt-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={stat.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {stat.value}
                        </motion.span>
                      </AnimatePresence>
                    </h4>
                    <span className={`flex items-center text-sm font-medium mt-2 ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' 
                        ? <ArrowUpRight className="w-4 h-4 mr-1" /> 
                        : <ArrowDownRight className="w-4 h-4 mr-1" />
                      }
                      {stat.increase}
                    </span>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Mini sparkline chart */}
                <div className="w-full h-12 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stat.chartData.map((val, i) => ({ value: val, name: i }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={`url(#${stat.title.replace(/\s+/g, '')}-gradient)`} 
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                      <defs>
                        <linearGradient id={`${stat.title.replace(/\s+/g, '')}-gradient`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stat.color.split(' ')[1].split('-')[2]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={stat.color.split(' ')[1].split('-')[2]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 col-span-2"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
                <p className="text-gray-400 text-sm">Detailed revenue breakdown</p>
              </div>
              <div className="mt-3 md:mt-0 flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
                {tabOptions.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={renderTabContent()}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <WhatsAppNotification />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </ZoomInEffect>
  );
};

export default React.memo(DashboardStats);