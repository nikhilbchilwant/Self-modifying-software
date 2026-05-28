import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Users, DollarSign, ArrowUpRight, TrendingUp, Settings } from 'lucide-react';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => (
  <div className="keynote-card p-6 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[#f5f5f7] rounded-lg text-[#1d1d1f]">
        {icon}
      </div>
      <span className="text-green-600 text-xs font-semibold px-2 py-1 bg-green-50 rounded-full">{change}</span>
    </div>
    <h3 className="text-[#86868b] text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-bold text-[#1d1d1f] tracking-tight">{value}</p>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="keynote-card p-6">
    <h3 className="text-sm font-semibold mb-6 text-[#1d1d1f] uppercase tracking-tight">{title}</h3>
    {children}
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container p-8 bg-[#f5f5f7] min-h-screen" id="dashboard-root">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-2">Analytics</h1>
          <p className="text-[#86868b] text-lg font-medium">Performance overview for Q2 2026</p>
        </div>
        <div className="flex gap-3">
          <button className="keynote-card px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Settings size={16} />
            Edit Layout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value="12,543" icon={<Users size={18} />} change="+12%" />
        <StatCard title="Revenue" value="$45,231" icon={<DollarSign size={18} />} change="+8.5%" />
        <StatCard title="Growth" value="23.4%" icon={<ArrowUpRight size={18} />} change="+2.1%" />
        <StatCard title="Active Sessions" value="1,204" icon={<TrendingUp size={18} />} change="+5.7%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="User Activity Trends">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 11}} dx={-10} />
              <Tooltip
                contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: '1px solid #e5e5e7', backdropFilter: 'blur(10px)'}}
              />
              <Line type="monotone" dataKey="value" stroke="#0071e3" strokeWidth={3} dot={{r: 4, fill: '#0071e3', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 11}} dx={-10} />
              <Tooltip
                 contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: '1px solid #e5e5e7', backdropFilter: 'blur(10px)'}}
              />
              <Bar dataKey="value" fill="#0071e3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-10 keynote-card p-8">
        <h2 className="text-lg font-semibold mb-6">Display Settings</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Report Name</label>
            <input
              type="text"
              placeholder="Dashboard Name"
              className="keynote-input w-64"
              defaultValue="Main Analytics"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Time Range</label>
            <select className="keynote-input w-48">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
