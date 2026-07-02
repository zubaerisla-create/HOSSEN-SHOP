"use client";

import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ShoppingBag, PieChart } from 'lucide-react';

interface MonthlyData {
  month: string;
  sales: number;
  orders: number;
}

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

const defaultMonthlySalesData: MonthlyData[] = [
  { month: 'Jan', sales: 12400, orders: 120 },
  { month: 'Feb', sales: 15800, orders: 150 },
  { month: 'Mar', sales: 14200, orders: 135 },
  { month: 'Apr', sales: 19100, orders: 185 },
  { month: 'May', sales: 24500, orders: 230 },
  { month: 'Jun', sales: 28900, orders: 275 },
];

const defaultCategoryData: CategoryData[] = [
  { category: 'Fruits & Veg', value: 14200, color: '#0F2C1F' },
  { category: 'Dairy & Eggs', value: 9800, color: '#10B981' },
  { category: 'Pantry Staples', value: 7500, color: '#FF8A00' },
  { category: 'Beverages', value: 5400, color: '#3B82F6' },
  { category: 'Bakery', value: 4300, color: '#EC4899' },
];

interface AdminChartsProps {
  monthlySalesData?: MonthlyData[];
  categorySalesData?: CategoryData[];
}

export default function AdminCharts({
  monthlySalesData: propMonthlySalesData,
  categorySalesData: propCategorySalesData,
}: AdminChartsProps) {
  const monthlySalesData = propMonthlySalesData && propMonthlySalesData.length > 0
    ? propMonthlySalesData
    : defaultMonthlySalesData;

  const categoryData = propCategorySalesData && propCategorySalesData.length > 0
    ? propCategorySalesData
    : defaultCategoryData;

  const [activeSalesIdx, setActiveSalesIdx] = useState<number | null>(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number | null>(null);

  // --- Sales Area Chart Coordinates ---
  const width = 500;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxSales = Math.max(...monthlySalesData.map(d => d.sales)) * 1.1; // Add padding

  const getSalesCoords = () => {
    return monthlySalesData.map((d, i) => {
      const x = paddingLeft + (i / (monthlySalesData.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (d.sales / maxSales) * chartHeight;
      return { x, y, ...d };
    });
  };

  const salesCoords = getSalesCoords();

  // Create SVG path string for line
  const linePath = salesCoords.reduce((acc, curr, i) => {
    return acc + `${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  // Create SVG path string for filled area
  const areaPath = linePath 
    ? `${linePath} L ${salesCoords[salesCoords.length - 1].x} ${paddingTop + chartHeight} L ${salesCoords[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // --- Category Bar Chart Variables ---
  const barMax = Math.max(...categoryData.map(d => d.value)) * 1.15;
  const barGap = 16;
  const totalBars = categoryData.length;
  const barWidth = (chartWidth - (barGap * (totalBars - 1))) / totalBars;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full font-sans">
      
      {/* CARD 1: SALES OVERVIEW (AREA CHART) */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-visible">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Sales Overview
            </h3>
            <p className="text-xs text-neutral-400 font-semibold">Monthly shop revenue trajectory</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">
            <span>+18.2%</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative w-full h-[180px] select-none mt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + chartHeight * r;
              return (
                <line 
                  key={i} 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#F3F4F6" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#salesGrad)" />

            {/* Line Path */}
            <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data Dots & Interactive Hover Regions */}
            {salesCoords.map((pt, i) => (
              <g key={i}>
                {/* Active Hover Guide line */}
                {activeSalesIdx === i && (
                  <line 
                    x1={pt.x} 
                    y1={paddingTop} 
                    x2={pt.x} 
                    y2={paddingTop + chartHeight} 
                    stroke="#E5E7EB" 
                    strokeWidth="1.5"
                  />
                )}

                {/* Data point circle */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={activeSalesIdx === i ? 6 : 4} 
                  fill={activeSalesIdx === i ? '#10B981' : '#FFFFFF'} 
                  stroke="#10B981" 
                  strokeWidth={activeSalesIdx === i ? 2 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Transparent trigger area */}
                <rect
                  x={pt.x - chartWidth / (monthlySalesData.length * 2)}
                  y={paddingTop}
                  width={chartWidth / (monthlySalesData.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveSalesIdx(i)}
                  onMouseLeave={() => setActiveSalesIdx(null)}
                />
              </g>
            ))}

            {/* X-Axis Labels */}
            {salesCoords.map((pt, i) => (
              <text 
                key={i} 
                x={pt.x} 
                y={height - 6} 
                textAnchor="middle" 
                className="text-[10px] fill-neutral-400 font-bold font-sans"
              >
                {pt.month}
              </text>
            ))}

            {/* Y-Axis Labels */}
            {[0, 0.5, 1].map((r, i) => {
              const val = Math.round(maxSales * (1 - r));
              const y = paddingTop + chartHeight * r + 4;
              return (
                <text 
                  key={i} 
                  x={paddingLeft - 8} 
                  y={y} 
                  textAnchor="end" 
                  className="text-[10px] fill-neutral-400 font-bold font-sans"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              );
            })}
          </svg>

          {/* Dynamic Floating Tooltip */}
          {activeSalesIdx !== null && (
            <div 
              className="absolute bg-[#0F2C1F] text-white px-3 py-2 rounded-xl shadow-xl text-xs font-bold border border-emerald-500/20 pointer-events-none transition-all duration-100 flex flex-col gap-0.5"
              style={{
                left: `${(salesCoords[activeSalesIdx].x / width) * 100}%`,
                top: `${(salesCoords[activeSalesIdx].y / height) * 100 - 35}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-[9px] text-emerald-400 uppercase tracking-widest leading-none">{salesCoords[activeSalesIdx].month} Revenue</span>
              <span className="text-sm font-extrabold leading-tight">${salesCoords[activeSalesIdx].sales.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-300 font-semibold">{salesCoords[activeSalesIdx].orders} Orders placed</span>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: CATEGORY SALES (BAR CHART) */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-visible">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-orange" />
              Category Breakdown
            </h3>
            <p className="text-xs text-neutral-400 font-semibold">Share of sales by department</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange">
            <ShoppingBag className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative w-full h-[180px] select-none mt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + chartHeight * r;
              return (
                <line 
                  key={i} 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#F3F4F6" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Bars */}
            {categoryData.map((d, i) => {
              const barHeight = (d.value / barMax) * chartHeight;
              const x = paddingLeft + i * (barWidth + barGap);
              const y = paddingTop + chartHeight - barHeight;

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    ry="6"
                    fill={d.color}
                    opacity={activeCategoryIdx === null || activeCategoryIdx === i ? 1 : 0.4}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setActiveCategoryIdx(i)}
                    onMouseLeave={() => setActiveCategoryIdx(null)}
                  />
                  {/* Category Name Label */}
                  <text
                    x={x + barWidth / 2}
                    y={height - 6}
                    textAnchor="middle"
                    className="text-[9px] fill-neutral-400 font-bold font-sans"
                  >
                    {d.category.split(' ')[0]} {/* First word for compact display */}
                  </text>
                </g>
              );
            })}

            {/* Y-Axis Labels */}
            {[0, 0.5, 1].map((r, i) => {
              const val = Math.round(barMax * (1 - r));
              const y = paddingTop + chartHeight * r + 4;
              return (
                <text 
                  key={i} 
                  x={paddingLeft - 8} 
                  y={y} 
                  textAnchor="end" 
                  className="text-[10px] fill-neutral-400 font-bold font-sans"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              );
            })}
          </svg>

          {/* Dynamic Floating Tooltip */}
          {activeCategoryIdx !== null && (
            <div 
              className="absolute bg-[#0F2C1F] text-white px-3 py-2 rounded-xl shadow-xl text-xs font-bold border border-emerald-500/20 pointer-events-none transition-all duration-100 flex flex-col gap-0.5"
              style={{
                left: `${((paddingLeft + activeCategoryIdx * (barWidth + barGap) + barWidth / 2) / width) * 100}%`,
                top: `${((paddingTop + chartHeight - (categoryData[activeCategoryIdx].value / barMax) * chartHeight) / height) * 100 - 30}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-[9px] text-[#FF8A00] uppercase tracking-widest leading-none">{categoryData[activeCategoryIdx].category}</span>
              <span className="text-sm font-extrabold leading-tight">${categoryData[activeCategoryIdx].value.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-300 font-semibold">Total departmental revenue</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
