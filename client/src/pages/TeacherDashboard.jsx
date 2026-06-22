import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

const API_URL = '/api';

const teacherNav = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'notes', label: 'My Notes', icon: BookOpen },
  { key: 'papers', label: 'My Papers', icon: FileText },
  { key: 'upload-notes', label: 'Upload Notes', icon: Upload },
  { key: 'upload-papers', label: 'Upload Papers', icon: Upload },
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
      <span>Back</span>
    </button>
  );
};

const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

const DashboardShell = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, children, user, isDesktop }) => (
  <div className="min-h-screen w-full overflow-x-hidden bg-[#fcfdfe] font-sans selection:bg-[#ff9f1c]/30">
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
        x: sidebarOpen || isDesktop ? 0 : '-100%',
        width: sidebarOpen ? 280 : 96,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed left-0 top-0 z-50 flex h-dvh max-w-[calc(100vw-16px)] flex-col overflow-hidden bg-[#0a4a44] text-white shadow-2xl lg:h-screen lg:translate-x-0"
    >
      <div className="flex shrink-0 items-center gap-4 p-5 sm:p-7">
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
              if (!isDesktop) setSidebarOpen(false);
            }}
            className={`group relative flex w-full items-center gap-4 rounded-[22px] px-4 py-3.5 text-left transition-all duration-300 sm:px-5 ${
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

    <main className={`${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[96px]'} min-w-0 overflow-x-hidden transition-[margin] duration-300`}>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-2 border-b border-gray-100 bg-white/80 px-3 backdrop-blur-2xl sm:px-4 md:px-8 lg:h-24 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-[#0a4a44] shadow-sm transition hover:bg-gray-100"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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

      <div className="min-w-0 p-3 sm:p-6 md:p-8 lg:p-10">{children}</div>
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
    className="group relative overflow-hidden rounded-[26px] border border-gray-100 bg-white p-4 shadow-sm hover:shadow-[0_30px_80px_-35px_rgba(10,74,68,0.45)] sm:rounded-[32px] sm:p-6"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-[#ff9f1c]/70 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
    <motion.div whileHover={{ rotate: [0, -6, 6, 0] }} className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a4a44]/5 text-[#0a4a44] group-hover:bg-white group-hover:text-[#ff9f1c] group-hover:shadow-lg">
      <Icon size={22} />
    </motion.div>
    <div className="relative">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-[#0a4a44] sm:text-3xl sm:tracking-tighter">{value}</p>
      <p className="mt-2 text-sm font-semibold text-gray-400">{caption}</p>
    </div>
  </motion.div>
);

const HeroPanel = ({ title, caption, action }) => (
  <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">EduAdmin Faculty</p>
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">{title}</h2>
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
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm sm:rounded-[36px]">
    <div className="flex items-center justify-between gap-3 bg-[#0a4a44] p-4 text-white sm:p-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">{editingId ? 'Edit Resource' : 'New Upload'}</p>
        <h3 className="mt-1 text-xl font-black tracking-tighter sm:text-2xl">{editingId ? 'Update' : 'Upload'} {type === 'notes' ? 'Note' : 'Paper'}</h3>
      </div>
      <button type="button" onClick={onCancel} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20" aria-label="Close form">
        <X size={20} />
      </button>
    </div>

    <form onSubmit={onSubmit} className="space-y-5 p-4 sm:space-y-6 sm:p-6">
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
        {type === 'papers' && (
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

      <div className="relative cursor-pointer rounded-[26px] border-4 border-dashed border-gray-100 bg-gray-50/20 p-5 text-center transition hover:border-[#ff9f1c] sm:rounded-[36px] sm:p-10">
        <input
          required={!editingId && !form.existingFileUrl}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })}
          className="absolute inset-0 z-20 cursor-pointer opacity-0"
        />
        <div className="space-y-5">
          <motion.div whileHover={{ scale: 1.08, rotate: 4 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-xl sm:h-24 sm:w-24 sm:rounded-[32px]">
            <Upload className={form.file ? 'text-green-500' : 'text-[#ff9f1c]'} size={32} />
          </motion.div>
          <div>
            <p className="break-words text-lg font-black text-[#0a4a44] sm:text-2xl">
              {form.file ? form.file.name : editingId ? 'Replace PDF Document' : 'Attach PDF Document'}
            </p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 sm:text-xs sm:tracking-[0.2em]">
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
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#ff9f1c] px-4 py-4 text-base font-black text-white shadow-[0_24px_50px_-18px_rgba(255,159,28,0.65)] transition hover:bg-[#e68a00] disabled:bg-gray-300 sm:rounded-3xl sm:py-5 sm:text-lg"
      >
        <Upload size={20} /> {loading ? 'Saving...' : editingId ? 'Update Resource' : 'Publish Resource'}
      </button>
    </form>
  </motion.div>
);

const ResourceCard = ({ item, type, onDownload, onEdit, onDelete, canManage = true }) => (
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
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onDownload(item.fileUrl)}
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0a4a44] py-2.5 text-xs font-black text-white transition hover:bg-[#ff9f1c]"
      >
        <Download size={14} /> Open
      </button>
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
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [sidebarOpen, setSidebarOpen] = useState(getIsDesktop);
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

  useEffect(() => {
    const handleResize = () => {
      const nextIsDesktop = getIsDesktop();
      setIsDesktop(nextIsDesktop);
      setSidebarOpen(nextIsDesktop);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (formData.department) fetchCourses(formData.department);
  }, [formData.department]);

  useEffect(() => {
    if (formData.course) fetchSemesters(formData.course);
  }, [formData.course]);

  useEffect(() => {
    if (formData.semester) fetchSubjects(formData.semester);
  }, [formData.semester]);
  const currentItems = (resourceType === 'notes' ? notes : papers).filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.subject?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const activity = [
    ...notes.slice(0, 3).map((item) => ({ type: 'Note', resourceType: 'notes', title: item.title, time: item.createdAt, id: item._id, item })),
    ...papers.slice(0, 3).map((item) => ({ type: 'Paper', resourceType: 'papers', title: item.title, time: item.createdAt, id: item._id, item })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

  const totalDownloads = [...notes, ...papers].reduce(
    (total, item) => total + Number(item.downloadsCount || item.downloads || item.views || 0),
    0
  );

  const stats = [
    { label: 'My Notes', value: notes?.length ?? 0, caption: 'Notes uploaded by you', icon: BookOpen },
    { label: 'My Papers', value: papers?.length ?? 0, caption: 'Papers uploaded by you', icon: FileText },
    { label: 'Downloads', value: totalDownloads, caption: 'Across your uploads', icon: Download },
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

  const handleDownload = (fileUrl) => {
    if (fileUrl) window.open(fileUrl, '_blank');
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
  const renderOverview = () => {
    const recentUploads = activity.slice(0, 3);
    const recentNotes = notes.slice(0, 3);
    const recentPapers = papers.slice(0, 3);

    return (
      <div className="space-y-8">
        <HeroPanel
          title={`Hello, ${user?.name || 'Teacher'}`}
          caption="Manage your uploaded notes, exam papers, downloads, and recent activity from one student-style dashboard."
        />

        <div className="mobile-carousel mobile-scroll-track md:grid-cols-3 md:gap-5">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveSection('upload-notes')}
            className="rounded-[26px] border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff9f1c]/10 text-[#ff9f1c]">
              <Upload size={22} />
            </div>
            <p className="text-lg font-black text-[#0a4a44]">Upload Resource</p>
            <p className="mt-1 text-sm font-semibold text-gray-400">Add notes or exam papers for students.</p>
          </button>
          <button
            type="button"
            onClick={fetchAll}
            className="rounded-[26px] border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a4a44]/5 text-[#0a4a44]">
              <LayoutDashboard size={22} />
            </div>
            <p className="text-lg font-black text-[#0a4a44]">Refresh Dashboard</p>
            <p className="mt-1 text-sm font-semibold text-gray-400">Reload your latest teacher uploads.</p>
          </button>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black tracking-tight text-[#0a4a44] sm:text-2xl">Recent Uploads</h3>
            <button type="button" onClick={fetchAll} className="text-sm font-black text-[#e68a00]">Refresh</button>
          </div>
          {recentUploads.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentUploads.map((entry) => (
                <ResourceCard
                  key={`${entry.type}-${entry.id}`}
                  item={entry.item}
                  type={entry.resourceType}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center">
              <AlertCircle className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="font-black text-[#0a4a44]">No recent uploads</p>
              <p className="mt-1 text-sm font-semibold text-gray-400">Upload notes or papers to see them here.</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black tracking-tight text-[#0a4a44] sm:text-2xl">My Notes</h3>
            <button type="button" onClick={() => setActiveSection('notes')} className="text-sm font-black text-[#e68a00]">See All</button>
          </div>
          {recentNotes.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentNotes.map((item) => (
                <ResourceCard key={item._id} item={item} type="notes" onDownload={handleDownload} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center">
              <AlertCircle className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="font-black text-[#0a4a44]">No notes found</p>
              <p className="mt-1 text-sm font-semibold text-gray-400">Upload notes from this teacher account.</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black tracking-tight text-[#0a4a44] sm:text-2xl">My Papers</h3>
            <button type="button" onClick={() => setActiveSection('papers')} className="text-sm font-black text-[#e68a00]">See All</button>
          </div>
          {recentPapers.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentPapers.map((item) => (
                <ResourceCard key={item._id} item={item} type="papers" onDownload={handleDownload} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center">
              <AlertCircle className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="font-black text-[#0a4a44]">No papers found</p>
              <p className="mt-1 text-sm font-semibold text-gray-400">Upload papers from this teacher account.</p>
            </div>
          )}
        </section>
      </div>
    );
  };
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-5 py-4 text-sm font-black text-white transition hover:bg-[#e68a00] sm:w-auto sm:px-6"
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
            <ResourceCard key={item._id} item={item} type={resourceType} onDownload={handleDownload} onEdit={handleEdit} onDelete={handleDelete} canManage />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12">
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
  const content = () => {
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
      isDesktop={isDesktop}
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









