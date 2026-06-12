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

type RawUser = Partial<User> & {
  _id?: string;
};

type RawAuthResponse = Partial<AuthResponse> & {
  accessToken?: string;
  data?: Partial<AuthResponse> & {
    accessToken?: string;
    user?: RawUser;
  };
  user?: RawUser;
};

type RawProfileResponse = RawUser & {
  data?: RawUser;
  user?: RawUser;
};

type RawNamedEntity = {
  id?: string;
  _id?: string;
  name?: string;
  code?: string;
  department?: RawNamedEntity;
  course?: RawNamedEntity;
};

type RawMaterial = {
  id?: string;
  _id?: string;
  title?: string;
  subject?: string | RawNamedEntity;
  course?: string | RawNamedEntity;
  department?: string | RawNamedEntity;
  year?: number | string;
  examYear?: number | string;
  fileUrl?: string;
  file?: string;
  url?: string;
  downloadsCount?: number;
  downloads?: number;
  views?: number;
  uploadedBy?: { id?: string; _id?: string; name?: string };
  uploaderId?: { id?: string; _id?: string; name?: string };
  author?: { id?: string; _id?: string; name?: string };
  createdAt?: string;
};

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
  recentUploads: { id: string; title: string; type: 'note' | 'paper'; downloads: number }[];
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
  downloadsOverTime: { date: string; count: number }[];
  flaggedReports: number;
}

// --- API SERVICES ---

function normalizeUser(rawUser: RawUser | undefined): User {
  if (!rawUser) {
    throw new Error('Login response did not include a user profile.');
  }

  const normalizedRole = String(rawUser.role ?? 'student').toLowerCase();
  const role = ['student', 'teacher', 'admin'].includes(normalizedRole)
    ? normalizedRole as UserRole
    : 'student';

  return {
    ...rawUser,
    id: rawUser.id ?? rawUser._id ?? '',
    name: rawUser.name ?? '',
    email: rawUser.email ?? '',
    role,
  };
}

function getEntityId(entity: string | RawNamedEntity | undefined) {
  if (!entity) return '';
  return typeof entity === 'string' ? entity : entity.id ?? entity._id ?? '';
}

function getEntityName(entity: string | RawNamedEntity | undefined) {
  if (!entity) return '';
  return typeof entity === 'string' ? entity : entity.name ?? entity.code ?? entity.id ?? entity._id ?? '';
}

function normalizeNamedEntity(raw: RawNamedEntity): Department {
  const id = raw.id ?? raw._id ?? '';
  const name = raw.name ?? raw.code ?? id;

  return {
    id,
    name,
    code: raw.code ?? name,
  };
}

function normalizeCourse(raw: RawNamedEntity): Course {
  const normalized = normalizeNamedEntity(raw);

  return {
    ...normalized,
    departmentId: getEntityId(raw.department),
  };
}

function normalizeSubject(raw: RawNamedEntity): Subject {
  const normalized = normalizeNamedEntity(raw);

  return {
    ...normalized,
    courseId: getEntityId(raw.course),
  };
}

function normalizeMaterial(raw: RawMaterial): Note {
  const uploader = raw.uploadedBy ?? raw.uploaderId ?? raw.author;

  return {
    id: raw.id ?? raw._id ?? '',
    title: raw.title ?? 'Untitled',
    subject: getEntityName(raw.subject) || 'General',
    course: getEntityName(raw.course),
    department: getEntityName(raw.department),
    fileUrl: raw.fileUrl ?? raw.file ?? raw.url ?? '',
    uploadedBy: {
      id: uploader?.id ?? uploader?._id ?? '',
      name: uploader?.name ?? 'Unknown',
    },
    downloadsCount: raw.downloadsCount ?? raw.downloads ?? raw.views ?? 0,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function normalizePaper(raw: RawMaterial): Paper {
  const material = normalizeMaterial(raw);

  return {
    ...material,
    year: Number(raw.year ?? raw.examYear ?? new Date().getFullYear()),
  };
}

function normalizeAuthResponse(rawResponse: RawAuthResponse): AuthResponse {
  const payload = rawResponse.data ?? rawResponse;
  const token = payload.token ?? payload.accessToken ?? rawResponse.token ?? rawResponse.accessToken;

  if (!token) {
    throw new Error('Login response did not include an auth token.');
  }

  return {
    token,
    user: normalizeUser(payload.user ?? rawResponse.user),
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<RawAuthResponse>('/auth/login', { email, password });
    return normalizeAuthResponse(response.data);
  },

  register: async (payload: { name: string; email: string; password: string; role: UserRole }): Promise<AuthResponse> => {
    const response = await apiClient.post<RawAuthResponse>('/auth/register', payload);
    return normalizeAuthResponse(response.data);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<RawProfileResponse>('/auth/me');
    return normalizeUser(response.data.data ?? response.data.user ?? response.data);
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', payload);
    return response.data;
  },
};

export const notesService = {
  list: async (filters?: { department?: string; course?: string; subject?: string; search?: string }): Promise<Note[]> => {
    const response = await apiClient.get<RawMaterial[]>('/notes', { params: filters });
    return response.data.map(normalizeMaterial);
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
    const response = await apiClient.get<RawMaterial[]>('/papers', { params: filters });
    return response.data.map(normalizePaper);
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
    const response = await apiClient.get<RawNamedEntity[]>('/departments');
    return response.data.map(normalizeNamedEntity);
  },

  getCourses: async (departmentId: string): Promise<Course[]> => {
    const response = await apiClient.get<RawNamedEntity[]>('/courses', { params: { department: departmentId } });
    return response.data.map(normalizeCourse);
  },

  getSubjects: async (courseId: string): Promise<Subject[]> => {
    const response = await apiClient.get<RawNamedEntity[]>('/subjects', { params: { course: courseId } });
    return response.data.map(normalizeSubject);
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
    const [notes, papers] = await Promise.all([notesService.list(), papersService.list()]);

    return {
      totalNotes: notes.length,
      totalPapers: papers.length,
      totalDownloads: [...notes, ...papers].reduce((total, item) => total + item.downloadsCount, 0),
      recentUploads: [
        ...notes.map((note) => ({ id: note.id, title: note.title, type: 'note' as const, downloads: note.downloadsCount })),
        ...papers.map((paper) => ({ id: paper.id, title: paper.title, type: 'paper' as const, downloads: paper.downloadsCount })),
      ].slice(0, 5),
    };
  },
  getAdminAnalytics: async (): Promise<AdminAnalytics> => {
    const [users, notes, papers] = await Promise.all([
      apiClient.get<RawUser[]>('/users').then((response) => response.data.map(normalizeUser)),
      notesService.list(),
      papersService.list(),
    ]);

    return {
      usersCount: {
        total: users.length,
        students: users.filter((user) => user.role === 'student').length,
        teachers: users.filter((user) => user.role === 'teacher').length,
        admins: users.filter((user) => user.role === 'admin').length,
      },
      contentCount: {
        totalNotes: notes.length,
        totalPapers: papers.length,
      },
      downloadsOverTime: [],
      flaggedReports: 0,
    };
  },
};

export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<RawUser[]>('/users');
    return response.data.map(normalizeUser);
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
