
import React, { useState } from 'react';
import {
  Users,
  Clock,
  FileCheck,
  FileText,
  Send,
  Inbox,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Bell,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Tag from '@/components/ui/Tag';
import { statsOverview, todoListData, notificationsData, monthlyStatsData, departmentStatsData } from '@/data/statistics';
import { mockEmployees } from '@/data/employees';
import { employeeStatusMap } from '@/types/employee';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e40af', '#0891b2', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0ea5e9', '#4f46e5', '#f59e0b', '#10b981'];

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('todo');

  const statCards = [
    { label: '待退休总人数', value: statsOverview.totalEmployees, icon: <Users size={24} />, color: 'blue', trend: '+5%', link: '/retire-list' },
    { label: '本月待办理', value: statsOverview.thisMonthCount, icon: <Calendar size={24} />, color: 'orange', trend: '+2', link: '/retire-list' },
    { label: '档案待核对', value: statsOverview.pendingCount, icon: <FileCheck size={24} />, color: 'purple', trend: '+3', link: '/archive-check' },
    { label: '材料待提交', value: statsOverview.materialPendingCount, icon: <FileText size={24} />, color: 'amber', trend: '-2', link: '/material' },
    { label: '申报中批次', value: statsOverview.declarationCount, icon: <Send size={24} />, color: 'cyan', trend: '', link: '/declaration' },
    { label: '结果待回执', value: statsOverview.resultBacklog, icon: <Inbox size={24} />, color: 'green', trend: '+1', link: '/result' },
  ];

  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-600', text: 'text-blue-700' },
    orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-500', text: 'text-orange-700' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-600', text: 'text-purple-700' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-500', text: 'text-amber-700' },
    cyan: { bg: 'bg-cyan-50', iconBg: 'bg-cyan-600', text: 'text-cyan-700' },
    green: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-600', text: 'text-emerald-700' },
  };

  const quickActions = [
    { label: '批量导入名单', icon: <Users size={20} />, color: 'blue', link: '/retire-list' },
    { label: '发起档案核对', icon: <FileCheck size={20} />, color: 'green', link: '/archive-check' },
    { label: '生成单位证明', icon: <FileText size={20} />, color: 'purple', link: '/material' },
    { label: '批量申报提交', icon: <Send size={20} />, color: 'orange', link: '/declaration' },
  ];

  const priorityColorMap: Record<string, string> = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-gray-600 bg-gray-50',
  };

  const priorityLabelMap: Record<string, string> = {
    high: '紧急',
    medium: '普通',
    low: '低',
  };

  const notifTypeMap: Record<string, { icon: React.ReactNode; color: string }> = {
    success: { icon: <TrendingUp size={16} />, color: 'text-emerald-500' },
    warning: { icon: <AlertCircle size={16} />, color: 'text-amber-500' },
    info: { icon: <Bell size={16} />, color: 'text-blue-500' },
  };

  return (
    <div className="space-y-6">
      {/* 欢迎语 */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-xl font-semibold mb-1">早上好，管理员 👋</h1>
        <p className="text-blue-100 text-sm">今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-200" />
            <span className="text-blue-100">本月待办 <span className="font-semibold text-white">15</span> 项</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-300" />
            <span className="text-blue-100">紧急事项 <span className="font-semibold text-white">3</span> 项</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <Card
              key={idx}
              padding="md"
              hover
              className="cursor-pointer"
            >
              <div
                onClick={() => navigate(card.link)}
                className="flex items-start justify-between"
              >
                <div className={`w-10 h-10 rounded-lg ${colors.iconBg} text-white flex items-center justify-center`}>
                  {card.icon}
                </div>
                {card.trend && (
                  <span className={`text-xs font-medium ${card.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'} flex items-center gap-0.5`}>
                    <ArrowUpRight size={12} className={card.trend.startsWith('+') ? '' : 'rotate-180'} />
                    {card.trend}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 快捷操作 + 待办/通知 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 快捷操作 */}
        <div className="col-span-12 xl:col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>快捷操作</Card.Title>
            </Card.Header>
            <Card.Body className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const colors = colorMap[action.color];
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(action.link)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                        {action.icon}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* 待办事项 & 通知消息 */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('todo')}
                  className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'todo' ? 'text-blue-700 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  待办事项
                </button>
                <button
                  onClick={() => setActiveTab('notif')}
                  className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'notif' ? 'text-blue-700 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  通知消息
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                查看全部 <ChevronRight size={14} />
              </button>
            </Card.Header>
            <Card.Body className="pt-4">
              {activeTab === 'todo' ? (
                <div className="space-y-2">
                  {todoListData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className={`w-1 h-10 rounded-full ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Tag color="gray" size="sm">{item.type}</Tag>
                          <span className="text-xs text-gray-400">{item.time}</span>
                        </div>
                      </div>
                      <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'gray'} size="sm">
                        {priorityLabelMap[item.priority]}
                      </Tag>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {notificationsData.map((item) => {
                    const notif = notifTypeMap[item.type];
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 月度趋势图 */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <Card.Header>
              <Card.Title>月度退休趋势</Card.Title>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-600" />
                  计划退休
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  已完成
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStatsData} barGap={4}>
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
                    <Bar dataKey="total" name="计划退休" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="已完成" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* 部门分布图 */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>部门分布</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentStatsData.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {departmentStatsData.slice(0, 6).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {departmentStatsData.slice(0, 6).map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs text-gray-600 truncate">{item.name}</span>
                    <span className="text-xs font-medium text-gray-800 ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 最近办理 */}
      <Card>
        <Card.Header>
          <Card.Title>最近办理</Card.Title>
          <Button variant="ghost" size="sm" onClick={() => navigate('/retire-list')}>
            查看全部
          </Button>
        </Card.Header>
        <Card.Body className="pt-0">
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">姓名</th>
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">部门</th>
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">岗位</th>
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">退休类型</th>
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">办理状态</th>
                  <th className="px-5 py-2.5 text-left font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockEmployees.slice(0, 5).map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.idNumber.slice(0, 6)}****{emp.idNumber.slice(-4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{emp.department}</td>
                    <td className="px-5 py-3 text-gray-600">{emp.position}</td>
                    <td className="px-5 py-3">
                      <Tag color="blue" size="sm">
                        {emp.retireType === 'normal' ? '正常退休' : emp.retireType === 'early' ? '提前退休' : emp.retireType === 'special' ? '特殊工种' : '病退'}
                      </Tag>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={employeeStatusMap[emp.status]} size="sm" />
                    </td>
                    <td className="px-5 py-3">
                      <Button variant="ghost" size="sm">详情</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
