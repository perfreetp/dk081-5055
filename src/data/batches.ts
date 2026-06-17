
import type { RetireBatch } from '../types/batch';

export const mockBatches: RetireBatch[] = [
  {
    id: 'batch-202405',
    batchName: '2024年5月退休批次',
    month: '2024-05',
    count: 2,
    status: 'completed',
    createTime: '2024-04-10 09:00:00',
    employeeIds: ['emp006', 'emp007'],
    submitTime: '2024-04-20 14:30:00',
    auditor: '人事主管-王经理',
  },
  {
    id: 'batch-202406',
    batchName: '2024年6月退休批次',
    month: '2024-06',
    count: 4,
    status: 'processing',
    createTime: '2024-05-10 10:00:00',
    employeeIds: ['emp001', 'emp002', 'emp003', 'emp009', 'emp012'],
    submitTime: '2024-05-25 16:00:00',
    auditor: '人事主管-王经理',
  },
  {
    id: 'batch-202407',
    batchName: '2024年7月退休批次',
    month: '2024-07',
    count: 4,
    status: 'draft',
    createTime: '2024-06-05 08:30:00',
    employeeIds: ['emp004', 'emp005', 'emp008', 'emp011'],
  },
  {
    id: 'batch-202408',
    batchName: '2024年8月退休批次',
    month: '2024-08',
    count: 1,
    status: 'draft',
    createTime: '2024-06-15 11:00:00',
    employeeIds: ['emp010'],
  },
];
