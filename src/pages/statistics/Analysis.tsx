
import React, { useState } from 'react';
import { TrendingUp, Users, Building2, Clock, FileCheck, PieChart, BarChart3, Activity } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import {
  monthlyStatsData,
  departmentStatsData,
  retireTypeStatsData,
} from '@/data/statistics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#1e40af', '#0891b2', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0ea5e9', '#4f46e5', '#f59e0b', '#10b981'];

function Analysis() {
  const [year, setYear] = useState('2024');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const statsCards = [
    { label: '总退休人数', value: '68', unit: '人', icon: <Users size={24} />, color: 'blue', trend: '+12% 同比' },
    { label: '涉及部门数', value: '10', unit: '个', icon: <Building2 size={24} />, color: 'purple', trend: '持平' },
    { label: '平均办理时长', value: '15', unit: '天', icon: <Clock size={24} />, color: 'emerald', trend: '-3天 同比' },
    { label: '一次通过率', value: '92.5', unit: '%', icon: <FileCheck size={24} />, color: 'amber', trend: '+2.5% 同比' },
  ];

  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-600', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-600', text: 'text-purple-700' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-600', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-500', text: 'text-amber-700' },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="统计分析"
        description="多维度统计分析退休办理数据，辅助决策"
        extra={
          <div className="flex items-center gap-2">
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={[
                { value: '2024', label: '2024年' },
                { value: '2023', label: '2023年' },
                { value: '2022', label: '2022年' },
              ]}
              className="w-28"
            />
            <Button variant="outline">导出报表</Button>
          </div>
        }
      />

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <Card key={idx} padding="md" hover>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${colors.iconBg} text-white flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {card.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 月度趋势图 */}
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              月度退休趋势
            </div>
          </Card.Title>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Activity size={18} />
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={monthlyStatsData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="计划退休" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="已完成" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="processing" name="进行中" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={monthlyStatsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="计划退休"
                    stroke="#1e40af"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="已完成"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      {/* 部门分布 + 退休类型分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-purple-600" />
                部门分布统计
              </div>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={departmentStatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentStatsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}人`, '人数']} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {departmentStatsData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-gray-600 truncate">{item.name}</span>
                  <span className="text-xs font-medium text-gray-800 ml-auto">{item.value}人</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>
              <div className="flex items-center gap-2">
                <PieChart size={18} className="text-amber-600" />
                退休类型分布
              </div>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={retireTypeStatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {retireTypeStatsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#1e40af', '#f59e0b', '#8b5cf6', '#ef4444'][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}人`, '人数']} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {retireTypeStatsData.map((item, idx) => {
                const total = retireTypeStatsData.reduce((sum, i) => sum + i.value, 0);
                const percent = ((item.value / total) * 100).toFixed(1);
                const colors = ['#1e40af', '#f59e0b', '#8b5cf6', '#ef4444'];
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[idx] }} />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-gray-800 font-medium">{item.value}人 ({percent}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, backgroundColor: colors[idx] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* 办理时效分析 */}
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" />
              办理时效分析
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: '档案核对平均耗时', value: '2.5天', color: 'blue' },
              { label: '材料收集平均耗时', value: '5.8天', color: 'amber' },
              { label: '申报审批平均耗时', value: '6.2天', color: 'purple' },
              { label: '全流程平均耗时', value: '14.5天', color: 'emerald' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg text-center">
                <p className={`text-2xl font-bold ${
                  item.color === 'blue' ? 'text-blue-600' :
                  item.color === 'amber' ? 'text-amber-600' :
                  item.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                }`}>
                  {item.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: '1月', archive: 2.8, material: 6.5, declare: 7.0, total: 16.3 },
                  { month: '2月', archive: 2.5, material: 6.0, declare: 6.5, total: 15.0 },
                  { month: '3月', archive: 2.6, material: 5.8, declare: 6.3, total: 14.7 },
                  { month: '4月', archive: 2.4, material: 5.5, declare: 6.0, total: 13.9 },
                  { month: '5月', archive: 2.3, material: 5.6, declare: 6.2, total: 14.1 },
                  { month: '6月', archive: 2.2, material: 5.3, declare: 5.8, total: 13.3 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" label={{ value: '天', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="archive" name="档案核对" stackId="a" fill="#3b82f6" />
                <Bar dataKey="material" name="材料收集" stackId="a" fill="#f59e0b" />
                <Bar dataKey="declare" name="申报审批" stackId="a" fill="#8b5cf6" />
                <Line type="monotone" dataKey="total" name="总耗时" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Analysis;
