export interface KioskCheckRequest {
  employeeCode: string;
}

export interface KioskToggleRequest {
  enabled: boolean;
}

export interface ManualAttendanceRequest {
  employeeId: string;
  workDate: string;
  shiftId?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: AttendanceStatus;
  note?: string | null;
}

export enum AttendanceStatus {
  Present = 0,
  Absent = 1,
  Late = 2,
  HalfDay = 3,
}

export interface CreateLeavePolicyRequest {
  name: string;
  isPaid: boolean;
  annualQuotaDays?: number | null;
  description?: string | null;
}

export interface UpdateLeavePolicyRequest {
  name: string;
  isPaid: boolean;
  annualQuotaDays?: number | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateLeaveRequest {
  leaveType: number;
  fromDate: string;
  toDate: string;
  reason?: string | null;
}

export interface RejectLeaveRequest {
  reason?: string | null;
}

export interface UpsertShiftRequest {
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  standardHours: number;
  isActive: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}
