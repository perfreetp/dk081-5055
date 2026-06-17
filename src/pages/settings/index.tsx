
import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, FileText, Bell, Palette, Database, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Table from '@/components/ui/Table';
import Tag from '@/components/ui/Tag';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

function Settings() {
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);

  const tabs = [
    { key: 'users', label: '用户管理', icon: <Users size={16} /> },
    { key: 'roles', label: '角色权限', icon: <Shield size={16} /> },
    { key: 'params', label: '系统参数', icon: <SettingsIcon size={16} /> },
    { key: 'templates', label: '模板配置', icon: <FileText size={16} /> },
    { key: 'notify', label: '通知设置', icon: <Bell size={16} /> },
  ];

  const mockUsers = [
    { id: 1, name: '李娜', account: 'lina', role: '人事专员', department: '人力资源部', status: 'active', phone: '138****8001' },
    { id: 2, name: '王强', account: 'wangqiang', role: '人事主管', department: '人力资源部', status: 'active', phone: '138****8002' },
    { id: 3, name: '张华', account: 'zhanghua', role: '部门领导', department: '行政管理部', status: 'active', phone: '138****8003' },
    { id: 4, name: '赵敏', account: 'zhaomin', role: '系统管理员', department: '信息中心', status: 'active', phone: '138****8004' },
    { id: 5, name: '陈刚', account: 'chenggang', role: '人事专员', department: '人力资源部', status: 'inactive', phone: '138****8005' },
  ];

  const userColumns = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name' as const,
      width: 100,
      render: (val: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{val}</p>
            <p className="text-xs text-gray-400">@{record.account}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', title: '部门', dataIndex: 'department' as const, width: 140, render: (v: string) => <span className="text-gray-600 text-sm">{v}</span> },
    {
      key: 'role',
      title: '角色',
      dataIndex: 'role' as const,
      width: 100,
      render: (v: string) => <Tag color={v === '系统管理员' ? 'purple' : v === '人事主管' ? 'blue' : 'gray'} size="sm">{v}</Tag>,
    },
    { key: 'phone', title: '手机号', dataIndex: 'phone' as const, width: 120, render: (v: string) => <span className="text-gray-600 text-sm">{v}</span> },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status' as const,
      width: 80,
      render: (v: string) => (
        <span className={`inline-flex items-center gap-1 text-xs ${v === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${v === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
          {v === 'active' ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 120,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="系统设置"
        description="管理系统用户、角色权限、系统参数等配置"
      />

      <Card padding="none">
        <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} type="card" />

        <div className="p-5">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input placeholder="搜索用户名..." className="w-56" />
                  <Select
                    value="all"
                    options={[
                      { value: 'all', label: '全部角色' },
                      { value: 'admin', label: '系统管理员' },
                      { value: 'manager', label: '人事主管' },
                      { value: 'staff', label: '人事专员' },
                    ]}
                    className="w-36"
                  />
                </div>
                <Button icon={<Plus size={16} />} onClick={() => setShowUserModal(true)}>新增用户</Button>
              </div>

              <Table columns={userColumns} data={mockUsers} rowKey="id" />
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: '系统管理员', desc: '拥有系统所有权限', count: 1, color: 'purple' },
                  { name: '人事主管', desc: '审核审批、台账查看', count: 2, color: 'blue' },
                  { name: '人事专员', desc: '名单管理、材料收集、申报', count: 5, color: 'green' },
                  { name: '部门领导', desc: '统计查看、决策支持', count: 10, color: 'orange' },
                  { name: '退休职工', desc: '查看个人信息、上传材料', count: 156, color: 'gray' },
                ].map((role, idx) => (
                  <Card key={idx} hover className="cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{role.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{role.desc}</p>
                      </div>
                      <Tag color={role.color as any} size="sm">{role.count}人</Tag>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <Button variant="ghost" size="sm">
                        权限配置 <ChevronRight size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">退休年龄设置</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="男性退休年龄" defaultValue="60" suffix="岁" />
                  <Input label="女性退休年龄" defaultValue="55" suffix="岁" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">提醒设置</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="提前提醒天数" defaultValue="90" suffix="天" />
                  <Select
                    label="提醒方式"
                    options={[
                      { value: 'sms', label: '短信通知' },
                      { value: 'email', label: '邮件通知' },
                      { value: 'both', label: '短信+邮件' },
                    ]}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">申报设置</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="申报批次周期"
                    options={[
                      { value: 'monthly', label: '每月' },
                      { value: 'quarterly', label: '每季度' },
                      { value: 'yearly', label: '每年' },
                    ]}
                  />
                  <Input label="每月申报日" defaultValue="25" suffix="号" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Button>保存设置</Button>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">管理系统各类证明、报表模板</p>
                <Button icon={<Plus size={16} />}>上传模板</Button>
              </div>
              <Table
                columns={[
                  { key: 'name', title: '模板名称', dataIndex: 'name' as const, width: 200 },
                  { key: 'type', title: '模板类型', dataIndex: 'type' as const, width: 120 },
                  { key: 'updateTime', title: '更新时间', dataIndex: 'updateTime' as const, width: 180 },
                  {
                    key: 'action',
                    title: '操作',
                    width: 150,
                    render: () => (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">预览</Button>
                        <Button variant="ghost" size="sm">下载</Button>
                        <button className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ),
                  },
                ]}
                data={[
                  { id: 1, name: '单位退休证明模板', type: '证明材料', updateTime: '2024-03-20 14:30:00' },
                  { id: 2, name: '工龄证明模板', type: '证明材料', updateTime: '2024-02-10 09:00:00' },
                  { id: 3, name: '养老金申请表', type: '申请表格', updateTime: '2024-05-20 15:00:00' },
                  { id: 4, name: '退休台账报表', type: '统计报表', updateTime: '2024-04-15 10:30:00' },
                ]}
                rowKey="id"
              />
            </div>
          )}

          {activeTab === 'notify' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">通知事项</h4>
                <div className="space-y-3">
                  {[
                    { name: '到龄人员提醒', desc: '提前提醒人事部门即将到龄退休人员', checked: true },
                    { name: '材料缺件提醒', desc: '材料不齐全时自动提醒职工补充', checked: true },
                    { name: '申报结果通知', desc: '申报结果出来后通知相关人员', checked: true },
                    { name: '退回件提醒', desc: '申报被退回时及时提醒经办人', checked: true },
                    { name: '办理完成通知', desc: '退休手续办理完成后通知', checked: false },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" defaultChecked={item.checked} className="mt-0.5 w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Button>保存设置</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 新增用户弹窗 */}
      <Modal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="新增用户"
        width={500}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>取消</Button>
            <Button onClick={() => setShowUserModal(false)}>确定</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="姓名" placeholder="请输入姓名" />
            <Input label="账号" placeholder="请输入登录账号" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="角色"
              options={[
                { value: '', label: '请选择角色' },
                { value: 'admin', label: '系统管理员' },
                { value: 'manager', label: '人事主管' },
                { value: 'staff', label: '人事专员' },
              ]}
            />
            <Input label="手机号" placeholder="请输入手机号" />
          </div>
          <Input label="所属部门" placeholder="请输入部门" />
          <Input label="初始密码" placeholder="请输入初始密码" type="password" />
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
