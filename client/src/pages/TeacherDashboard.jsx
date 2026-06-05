import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit2,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

const API_URL = '/api';

const getUserId = (user) => user?._id || user?.id;

const teacherNav = [
  { key: 'overview', label: 'Dashboard Stats', icon: LayoutDashboard },
  { key: 'notes', label: 'Manage Notes', icon: BookOpen },
  { key: 'papers', label: 'Manage Papers', icon: FileText },
  { key: 'upload-notes', label: 'Upload Notes', icon: Upload },
  { key: 'upload-papers', label: 'Upload Papers', icon: Upload },
  { key: 'academics', label: 'Courses & Subjects', icon: Layers },
  { key: 'activity', label: 'Activity', icon: Activity },
];

const emptyResource = {
  title: '',
  description: '',
  department: '',
  course: '',
  semester: '',
  subject: '',
  file: null,
  existingFileUrl: '',
  category: 'Digital PDF',
  year: new Date().getFullYear(),
  examType: 'Final',
};

const emptyAcademic = {
  courseName: '',
  semesterName: '',
  semesterOrder: '',
  subjectName: '',
  department: '',
  course: '',
  semester: '',
};

const tokenHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 text-sm font-black text-[#0a4a44] shadow-sm transition hover:border-[#ff9f1c]/40 hover:bg-orange-50 hover:text-[#ff9f1c] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c]/40 focus:ring-offset-2 sm:px-4"
      aria-label="Go back"
    >
      <ArrowLeft size={18} aria-hidden="true" />
      <span className="hidden md:inline">Back</span>
    </button>
  );
};

const DashboardShell = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, children, user }) => (
  <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-[#ff9f1c]/30">
    <AnimatePresence>
      {sidebarOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}
    </AnimatePresence>

    <motion.aside
      animate={{
        x: sidebarOpen || window.innerWidth >= 1024 ? 0 : '-100%',
        width: sidebarOpen ? 280 : 96,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed left-0 top-0 z-50 flex h-screen max-w-[calc(100vw-24px)] flex-col overflow-hidden bg-[#0a4a44] text-white shadow-2xl lg:translate-x-0"
    >
      <div className="flex shrink-0 items-center gap-4 p-7">
        <div className="rounded-2xl bg-[#ff9f1c] p-2.5 shadow-xl shadow-orange-950/20">
          <GraduationCap size={24} />
        </div>
        {sidebarOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-tighter">
            EduAdmin<span className="text-[#ff9f1c]">.</span>
          </motion.span>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-6">
        {teacherNav.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveSection(key);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`group relative flex w-full items-center gap-4 rounded-[22px] px-5 py-3.5 text-left transition-all duration-300 ${
              activeSection === key
                ? 'bg-[#ff9f1c] text-white shadow-[0_20px_40px_-10px_rgba(255,159,28,0.35)]'
                : 'text-teal-100/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={22} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-bold">{label}</span>}
            {activeSection === key && (
              <motion.span layoutId="teacherActivePill" className="absolute -left-1 h-8 w-2 rounded-full bg-white" />
            )}
          </button>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-5">
        <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#ff9f1c] bg-white text-[#0a4a44] font-black">
            {(user?.name || 'T').charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{user?.name || 'Teacher'}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-teal-100/40">Faculty Access</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>

    <main className={`${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[96px]'} min-w-0 transition-[margin] duration-300`}>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-2xl md:px-8 lg:h-24 lg:px-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-[#0a4a44] shadow-sm transition hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Teacher Console</p>
            <h1 className="truncate text-lg font-black tracking-tighter text-[#0a4a44] sm:text-xl md:text-2xl">
              {teacherNav.find((item) => item.key === activeSection)?.label}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <BackButton />
          <div className="hidden items-center gap-3 rounded-3xl border border-gray-100 bg-gray-50 p-2 pr-5 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a4a44] text-sm font-black text-white">
              {(user?.name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black leading-none text-[#0a4a44]">{user?.name || 'Teacher'}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{user?.email || 'faculty@eduhub'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 md:p-8 lg:p-10">{children}</div>
    </main>
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, disabled, children }) => (
  <Field label={label}>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full appearance-none rounded-2xl border-2 border-transparent bg-gray-50 p-4 pr-10 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    </div>
  </Field>
);

const StatCard = ({ icon: Icon, label, value, caption }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.015 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm hover:shadow-[0_30px_80px_-35px_rgba(10,74,68,0.45)]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-[#ff9f1c]/70 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
    <motion.div whileHover={{ rotate: [0, -6, 6, 0] }} className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a4a44]/5 text-[#0a4a44] group-hover:bg-white group-hover:text-[#ff9f1c] group-hover:shadow-lg">
      <Icon size={22} />
    </motion.div>
    <div className="relative">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tighter text-[#0a4a44]">{value}</p>
      <p className="mt-2 text-sm font-semibold text-gray-400">{caption}</p>
    </div>
  </motion.div>
);

const HeroPanel = ({ title, caption, action }) => (
  <div className="rounded-[40px] bg-[#0a4a44] p-8 text-white md:p-10">
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">EduAdmin Faculty</p>
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-4xl font-black tracking-tighter md:text-5xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">{caption}</p>
      </div>
      {action}
    </div>
  </div>
);

const ResourceForm = ({
  type,
  form,
  setForm,
  departments,
  courses,
  semesters,
  subjects,
  onSubmit,
  loading,
  editingId,
  onCancel,
}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-sm">
    <div className="flex items-center justify-between bg-[#0a4a44] p-6 text-white">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">{editingId ? 'Edit Resource' : 'New Upload'}</p>
        <h3 className="mt-1 text-2xl font-black tracking-tighter">{editingId ? 'Update' : 'Upload'} {type === 'notes' ? 'Note' : 'Paper'}</h3>
      </div>
      <button type="button" onClick={onCancel} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20" aria-label="Close form">
        <X size={20} />
      </button>
    </div>

    <form onSubmit={onSubmit} className="space-y-6 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
          />
        </Field>
        <SelectField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value, course: '', semester: '', subject: '' })}>
          <option value="">Select Department</option>
          {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
        </SelectField>
        <SelectField label="Course" value={form.course} disabled={!form.department} onChange={(e) => setForm({ ...form, course: e.target.value, semester: '', subject: '' })}>
          <option value="">Select Course</option>
          {courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
        </SelectField>
        <SelectField label="Semester" value={form.semester} disabled={!form.course} onChange={(e) => setForm({ ...form, semester: e.target.value, subject: '' })}>
          <option value="">Select Semester</option>
          {semesters.map((semester) => <option key={semester._id} value={semester._id}>{semester.name}</option>)}
        </SelectField>
        <SelectField label="Subject" value={form.subject} disabled={!form.semester} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
          <option value="">Select Subject</option>
          {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
        </SelectField>
        {type === 'notes' ? (
          <SelectField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Digital PDF', 'Handwritten', 'Revision Sheets', 'Topper Special'].map((category) => <option key={category} value={category}>{category}</option>)}
          </SelectField>
        ) : (
          <>
            <Field label="Year">
              <input
                required
                type="number"
                min="2000"
                max="2100"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
              />
            </Field>
            <SelectField label="Exam Type" value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
              {['Mid-term', 'Final', 'Quiz', 'Assignment'].map((exam) => <option key={exam} value={exam}>{exam}</option>)}
            </SelectField>
          </>
        )}
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="3"
          className="w-full resize-none rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
        />
      </Field>

      <div className="relative cursor-pointer rounded-[36px] border-4 border-dashed border-gray-100 bg-gray-50/20 p-10 text-center transition hover:border-[#ff9f1c]">
        <input
          required={!editingId && !form.existingFileUrl}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })}
          className="absolute inset-0 z-20 cursor-pointer opacity-0"
        />
        <div className="space-y-5">
          <motion.div whileHover={{ scale: 1.08, rotate: 4 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-xl">
            <Upload className={form.file ? 'text-green-500' : 'text-[#ff9f1c]'} size={36} />
          </motion.div>
          <div>
            <p className="text-2xl font-black text-[#0a4a44]">
              {form.file ? form.file.name : editingId ? 'Replace PDF Document' : 'Attach PDF Document'}
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              {form.file
                ? `${(form.file.size / 1024 / 1024).toFixed(2)} MB - Ready`
                : editingId
                ? 'Leave empty to keep current PDF'
                : 'Max File Size: 15MB - PDF only'}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-3xl bg-[#ff9f1c] py-5 text-lg font-black text-white shadow-[0_24px_50px_-18px_rgba(255,159,28,0.65)] transition hover:bg-[#e68a00] disabled:bg-gray-300"
      >
        <Upload size={20} /> {loading ? 'Saving...' : editingId ? 'Update Resource' : 'Publish Resource'}
      </button>
    </form>
  </motion.div>
);

const ResourceCard = ({ item, type, onEdit, onDelete, canManage = true }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div className="mb-3 flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff9f1c]/10 text-[#ff9f1c]">
        {type === 'notes' ? <BookOpen size={19} /> : <FileText size={19} />}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-base font-black leading-tight text-[#0a4a44]">{item.title}</h3>
        <p className="mt-1 truncate text-xs font-bold text-gray-400">{item.subject?.name || 'Unassigned subject'}</p>
      </div>
    </div>
    <p className="mb-3 line-clamp-2 min-h-[36px] text-xs font-medium leading-relaxed text-gray-500">{item.description || 'No description added yet.'}</p>
    <div className="mb-3 flex flex-wrap gap-2">
      <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-black text-[#0a4a44]">
        {type === 'notes' ? item.category || 'Digital PDF' : item.examType || 'Final'}
      </span>
      <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-black text-[#0a4a44]">
        {type === 'papers' ? item.year || 'Year' : `${item.chapters || 1} chapter`}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onEdit(item)}
        disabled={!canManage}
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0a4a44]/5 py-2.5 text-xs font-black text-[#0a4a44] transition hover:bg-[#0a4a44] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
        title={canManage ? 'Edit resource' : 'Only the uploader or an admin can edit this resource'}
      >
        <Edit2 size={14} /> Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(item._id)}
        disabled={!canManage}
        className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-black text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
        title={canManage ? 'Delete resource' : 'Only the uploader or an admin can delete this resource'}
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [resourceType, setResourceType] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(emptyResource);
  const [academicForm, setAcademicForm] = useState(emptyAcademic);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeSection]);

  useEffect(() => {
    fetchAll();
    const interval = window.setInterval(fetchAll, 15000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSection === 'notes') setResourceType('notes');
    if (activeSection === 'papers') setResourceType('papers');
    if (activeSection === 'upload-notes') {
      setResourceType('notes');
      setEditingId(null);
      setFormData(emptyResource);
      setShowForm(false);
    }
    if (activeSection === 'upload-papers') {
      setResourceType('papers');
      setEditingId(null);
      setFormData(emptyResource);
      setShowForm(false);
    }
  }, [activeSection]);

  useEffect(() => {
    const department = formData.department || academicForm.department;
    if (department) fetchCourses(department);
  }, [formData.department, academicForm.department]);

  useEffect(() => {
    const course = formData.course || academicForm.course;
    if (course) fetchSemesters(course);
  }, [formData.course, academicForm.course]);

  useEffect(() => {
    if (formData.semester || academicForm.semester) fetchSubjects(formData.semester || academicForm.semester);
  }, [formData.semester, academicForm.semester]);

  const teacherId = getUserId(user);

  const isOwner = (item) =>
    item.uploaderId?._id === teacherId ||
    item.uploaderId === teacherId ||
    item.author?._id === teacherId ||
    item.author === teacherId;

  const currentItems = (resourceType === 'notes' ? notes : papers).filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.subject?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const activity = [
    ...notes.slice(0, 3).map((item) => ({ type: 'Note', title: item.title, time: item.createdAt })),
    ...papers.slice(0, 3).map((item) => ({ type: 'Paper', title: item.title, time: item.createdAt })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

  const stats = [
    { label: 'My Notes', value: notes.length, caption: 'Notes uploaded by you', icon: BookOpen },
    { label: 'My Papers', value: papers.length, caption: 'Papers uploaded by you', icon: FileText },
    { label: 'Subjects Indexed', value: subjects.length, caption: 'Current subject scope', icon: Layers },
    { label: 'My Uploads', value: [...notes, ...papers].filter(isOwner).length, caption: 'Resources you can manage', icon: Activity },
  ];

  const fetchAll = async () => {
    await Promise.all([fetchDepartments(), fetchNotes(), fetchPapers(), fetchSubjects()]);
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      setDepartments(await response.json());
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async (deptId) => {
    try {
      const response = await fetch(`${API_URL}/courses?department=${deptId}`);
      setCourses(await response.json());
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/semesters?course=${courseId}`);
      setSemesters(await response.json());
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchSubjects = async (semesterId = '') => {
    try {
      const query = semesterId ? `?semester=${semesterId}` : '';
      const response = await fetch(`${API_URL}/subjects${query}`);
      setSubjects(await response.json());
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/users/me/resources?type=notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load notes');
      setNotes(data.items || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/me/resources?type=papers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load papers');
      setPapers(data.items || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setPapers([]);
    }
  };

  const resetResourceForm = () => {
    setFormData(emptyResource);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('department', formData.department);
      payload.append('course', formData.course);
      payload.append('semester', formData.semester);
      payload.append('subject', formData.subject);

      if (formData.file) {
        payload.append('file', formData.file);
      }

      if (resourceType === 'notes') {
        payload.append('category', formData.category);
      } else {
        payload.append('year', Number(formData.year));
        payload.append('examType', formData.examType);
      }

      const response = await fetch(`${API_URL}/${resourceType}${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save resource');

      setMessage(editingId ? 'Resource updated successfully.' : 'Resource published successfully.');
      resetResourceForm();
      if (resourceType === 'notes') {
        await fetchNotes();
      } else {
        await fetchPapers();
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      department: item.subject?.department?._id || item.department?._id || item.department || '',
      course: item.subject?.course?._id || item.course?._id || item.course || '',
      semester: item.subject?.semester?._id || item.semester?._id || item.semester || '',
      subject: item.subject?._id || item.subject || '',
      file: null,
      existingFileUrl: item.fileUrl || '',
      category: item.category || 'Digital PDF',
      year: item.year || new Date().getFullYear(),
      examType: item.examType || 'Final',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${resourceType}/${id}`, {
        method: 'DELETE',
        headers: tokenHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete resource');

      setMessage('Resource deleted successfully.');
      if (resourceType === 'notes') {
        await fetchNotes();
      } else {
        await fetchPapers();
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const createAcademic = async (kind) => {
    setLoading(true);
    setMessage('');

    const payloads = {
      course: { name: academicForm.courseName, department: academicForm.department },
      semester: {
        name: academicForm.semesterName,
        department: academicForm.department,
        course: academicForm.course,
        order: Number(academicForm.semesterOrder) || undefined,
      },
      subject: {
        name: academicForm.subjectName,
        department: academicForm.department,
        course: academicForm.course,
        semester: academicForm.semester,
      },
    };

    try {
      const response = await fetch(`${API_URL}/${kind === 'course' ? 'courses' : kind === 'semester' ? 'semesters' : 'subjects'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads[kind]),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Unable to create ${kind}`);

      setMessage(`${kind.charAt(0).toUpperCase() + kind.slice(1)} created successfully.`);
      setAcademicForm({ ...emptyAcademic, department: academicForm.department, course: academicForm.course, semester: academicForm.semester });
      if (kind === 'course') fetchCourses(academicForm.department);
      if (kind === 'semester') fetchSemesters(academicForm.course);
      fetchSubjects(academicForm.semester);
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return;

    try {
      const response = await fetch(`${API_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: tokenHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete subject');
      setMessage('Subject deleted successfully.');
      fetchSubjects(academicForm.semester);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <HeroPanel
        title="Academic Command Center"
        caption="Track your uploads, monitor resource activity, and keep course structures tidy from one responsive console."
        action={
          <button
            type="button"
            onClick={() => {
              setActiveSection('notes');
              setResourceType('notes');
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e68a00]"
          >
            <Plus size={18} /> New Resource
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-[#0a4a44]">
              <BarChart3 className="text-[#ff9f1c]" /> Resource Activity
            </h3>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-600">Live</span>
          </div>
          <div className="flex h-56 items-end gap-4">
            {[notes.length + 2, papers.length + 1, subjects.length + 1, courses.length + 1, semesters.length + 1, notes.length + papers.length + 1].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(95, 24 + height * 12)}%` }}
                transition={{ delay: index * 0.08 }}
                className="w-full rounded-t-3xl bg-[#0a4a44] transition-colors hover:bg-[#ff9f1c]"
              />
            ))}
          </div>
        </div>

        <div className="rounded-[40px] bg-[#0a4a44] p-8 text-white shadow-xl">
          <h3 className="mb-6 text-2xl font-black tracking-tighter">Recent Activity</h3>
          <div className="space-y-4">
            {activity.length ? activity.map((item) => (
              <div key={`${item.type}-${item.title}`} className="rounded-3xl bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9f1c]">{item.type}</p>
                <p className="mt-1 line-clamp-1 font-bold">{item.title}</p>
              </div>
            )) : (
              <p className="text-sm font-medium text-teal-100/50">No uploads yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      <HeroPanel
        title={`Manage ${resourceType === 'notes' ? 'Notes' : 'Papers'}`}
        caption="Upload, edit, and delete your academic resources with the same structure students use to discover them."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData(emptyResource);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e68a00]"
          >
            <Plus size={18} /> Add {resourceType === 'notes' ? 'Note' : 'Paper'}
          </button>
        }
      />

      <div className="flex flex-col gap-4 rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex rounded-2xl bg-gray-50 p-1">
          {['notes', 'papers'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setResourceType(type)}
              className={`rounded-xl px-5 py-3 text-sm font-black capitalize transition ${
                resourceType === type ? 'bg-[#0a4a44] text-white' : 'text-gray-400 hover:text-[#0a4a44]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your resources"
            className="w-full rounded-2xl bg-gray-50 py-4 pl-11 pr-4 font-bold text-[#0a4a44] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ff9f1c]"
          />
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-2xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">
            <CheckCircle2 size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <ResourceForm
            type={resourceType}
            form={formData}
            setForm={setFormData}
            departments={departments}
            courses={courses}
            semesters={semesters}
            subjects={subjects}
            onSubmit={handleSubmit}
            loading={loading}
            editingId={editingId}
            onCancel={resetResourceForm}
          />
        )}
      </AnimatePresence>

      {currentItems.length ? (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {currentItems.map((item) => (
            <ResourceCard key={item._id} item={item} type={resourceType} onEdit={handleEdit} onDelete={handleDelete} canManage />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-gray-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-[#0a4a44]">No {resourceType} yet</h3>
          <p className="mt-2 font-medium text-gray-400">Create one to start building your resource library.</p>
        </div>
      )}
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-8">
      <HeroPanel
        title={`Upload ${resourceType === 'notes' ? 'Notes' : 'Papers'}`}
        caption="Publish a new academic resource and tag it to the right department, course, semester, and subject."
      />

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-2xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">
            <CheckCircle2 size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <ResourceForm
        type={resourceType}
        form={formData}
        setForm={setFormData}
        departments={departments}
        courses={courses}
        semesters={semesters}
        subjects={subjects}
        onSubmit={handleSubmit}
        loading={loading}
        editingId={null}
        onCancel={() => setActiveSection(resourceType)}
      />
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-8">
      <HeroPanel
        title="Manage Courses, Subjects & Semesters"
        caption="Keep the academic taxonomy clean so notes and papers land in the right department, course, semester, and subject."
      />

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-2xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">
            <CheckCircle2 size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-2xl font-black text-[#0a4a44]">Course</h3>
          <div className="space-y-4">
            <SelectField label="Department" value={academicForm.department} onChange={(e) => setAcademicForm({ ...academicForm, department: e.target.value, course: '', semester: '' })}>
              <option value="">Select Department</option>
              {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
            </SelectField>
            <Field label="Course Name">
              <input
                value={academicForm.courseName}
                onChange={(e) => setAcademicForm({ ...academicForm, courseName: e.target.value })}
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
              />
            </Field>
            <button
              type="button"
              disabled={!academicForm.department || !academicForm.courseName || loading}
              onClick={() => createAcademic('course')}
              className="w-full rounded-2xl bg-[#0a4a44] py-4 text-sm font-black text-white transition hover:bg-[#ff9f1c] disabled:bg-gray-300"
            >
              Create Course
            </button>
          </div>
        </div>

        <div className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-2xl font-black text-[#0a4a44]">Semester</h3>
          <div className="space-y-4">
            <SelectField label="Course" value={academicForm.course} disabled={!academicForm.department} onChange={(e) => setAcademicForm({ ...academicForm, course: e.target.value, semester: '' })}>
              <option value="">Select Course</option>
              {courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
            </SelectField>
            <Field label="Semester Name">
              <input
                value={academicForm.semesterName}
                onChange={(e) => setAcademicForm({ ...academicForm, semesterName: e.target.value })}
                placeholder="e.g. Semester 3"
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                value={academicForm.semesterOrder}
                onChange={(e) => setAcademicForm({ ...academicForm, semesterOrder: e.target.value })}
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
              />
            </Field>
            <button
              type="button"
              disabled={!academicForm.department || !academicForm.course || !academicForm.semesterName || loading}
              onClick={() => createAcademic('semester')}
              className="w-full rounded-2xl bg-[#0a4a44] py-4 text-sm font-black text-white transition hover:bg-[#ff9f1c] disabled:bg-gray-300"
            >
              Create Semester
            </button>
          </div>
        </div>

        <div className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-2xl font-black text-[#0a4a44]">Subject</h3>
          <div className="space-y-4">
            <SelectField label="Semester" value={academicForm.semester} disabled={!academicForm.course} onChange={(e) => setAcademicForm({ ...academicForm, semester: e.target.value })}>
              <option value="">Select Semester</option>
              {semesters.map((semester) => <option key={semester._id} value={semester._id}>{semester.name}</option>)}
            </SelectField>
            <Field label="Subject Name">
              <input
                value={academicForm.subjectName}
                onChange={(e) => setAcademicForm({ ...academicForm, subjectName: e.target.value })}
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
              />
            </Field>
            <button
              type="button"
              disabled={!academicForm.department || !academicForm.course || !academicForm.semester || !academicForm.subjectName || loading}
              onClick={() => createAcademic('subject')}
              className="w-full rounded-2xl bg-[#0a4a44] py-4 text-sm font-black text-white transition hover:bg-[#ff9f1c] disabled:bg-gray-300"
            >
              Create Subject
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-2xl font-black text-[#0a4a44]">Subject Directory</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {subjects.length ? subjects.map((subject) => (
            <div key={subject._id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
              <div className="min-w-0">
                <p className="truncate font-black text-[#0a4a44]">{subject.name}</p>
                <p className="truncate text-xs font-bold text-gray-400">{subject.course?.name || 'Course'} / {subject.semester?.name || 'Semester'}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteSubject(subject._id)}
                className="rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-500 hover:text-white"
                aria-label="Delete subject"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )) : (
            <p className="text-sm font-bold text-gray-400">Select a semester to view subjects.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-8">
      <HeroPanel title="Dashboard Stats & Activity" caption="A compact timeline of your uploads and taxonomy work inside the teacher console." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      <div className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-2xl font-black text-[#0a4a44]">Activity Feed</h3>
        <div className="space-y-4">
          {activity.length ? activity.map((item) => (
            <div key={`${item.type}-${item.title}`} className="flex items-center gap-4 rounded-3xl bg-gray-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff9f1c]/10 text-[#ff9f1c]">
                {item.type === 'Note' ? <BookOpen size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{item.type}</p>
                <p className="font-black text-[#0a4a44]">{item.title}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm font-bold text-gray-400">No recent activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  const content = () => {
    if (activeSection === 'academics') return renderAcademics();
    if (activeSection === 'activity') return renderActivity();
    if (activeSection === 'upload-notes' || activeSection === 'upload-papers') return renderUpload();
    if (activeSection === 'notes' || activeSection === 'papers') return renderResources();
    return renderOverview();
  };

  return (
    <DashboardShell
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      user={user}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
          {content()}
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
};

export default TeacherDashboard;
