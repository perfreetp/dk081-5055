
import { create } from 'zustand';
import type { Employee } from '../types/employee';
import type { RetireBatch } from '../types/batch';
import type { MaterialItem, ProofTemplate } from '../types/material';
import type { ArchiveCheck, DeclarationResult } from '../types/archive';
import { mockEmployees } from '../data/employees';
import { mockBatches } from '../data/batches';
import { mockMaterials, mockProofTemplates } from '../data/materials';
import { mockArchiveChecks, mockDeclarationResults } from '../data/archiveChecks';

export interface ImportRecord {
  id: string;
  importTime: string;
  fileName: string;
  totalCount: number;
  addedCount: number;
  skippedCount: number;
  skippedIds: string[];
}

interface AppState {
  employees: Employee[];
  batches: RetireBatch[];
  materials: MaterialItem[];
  proofTemplates: ProofTemplate[];
  archiveChecks: ArchiveCheck[];
  declarationResults: DeclarationResult[];
  importRecords: ImportRecord[];

  addEmployee: (employee: Employee) => void;
  addEmployees: (employees: Employee[]) => { added: number; skipped: number; skippedIds: string[] };
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateEmployeesStatus: (ids: string[], status: Employee['status']) => void;

  addBatch: (batch: RetireBatch) => void;
  createBatch: (data: { batchName: string; month: string; employeeIds: string[] }) => RetireBatch;
  updateBatch: (id: string, updates: Partial<RetireBatch>) => void;
  submitBatch: (id: string) => void;

  addMaterial: (material: MaterialItem) => void;
  updateMaterial: (id: string, updates: Partial<MaterialItem>) => void;
  uploadMaterial: (id: string, fileName: string) => void;

  updateArchiveCheck: (id: string, updates: Partial<ArchiveCheck>) => void;
  startArchiveCheck: (checkId: string) => void;
  passArchiveCheck: (id: string) => void;
  rejectArchiveCheck: (id: string, remark: string) => void;

  addDeclarationResult: (result: DeclarationResult) => void;
  updateDeclarationResult: (id: string, updates: Partial<DeclarationResult>) => void;

  addImportRecord: (record: ImportRecord) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  employees: [...mockEmployees],
  batches: [...mockBatches],
  materials: [...mockMaterials],
  proofTemplates: [...mockProofTemplates],
  archiveChecks: [...mockArchiveChecks],
  declarationResults: [...mockDeclarationResults],
  importRecords: [
    {
      id: 'imp-001',
      importTime: '2024-05-20 10:30:00',
      fileName: '待退职工名单_2024Q2.xlsx',
      totalCount: 12,
      addedCount: 12,
      skippedCount: 0,
      skippedIds: [],
    },
  ],

  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),

  addEmployees: (newEmployees) => {
    const state = get();
    const existingIdNumbers = new Set(state.employees.map((e) => e.idNumber));
    const toAdd: Employee[] = [];
    const skippedIds: string[] = [];
    for (const emp of newEmployees) {
      if (existingIdNumbers.has(emp.idNumber)) {
        skippedIds.push(emp.idNumber);
      } else {
        toAdd.push(emp);
        existingIdNumbers.add(emp.idNumber);
      }
    }
    if (toAdd.length > 0) {
      set({ employees: [...state.employees, ...toAdd] });
    }
    return {
      added: toAdd.length,
      skipped: skippedIds.length,
      skippedIds,
    };
  },

  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  updateEmployeesStatus: (ids, status) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        ids.includes(e.id) ? { ...e, status } : e
      ),
    })),

  addBatch: (batch) =>
    set((state) => ({ batches: [...state.batches, batch] })),

  createBatch: ({ batchName, month, employeeIds }) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newBatch: RetireBatch = {
      id: `batch-${Date.now()}`,
      batchName,
      month,
      count: employeeIds.length,
      status: 'draft',
      createTime: now,
      employeeIds,
      submitTime: undefined,
      auditor: undefined,
    };
    set((state) => ({ batches: [...state.batches, newBatch] }));
    return newBatch;
  },

  updateBatch: (id, updates) =>
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),

  submitBatch: (id) =>
    set((state) => {
      const batch = state.batches.find((b) => b.id === id);
      if (!batch || batch.status !== 'draft') return {};

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const employeeIds = batch.employeeIds;

      return {
        batches: state.batches.map((b) =>
          b.id === id ? { ...b, status: 'submitted' as const, submitTime: now, auditor: '人事主管-王经理' } : b
        ),
        employees: state.employees.map((e) =>
          employeeIds.includes(e.id) ? { ...e, status: 'declaring' as const } : e
        ),
        declarationResults: [
          ...state.declarationResults,
          ...employeeIds.map((empId, idx) => {
            const emp = state.employees.find((e) => e.id === empId);
            return {
              id: `res-${Date.now()}-${idx}`,
              declarationId: id,
              employeeId: empId,
              employeeName: emp?.name || '',
              department: emp?.department || '',
              resultStatus: 'processing' as const,
            };
          }),
        ],
      };
    }),

  addMaterial: (material) =>
    set((state) => ({ materials: [...state.materials, material] })),

  updateMaterial: (id, updates) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  uploadMaterial: (id, fileName) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, status: 'uploaded' as const, fileName, uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 19) } : m
      ),
    })),

  updateArchiveCheck: (id, updates) =>
    set((state) => ({
      archiveChecks: state.archiveChecks.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  startArchiveCheck: (checkId) =>
    set((state) => {
      const check = state.archiveChecks.find((c) => c.id === checkId);
      if (!check || (check.status !== 'pending' && check.status !== 'rejected')) return {};

      return {
        archiveChecks: state.archiveChecks.map((c) =>
          c.id === checkId ? { ...c, status: 'checking' as const, checker: '人事专员-李娜' } : c
        ),
        employees: state.employees.map((e) =>
          e.id === check.employeeId ? { ...e, status: 'checking' as const } : e
        ),
      };
    }),

  passArchiveCheck: (id) =>
    set((state) => {
      const check = state.archiveChecks.find((c) => c.id === id);
      if (!check || check.status !== 'checking') return {};

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      return {
        archiveChecks: state.archiveChecks.map((c) =>
          c.id === id ? { ...c, status: 'passed' as const, checkTime: now } : c
        ),
        employees: state.employees.map((e) =>
          e.id === check.employeeId ? { ...e, status: 'material' as const } : e
        ),
      };
    }),

  rejectArchiveCheck: (id, remark) =>
    set((state) => {
      const check = state.archiveChecks.find((c) => c.id === id);
      if (!check || check.status !== 'checking') return {};

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      return {
        archiveChecks: state.archiveChecks.map((c) =>
          c.id === id ? { ...c, status: 'rejected' as const, checkTime: now, remark } : c
        ),
      };
    }),

  addDeclarationResult: (result) =>
    set((state) => ({
      declarationResults: [...state.declarationResults, result],
    })),

  updateDeclarationResult: (id, updates) =>
    set((state) => ({
      declarationResults: state.declarationResults.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  addImportRecord: (record) =>
    set((state) => ({
      importRecords: [record, ...state.importRecords].slice(0, 10),
    })),
}));

export default useAppStore;
