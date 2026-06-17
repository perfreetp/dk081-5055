
export interface MonthlyStats {
  month: string;
  total: number;
  completed: number;
  processing: number;
}

export interface DepartmentStats {
  name: string;
  value: number;
}

export interface RetireTypeStats {
  name: string;
  value: number;
}

export const monthlyStatsData: MonthlyStats[] = [
  { month: '1月', total: 8, completed: 8, processing: 0 },
  { month: '2月', total: 6, completed: 6, processing: 0 },
  { month: '3月', total: 10, completed: 10, processing: 0 },
  { month: '4月', total: 7, completed: 7, processing: 0 },
  { month: '5月', total: 12, completed: 12, processing: 0 },
  { month: '6月', total: 15, completed: 5, processing: 10 },
  { month: '7月', total: 8, completed: 0, processing: 0 },
  { month: '8月', total: 5, completed: 0, processing: 0 },
  { month: '9月', total: 6, completed: 0, processing: 0 },
  { month: '10月', total: 9, completed: 0, processing: 0 },
  { month: '11月', total: 7, completed: 0, processing: 0 },
  { month: '12月', total: 10, completed: 0, processing: 0 },
];

export const departmentStatsData: DepartmentStats[] = [
  { name: '技术研发部', value: 12 },
  { name: '生产制造部', value: 18 },
  { name: '人力资源部', value: 5 },
  { name: '财务部', value: 3 },
  { name: '行政管理部', value: 6 },
  { name: '市场营销部', value: 4 },
  { name: '安全环保部', value: 7 },
  { name: '物流仓储部', value: 8 },
  { name: '品质管理部', value: 4 },
  { name: '设备维护部', value: 3 },
];

export const retireTypeStatsData: RetireTypeStats[] = [
  { name: '正常退休', value: 45 },
  { name: '特殊工种', value: 15 },
  { name: '提前退休', value: 5 },
  { name: '病退', value: 3 },
];

export const todoListData = [
  { id: 1, title: '档案核对：陈雅芳', type: '档案核对', priority: 'high', time: '今天 10:00' },
  { id: 2, title: '材料催办：王志强（照片不合格）', type: '材料催办', priority: 'high', time: '今天 14:00' },
  { id: 3, title: '6月批次申报审核', type: '批量申报', priority: 'medium', time: '今天 16:00' },
  { id: 4, title: '退回件修改：吴洪武', type: '退回处理', priority: 'high', time: '明天 09:00' },
  { id: 5, title: '7月批次名单确认', type: '名单管理', priority: 'medium', time: '本周五' },
  { id: 6, title: '证明模板更新', type: '模板管理', priority: 'low', time: '下周' },
];

export const notificationsData = [
  { id: 1, title: '6月退休批次审核通过', content: '您提交的2024年6月退休批次已通过预审', time: '10分钟前', type: 'success' },
  { id: 2, title: '材料退回提醒', content: '王志强的一寸照片不符合规格，请通知重新上传', time: '30分钟前', type: 'warning' },
  { id: 3, title: '到龄人员提醒', content: '本月新增3名到龄人员，请及时确认', time: '1小时前', type: 'info' },
  { id: 4, title: '办理完成通知', content: '张建国的退休手续已全部办理完成', time: '2小时前', type: 'success' },
  { id: 5, title: '系统维护通知', content: '本周六凌晨2:00-4:00系统维护', time: '昨天', type: 'info' },
];

export const statsOverview = {
  totalEmployees: 156,
  pendingCount: 12,
  thisMonthCount: 15,
  completedCount: 48,
  urgentCount: 3,
  materialPendingCount: 8,
  declarationCount: 5,
  resultBacklog: 10,
};
