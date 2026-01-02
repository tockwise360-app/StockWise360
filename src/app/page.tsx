'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInventory } from '@/hooks/useInventory';
import { useChartColors } from '@/lib/utils/chartColors';
import { TrendingUp, AlertTriangle, DollarSign, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LandingPage() {
  const { products, isLoaded } = useInventory();
  const colors = useChartColors();

  if (!isLoaded) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
        </div>
      </PageContainer>
    );
  }

  // Calculate metrics
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < (p.lowStockThreshold || 10)).length;

  // Mock data for chart
  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${(totalValue * 0.1).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: '+12.5% from last month'
    },
    {
      title: 'Inventory Value',
      value: `₹${totalValue.toLocaleString()}`,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      trend: null
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      trend: 'Requires attention'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
      trend: null
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back to StockWise360"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  {stat.trend && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">{stat.trend}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sales Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="name" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.primary === '#7C3AED' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
                    border: `1px solid ${colors.grid}`,
                    borderRadius: '8px',
                    color: colors.text
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke={colors.primary} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">New Invoice Generated</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">2 minutes ago</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">+₹1,200</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
