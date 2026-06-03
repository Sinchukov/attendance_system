export interface AuditLog {
  id: number;

  action: string;

  entityType: string;

  entityId: number;

  oldValues?: unknown;

  newValues?: unknown;

  createdAt: string;
}