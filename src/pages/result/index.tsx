
import React, { useState } from 'react';
import { Search, Download, CheckCircle, XCircle, Clock, FileText, Eye, RefreshCw, AlertTriangle, Inbox, ArrowDownCircle } from 'lucide-react';
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
import { mockDeclarationResults } from '@/data/archiveChecks';
import { resultStatusMap } from '@/types/archive';
import { formatDate } from '@/utils/date';

function Result() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<typeof mockDeclarationResults[0] | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const pageSize = 10;

  const filteredData = mockDeclarationResults.filter((item) => {
    const matchSearch = item.employeeName.includes(searchText) || item.department.includes(searchText);
    const matchStatus = statusFilter === 'all' || item.resultStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    total: mockDeclarationResults.length,
    passed: mockDeclarationResults.filter(r => r.resultStatus === 'passed').length,
    rejected: mockDeclarationResults.filter(r => r.resultStatus === 'rejected').length,
    processing: mockDeclarationResults.filter(r => r.resultStatus === 'processing').length,
  };

  const handleViewDetail = (item: typeof mockDeclarationResults[0]) => {
    setSelectedResult(item);
    setShowDetailModal(true);
  };

  const columns = [
    {
      key: 'employeeName',
      title: '姓名',
      dataIndex: 'employeeName' as const,
      width: 120,
      fixed: 'left' as const,
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {val.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{val}</span>
        </div>
      ),
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department' as const,
      width: 140,
      render: (val: string) => <span className="text-gray-600">{val}</span>,
    },
    {
      key: 'declarationId',
      title: '所属批次',
      dataIndex: 'declarationId' as const,
      width: 160,
      render: (val: string) => {
        const name = val === 'batch-202405' ? '2024年5月批次' : '2024年6月批次';
        return <Tag color="blue" size="sm">{name}</Tag>;
      },
    },
    {
      key: 'resultStatus',
      title: '办理结果',
      dataIndex: 'resultStatus' as const,
      width: 100,
      render: (val: string) => (
        <StatusBadge status={resultStatusMap[val]} size="sm" />
      ),
    },
    {
      key: 'resultTime',
      title: '结果时间',
      dataIndex: 'resultTime' as const,
      width: 160,
      render: (val?: string) => (
        <span className="text-sm text-gray-500">{val ? formatDate(val, 'yyyy-MM-dd HH:mm') : '-'}</span>
      ),
    },
    {
      key: 'receipt',
      title: '回执文件',
      width: 120,
      render: (_: any, record: typeof mockDeclarationResults[0]) => (
        record.receiptName ? (
          <button
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <FileText size={14} />
            <span className="truncate max-w-[80px]">{record.receiptName}</span>
          </button>
        ) : (
          <span className="text-gray-400 text-sm">暂无</span>
        )
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: typeof mockDeclarationResults[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}>
            详情
          </Button>
          {record.receiptName && (
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={(e) => e.stopPropagation()}>
              回执
            </Button>
          )}
          {record.resultStatus === 'rejected' && (
            <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={(e) => e.stopPropagation()}>
              重报
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="结果回传"
        description="查看退休办理结果，下载回执文件，处理退回件"
        extra={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<Download size={16} />}>批量下载回执</Button>
            <Button variant="outline" icon={<RefreshCw size={16} />}>同步结果</Button>
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Inbox size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">总记录数</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">已通过</p>
              <p className="text-xl font-bold text-emerald-600">{stats.passed}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">已退回</p>
              <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">处理中</p>
              <p className="text-xl font-bold text-amber-600">{stats.processing}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 筛选 */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索姓名、部门..."
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
                { value: 'all', label: '全部结果' },
                { value: 'passed', label: '已通过' },
                { value: 'rejected', label: '已退回' },
                { value: 'processing', label: '处理中' },
              ]}
            />
          </div>
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
              <Button size="sm" variant="outline" icon={<Download size={14} />}>
                批量下载回执
              </Button>
            )}
          </div>
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
        title="办理结果详情"
        width={600}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>关闭</Button>
            {selectedResult?.resultStatus === 'passed' && selectedResult?.receiptName && (
              <Button icon={<Download size={16} />} onClick={() => setShowReceiptModal(true)}>
                下载回执
              </Button>
            )}
            {selectedResult?.resultStatus === 'rejected' && (
              <Button>修改后重新申报</Button>
            )}
          </>
        }
      >
        {selectedResult && (
          <div className="space-y-5">
            {/* 状态展示 */}
            <div className={`p-5 rounded-lg ${
              selectedResult.resultStatus === 'passed' ? 'bg-emerald-50 border border-emerald-200' :
              selectedResult.resultStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
              'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  selectedResult.resultStatus === 'passed' ? 'bg-emerald-500 text-white' :
                  selectedResult.resultStatus === 'rejected' ? 'bg-red-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {selectedResult.resultStatus === 'passed' ? <CheckCircle size={28} /> :
                   selectedResult.resultStatus === 'rejected' ? <XCircle size={28} /> :
                   <Clock size={28} />}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    selectedResult.resultStatus === 'passed' ? 'text-emerald-700' :
                    selectedResult.resultStatus === 'rejected' ? 'text-red-700' :
                    'text-amber-700'
                  }`}>
                    {resultStatusMap[selectedResult.resultStatus].label}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    selectedResult.resultStatus === 'passed' ? 'text-emerald-600' :
                    selectedResult.resultStatus === 'rejected' ? 'text-red-600' :
                    'text-amber-600'
                  }`}>
                    {selectedResult.resultTime
                      ? `办理时间：${formatDate(selectedResult.resultTime, 'yyyy-MM-dd HH:mm')}`
                      : '正在处理中，请耐心等待'}
                  </p>
                </div>
              </div>
            </div>

            {/* 基本信息 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">基本信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">姓名</p>
                  <p className="text-sm text-gray-800 font-medium">{selectedResult.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">部门</p>
                  <p className="text-sm text-gray-800">{selectedResult.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">所属批次</p>
                  <p className="text-sm text-gray-800">
                    {selectedResult.declarationId === 'batch-202405' ? '2024年5月退休批次' : '2024年6月退休批次'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">申报时间</p>
                  <p className="text-sm text-gray-800">2024-05-25 16:00:00</p>
                </div>
              </div>
            </div>

            {/* 退回原因 */}
            {selectedResult.resultStatus === 'rejected' && selectedResult.remark && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">退回原因</p>
                    <p className="text-sm text-red-700 mt-1">{selectedResult.remark}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 回执文件 */}
            {selectedResult.receiptName && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">回执文件</h4>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{selectedResult.receiptName}</p>
                      <p className="text-xs text-gray-500">PDF · 128KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={<Eye size={14} />}>预览</Button>
                    <Button size="sm" icon={<Download size={14} />}>下载</Button>
                  </div>
                </div>
              </div>
            )}

            {/* 办理流程 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">办理流程</h4>
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
                {[
                  { title: '提交申报', time: '2024-05-25 16:00:00', status: 'done' },
                  { title: '单位审核', time: '2024-05-26 09:30:00', status: 'done' },
                  { title: '社保受理', time: '2024-05-27 10:00:00', status: 'done' },
                  {
                    title: selectedResult.resultStatus === 'passed' ? '审批通过' :
                           selectedResult.resultStatus === 'rejected' ? '审核退回' : '审核中',
                    time: selectedResult.resultTime || '',
                    status: selectedResult.resultStatus === 'processing' ? 'processing' : 'done'
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative pb-4 last:pb-0">
                    <div className={`absolute -left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                      step.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{step.title}</p>
                      {step.time && <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 回执预览弹窗 */}
      <Modal
        open={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="回执预览"
        width={700}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowReceiptModal(false)}>关闭</Button>
            <Button icon={<ArrowDownCircle size={16} />}>下载回执</Button>
          </>
        }
      >
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="bg-white p-8 rounded shadow-sm min-h-[400px]">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">退休审批回执</h2>
              <p className="text-sm text-gray-500 mt-1">编号：TX202406001</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">姓名：</span>
                  <span className="text-gray-800">{selectedResult?.employeeName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">性别：</span>
                  <span className="text-gray-800">男</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">身份证号：</span>
                  <span className="text-gray-800">310101********1234</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20 flex-shrink-0">退休类型：</span>
                  <span className="text-gray-800">正常退休</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  经审核，该同志符合退休条件，准予办理退休手续。
                  自 <span className="font-medium">2024年7月</span> 起享受基本养老保险待遇。
                </p>
              </div>
              <div className="text-right pt-8">
                <p className="text-sm text-gray-600">审批单位：社会保险管理局</p>
                <p className="text-sm text-gray-600">2024年6月10日</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Result;
