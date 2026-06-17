
import React, { useState } from 'react';
import { Search, Send, Clock, CheckCircle, XCircle, FileText, Eye, ChevronRight, AlertTriangle, RotateCcw, Plus, Download } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import StatusBadge from '@/components/ui/StatusBadge';
import Tag from '@/components/ui/Tag';
import Modal from '@/components/ui/Modal';
import { mockBatches } from '@/data/batches';
import { mockEmployees } from '@/data/employees';
import { batchStatusMap } from '@/types/batch';
import { employeeStatusMap, retireTypeMap } from '@/types/employee';
import { formatDate } from '@/utils/date';

function Declaration() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<typeof mockBatches[0] | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const filteredBatches = mockBatches.filter((batch) => {
    const matchSearch = batch.batchName.includes(searchText);
    const matchStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (batch: typeof mockBatches[0]) => {
    setSelectedBatch(batch);
    setShowDetailModal(true);
  };

  const handleSubmitBatch = (batch: typeof mockBatches[0]) => {
    setSelectedBatch(batch);
    setShowSubmitModal(true);
  };

  const batchEmployees = selectedBatch
    ? mockEmployees.filter((emp) => selectedBatch.employeeIds.includes(emp.id))
    : [];

  const tabs = [
    { key: 'info', label: '批次信息' },
    { key: 'employees', label: `申报人员 (${batchEmployees.length})` },
    { key: 'materials', label: '申报材料' },
    { key: 'history', label: '流程记录' },
  ];

  const statusCardData = [
    { label: '全部批次', value: mockBatches.length, color: 'gray' },
    { label: '草稿', value: mockBatches.filter(b => b.status === 'draft').length, color: 'gray' },
    { label: '已提交', value: mockBatches.filter(b => b.status === 'submitted').length, color: 'blue' },
    { label: '处理中', value: mockBatches.filter(b => b.status === 'processing').length, color: 'orange' },
    { label: '已完成', value: mockBatches.filter(b => b.status === 'completed').length, color: 'green' },
    { label: '已退回', value: mockBatches.filter(b => b.status === 'rejected').length, color: 'red' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="批量申报"
        description="管理退休申报批次，支持批量提交联办事项和退回件集中修改"
        extra={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<Download size={16} />}>导出申报单</Button>
            <Button icon={<Plus size={16} />} onClick={() => setShowSubmitModal(true)}>
              新建申报批次
            </Button>
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusCardData.map((item, idx) => (
          <Card key={idx} padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className={`text-2xl font-bold mt-1 ${
                  item.color === 'green' ? 'text-emerald-600' :
                  item.color === 'red' ? 'text-red-600' :
                  item.color === 'blue' ? 'text-blue-600' :
                  item.color === 'orange' ? 'text-amber-600' : 'text-gray-900'
                }`}>
                  {item.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                item.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                item.color === 'red' ? 'bg-red-50 text-red-600' :
                item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                item.color === 'orange' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'
              }`}>
                {item.color === 'green' ? <CheckCircle size={20} /> :
                 item.color === 'red' ? <XCircle size={20} /> :
                 item.color === 'blue' ? <Send size={20} /> :
                 item.color === 'orange' ? <Clock size={20} /> : <FileText size={20} />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 筛选 */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索批次名称..."
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
                { value: 'draft', label: '草稿' },
                { value: 'submitted', label: '已提交' },
                { value: 'processing', label: '处理中' },
                { value: 'completed', label: '已完成' },
                { value: 'rejected', label: '已退回' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* 批次卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBatches.map((batch) => (
          <Card key={batch.id} hover className="cursor-pointer" onClick={() => handleViewDetail(batch)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{batch.batchName}</h3>
                <p className="text-xs text-gray-400 mt-1">创建于 {formatDate(batch.createTime)}</p>
              </div>
              <StatusBadge status={batchStatusMap[batch.status]} size="sm" />
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{batch.count}</p>
                <p className="text-xs text-gray-500">申报人数</p>
              </div>
              {batch.submitTime && (
                <div>
                  <p className="text-sm text-gray-700">{formatDate(batch.submitTime)}</p>
                  <p className="text-xs text-gray-500">提交时间</p>
                </div>
              )}
              {batch.auditor && (
                <div>
                  <p className="text-sm text-gray-700">{batch.auditor}</p>
                  <p className="text-xs text-gray-500">审核人</p>
                </div>
              )}
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>办理进度</span>
                <span>
                  {batch.status === 'completed' ? '100%' :
                   batch.status === 'processing' ? '60%' :
                   batch.status === 'submitted' ? '30%' : '0%'}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    batch.status === 'completed' ? 'bg-emerald-500' :
                    batch.status === 'processing' ? 'bg-amber-500' :
                    batch.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{
                    width: batch.status === 'completed' ? '100%' :
                           batch.status === 'processing' ? '60%' :
                           batch.status === 'submitted' ? '30%' : '0%'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex -space-x-2">
                {mockEmployees
                  .filter(e => batch.employeeIds.includes(e.id))
                  .slice(0, 4)
                  .map((emp) => (
                    <div
                      key={emp.id}
                      className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white text-blue-600 flex items-center justify-center text-xs font-medium"
                      title={emp.name}
                    >
                      {emp.name.charAt(0)}
                    </div>
                  ))}
                {batch.count > 4 && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-gray-500 flex items-center justify-center text-xs">
                    +{batch.count - 4}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                查看详情 <ChevronRight size={14} />
              </Button>
            </div>

            {/* 操作按钮 */}
            {batch.status === 'draft' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button size="sm" variant="outline" className="flex-1">编辑</Button>
                <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleSubmitBatch(batch); }}>
                  提交申报
                </Button>
              </div>
            )}
            {batch.status === 'rejected' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button size="sm" variant="outline" className="flex-1" icon={<RotateCcw size={14} />}>
                  修改重报
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">查看原因</Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 详情弹窗 */}
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="申报批次详情"
        width={800}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>关闭</Button>
            {selectedBatch?.status === 'draft' && (
              <Button onClick={() => { setShowDetailModal(false); handleSubmitBatch(selectedBatch); }}>
                提交申报
              </Button>
            )}
            {selectedBatch?.status === 'rejected' && (
              <Button>修改后重报</Button>
            )}
          </>
        }
      >
        {selectedBatch && (
          <div className="space-y-4">
            {/* 头部信息 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedBatch.batchName}</h3>
                <p className="text-sm text-gray-500 mt-1">批次号：{selectedBatch.id}</p>
              </div>
              <StatusBadge status={batchStatusMap[selectedBatch.status]} />
            </div>

            {/* 标签页 */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-2 text-sm font-medium relative ${
                      activeTab === tab.key
                        ? 'text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 标签页内容 */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">批次名称</p>
                  <p className="text-sm text-gray-800 mt-1">{selectedBatch.batchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属月份</p>
                  <p className="text-sm text-gray-800 mt-1">{selectedBatch.month}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">申报人数</p>
                  <p className="text-sm text-gray-800 mt-1">{selectedBatch.count} 人</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">创建时间</p>
                  <p className="text-sm text-gray-800 mt-1">{formatDate(selectedBatch.createTime, 'yyyy-MM-dd HH:mm')}</p>
                </div>
                {selectedBatch.submitTime && (
                  <div>
                    <p className="text-sm text-gray-500">提交时间</p>
                    <p className="text-sm text-gray-800 mt-1">{formatDate(selectedBatch.submitTime, 'yyyy-MM-dd HH:mm')}</p>
                  </div>
                )}
                {selectedBatch.auditor && (
                  <div>
                    <p className="text-sm text-gray-500">审核人</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedBatch.auditor}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {batchEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{emp.name}</span>
                        <Tag color="blue" size="sm">
                          {retireTypeMap[emp.retireType]}
                        </Tag>
                      </div>
                      <p className="text-xs text-gray-500">{emp.department} · {emp.position}</p>
                    </div>
                    <StatusBadge status={employeeStatusMap[emp.status]} size="sm" />
                    <Button variant="ghost" size="sm">
                      <Eye size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">单位退休证明</p>
                      <p className="text-xs text-gray-500">共 {selectedBatch.count} 份</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">预览</Button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">养老保险待遇申领表</p>
                      <p className="text-xs text-gray-500">共 {selectedBatch.count} 份</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">预览</Button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">个人材料包</p>
                      <p className="text-xs text-gray-500">按人员分别整理</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">查看</Button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-200" />
                {[
                  { time: selectedBatch.createTime, action: '创建批次', user: '人事专员-李娜', status: 'info' },
                  ...(selectedBatch.submitTime ? [{ time: selectedBatch.submitTime, action: '提交申报', user: '人事专员-李娜', status: 'success' }] : []),
                  ...(selectedBatch.status === 'completed' ? [{ time: '2024-06-10 16:00:00', action: '审批通过', user: '社保部门', status: 'success' }] : []),
                  ...(selectedBatch.status === 'rejected' ? [{ time: '2024-06-08 15:00:00', action: '审核退回', user: '社保部门', status: 'error', remark: '部分人员材料不齐全' }] : []),
                ].map((item: any, idx) => (
                  <div key={idx} className="relative pb-4 last:pb-0">
                    <div className={`absolute -left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                      item.status === 'success' ? 'bg-emerald-500' :
                      item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{item.action}</span>
                        <span className="text-xs text-gray-400">- {item.user}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.time, 'yyyy-MM-dd HH:mm')}</p>
                      {item.remark && (
                        <p className="text-xs text-red-600 mt-1">{item.remark}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 提交确认弹窗 */}
      <Modal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="提交申报确认"
        width={500}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>取消</Button>
            <Button onClick={() => { setShowSubmitModal(false); }}>确认提交</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">提交提示</p>
                <p className="text-sm text-blue-700 mt-1">
                  提交后将进入社保部门联办流程，请确认以下信息无误：
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">批次名称</span>
              <span className="text-gray-800 font-medium">{selectedBatch?.batchName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">申报人数</span>
              <span className="text-gray-800 font-medium">{selectedBatch?.count} 人</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">材料完整性</span>
              <span className="text-emerald-600 font-medium">全部齐全</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>⚠️ 提交后将无法直接修改，如需修改请联系审核部门退回。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Declaration;
