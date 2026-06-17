
import { create } from 'zustand';
import type { Employee } from '../types/employee';
import type { RetireBatch } from '../types/batch';
import type { MaterialItem, ProofTemplate } from '../types/material';
import type { ArchiveCheck, DeclarationResult } from '../types/archive';
import { mockEmployees } from '../data/employees';
import { mockBatches } from '../data/batches';
import { mockMaterials, mockProofTemplates } from '../data/materials';
import { mockArchiveChecks, mockDeclarationResults } from '../data/archiveChecks';

interface AppState {
  employees: Employee[];
  batches: RetireBatch[];
  materials: MaterialItem[];
  proofTemplates: ProofTemplate[];
  archiveChecks: ArchiveCheck[];
  declarationResults: DeclarationResult[];

  addEmployee: (employee: Employee) => void;
  addEmployees: (employees: Employee[]) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateEmployeesStatus: (ids: string[], status: Employee['status']) => void;

  addBatch: (batch: RetireBatch) => void;
  updateBatch: (id: string, updates: Partial<RetireBatch>) => void;
  submitBatch: (id: string) => void;

  addMaterial: (material: MaterialItem) => void;
  updateMaterial: (id: string, updates: Partial<MaterialItem>) => void;

  updateArchiveCheck: (id: string, updates: Partial<ArchiveCheck>) => void;
  startArchiveCheck: (employeeId: string) => void;
  passArchiveCheck: (id: string) => void;
  rejectArchiveCheck: (id: string, remark: string) => void;

  addDeclarationResult: (result: DeclarationResult) => void;
  updateDeclarationResult: (id: string, updates: Partial<DeclarationResult>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  employees: [...mockEmployees],
  batches: [...mockBatches],
  materials: [...mockMaterials],
  proofTemplates: [...mockProofTemplates],
  archiveChecks: [...mockArchiveChecks],
  declarationResults: [...mockDeclarationResults],

  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),

  addEmployees: (newEmployees) =>
    set((state) => ({ employees: [...state.employees, ...newEmployees] })),

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

  updateArchiveCheck: (id, updates) =>
    set((state) => ({
      archiveChecks: state.archiveChecks.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  startArchiveCheck: (employeeId) =>
    set((state) => {
      const check = state.archiveChecks.find((c) => c.employeeId === employeeId);
      if (!check || check.status !== 'pending') return {};

      return {
        archiveChecks: state.archiveChecks.map((c) =>
          c.employeeId === employeeId ? { ...c, status: 'checking' as const, checker: '人事专员-李娜' } : c
        ),
        employees: state.employees.map((e) =>
          e.id === employeeId ? { ...e, status: 'checking' as const } : e
        ),
      };
    }),

  passArchiveCheck: (id) =>
    set((state) => {
      const check = state.archiveChecks.find((c) => c.id === id);
      if (!check) return {};

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
      if (!check) return {};

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
}));

export default useAppStore;
