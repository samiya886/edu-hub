import apiClient from '../api/client';
import { UserRole } from '../constants';

// --- TYPES ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  course?: string;
  department?: string;
  fileUrl: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  downloadsCount: number;
  createdAt: string;
}

export interface Paper {
  id: string;
  title: string;
  subject: string;
  course?: string;
  department?: string;
  year: number;
  fileUrl: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  downloadsCount: number;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Course {
  id: string;
  departmentId: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  courseId: string;
  name: string;
  code: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'upload' | 'announcement' | 'system';
  createdAt: string;
  read: boolean;
}

export interface TeacherStats {
  totalNotes: number;
  totalPapers: number;
  totalDownloads: number;
  recentUploads: Array<{ id: string; title: string; type: 'note' | 'paper'; downloads: number }>;
}

export interface AdminAnalytics {
  usersCount: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
  };
  contentCount: {
    totalNotes: number;
    totalPapers: number;
  };
  downloadsOverTime: Array<{ date: string; count: number }>;
  flaggedReports: number;
}

// --- API SERVICES ---

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (payload: { name: string; email: string; password: string; role: UserRole }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', payload);
    return response.data;
  },
};

export const notesService = {
  list: async (filters?: { department?: string; course?: string; subject?: string; search?: string }): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>('/notes', { params: filters });
    return response.data;
  },

  upload: async (payload: { title: string; subject: string; course: string; department: string; fileUrl: string }): Promise<Note> => {
    const response = await apiClient.post<Note>('/notes', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Note>): Promise<Note> => {
    const response = await apiClient.put<Note>(`/notes/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/notes/${id}`);
    return response.data;
  },
};

export const papersService = {
  list: async (filters?: { department?: string; course?: string; subject?: string; search?: string; year?: number }): Promise<Paper[]> => {
    const response = await apiClient.get<Paper[]>('/papers', { params: filters });
    return response.data;
  },

  upload: async (payload: { title: string; subject: string; course: string; department: string; year: number; fileUrl: string }): Promise<Paper> => {
    const response = await apiClient.post<Paper>('/papers', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Paper>): Promise<Paper> => {
    const response = await apiClient.put<Paper>(`/papers/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/papers/${id}`);
    return response.data;
  },
};

export const filterService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>('/departments');
    return response.data;
  },

  getCourses: async (departmentId: string): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>(`/departments/${departmentId}/courses`);
    return response.data;
  },

  getSubjects: async (courseId: string): Promise<Subject[]> => {
    const response = await apiClient.get<Subject[]>(`/courses/${courseId}/subjects`);
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  },
};

export const statsService = {
  getTeacherStats: async (): Promise<TeacherStats> => {
    const response = await apiClient.get<TeacherStats>('/teacher/stats');
    return response.data;
  },
  getAdminAnalytics: async (): Promise<AdminAnalytics> => {
    const response = await apiClient.get<AdminAnalytics>('/admin/analytics');
    return response.data;
  },
};

export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  },
  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/admin/users/${userId}`);
    return response.data;
  },
};
