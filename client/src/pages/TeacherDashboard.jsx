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
  Menu,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

const API_URL = '/api';

const teacherNav = [
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
      className="eduhub-dashboard-back-button inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 text-xs font-black text-[#0a4a44] shadow-sm transition hover:border-[#ff9f1c]/40 hover:bg-orange-50 hover:text-[#ff9f1c] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c]/40 focus:ring-offset-2 sm:h-11 sm:px-4 sm:text-sm"
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
        width: sidebarOpen || !isDesktop ? 280 : 96,
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
      <header className="eduhub-dashboard-header sticky top-0 z-30 flex h-20 items-center justify-between gap-2 border-b border-gray-100 bg-white/80 px-3 backdrop-blur-2xl sm:px-4 md:px-8 lg:h-24 lg:px-10">
        <div className="eduhub-dashboard-header-left flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="eduhub-dashboard-menu-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-[#0a4a44] shadow-sm transition hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black tracking-tighter text-[#0a4a44] sm:text-xl md:text-2xl">
              {teacherNav.find((item) => item.key === activeSection)?.label}
            </h1>
          </div>
        </div>

        <div className="eduhub-dashboard-header-actions flex shrink-0 items-center justify-end gap-2 sm:gap-3">
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

const SelectField = ({ label, value, onChange, disabled, children, variant = 'rounded' }) => (
  <Field label={label}>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={
          variant === 'plain'
            ? 'w-full appearance-none rounded-md border border-gray-300 bg-white p-3 pr-10 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60'
            : 'w-full appearance-none rounded-2xl border-2 border-transparent bg-gray-50 p-4 pr-10 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50'
        }
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

const UploadForm = ({
  type,
  form,
  setForm,
  departments,
  courses,
  semesters,
  subjects,
  loading,
  message,
  editingId,
  onCancel,
  onSubmit,
}) => (
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
    <div className="mb-5 border-b border-gray-200 pb-5">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9f1c]">Academic Submission</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0a4a44] sm:text-3xl">
        {editingId ? 'Edit' : 'Upload'} {type === 'notes' ? 'Notes' : 'Question Paper'}
      </h2>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-500">
        Complete each required field and attach one PDF document for review.
      </p>
    </div>

    <form onSubmit={onSubmit} className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <section className="border-b border-gray-200 p-5 sm:p-6">
        <h3 className="text-base font-black text-[#0a4a44]">Resource Information</h3>
        <div className="mt-5 grid gap-5">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Data Structures Unit 2"
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition placeholder:text-gray-400 focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
              placeholder="Add brief details about this resource"
              className="w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition placeholder:text-gray-400 focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100"
            />
          </Field>
        </div>
      </section>

      <section className="border-b border-gray-200 p-5 sm:p-6">
        <h3 className="text-base font-black text-[#0a4a44]">Academic Details</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <SelectField variant="plain" label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value, course: '', semester: '', subject: '' })}>
            <option value="">Select Department</option>
            {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
          </SelectField>

          <SelectField variant="plain" label="Course" value={form.course} disabled={!form.department} onChange={(e) => setForm({ ...form, course: e.target.value, semester: '', subject: '' })}>
            <option value="">Select Course</option>
            {courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
          </SelectField>

          <SelectField variant="plain" label="Semester" value={form.semester} disabled={!form.course} onChange={(e) => setForm({ ...form, semester: e.target.value, subject: '' })}>
            <option value="">Select Semester</option>
            {semesters.map((semester) => <option key={semester._id} value={semester._id}>{semester.name}</option>)}
          </SelectField>

          <SelectField variant="plain" label="Subject" value={form.subject} disabled={!form.semester} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            <option value="">Select Subject</option>
            {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
          </SelectField>

          {type === 'notes' ? (
            <SelectField variant="plain" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
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
                  className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100"
                />
              </Field>
              <SelectField variant="plain" label="Exam Type" value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
                {['Mid-term', 'Final', 'Quiz', 'Assignment'].map((exam) => <option key={exam} value={exam}>{exam}</option>)}
              </SelectField>
            </>
          )}
        </div>
      </section>

      <section className="border-b border-gray-200 p-5 sm:p-6">
        <h3 className="text-base font-black text-[#0a4a44]">Document Upload</h3>
        <div className="mt-5 rounded-md border border-gray-300 bg-gray-50 p-4">
          <label className="block text-xs font-black uppercase tracking-[0.16em] text-gray-500" htmlFor="teacher-resource-file">
            PDF Document
          </label>
          <input
            id="teacher-resource-file"
            required={!editingId && !form.existingFileUrl}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })}
            className="mt-3 block w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] file:mr-4 file:rounded-md file:border-0 file:bg-[#0a4a44] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
          />
          <p className="mt-3 text-xs font-semibold text-gray-500">
            {form.file
              ? `${form.file.name} - ${(form.file.size / 1024 / 1024).toFixed(2)} MB`
              : editingId
              ? 'Leave empty to keep the current PDF.'
              : 'Upload one PDF file, maximum 15MB.'}
          </p>
        </div>
      </section>

      {message && (
        <div className="mx-5 mt-5 rounded-md border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44] sm:mx-6">
          {message}
        </div>
      )}

      <div className="grid gap-3 p-5 sm:flex sm:justify-end sm:p-6">
        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-black text-[#0a4a44] transition hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ff9f1c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#e68a00] disabled:bg-gray-300"
        >
          <Upload size={18} /> {loading ? 'Submitting...' : editingId ? 'Update Submission' : `Submit ${type === 'notes' ? 'Notes' : 'Paper'}`}
        </button>
      </div>
    </form>
  </motion.div>
);

const ResourceCard = ({ item, type, onDownload, onEdit, onDelete, canManage = true }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.005 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-[0_24px_70px_-38px_rgba(10,74,68,0.45)]"
  >
    <div className="absolute inset-x-4 bottom-0 h-1 rounded-full bg-[#ff9f1c]/70 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff9f1c]/10 text-[#ff9f1c] group-hover:bg-orange-50 group-hover:shadow-md">
          {type === 'notes' ? <BookOpen size={19} /> : <FileText size={19} />}
        </motion.div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-black leading-tight text-[#0a4a44]">{item.title}</h3>
          <p className="mt-1 truncate text-xs font-bold text-gray-400">{item.subject?.name || 'Unassigned subject'}</p>
        </div>
      </div>
    </div>

    <p className="mb-3 line-clamp-2 min-h-[36px] text-xs font-medium leading-relaxed text-gray-500">
      {item.description || 'No description added yet.'}
    </p>

    <div className="mb-4 grid grid-cols-1 gap-3 text-sm font-bold text-gray-400 sm:grid-cols-2">
      <div className="rounded-2xl bg-gray-50 p-3.5">
        <p className="truncate text-[#0a4a44]">{item.subject?.course?.name || item.course?.name || 'Course'}</p>
        <p>Course</p>
      </div>
      <div className="rounded-2xl bg-gray-50 p-3.5">
        <p className="truncate text-[#0a4a44]">{item.subject?.semester?.name || item.semester?.name || 'Semester'}</p>
        <p>Semester</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <button
        type="button"
        onClick={() => onDownload(item.fileUrl)}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#0a4a44] px-3 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#ff9f1c]"
      >
        <Download size={15} /> Open
      </button>
      <button
        type="button"
        onClick={() => onEdit(item, type)}
        disabled={!canManage}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 py-3 text-sm font-black text-[#0a4a44] shadow-sm transition hover:bg-[#0a4a44] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
      >
        <Edit2 size={14} /> Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(item._id, type)}
        disabled={!canManage}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-red-50 px-3 py-3 text-sm font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('notes');
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [sidebarOpen, setSidebarOpen] = useState(getIsDesktop);
  const [resourceType, setResourceType] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(emptyResource);
  const [filters, setFilters] = useState({ search: '' });

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
    }
    if (activeSection === 'upload-papers') {
      setResourceType('papers');
      setEditingId(null);
      setFormData(emptyResource);
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
    item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.subject?.name?.toLowerCase().includes(filters.search.toLowerCase())
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
    { label: 'Search Active', value: filters.search ? 1 : 0, caption: 'Keyword search only', icon: Search },
  ];

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchDepartments(), fetchNotes(), fetchPapers(), fetchSubjects()]);
    setLoading(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
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

    setUploading(false);
  };

  const handleEdit = (item, typeOverride = resourceType) => {
    const targetType = typeOverride || resourceType;
    setResourceType(targetType);
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
    setActiveSection(targetType === 'papers' ? 'upload-papers' : 'upload-notes');
  };

  const handleDelete = async (id, typeOverride = resourceType) => {
    const targetType = typeOverride || resourceType;
    if (!window.confirm('Delete this resource?')) return;
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${targetType}/${id}`, {
        method: 'DELETE',
        headers: tokenHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete resource');

      setMessage('Resource deleted successfully.');
      if (targetType === 'notes') {
        await fetchNotes();
      } else {
        await fetchPapers();
      }
    } catch (error) {
      setMessage(error.message);
    }
  };
  const renderResources = () => (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Academic Library</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">
              {activeSection === 'notes' ? 'Notes Library' : 'Paper Vault'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">
              Review your own uploaded resources, search by title or description, then open the exact material you need.
            </p>
          </div>
        </div>
      </div>

      <div className="mobile-carousel mobile-scroll-track md:grid-cols-3 md:gap-5">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder={`Search ${resourceType}`}
            className="w-full rounded-2xl bg-gray-50 py-4 pl-12 pr-4 font-bold text-[#0a4a44] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ff9f1c]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#ff9f1c]/20 border-t-[#ff9f1c]" />
          <p className="font-bold text-gray-400">Loading resources...</p>
        </div>
      ) : currentItems.length ? (
        <motion.div layout className="mobile-carousel mobile-scroll-track sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {currentItems.map((item) => (
            <ResourceCard key={item._id} item={item} type={resourceType} onDownload={handleDownload} onEdit={handleEdit} onDelete={handleDelete} canManage />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12">
          <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-[#0a4a44]">No resources found</h3>
          <p className="mt-2 font-medium text-gray-400">Try changing the search keyword or upload a new teacher resource.</p>
        </div>
      )}
    </div>
  );

  const renderUpload = () => (
    <UploadForm
      type={activeSection === 'upload-papers' ? 'papers' : 'notes'}
      form={formData}
      setForm={setFormData}
      departments={departments}
      courses={courses}
      semesters={semesters}
      subjects={subjects}
      loading={uploading}
      message={message}
      editingId={editingId}
      onCancel={() => {
        resetResourceForm();
        setActiveSection(resourceType);
      }}
      onSubmit={handleSubmit}
    />
  );

  const content = () => {
    if (activeSection === 'upload-notes' || activeSection === 'upload-papers') return renderUpload();
    if (activeSection === 'notes' || activeSection === 'papers') return renderResources();
    return renderResources();
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









