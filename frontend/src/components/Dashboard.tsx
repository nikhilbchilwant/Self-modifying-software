// Removed React import
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Percent, ArrowUpRight, Activity } from 'lucide-react';

interface DashboardProps {
  metricValue?: string;
  setMetricValue?: (val: string) => void;
}

const data = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 9800, users: 2000 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

export default function Dashboard({ metricValue = '1000', setMetricValue = () => {} }: DashboardProps) {
  const numericMetricValue = parseFloat(metricValue) || 0;

  return (
    <div 
      data-testid="dashboard-container"
      className="dashboard-container"
      style={{
        background: '#F5F5F7',
        color: '#1D1D1F',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '32px',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          borderBottom: '1px solid #D2D2D7',
          paddingBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>
            Analytics Dashboard
          </h2>
          <p style={{ color: '#86868B', margin: '4px 0 0 0', fontSize: '14px' }}>
            Real-time SaaS Performance Overview
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label 
            htmlFor="metric" 
            style={{ fontSize: '14px', fontWeight: 500, color: '#1D1D1F' }}
          >
            Target Monthly Goal ($):
          </label>
          <input
            id="metric"
            data-testid="dashboard-input-metric"
            type="number"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D2D2D7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              color: '#1D1D1F',
              width: '120px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            placeholder="e.g. 5000"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: MRR */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868B', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Monthly Recurring Revenue</span>
            <DollarSign size={18} style={{ color: '#0071E3' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>$14,240</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34C759' }}>
            <ArrowUpRight size={14} />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* Card 2: Active Customers */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868B', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Active Customers</span>
            <Users size={18} style={{ color: '#34C759' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>1,842</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34C759' }}>
            <ArrowUpRight size={14} />
            <span>+8.2% vs last month</span>
          </div>
        </div>

        {/* Card 3: Churn Rate */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868B', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Churn Rate</span>
            <Percent size={18} style={{ color: '#FF3B30' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>1.8%</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34C759' }}>
            <TrendingUp size={14} style={{ transform: 'rotate(180deg)', color: '#34C759' }} />
            <span style={{ color: '#34C759' }}>-0.4% improvement</span>
          </div>
        </div>

        {/* Card 4: Progress Indicator */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868B', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Monthly Goal Progress</span>
            <Activity size={18} style={{ color: '#5856D6' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
            {numericMetricValue > 0 ? `${Math.min(100, Math.round((14240 / numericMetricValue) * 100))}%` : '100%'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#86868B' }}>
            <span>Target: ${numericMetricValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div 
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E5EA',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: 0, marginBottom: '20px' }}>
          Revenue Growth Trend
        </h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071E3" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0071E3" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#86868B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#86868B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: '1px solid #D2D2D7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  color: '#1D1D1F',
                  fontFamily: 'sans-serif',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0071E3" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
