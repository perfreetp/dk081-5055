
import React, { useState } from 'react';
import { Search, Check, X, AlertTriangle, ChevronRight, FileCheck, RefreshCw } from 'lucide-react';
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
import { mockArchiveChecks } from '@/data/archiveChecks';
import { archiveCheckStatusMap } from '@/types/archive';
import { formatDate } from '@/utils/date';

function ArchiveCheck() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<typeof mockArchiveChecks[0] | null>(null);
  const pageSize = 10;

  const filteredData = mockArchiveChecks.filter((item) => {
    const matchSearch = item.employeeName.includes(searchText);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    total: mockArchiveChecks.length,
    pending: mockArchiveChecks.filter(i => i.status === 'pending').length,
    checking: mockArchiveChecks.filter(i => i.status === 'checking').length,
    passed: mockArchiveChecks.filter(i => i.status === 'passed').length,
    rejected: mockArchiveChecks.filter(i => i.status === 'rejected').length,
  };

  const handleViewDetail = (item: typeof mockArchiveChecks[0]) => {
    setSelectedCheck(item);
    setShowDetailModal(true);
  };

  const columns = [
    {
      key: 'employeeName',
      title: '姓名',
      dataIndex: 'employeeName' as const,
      width: 120,
      fixed: 'left' as const,
      render: (val: string, record: typeof mockArchiveChecks[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {val.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{val}</span>
        </div>
      ),
    },
    {
      key: 'positionMatch',
      title: '岗位信息',
      width: 140,
      render: (_: any, record: typeof mockArchiveChecks[0]) => (
        <div className="flex items-center gap-2">
          {record.positionInfo.match ? (
            <span className="text-emerald-600"><Check size={16} /></span>
          ) : (
            <span className="text-red-500"><X size={16} /></span>
          )}
          <span className="text-sm text-gray-600">
            {record.positionInfo.match ? '一致' : '不一致'}
          </span>
        </div>
      ),
    },
    {
      key: 'workYearsMatch',
      title: '工龄信息',
      width: 140,
      render: (_: any, record: typeof mockArchiveChecks[0]) => (
        <div className="flex items-center gap-2">
          {record.workYearsInfo.match ? (
            <span className="text-emerald-600"><Check size={16} /></span>
          ) : (
            <span className="text-red-500"><X size={16} /></span>
          )}
          <span className="text-sm text-gray-600">
            {record.workYearsInfo.match ? '一致' : '不一致'}
          </span>
        </div>
      ),
    },
    {
      key: 'socialSecurityMatch',
      title: '社保信息',
      width: 140,
      render: (_: any, record: typeof mockArchiveChecks[0]) => (
        <div className="flex items-center gap-2">
          {record.socialSecurityInfo.match ? (
            <span className="text-emerald-600"><Check size={16} /></span>
          ) : (
            <span className="text-red-500"><X size={16} /></span>
          )}
          <span className="text-sm text-gray-600">
            {record.socialSecurityInfo.match ? '一致' : '不一致'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: '核对状态',
      dataIndex: 'status' as const,
      width: 100,
      render: (val: string) => (
        <StatusBadge status={archiveCheckStatusMap[val as keyof typeof archiveCheckStatusMap]} size="sm" />
      ),
    },
    {
      key: 'checker',
      title: '核对人',
      dataIndex: 'checker' as const,
      width: 120,
      render: (val?: string) => <span className="text-sm text-gray-600">{val || '-'}</span>,
    },
    {
      key: 'checkTime',
      title: '核对时间',
      dataIndex: 'checkTime' as const,
      width: 160,
      render: (val?: string) => (
        <span className="text-sm text-gray-500">{val ? formatDate(val, 'yyyy-MM-dd HH:mm') : '-'}</span>
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: typeof mockArchiveChecks[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}>
            查看
          </Button>
          {record.status === 'pending' && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              发起核对
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="职工档案核对"
        description="核对职工岗位、工龄、社保等档案信息，确保数据准确一致"
        extra={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<RefreshCw size={16} />}>批量发起核对</Button>
            <Button icon={<FileCheck size={16} />}>导出核对结果</Button>
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">全部</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">待核对</p>
            <p className="text-2xl font-bold text-gray-400 mt-1">{stats.pending}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">核对中</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.checking}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">已通过</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.passed}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">有差异</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
          </div>
        </Card>
      </div>

      {/* 筛选 */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索姓名..."
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
                { value: 'pending', label: '待核对' },
                { value: 'checking', label: '核对中' },
                { value: 'passed', label: '已通过' },
                { value: 'rejected', label: '有差异' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* 表格 */}
      <Card padding="none">
        <Table
          columns={columns}
          data={paginatedData}
          rowKey="id"
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
        title="档案信息核对详情"
        width={700}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>关闭</Button>
            {selectedCheck?.status === 'checking' && (
              <>
                <Button variant="outline" onClick={() => {}}>退回修改</Button>
                <Button>确认通过</Button>
              </>
            )}
            {selectedCheck?.status === 'pending' && (
              <Button>发起核对</Button>
            )}
          </>
        }
      >
        {selectedCheck && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-medium">
                  {selectedCheck.employeeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCheck.employeeName}</h3>
                  <StatusBadge status={archiveCheckStatusMap[selectedCheck.status]} size="sm" />
                </div>
              </div>
              {selectedCheck.checker && (
                <div className="text-right text-sm text-gray-500">
                  <p>核对人：{selectedCheck.checker}</p>
                  {selectedCheck.checkTime && <p>核对时间：{formatDate(selectedCheck.checkTime, 'yyyy-MM-dd HH:mm')}</p>}
                </div>
              )}
            </div>

            {/* 岗位信息 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-800">岗位信息核对</h4>
                {selectedCheck.positionInfo.match ? (
                  <Tag color="green" size="sm">一致</Tag>
                ) : (
                  <Tag color="red" size="sm">不一致</Tag>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">档案记录</p>
                  <p className="text-base font-medium text-gray-800">{selectedCheck.positionInfo.archive}</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedCheck.positionInfo.match ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <p className="text-xs text-gray-500 mb-1">系统实际</p>
                  <p className={`text-base font-medium ${selectedCheck.positionInfo.match ? 'text-emerald-700' : 'text-red-700'}`}>
                    {selectedCheck.positionInfo.actual}
                  </p>
                </div>
              </div>
            </div>

            {/* 工龄信息 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-800">工龄信息核对</h4>
                {selectedCheck.workYearsInfo.match ? (
                  <Tag color="green" size="sm">一致</Tag>
                ) : (
                  <Tag color="red" size="sm">不一致</Tag>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">档案记录</p>
                  <p className="text-base font-medium text-gray-800">{selectedCheck.workYearsInfo.archive} 年</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedCheck.workYearsInfo.match ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <p className="text-xs text-gray-500 mb-1">系统实际</p>
                  <p className={`text-base font-medium ${selectedCheck.workYearsInfo.match ? 'text-emerald-700' : 'text-red-700'}`}>
                    {selectedCheck.workYearsInfo.actual} 年
                    {!selectedCheck.workYearsInfo.match && (
                      <span className="text-sm ml-2">
                        差 {Math.abs(selectedCheck.workYearsInfo.actual - selectedCheck.workYearsInfo.archive)} 年
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* 社保信息 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-800">社保缴费年限</h4>
                {selectedCheck.socialSecurityInfo.match ? (
                  <Tag color="green" size="sm">一致</Tag>
                ) : (
                  <Tag color="red" size="sm">不一致</Tag>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">档案记录</p>
                  <p className="text-base font-medium text-gray-800">{selectedCheck.socialSecurityInfo.archive} 年</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedCheck.socialSecurityInfo.match ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <p className="text-xs text-gray-500 mb-1">社保系统</p>
                  <p className={`text-base font-medium ${selectedCheck.socialSecurityInfo.match ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedCheck.socialSecurityInfo.actual} 年
                    {!selectedCheck.socialSecurityInfo.match && (
                      <span className="text-sm ml-2">
                        差 {Math.abs(selectedCheck.socialSecurityInfo.actual - selectedCheck.socialSecurityInfo.archive).toFixed(1)} 年
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* 备注 */}
            {selectedCheck.remark && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">核对备注</p>
                    <p className="text-sm text-amber-700 mt-1">{selectedCheck.remark}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ArchiveCheck;
