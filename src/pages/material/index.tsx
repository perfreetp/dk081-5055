
import React, { useState, useMemo } from 'react';
import { Search, Upload, FileText, Download, Clock, CheckCircle, AlertCircle, XCircle, Bell, Send, Eye, Edit2, Trash2, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import Tag from '@/components/ui/Tag';
import Modal from '@/components/ui/Modal';
import { useAppStore } from '@/store/useAppStore';
import type { ProofTemplate } from '@/types/material';
import { materialStatusMap, materialTypeMap } from '@/types/material';
import { formatDate } from '@/utils/date';

function Material() {
  const materials = useAppStore((state) => state.materials);
  const proofTemplates = useAppStore((state) => state.proofTemplates);
  const employees = useAppStore((state) => state.employees);

  const [activeTab, setActiveTab] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProofTemplate | null>(null);
  const pageSize = 10;

  const employeeMaterialMap = useMemo(() => employees.reduce((acc, emp) => {
    const empMaterials = materials.filter(m => m.employeeId === emp.id);
    if (empMaterials.length > 0) {
      acc.push({
        ...emp,
        materials: empMaterials,
        totalCount: empMaterials.length,
        uploadedCount: empMaterials.filter(m => m.status !== 'pending').length,
        approvedCount: empMaterials.filter(m => m.status === 'approved').length,
        rejectedCount: empMaterials.filter(m => m.status === 'rejected').length,
      });
    }
    return acc;
  }, [] as any[]), [employees, materials]);

  const filteredData = useMemo(() => employeeMaterialMap.filter((item: any) => {
    const matchSearch = item.name.includes(searchText) || item.department.includes(searchText);
    let matchStatus = true;
    if (statusFilter === 'all') {
      matchStatus = true;
    } else if (statusFilter === 'rejected') {
      matchStatus = item.rejectedCount > 0;
    } else if (statusFilter === 'pending') {
      matchStatus = item.uploadedCount === 0;
    } else if (statusFilter === 'approved') {
      matchStatus = item.approvedCount === item.totalCount;
    } else if (statusFilter === 'uploaded') {
      matchStatus = item.uploadedCount > 0 && item.approvedCount < item.totalCount && item.rejectedCount === 0;
    }

    let matchType = true;
    if (typeFilter !== 'all') {
      matchType = item.materials.some((m: any) => m.type === typeFilter);
    }

    return matchSearch && matchStatus && matchType;
  }), [employeeMaterialMap, searchText, statusFilter, typeFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage, pageSize]
  );

  const tabs = [
    { key: 'list', label: '材料清单' },
    { key: 'templates', label: '证明模板' },
  ];

  const handleViewTemplate = (tpl: ProofTemplate) => {
    setSelectedTemplate(tpl);
    setShowTemplateModal(true);
  };

  const columns = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name' as const,
      width: 130,
      fixed: 'left' as const,
      render: (val: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{val}</p>
            <p className="text-xs text-gray-400">{record.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'materialProgress',
      title: '材料进度',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>已上传 {record.uploadedCount}/{record.totalCount}</span>
            <span>{Math.round(record.uploadedCount / record.totalCount * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${record.uploadedCount / record.totalCount * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'approved',
      title: '已通过',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <span className="text-emerald-600 font-medium">{record.approvedCount}</span>
      ),
    },
    {
      key: 'rejected',
      title: '已退回',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <span className="text-red-600 font-medium">{record.rejectedCount}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      render: (_: any, record: any) => {
        if (record.rejectedCount > 0) {
          return <StatusBadge status={{ label: '有退回', color: 'red' }} size="sm" />;
        } else if (record.uploadedCount === record.totalCount) {
          return <StatusBadge status={{ label: '已齐', color: 'green' }} size="sm" />;
        } else if (record.uploadedCount > 0) {
          return <StatusBadge status={{ label: '收集中', color: 'blue' }} size="sm" />;
        } else {
          return <StatusBadge status={{ label: '待上传', color: 'gray' }} size="sm" />;
        }
      },
    },
    {
      key: 'action',
      title: '操作',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">查看</Button>
          <Button variant="outline" size="sm" icon={<Bell size={14} />}>催办</Button>
          <Button variant="ghost" size="sm">生成证明</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="材料协同"
        description="管理退休办理所需材料，支持材料收集、证明模板生成和缺件催办"
        extra={
          <div className="flex items-center gap-2">
            {activeTab === 'list' && (
              <>
                <Button variant="outline" icon={<Download size={16} />}>导出清单</Button>
                <Button icon={<Send size={16} />}>批量推送</Button>
              </>
            )}
            {activeTab === 'templates' && (
              <Button icon={<Plus size={16} />} onClick={() => { setSelectedTemplate(null); setShowTemplateModal(true); }}>
                新建模板
              </Button>
            )}
          </div>
        }
      />

      <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} type="card" />

      {activeTab === 'list' && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">待收集材料</p>
                  <p className="text-xl font-bold text-gray-900">
                    {materials.filter(m => m.status === 'pending').length}
                  </p>
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
                  <p className="text-xl font-bold text-emerald-600">
                    {materials.filter(m => m.status === 'approved').length}
                  </p>
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
                  <p className="text-xl font-bold text-red-600">
                    {materials.filter(m => m.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">待审核</p>
                  <p className="text-xl font-bold text-amber-600">
                    {materials.filter(m => m.status === 'uploaded').length}
                  </p>
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
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  options={[
                    { value: 'all', label: '全部状态' },
                    { value: 'pending', label: '待上传' },
                    { value: 'uploaded', label: '已上传' },
                    { value: 'approved', label: '已通过' },
                    { value: 'rejected', label: '已退回' },
                  ]}
                />
              </div>
              <div className="w-36">
                <Select
                  value={typeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                  options={[
                    { value: 'all', label: '全部类型' },
                    { value: 'id', label: '身份证件' },
                    { value: 'proof', label: '证明材料' },
                    { value: 'certificate', label: '证书证件' },
                    { value: 'other', label: '其他材料' },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* 表格 */}
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
        </>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proofTemplates.map((tpl) => (
            <Card key={tpl.id} hover className="cursor-pointer" onClick={() => handleViewTemplate(tpl)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{tpl.name}</h4>
                  <Tag color="blue" size="sm" className="mt-1">{tpl.type}</Tag>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tpl.description}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    更新于 {formatDate(tpl.updateTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" icon={<Eye size={14} />}>预览</Button>
                <Button variant="ghost" size="sm" icon={<Edit2 size={14} />}>编辑</Button>
                <Button variant="ghost" size="sm" icon={<Download size={14} />}>下载</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 模板预览/编辑弹窗 */}
      <Modal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title={selectedTemplate ? '编辑证明模板' : '新建证明模板'}
        width={700}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowTemplateModal(false)}>取消</Button>
            <Button>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="模板名称" defaultValue={selectedTemplate?.name || ''} placeholder="请输入模板名称" />
            <Select
              label="模板类型"
              options={[
                { value: 'unit', label: '单位证明' },
                { value: 'proof', label: '证明材料' },
                { value: 'form', label: '申请表格' },
                { value: 'other', label: '其他' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">模板描述</label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              defaultValue={selectedTemplate?.description || ''}
              placeholder="请输入模板描述"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">模板内容</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">点击上传模板文件</p>
              <p className="text-xs text-gray-400 mt-1">支持 .docx, .xlsx 格式</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">可用变量：</p>
            <div className="flex flex-wrap gap-2">
              {['{姓名}', '{身份证号}', '{部门}', '{岗位}', '{工龄}', '{出生日期}', '{退休日期}'].map((v) => (
                <code key={v} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">{v}</code>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Material;
