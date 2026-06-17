
export type Gender = 'male' | 'female';

export type RetireType = 'normal' | 'early' | 'special' | 'illness';

export type EmployeeStatus = 'pending' | 'checking' | 'material' | 'declaring' | 'done' | 'rejected';

export interface Employee {
  id: string;
  name: string;
  idNumber: string;
  gender: Gender;
  birthDate: string;
  department: string;
  position: string;
  joinDate: string;
  workYears: number;
  retireType: RetireType;
  status: EmployeeStatus;
  phone?: string;
  address?: string;
  avatar?: string;
  batchId?: string;
}

export const retireTypeMap: Record<RetireType, string> = {
  normal: '正常退休',
  early: '提前退休',
  special: '特殊工种',
  illness: '病退',
};

export const employeeStatusMap: Record<EmployeeStatus, { label: string; color: string }> = {
  pending: { label: '待办理', color: 'gray' },
  checking: { label: '核对中', color: 'blue' },
  material: { label: '材料收集中', color: 'orange' },
  declaring: { label: '申报中', color: 'purple' },
  done: { label: '已完成', color: 'green' },
  rejected: { label: '已退回', color: 'red' },
};

export const genderMap: Record<Gender, string> = {
  male: '男',
  female: '女',
};
