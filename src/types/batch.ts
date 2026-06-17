
export type BatchStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected';

export interface RetireBatch {
  id: string;
  batchName: string;
  month: string;
  count: number;
  status: BatchStatus;
  createTime: string;
  employeeIds: string[];
  submitTime?: string;
  auditor?: string;
  remark?: string;
}

export const batchStatusMap: Record<BatchStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'gray' },
  submitted: { label: '已提交', color: 'blue' },
  processing: { label: '处理中', color: 'orange' },
  completed: { label: '已完成', color: 'green' },
  rejected: { label: '已退回', color: 'red' },
};
