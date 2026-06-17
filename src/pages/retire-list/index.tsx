
import React, { useState, useMemo } from 'react';
import { Search, Plus, Upload, Download, Filter, MoreHorizontal, Bell, Calendar, User, CheckCircle, XCircle, History, FileQuestion } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import Tag from '@/components/ui/Tag';
import Modal from '@/components/ui/Modal';
import { useAppStore } from '@/store/useAppStore';
import type { ImportRecord } from '@/store/useAppStore';
import type { Employee } from '@/types/employee';
import { employeeStatusMap, retireTypeMap, genderMap } from '@/types/employee';
import { formatDate, calcAge, formatIdNumber } from '@/utils/date';

const sampleImportData: Employee[] = [
  {
    id: `emp-${Date.now()}-1`,
    name: '黄小明',
    idNumber: '310113196508154321',
    gender: 'male',
    birthDate: '1965-08-15',
    department: '技术研发部',
    position: '工程师',
    joinDate: '1988-09-01',
    workYears: 36,
    retireType: 'normal',
    status: 'pending',
    phone: '13900139001',
    address: '上海市浦东新区张江路800号',
  },
  {
    id: `emp-${Date.now()}-2`,
    name: '林晓红',
    idNumber: '310114197012205432',
    gender: 'female',
    birthDate: '1970-12-20',
    department: '财务部',
    position: '会计',
    joinDate: '1992-04-15',
    workYears: 32,
    retireType: 'normal',
    status: 'pending',
    phone: '13900139002',
    address: '上海市徐汇区漕河泾路900号',
  },
  {
    id: `emp-${Date.now()}-3`,
    name: '周建军',
    idNumber: '310115196603086543',
    gender: 'male',
    birthDate: '1966-03-08',
    department: '生产制造部',
    position: '技师',
    joinDate: '1987-07-01',
    workYears: 37,
    retireType: 'special',
    status: 'pending',
    phone: '13900139003',
    address: '上海市宝山区共富路700号',
  },
];

function RetireList() {
  const employees = useAppStore((state) => state.employees);
  const addEmployees = useAppStore((state) => state.addEmployees);
  const importRecords = useAppStore((state) => state.importRecords);
  const addImportRecord = useAppStore((state) => state.addImportRecord);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [retireTypeFilter, setRetireTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [lastImportResult, setLastImportResult] = useState<{ added: number; skipped: number; skippedIds: string[] } | null>(null);
  const pageSize = 10;

  const filteredData = useMemo(() => employees.filter((emp) => {
    const matchSearch = emp.name.includes(searchText) || emp.idNumber.includes(searchText) || emp.department.includes(searchText);
    const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchType = retireTypeFilter === 'all' || emp.retireType === retireTypeFilter;
    return matchSearch && matchStatus && matchType;
  }), [employees, searchText, statusFilter, retireTypeFilter]);

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage, pageSize]
  );

  const columns = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name' as const,
      width: 140,
      fixed: 'left' as const,
      render: (_: any, record: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {record.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{record.name}</p>
            <p className="text-xs text-gray-400">{genderMap[record.gender]}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'idNumber',
      title: '身份证号',
      dataIndex: 'idNumber' as const,
      width: 180,
      render: (val: string) => <span className="text-gray-600 font-mono text-xs">{formatIdNumber(val)}</span>,
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
          <p className="text-gray-600">{formatDate(val)}</p>
          <p className="text-xs text-gray-400">{calcAge(val)} 岁</p>
        </div>
      ),
    },
    {
      key: 'workYears',
      title: '工龄',
      dataIndex: 'workYears' as const,
      width: 80,
      align: 'center' as const,
      render: (val: number) => <span className="text-gray-600">{val} 年</span>,
    },
    {
      key: 'retireType',
      title: '退休类型',
      dataIndex: 'retireType' as const,
      width: 100,
      render: (val: string) => (
        <Tag color={val === 'normal' ? 'blue' : val === 'special' ? 'orange' : val === 'early' ? 'purple' : 'red'} size="sm">
          {retireTypeMap[val as keyof typeof retireTypeMap]}
        </Tag>
      ),
    },
    {
      key: 'status',
      title: '办理状态',
      dataIndex: 'status' as const,
      width: 110,
      render: (val: string) => <StatusBadge status={employeeStatusMap[val as keyof typeof employeeStatusMap]} size="sm" />,
    },
    {
      key: 'action',
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Employee) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmployee(record);
              setShowDetailModal(true);
            }}
          >
            详情
          </Button>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleViewDetail = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowDetailModal(true);
  };

  const handleImport = () => {
    const newEmployees: Employee[] = sampleImportData.map(emp => ({
      ...emp,
      id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }));
    const result = addEmployees(newEmployees);
    const record: ImportRecord = {
      id: `imp-${Date.now()}`,
      importTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fileName: '待退职工名单.xlsx',
      totalCount: newEmployees.length,
      addedCount: result.added,
      skippedCount: result.skipped,
      skippedIds: result.skippedIds,
    };
    addImportRecord(record);
    setLastImportResult(result);
    setShowImportModal(false);
    setShowResultModal(true);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="退休名单"
        description="管理待退休人员名单，支持批量导入、到龄提醒和批次管理"
        extra={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<Download size={16} />}>导出</Button>
            <Button variant="outline" icon={<History size={16} />} onClick={() => setShowHistoryModal(true)}>导入历史</Button>
            <Button variant="outline" icon={<Upload size={16} />} onClick={() => setShowImportModal(true)}>批量导入</Button>
            <Button icon={<Plus size={16} />}>新增人员</Button>
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待退休总人数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本月到龄</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{employees.filter(e => e.status === 'done').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Bell size={20} />
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">紧急待办</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <Bell size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* 筛选区 */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索姓名、身份证号、部门..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending', label: '待办理' },
                { value: 'checking', label: '核对中' },
                { value: 'material', label: '材料收集中' },
                { value: 'declaring', label: '申报中' },
                { value: 'done', label: '已完成' },
                { value: 'rejected', label: '已退回' },
              ]}
            />
          </div>
          <div className="w-36">
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
            />
          </div>
          <Button variant="outline" icon={<Filter size={16} />}>更多筛选</Button>
        </div>
      </Card>

      {/* 表格 */}
      <Card padding="none">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              共 <span className="font-medium text-gray-800">{filteredData.length}</span> 条记录
              {selectedKeys.length > 0 && (
                <span className="ml-2">已选 <span className="font-medium text-blue-600">{selectedKeys.length}</span> 条</span>
              )}
            </span>
            {selectedKeys.length > 0 && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">批量核对</Button>
                <Button size="sm" variant="outline">批量推送</Button>
                <Button size="sm" variant="outline">加入批次</Button>
              </div>
            )}
          </div>
          <Button size="sm" variant="ghost">刷新</Button>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectChange={setSelectedKeys}
          onRowClick={handleViewDetail}
        />

        <div className="px-5 py-4 border-t border-gray-100">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="退休人员详情"
        width={600}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>关闭</Button>
            <Button>发起办理</Button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-medium">
                {selectedEmployee.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={employeeStatusMap[selectedEmployee.status]} />
                  <Tag color={selectedEmployee.retireType === 'normal' ? 'blue' : 'orange'} size="sm">
                    {retireTypeMap[selectedEmployee.retireType]}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">身份证号</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">出生日期</p>
                <p className="text-sm text-gray-800 mt-1">{formatDate(selectedEmployee.birthDate)}（{calcAge(selectedEmployee.birthDate)}岁）</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">所在部门</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">现任岗位</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">参加工作时间</p>
                <p className="text-sm text-gray-800 mt-1">{formatDate(selectedEmployee.joinDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">工龄</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.workYears} 年</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">联系电话</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">家庭住址</p>
                <p className="text-sm text-gray-800 mt-1">{selectedEmployee.address || '-'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-800 mb-3">办理进度</h4>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
                {['名单确认', '档案核对', '材料收集', '批量申报', '办理完成'].map((step, idx) => {
                  const statuses = ['pending', 'checking', 'material', 'declaring', 'done'];
                  const currentIdx = statuses.indexOf(selectedEmployee.status);
                  const isDone = currentIdx > idx || selectedEmployee.status === 'done';
                  const isCurrent = currentIdx === idx;
                  return (
                    <div key={step} className="flex items-start gap-3 pb-4 last:pb-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <span className="text-xs font-medium">{idx + 1}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step}
                        </p>
                        {isCurrent && <p className="text-xs text-gray-500 mt-0.5">当前步骤</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 导入弹窗 */}
      <Modal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="批量导入待退职工"
        width={520}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>取消</Button>
            <Button onClick={handleImport}>开始导入</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg text-center">
            <CheckCircle size={36} className="mx-auto text-blue-500 mb-2" />
            <p className="text-sm font-medium text-blue-700">待退职工名单.xlsx</p>
            <p className="text-xs text-blue-500 mt-1">文件大小：24.5KB · 共 {sampleImportData.length} 条记录</p>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-600">数据预览（共 {sampleImportData.length} 条）</p>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">姓名</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">身份证号</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">部门</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">退休类型</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleImportData.map((emp, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-gray-800">{emp.name}</td>
                      <td className="px-3 py-2 text-gray-600 font-mono">{emp.idNumber.slice(0, 10)}...</td>
                      <td className="px-3 py-2 text-gray-600">{emp.department}</td>
                      <td className="px-3 py-2 text-gray-600">{retireTypeMap[emp.retireType]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-700">下载导入模板</a>
            <span className="text-gray-400 text-xs">上次导入：2024-05-20</span>
          </div>
        </div>
      </Modal>

      {/* 导入结果弹窗 */}
      <Modal
        open={showResultModal}
        onClose={() => setShowResultModal(false)}
        title="导入完成"
        width={520}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowResultModal(false)}>关闭</Button>
            <Button onClick={() => { setShowResultModal(false); setShowHistoryModal(true); }}>查看历史记录</Button>
          </>
        }
      >
        {lastImportResult && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 justify-center py-4">
              {lastImportResult.added > 0 && (
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-500">成功新增</p>
                  <p className="text-2xl font-bold text-emerald-600">{lastImportResult.added} 人</p>
                </div>
              )}
              {lastImportResult.skipped > 0 && (
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-2">
                    <FileQuestion size={28} className="text-amber-500" />
                  </div>
                  <p className="text-sm text-gray-500">跳过重复</p>
                  <p className="text-2xl font-bold text-amber-600">{lastImportResult.skipped} 人</p>
                </div>
              )}
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <User size={28} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-500">本次共导入</p>
                <p className="text-2xl font-bold text-blue-600">{lastImportResult.added + lastImportResult.skipped} 人</p>
              </div>
            </div>

            {lastImportResult.skippedIds.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1">
                  <XCircle size={14} /> 以下身份证重复已跳过：
                </p>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {lastImportResult.skippedIds.map((id, idx) => (
                    <p key={idx} className="text-xs text-amber-700 font-mono">
                      {idx + 1}. {formatIdNumber(id)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 导入历史弹窗 */}
      <Modal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="导入历史记录"
        width={620}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowHistoryModal(false)}>关闭</Button>
          </>
        }
      >
        <div className="space-y-3">
          {importRecords.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              暂无导入记录
            </div>
          ) : (
            importRecords.map((record) => (
              <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{record.fileName}</p>
                      <p className="text-xs text-gray-400">{formatDate(record.importTime, 'yyyy-MM-dd HH:mm')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-600 font-medium">新增 {record.addedCount}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-amber-600 font-medium">跳过 {record.skippedCount}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">共 {record.totalCount}</span>
                  </div>
                </div>
                {record.skippedIds.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                    <span>已跳过 {record.skippedIds.length} 条重复记录：</span>
                    <span className="font-mono">
                      {record.skippedIds.slice(0, 3).map(id => formatIdNumber(id)).join('，')}
                      {record.skippedIds.length > 3 && ` 等 ${record.skippedIds.length} 条`}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default RetireList;
