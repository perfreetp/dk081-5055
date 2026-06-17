
import React, { useState } from 'react';
import { Search, Download, Calendar, Users, FileText, Filter, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import Tag from '@/components/ui/Tag';
import { mockEmployees } from '@/data/employees';
import { employeeStatusMap, retireTypeMap } from '@/types/employee';
import { formatDate, calcAge } from '@/utils/date';

function Ledger() {
  const [searchText, setSearchText] = useState('');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [retireTypeFilter, setRetireTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'byMonth'>('byMonth');
  const pageSize = 10;

  const filteredData = mockEmployees.filter((emp) => {
    const matchSearch = emp.name.includes(searchText) || emp.department.includes(searchText);
    const matchDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchType = retireTypeFilter === 'all' || emp.retireType === retireTypeFilter;
    return matchSearch && matchDept && matchType;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const departments = [...new Set(mockEmployees.map(e => e.department))];

  const columns = [
    {
      key: 'index',
      title: '序号',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500">{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name' as const,
      width: 100,
      fixed: 'left' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
            {val.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{val}</span>
        </div>
      ),
    },
    {
      key: 'idNumber',
      title: '身份证号',
      dataIndex: 'idNumber' as const,
      width: 180,
      render: (val: string) => <span className="text-gray-600 font-mono text-xs">{val}</span>,
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department' as const,
      width: 140,
      render: (val: string) => <span className="text-gray-600">{val}</span>,
    },
    {
      key: 'position',
      title: '岗位',
      dataIndex: 'position' as const,
      width: 120,
      render: (val: string) => <span className="text-gray-600">{val}</span>,
    },
    {
      key: 'birthDate',
      title: '出生日期',
      dataIndex: 'birthDate' as const,
      width: 120,
      render: (val: string) => (
        <div>
          <p className="text-gray-600 text-sm">{formatDate(val)}</p>
          <p className="text-xs text-gray-400">{calcAge(val)}岁</p>
        </div>
      ),
    },
    {
      key: 'joinDate',
      title: '参加工作时间',
      dataIndex: 'joinDate' as const,
      width: 120,
      render: (val: string) => <span className="text-gray-600 text-sm">{formatDate(val)}</span>,
    },
    {
      key: 'workYears',
      title: '工龄',
      dataIndex: 'workYears' as const,
      width: 80,
      align: 'center' as const,
      render: (val: number) => <span className="text-gray-600">{val}年</span>,
    },
    {
      key: 'retireType',
      title: '退休类型',
      dataIndex: 'retireType' as const,
      width: 100,
      render: (val: string) => (
        <Tag color={val === 'normal' ? 'blue' : val === 'special' ? 'orange' : 'purple'} size="sm">
          {retireTypeMap[val as keyof typeof retireTypeMap]}
        </Tag>
      ),
    },
    {
      key: 'retireMonth',
      title: '退休月份',
      width: 100,
      render: (_: any, record: typeof mockEmployees[0]) => (
        <span className="text-gray-600">2024年{record.birthDate.slice(5, 7)}月</span>
      ),
    },
    {
      key: 'status',
      title: '办理状态',
      dataIndex: 'status' as const,
      width: 100,
      render: (val: string) => (
        <StatusBadge status={employeeStatusMap[val as keyof typeof employeeStatusMap]} size="sm" />
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 80,
      fixed: 'right' as const,
      render: () => <Button variant="ghost" size="sm">详情</Button>,
    },
  ];

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthStats = months.map(m => ({
    month: m,
    count: mockEmployees.filter(e => e.birthDate.slice(5, 7) === m).length,
    done: mockEmployees.filter(e => e.birthDate.slice(5, 7) === m && e.status === 'done').length,
    pending: mockEmployees.filter(e => e.birthDate.slice(5, 7) === m && e.status !== 'done').length,
  }));

  const summaryStats = {
    yearTotal: mockEmployees.length,
    completed: mockEmployees.filter(e => e.status === 'done').length,
    processing: mockEmployees.filter(e => e.status !== 'done' && e.status !== 'pending').length,
    pending: mockEmployees.filter(e => e.status === 'pending').length,
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="退休台账"
        description="查看年度、月度退休人员台账，支持多维度筛选和导出"
        extra={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<FileText size={16} />}>生成报表</Button>
            <Button variant="outline" icon={<Download size={16} />}>导出Excel</Button>
          </div>
        }
      />

      {/* 汇总统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">年度计划退休</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats.yearTotal} 人</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已办理完成</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{summaryStats.completed} 人</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">办理中</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{summaryStats.processing} 人</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待办理</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{summaryStats.pending} 人</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Calendar size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* 筛选区 */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">年度：</span>
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={[
                { value: '2024', label: '2024年' },
                { value: '2023', label: '2023年' },
                { value: '2022', label: '2022年' },
                { value: '2021', label: '2021年' },
              ]}
              className="w-28"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">月份：</span>
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: '01', label: '1月' },
                { value: '02', label: '2月' },
                { value: '03', label: '3月' },
                { value: '04', label: '4月' },
                { value: '05', label: '5月' },
                { value: '06', label: '6月' },
                { value: '07', label: '7月' },
                { value: '08', label: '8月' },
                { value: '09', label: '9月' },
                { value: '10', label: '10月' },
                { value: '11', label: '11月' },
                { value: '12', label: '12月' },
              ]}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">部门：</span>
            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部部门' },
                ...departments.map(d => ({ value: d, label: d })),
              ]}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">类型：</span>
            <Select
              value={retireTypeFilter}
              onChange={(e) => setRetireTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部类型' },
                { value: 'normal', label: '正常退休' },
                { value: 'early', label: '提前退休' },
                { value: 'special', label: '特殊工种' },
                { value: 'illness', label: '病退' },
              ]}
              className="w-28"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索姓名、身份证号..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Button variant="outline" icon={<Filter size={16} />}>更多筛选</Button>
        </div>
      </Card>

      {/* 视图切换 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('byMonth')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            viewMode === 'byMonth'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          按月分组
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          列表视图
        </button>
      </div>

      {viewMode === 'byMonth' ? (
        <div className="space-y-4">
          {monthStats.filter(m => monthFilter === 'all' || m.month === monthFilter).map((month) => (
            <Card key={month.month} padding="none">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-gray-800">{month.month}月</h3>
                  <Tag color="blue" size="sm">共 {month.count} 人</Tag>
                  <span className="text-xs text-emerald-600">已完成 {month.done} 人</span>
                  <span className="text-xs text-amber-600">待办理 {month.pending} 人</span>
                </div>
                <Button variant="ghost" size="sm">
                  展开 <ChevronDown size={14} />
                </Button>
              </div>
              {month.count > 0 && (
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {mockEmployees
                      .filter(e => e.birthDate.slice(5, 7) === month.month)
                      .filter(e => deptFilter === 'all' || e.department === deptFilter)
                      .filter(e => retireTypeFilter === 'all' || e.retireType === retireTypeFilter)
                      .map((emp) => (
                        <div
                          key={emp.id}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                              {emp.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{emp.name}</p>
                              <p className="text-xs text-gray-400 truncate">{emp.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Tag color={emp.retireType === 'normal' ? 'blue' : 'orange'} size="sm">
                              {retireTypeMap[emp.retireType]}
                            </Tag>
                            <StatusBadge status={employeeStatusMap[emp.status]} size="sm" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <Table columns={columns} data={paginatedData} rowKey="id" />
          <div className="px-5 py-4 border-t border-gray-100">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={setCurrentPage}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

export default Ledger;
