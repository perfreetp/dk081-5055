
export type MaterialType = 'id' | 'proof' | 'certificate' | 'other';

export type MaterialStatus = 'pending' | 'uploaded' | 'approved' | 'rejected';

export interface MaterialItem {
  id: string;
  employeeId: string;
  name: string;
  type: MaterialType;
  required: boolean;
  status: MaterialStatus;
  uploadTime?: string;
  fileUrl?: string;
  fileName?: string;
  remark?: string;
}

export const materialTypeMap: Record<MaterialType, string> = {
  id: '身份证件',
  proof: '证明材料',
  certificate: '证书证件',
  other: '其他材料',
};

export const materialStatusMap: Record<MaterialStatus, { label: string; color: string }> = {
  pending: { label: '待上传', color: 'gray' },
  uploaded: { label: '已上传', color: 'blue' },
  approved: { label: '已通过', color: 'green' },
  rejected: { label: '已退回', color: 'red' },
};

export interface ProofTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  createTime: string;
  updateTime: string;
}
