import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { OrderEnquiry, OrderStatus } from '../types';
import { getEffectiveStatus } from './BossPanel';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ShoppingBag,
  Award,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';

interface MonthlyRevenueChartProps {
  orders: OrderEnquiry[];
}

interface MonthlyDataPoint {
  key: string; // "YYYY-MM"
  monthLabel: string; // "Sep '26"
  year: number;
  monthIndex: number;
  totalSales: number;
  realizedSales: number; // Payment Received, Processing, Shipped, Delivered
  pendingSales: number; // Pending
  orderCount: number;
  avgOrderValue: number;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Robustly parses various date formats used in OrderEnquiry:
 * - "28/09/2026, 11:42 am" (DD/MM/YYYY)
 * - "2026-09-28" (YYYY-MM-DD)
 * - Standard Date parsable strings
 */
function parseOrderDate(dateStr?: string): Date {
  if (!dateStr) return new Date();

  // Try matching DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) return date;
  }

  // Fallback to standard JS Date parsing
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  return new Date();
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ orders }) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'stacked'>('area');
  const [revenueFilter, setRevenueFilter] = useState<'all' | 'realized'>('all');

  // Compute aggregated monthly data
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, MonthlyDataPoint>();

    orders.forEach(order => {
      // Ignore orders with no amount or cancelled orders
      const amount = order.amount || 0;
      const status: OrderStatus = getEffectiveStatus(order);
      if (status === 'Cancelled') return;

      const orderDate = parseOrderDate(order.time || order.updatedAt);
      const year = orderDate.getFullYear();
      const monthIndex = orderDate.getMonth();
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthLabel = `${MONTH_NAMES[monthIndex]} '${String(year).slice(-2)}`;

      const isRealized = ['Payment Received', 'Processing', 'Shipped', 'Delivered'].includes(status);

      if (!monthMap.has(key)) {
        monthMap.set(key, {
          key,
          monthLabel,
          year,
          monthIndex,
          totalSales: 0,
          realizedSales: 0,
          pendingSales: 0,
          orderCount: 0,
          avgOrderValue: 0,
        });
      }

      const point = monthMap.get(key)!;
      point.totalSales += amount;
      if (isRealized) {
        point.realizedSales += amount;
      } else {
        point.pendingSales += amount;
      }
      point.orderCount += 1;
    });

    // If no orders have amounts yet, provide at least one month point with 0
    if (monthMap.size === 0) {
      const now = new Date();
      const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, {
        key,
        monthLabel: `${MONTH_NAMES[now.getMonth()]} '${String(now.getFullYear()).slice(-2)}`,
        year: now.getFullYear(),
        monthIndex: now.getMonth(),
        totalSales: 0,
        realizedSales: 0,
        pendingSales: 0,
        orderCount: 0,
        avgOrderValue: 0,
      });
    }

    // Sort chronologically by year and month
    const sorted = Array.from(monthMap.values()).sort((a, b) => a.key.localeCompare(b.key));

    // Calculate AOV
    sorted.forEach(p => {
      p.avgOrderValue = p.orderCount > 0 ? Math.round(p.totalSales / p.orderCount) : 0;
    });

    return sorted;
  }, [orders]);

  // Overall KPIs
  const { totalSales, totalRealizedSales, bestMonth, avgMonthlySales, momGrowth } = useMemo(() => {
    let total = 0;
    let realized = 0;
    let maxMonth: MonthlyDataPoint | null = null;

    monthlyData.forEach(m => {
      total += m.totalSales;
      realized += m.realizedSales;
      if (!maxMonth || m.totalSales > maxMonth.totalSales) {
        maxMonth = m;
      }
    });

    const avg = monthlyData.length > 0 ? Math.round(total / monthlyData.length) : 0;

    // MoM growth between last two months
    let growth = 0;
    if (monthlyData.length >= 2) {
      const last = monthlyData[monthlyData.length - 1].totalSales;
      const prev = monthlyData[monthlyData.length - 2].totalSales;
      if (prev > 0) {
        growth = Math.round(((last - prev) / prev) * 100);
      }
    }

    return {
      totalSales: total,
      totalRealizedSales: realized,
      bestMonth: maxMonth,
      avgMonthlySales: avg,
      momGrowth: growth,
    };
  }, [monthlyData]);

  // Active dataset based on revenue filter
  const chartData = useMemo(() => {
    return monthlyData.map(d => ({
      ...d,
      displaySales: revenueFilter === 'realized' ? d.realizedSales : d.totalSales,
    }));
  }, [monthlyData, revenueFilter]);

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-[#08121e]/95 backdrop-blur-md border border-[#4DC8C8]/40 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-[#4DC8C8]/20 pb-1.5 mb-1.5">
            <span className="font-semibold text-[#ddeaf8] font-serif text-sm">{data.monthLabel}</span>
            <span className="text-[10px] font-mono text-[#7a9ab8]">{data.orderCount} orders</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#7a9ab8]">Total Sales:</span>
            <span className="font-serif font-bold text-[#7FFFD4] text-sm">
              ₹{data.totalSales.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-400">Realized (Paid):</span>
            <span className="font-mono text-emerald-300">
              ₹{data.realizedSales.toLocaleString('en-IN')}
            </span>
          </div>
          {data.pendingSales > 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-amber-400">Pending Clearance:</span>
              <span className="font-mono text-amber-300">
                ₹{data.pendingSales.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#4DC8C8]/15 text-[#C9A84C]">
            <span>Avg Order Value:</span>
            <span className="font-mono font-medium">₹{data.avgOrderValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-[#08121e]/90 border border-[#4DC8C8]/25 shadow-xl space-y-5">
      {/* Top Header & Interactive View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7FFFD4]" />
            <h4 className="text-sm font-semibold text-[#ddeaf8] tracking-wide">
              Monthly Revenue &amp; Sales Analytics
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4DC8C8]/15 text-[#7FFFD4] border border-[#4DC8C8]/30">
              Live Recharts
            </span>
          </div>
          <p className="text-xs text-[#7a9ab8] mt-0.5">
            Aggregated revenue visualization calculated directly from customer orders and bespoke commission data.
          </p>
        </div>

        {/* Chart View & Filter Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Realized vs All Sales Toggle */}
          <div className="flex items-center bg-[#101c2b] p-0.5 rounded-lg border border-[#4DC8C8]/25 text-xs">
            <button
              onClick={() => setRevenueFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                revenueFilter === 'all'
                  ? 'bg-[#4DC8C8]/25 text-[#7FFFD4] font-medium'
                  : 'text-[#7a9ab8] hover:text-[#ddeaf8]'
              }`}
            >
              All Sales
            </button>
            <button
              onClick={() => setRevenueFilter('realized')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                revenueFilter === 'realized'
                  ? 'bg-[#4DC8C8]/25 text-[#7FFFD4] font-medium'
                  : 'text-[#7a9ab8] hover:text-[#ddeaf8]'
              }`}
            >
              Realized Only
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center bg-[#101c2b] p-0.5 rounded-lg border border-[#4DC8C8]/25 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-[#7FFFD4]/20 text-[#7FFFD4] font-medium'
                  : 'text-[#7a9ab8] hover:text-[#ddeaf8]'
              }`}
              title="Smooth Gradient Area Chart"
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-[#7FFFD4]/20 text-[#7FFFD4] font-medium'
                  : 'text-[#7a9ab8] hover:text-[#ddeaf8]'
              }`}
              title="Monthly Bar Chart"
            >
              Bars
            </button>
            <button
              onClick={() => setChartType('stacked')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                chartType === 'stacked'
                  ? 'bg-[#7FFFD4]/20 text-[#7FFFD4] font-medium'
                  : 'text-[#7a9ab8] hover:text-[#ddeaf8]'
              }`}
              title="Realized vs Pending Breakdown"
            >
              Stacked
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Sales */}
        <div className="p-3 rounded-xl bg-[#101c2b]/80 border border-[#4DC8C8]/20">
          <div className="flex items-center justify-between text-[11px] text-[#7a9ab8]">
            <span>Total Sales</span>
            <DollarSign className="w-3.5 h-3.5 text-[#7FFFD4]" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-semibold text-[#7FFFD4] mt-1">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#7a9ab8] mt-0.5 flex items-center gap-1">
            <span>Realized:</span>
            <span className="font-mono text-emerald-300">₹{totalRealizedSales.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Average Monthly Sales */}
        <div className="p-3 rounded-xl bg-[#101c2b]/80 border border-[#4DC8C8]/20">
          <div className="flex items-center justify-between text-[11px] text-[#7a9ab8]">
            <span>Monthly Average</span>
            <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-semibold text-[#C9A84C] mt-1">
            ₹{avgMonthlySales.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#7a9ab8] mt-0.5">
            Across {monthlyData.length} active month{monthlyData.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Best Month */}
        <div className="p-3 rounded-xl bg-[#101c2b]/80 border border-[#4DC8C8]/20">
          <div className="flex items-center justify-between text-[11px] text-[#7a9ab8]">
            <span>Peak Month</span>
            <Award className="w-3.5 h-3.5 text-[#7FFFD4]" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-semibold text-[#ddeaf8] mt-1 truncate">
            {bestMonth ? bestMonth.monthLabel : '—'}
          </div>
          <div className="text-[10px] text-[#7a9ab8] mt-0.5">
            {bestMonth ? `₹${bestMonth.totalSales.toLocaleString('en-IN')} (${bestMonth.orderCount} orders)` : 'No sales'}
          </div>
        </div>

        {/* MoM Trend */}
        <div className="p-3 rounded-xl bg-[#101c2b]/80 border border-[#4DC8C8]/20">
          <div className="flex items-center justify-between text-[11px] text-[#7a9ab8]">
            <span>MoM Growth</span>
            {momGrowth >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
          <div className={`font-serif text-xl sm:text-2xl font-semibold mt-1 ${momGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {momGrowth >= 0 ? `+${momGrowth}%` : `${momGrowth}%`}
          </div>
          <div className="text-[10px] text-[#7a9ab8] mt-0.5">
            Latest month vs previous
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="artwaaliTealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7FFFD4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#4DC8C8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="artwaaliGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4DC8C8" strokeOpacity={0.12} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#4DC8C8', strokeOpacity: 0.2 }}
              />
              <YAxis
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="displaySales"
                name="Revenue"
                stroke="#7FFFD4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#artwaaliTealGrad)"
                activeDot={{ r: 6, fill: '#7FFFD4', stroke: '#08121e', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4DC8C8" strokeOpacity={0.12} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#4DC8C8', strokeOpacity: 0.2 }}
              />
              <YAxis
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="displaySales"
                name="Monthly Revenue"
                fill="#4DC8C8"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4DC8C8" strokeOpacity={0.12} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#4DC8C8', strokeOpacity: 0.2 }}
              />
              <YAxis
                stroke="#7a9ab8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', color: '#7a9ab8' }}
              />
              <Bar
                dataKey="realizedSales"
                name="Realized (Paid)"
                stackId="sales"
                fill="#10B981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="pendingSales"
                name="Pending Clearance"
                stackId="sales"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info / Legend Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-[#4DC8C8]/15 text-[11px] text-[#7a9ab8]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FFFD4]"></span>
            <span>Monthly Revenue (INR)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Realized UPI/Bank</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Pending Clearance</span>
          </span>
        </div>
        <div className="font-mono text-[10px] text-[#7a9ab8]">
          Updates dynamically upon every order &amp; status transition
        </div>
      </div>
    </div>
  );
};
