
import type { MaterialItem, ProofTemplate } from '../types/material';

export const mockMaterials: MaterialItem[] = [
  { id: 'mat001', employeeId: 'emp002', name: '身份证复印件', type: 'id', required: true, status: 'approved', uploadTime: '2024-05-15 10:30:00', fileName: '李美玲-身份证复印件.pdf' },
  { id: 'mat002', employeeId: 'emp002', name: '户口本复印件', type: 'id', required: true, status: 'approved', uploadTime: '2024-05-15 10:35:00', fileName: '李美玲-户口本复印件.pdf' },
  { id: 'mat003', employeeId: 'emp002', name: '一寸照片', type: 'other', required: true, status: 'approved', uploadTime: '2024-05-15 10:40:00', fileName: '李美玲-一寸照片.jpg' },
  { id: 'mat004', employeeId: 'emp002', name: '工龄认定表', type: 'proof', required: true, status: 'approved', uploadTime: '2024-05-16 09:00:00', fileName: '李美玲-工龄认定表.pdf' },
  { id: 'mat005', employeeId: 'emp002', name: '养老保险手册', type: 'certificate', required: false, status: 'pending' },

  { id: 'mat006', employeeId: 'emp003', name: '身份证复印件', type: 'id', required: true, status: 'uploaded', uploadTime: '2024-05-20 14:00:00', fileName: '王志强-身份证复印件.pdf' },
  { id: 'mat007', employeeId: 'emp003', name: '特殊工种证明', type: 'proof', required: true, status: 'pending' },
  { id: 'mat008', employeeId: 'emp003', name: '户口本复印件', type: 'id', required: true, status: 'uploaded', uploadTime: '2024-05-20 14:10:00', fileName: '王志强-户口本复印件.pdf' },
  { id: 'mat009', employeeId: 'emp003', name: '一寸照片', type: 'other', required: true, status: 'rejected', uploadTime: '2024-05-21 09:30:00', fileName: '王志强-一寸照片.jpg', remark: '照片不符合规格，请重新上传' },

  { id: 'mat010', employeeId: 'emp004', name: '身份证复印件', type: 'id', required: true, status: 'pending' },
  { id: 'mat011', employeeId: 'emp004', name: '户口本复印件', type: 'id', required: true, status: 'pending' },
  { id: 'mat012', employeeId: 'emp004', name: '干部任免表', type: 'proof', required: true, status: 'pending' },

  { id: 'mat013', employeeId: 'emp008', name: '身份证复印件', type: 'id', required: true, status: 'uploaded', uploadTime: '2024-06-01 11:00:00', fileName: '周丽娟-身份证复印件.pdf' },
  { id: 'mat014', employeeId: 'emp008', name: '户口本复印件', type: 'id', required: true, status: 'pending' },
  { id: 'mat015', employeeId: 'emp008', name: '一寸照片', type: 'other', required: true, status: 'uploaded', uploadTime: '2024-06-01 11:15:00', fileName: '周丽娟-一寸照片.jpg' },
];

export const mockProofTemplates: ProofTemplate[] = [
  {
    id: 'tpl001',
    name: '单位退休证明',
    type: '单位证明',
    description: '标准单位退休证明模板，用于证明员工退休身份',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-03-20 14:30:00',
  },
  {
    id: 'tpl002',
    name: '工龄证明',
    type: '证明材料',
    description: '员工工龄证明模板，用于社保部门工龄认定',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-02-10 09:00:00',
  },
  {
    id: 'tpl003',
    name: '岗位证明',
    type: '证明材料',
    description: '员工岗位职务证明模板',
    createTime: '2024-02-01 11:00:00',
    updateTime: '2024-04-05 16:00:00',
  },
  {
    id: 'tpl004',
    name: '特殊工种证明',
    type: '证明材料',
    description: '特殊工种退休专用证明模板',
    createTime: '2024-02-15 14:00:00',
    updateTime: '2024-05-10 10:30:00',
  },
  {
    id: 'tpl005',
    name: '养老金申请表',
    type: '申请表格',
    description: '基本养老保险待遇申领表',
    createTime: '2024-03-01 09:30:00',
    updateTime: '2024-05-20 15:00:00',
  },
];
