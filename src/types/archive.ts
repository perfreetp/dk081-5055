
export type ArchiveCheckStatus = 'pending' | 'checking' | 'passed' | 'rejected';

export interface ArchiveCheck {
  id: string;
  employeeId: string;
  employeeName: string;
  positionInfo: {
    archive: string;
    actual: string;
    match: boolean;
  };
  workYearsInfo: {
    archive: number;
    actual: number;
    match: boolean;
  };
  socialSecurityInfo: {
    archive: number;
    actual: number;
    match: boolean;
  };
  status: ArchiveCheckStatus;
  checkTime?: string;
  checker?: string;
  remark?: string;
}

export const archiveCheckStatusMap: Record<ArchiveCheckStatus, { label: string; color: string }> = {
  pending: { label: '待核对', color: 'gray' },
  checking: { label: '核对中', color: 'blue' },
  passed: { label: '已通过', color: 'green' },
  rejected: { label: '有差异', color: 'red' },
};

export interface DeclarationResult {
  id: string;
  declarationId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  resultStatus: 'passed' | 'rejected' | 'processing';
  resultTime?: string;
  receiptUrl?: string;
  receiptName?: string;
  remark?: string;
}

export const resultStatusMap: Record<string, { label: string; color: string }> = {
  passed: { label: '已通过', color: 'green' },
  rejected: { label: '已退回', color: 'red' },
  processing: { label: '处理中', color: 'orange' },
};
