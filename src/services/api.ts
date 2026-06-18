import axios, { AxiosInstance } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://courageous-playfulness-production-6a79.up.railway.app';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  // Attendance
  checkIn = () => this.api.post('/api/Attendance/check-in');
  checkOut = () => this.api.post('/api/Attendance/check-out');
  
  kioskCheckIn = (data: { employeeCode: string }) => this.api.post('/api/Attendance/kiosk/check-in', data);
  kioskCheckOut = (data: { employeeCode: string }) => this.api.post('/api/Attendance/kiosk/check-out', data);
  getKioskStatus = () => this.api.get('/api/Attendance/kiosk/status');
  toggleKiosk = (data: { enabled: boolean }) => this.api.post('/api/Attendance/kiosk/toggle', data);

  getMyAttendance = (month?: number, year?: number) =>
    this.api.get('/api/Attendance/me', { params: { month, year } });

  getAttendance = (employeeId?: string, month?: number, year?: number) =>
    this.api.get('/api/Attendance', { params: { employeeId, month, year } });

  getAttendanceByDepartment = (departmentId: string, month?: number, year?: number) =>
    this.api.get(`/api/Attendance/by-department/${departmentId}`, { params: { month, year } });

  closeAttendance = (month?: number, year?: number) =>
    this.api.post('/api/Attendance/close', null, { params: { month, year } });

  getSummary = (month?: number, year?: number) =>
    this.api.get('/api/Attendance/summary', { params: { month, year } });

  createManualAttendance = (data: any) => this.api.post('/api/Attendance', data);

  // Leave Policies
  getLeavePolicies = () => this.api.get('/api/leave-policies');
  createLeavePolicy = (data: any) => this.api.post('/api/leave-policies', data);
  updateLeavePolicy = (id: string, data: any) => this.api.put(`/api/leave-policies/${id}`, data);
  deleteLeavePolicy = (id: string) => this.api.delete(`/api/leave-policies/${id}`);

  // Leave Requests
  createLeaveRequest = (data: any) => this.api.post('/api/leave-requests', data);
  getMyLeaveRequests = () => this.api.get('/api/leave-requests/me');
  getPendingLeaveRequests = () => this.api.get('/api/leave-requests/pending');
  getMyLeaveBalance = (year?: number) => this.api.get('/api/leave-requests/balance', { params: { year } });
  getEmployeeLeaveBalance = (employeeId: string, year?: number) =>
    this.api.get(`/api/leave-requests/balance/${employeeId}`, { params: { year } });
  approveLeaveRequest = (id: string) => this.api.post(`/api/leave-requests/${id}/approve`);
  rejectLeaveRequest = (id: string, data: { reason?: string }) =>
    this.api.post(`/api/leave-requests/${id}/reject`, data);

  // Shifts
  getShifts = () => this.api.get('/api/Shifts');
  createShift = (data: any) => this.api.post('/api/Shifts', data);
  updateShift = (id: string, data: any) => this.api.put(`/api/Shifts/${id}`, data);
  deleteShift = (id: string) => this.api.delete(`/api/Shifts/${id}`);
}

const api = new ApiService();
export default api;
