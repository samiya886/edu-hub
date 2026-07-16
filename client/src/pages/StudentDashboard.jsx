import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../components/NotificationBell';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Download,
  Edit2,
  FileText,
  GraduationCap,
  Menu,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { API_URL } from '../config/api';

const getAcademicId = (value) => value?._id || value || '';
const getAcademicName = (value, fallback = 'Not set') => value?.name || fallback;

const studentNav = [
  { key: 'notes', label: 'Notes', icon: BookOpen },
  { key: 'papers', label: 'Papers', icon: FileText },
  { key: 'upload-notes', label: 'Upload Notes', icon: Upload },
  { key: 'upload-papers', label: 'Upload Papers', icon: Upload },
  { key: 'profile', label: 'Profile', icon: User },
];

const studentSectionKeys = new Set(studentNav.map((item) => item.key));

const emptyUpload = {
  title: '',
  description: '',
  department: '',
  course: '',
  semester: '',
  subject: '',
  file: null,
  existingFileUrl: '',
  year: new Date().getFullYear(),
  examType: 'Final',
  category: 'Digital PDF',
};

const emptyProfile = {
  rollNumber: '',
  phoneNumber: '',
  admissionYear: new Date().getFullYear(),
  department: '',
  course: '',
  semester: '',
  subjects: [],
};

const isStudentProfileComplete = (user) => {
  if (user?.role !== 'student') return true;
  return Boolean(
    user?.rollNumber &&
      user?.phoneNumber &&
      user?.admissionYear &&
      getAcademicId(user?.department) &&
      getAcademicId(user?.course) &&
      getAcademicId(user?.semester) &&
      user?.subjects?.length
  );
};

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

const Shell = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, children, user, isDesktop }) => (
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
        {studentNav.map(({ key, label, icon: Icon }) => (
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
              <motion.span layoutId="studentActivePill" className="absolute -left-1 h-8 w-2 rounded-full bg-white" />
            )}
          </button>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-5">
        <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#ff9f1c] bg-white text-[#0a4a44] font-black">
            {(user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{user?.name || 'Student'}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-teal-100/40">Learner Access</p>
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
              {studentNav.find((item) => item.key === activeSection)?.label}
            </h1>
          </div>
        </div>
        <div className="eduhub-dashboard-header-actions flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <NotificationBell />
          <BackButton />
          <div className="hidden items-center gap-3 rounded-3xl border border-gray-100 bg-gray-50 p-2 pr-5 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a4a44] text-sm font-black text-white">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black leading-none text-[#0a4a44]">{user?.name || 'Student'}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{user?.email || 'student@eduhub'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-w-0 p-3 sm:p-6 md:p-8 lg:p-10">{children}</div>
    </main>
  </div>
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

const ResourceCard = ({ item, type, onDownload, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.005 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-[0_24px_70px_-38px_rgba(10,74,68,0.35)] sm:p-5"
  >
    <div className="absolute inset-x-5 bottom-0 h-1 rounded-full bg-[#ff9f1c]/80 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
    <div className="mb-4 flex items-start gap-3">
      <div className="flex min-w-0 gap-3">
        <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff9f1c]/10 text-[#ff9f1c] group-hover:bg-orange-50 group-hover:shadow-md">
          {type === 'notes' ? <BookOpen size={19} /> : <FileText size={19} />}
        </motion.div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-black leading-tight text-[#0a4a44]">{item.title}</h3>
          <p className="mt-1 truncate text-xs font-bold text-gray-400">{item.subject?.name || 'Unassigned subject'}</p>
        </div>
      </div>
    </div>

    <p className="mb-4 line-clamp-2 min-h-[38px] text-sm font-medium leading-relaxed text-gray-500">
      {item.description || 'No description added yet.'}
    </p>

    <div className="mb-4 grid grid-cols-1 gap-3 text-sm font-bold text-gray-400 sm:grid-cols-2">
      <div className="rounded-2xl bg-gray-50/90 p-3">
        <p className="truncate text-[#0a4a44]">{item.subject?.course?.name || item.course?.name || 'Course'}</p>
        <p>Course</p>
      </div>
      <div className="rounded-2xl bg-gray-50/90 p-3">
        <p className="truncate text-[#0a4a44]">{item.subject?.semester?.name || item.semester?.name || 'Semester'}</p>
        <p>Semester</p>
      </div>
    </div>

    <div className="eduhub-resource-actions mt-auto grid grid-cols-1 gap-2 border-t border-gray-100 pt-3 sm:gap-3">
      <button
        type="button"
        onClick={() => onDownload(item.fileUrl)}
        className="eduhub-resource-action eduhub-resource-action-open flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-[#0a4a44] px-2.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#ff9f1c] sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm"
      >
        <Download size={15} /> Open
      </button>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="eduhub-resource-action eduhub-resource-action-edit flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-2.5 py-2 text-xs font-black text-[#0a4a44] shadow-sm transition hover:bg-[#0a4a44] hover:text-white sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm"
      >
        <Edit2 size={14} /> Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(item._id)}
        className="eduhub-resource-action eduhub-resource-action-delete flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-2.5 py-2 text-xs font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </motion.div>
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
          <label className="block text-xs font-black uppercase tracking-[0.16em] text-gray-500" htmlFor="student-resource-file">
            PDF Document
          </label>
          <input
            id="student-resource-file"
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

const ProfileForm = ({
  user,
  form,
  setForm,
  departments,
  courses,
  semesters,
  subjects,
  saving,
  message,
  onSubmit,
  setupMode = false,
}) => (
  <motion.form
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    onSubmit={onSubmit}
    className="rounded-[40px] border border-gray-100 bg-white p-6 shadow-sm md:p-8"
  >
    <div className="mb-7">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">
        {setupMode ? 'Required Setup' : 'Credential Scope'}
      </p>
      <h3 className="text-2xl font-black tracking-tighter text-[#0a4a44]">
        {setupMode ? 'Complete your student profile' : 'Academic profile'}
      </h3>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-400">
        These fields decide which notes, papers, and study materials appear after login.
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {/* <Field label="Roll Number">
        <input
          required
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          placeholder="e.g. CSE-2026-021"
          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition placeholder:text-gray-300 focus:border-[#ff9f1c] focus:bg-white"
        />
      </Field> */}

      <Field label="Phone Number">
        <input
          required
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          placeholder="Student contact number"
          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition placeholder:text-gray-300 focus:border-[#ff9f1c] focus:bg-white"
        />
      </Field>

      <Field label="Admission Year">
        <input
          required
          type="number"
          min="2000"
          max="2100"
          value={form.admissionYear}
          onChange={(e) => setForm({ ...form, admissionYear: e.target.value })}
          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white"
        />
      </Field>

      <SelectField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value, course: '', semester: '', subjects: [] })}>
        <option value="">Select Department</option>
        {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
      </SelectField>

      <SelectField label="Course" value={form.course} disabled={!form.department} onChange={(e) => setForm({ ...form, course: e.target.value, semester: '', subjects: [] })}>
        <option value="">Select Course</option>
        {courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
      </SelectField>

      <SelectField label="Semester" value={form.semester} disabled={!form.course} onChange={(e) => setForm({ ...form, semester: e.target.value, subjects: [] })}>
        <option value="">Select Semester</option>
        {semesters.map((semester) => <option key={semester._id} value={semester._id}>{semester.name}</option>)}
      </SelectField>

      <Field label="Subjects">
        <select
          multiple
          value={form.subjects}
          disabled={!form.semester}
          onChange={(e) => setForm({ ...form, subjects: Array.from(e.target.selectedOptions, (option) => option.value) })}
          className="min-h-[140px] w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>Select one or more subjects</option>
          {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
        </select>
      </Field>
    </div>

    <div className="mt-6 rounded-3xl bg-[#0a4a44]/5 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current login</p>
      <p className="mt-2 text-sm font-black text-[#0a4a44]">{user?.name} - {user?.email}</p>
    </div>

    <button
      type="submit"
      disabled={saving || !form.rollNumber || !form.phoneNumber || !form.admissionYear || !form.department || !form.course || !form.semester || !form.subjects.length}
      className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-[#ff9f1c] py-5 text-base font-black text-white shadow-[0_24px_50px_-18px_rgba(255,159,28,0.65)] transition hover:bg-[#e68a00] disabled:bg-gray-300"
    >
      <User size={18} /> {saving ? 'Saving profile...' : setupMode ? 'Save profile and enter dashboard' : 'Save academic profile'}
    </button>

    {message && <div className="mt-4 rounded-2xl bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">{message}</div>}
  </motion.form>
);

const DeleteConfirmModal = ({ open, title = 'Delete this resource?', message, isDeleting, onCancel, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061816]/55 px-4 py-6 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isDeleting) onCancel();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-[0_28px_80px_-24px_rgba(2,24,22,0.55)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={22} />
            </div>
            <div className="min-w-0">
              <h2 id="delete-confirm-title" className="text-lg font-black text-[#0a4a44]">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-500">{message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onCancel} disabled={isDeleting} className="min-h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:bg-gray-50 disabled:opacity-60">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="min-h-12 rounded-2xl bg-red-500 px-4 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-600 disabled:bg-red-300">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
const StudentDashboard = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('notes');
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [sidebarOpen, setSidebarOpen] = useState(getIsDesktop);
  const [resourceType, setResourceType] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uploadForm, setUploadForm] = useState(emptyUpload);
  const [profileForm, setProfileForm] = useState(emptyProfile);

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
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileRequired, setProfileRequired] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    department: '',
    course: '',
    semester: '',
    subject: '',
  });

  const profileComplete = isStudentProfileComplete(user);

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section && studentSectionKeys.has(section)) {
      setActiveSection(section);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'notes' || activeSection === 'papers') {
      setResourceType(activeSection);
    }
    if (activeSection === 'upload-notes') {
      setResourceType('notes');
      if (!editingId) setUploadForm(emptyUpload);
    }
    if (activeSection === 'upload-papers') {
      setResourceType('papers');
      if (!editingId) setUploadForm(emptyUpload);
    }
    // Refresh resources when section changes
    fetchResources();
  }, [activeSection]);

  const fetchAll = async () => {
    await Promise.all([fetchDepartments(), fetchResources()]);
  };

  useEffect(() => {
    fetchAll();
    refreshUser?.();
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      rollNumber: user.rollNumber || '',
      phoneNumber: user.phoneNumber || '',
      admissionYear: user.admissionYear || new Date().getFullYear(),
      department: getAcademicId(user.department),
      course: getAcademicId(user.course),
      semester: getAcademicId(user.semester),
      subjects: Array.isArray(user.subjects) ? user.subjects.map(getAcademicId).filter(Boolean) : [],
    });
  }, [user]);

  useEffect(() => {
    if (!profileComplete) return;
    const interval = window.setInterval(() => fetchResources(), 15000);
    return () => window.clearInterval(interval);
  }, [profileComplete]);

  useEffect(() => {
    const department = filters.department || uploadForm.department || profileForm.department;
    if (department) fetchCourses(department);
  }, [filters.department, uploadForm.department, profileForm.department]);

  useEffect(() => {
    const course = filters.course || uploadForm.course || profileForm.course;
    if (course) fetchSemesters(course);
  }, [filters.course, uploadForm.course, profileForm.course]);

  useEffect(() => {
    const semester = filters.semester || uploadForm.semester || profileForm.semester;
    if (semester) fetchSubjects(semester);
  }, [filters.semester, uploadForm.semester, profileForm.semester]);

  useEffect(() => {
    const sourceItems = resourceType === 'notes' ? notes : papers;
    let result = sourceItems;

    if (filters.search) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.subject) {
      result = result.filter((item) => item.subject?._id === filters.subject);
    } else if (filters.semester) {
      result = result.filter((item) => item.subject?.semester?._id === filters.semester || item.semester?._id === filters.semester);
    } else if (filters.course) {
      result = result.filter((item) => item.subject?.course?._id === filters.course || item.course?._id === filters.course);
    } else if (filters.department) {
      result = result.filter((item) => item.subject?.department?._id === filters.department || item.department?._id === filters.department);
    }

    setFilteredItems(result);
  }, [filters, notes, papers, resourceType]);

  const stats = useMemo(() => [
    { label: 'My Notes', value: notes?.length ?? 0, caption: 'Notes uploaded by you', icon: BookOpen },
    { label: 'My Papers', value: papers?.length ?? 0, caption: 'Papers uploaded by you', icon: FileText },
    { label: 'Search Active', value: filters.search ? 1 : 0, caption: 'Keyword search only', icon: Search },
  ], [notes.length, papers.length, filters.search]);

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

  const fetchSubjects = async (semesterId) => {
    try {
      const response = await fetch(`${API_URL}/subjects?semester=${semesterId}`);
      setSubjects(await response.json());
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [notesRes, papersRes] = await Promise.all([
        fetch(`${API_URL}/users/me/resources?type=notes`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/me/resources?type=papers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const notesData = await notesRes.json();
      const papersData = await papersRes.json();

      if (!notesRes.ok) throw new Error(notesData.message || 'Unable to load notes');
      if (!papersRes.ok) throw new Error(papersData.message || 'Unable to load papers');

      setNotes(notesData.items || []);
      setPapers(papersData.items || []);
      setProfileRequired(Boolean(notesData.profileRequired || papersData.profileRequired));
      if (notesData.message) setMessage(notesData.message);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setNotes([]);
      setPapers([]);
      setProfileRequired(true);
      setMessage(error.message);
    }
    setLoading(false);
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) window.open(fileUrl, '_blank');
  };

  const resetUploadForm = () => {
    setUploadForm(emptyUpload);
    setEditingId(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const type = activeSection === 'upload-papers' || resourceType === 'papers' ? 'papers' : 'notes';
      const payload = new FormData();
      payload.append('title', uploadForm.title);
      payload.append('description', uploadForm.description);
      payload.append('department', uploadForm.department);
      payload.append('course', uploadForm.course);
      payload.append('semester', uploadForm.semester);
      payload.append('subject', uploadForm.subject);

      if (uploadForm.file) {
        payload.append('file', uploadForm.file);
      }

      if (type === 'notes') {
        payload.append('category', uploadForm.category);
      } else {
        payload.append('year', Number(uploadForm.year));
        payload.append('examType', uploadForm.examType);
      }

      const response = await fetch(`${API_URL}/${type}${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: payload,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to publish resource');

      setMessage(`${type === 'notes' ? 'Notes' : 'Paper'} ${editingId ? 'updated' : 'published'} successfully.`);
      resetUploadForm();
      setFilters({ search: '', department: '', course: '', semester: '', subject: '' });
      setResourceType(type);
      await fetchResources();
      setActiveSection(type);
    } catch (error) {
      setMessage(error.message);
    }

    setUploading(false);
  };

  const handleEditResource = (item) => {
    const type = resourceType;
    setUploadForm({
      title: item.title || '',
      description: item.description || '',
      department: item.subject?.department?._id || item.department?._id || item.department || '',
      course: item.subject?.course?._id || item.course?._id || item.course || '',
      semester: item.subject?.semester?._id || item.semester?._id || item.semester || '',
      subject: item.subject?._id || item.subject || '',
      file: null,
      existingFileUrl: item.fileUrl || '',
      year: item.year || new Date().getFullYear(),
      examType: item.examType || 'Final',
      category: item.category || 'Digital PDF',
    });
    setEditingId(item._id);
    setActiveSection(type === 'papers' ? 'upload-papers' : 'upload-notes');
  };

  const handleDeleteResource = (id) => {
    setPendingDelete({ id, type: resourceType });
  };

  const confirmDeleteResource = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${pendingDelete.type}/${pendingDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to delete resource');

      setMessage('Resource deleted successfully.');
      setPendingDelete(null);
      await fetchResources();
    } catch (error) {
      setMessage(error.message);
    }

    setIsDeleting(false);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to save profile');

      updateUser(data.user);
      setProfileMessage('Academic profile saved. Your library is now filtered to your credentials.');
      setProfileRequired(false);
      fetchResources();
    } catch (error) {
      setProfileMessage(error.message);
    }

    setSavingProfile(false);
  };

  const renderLibrary = () => (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Academic Library</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">
              {activeSection === 'notes' ? 'Notes Library' : 'Paper Vault'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">
              Review your own uploaded resources, search by title or description, then download the exact material you need.
            </p>
          </div>
        </div>
      </div>

      {profileRequired ? (
        <div className="rounded-[32px] border border-orange-100 bg-orange-50/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9f1c]">Profile Required</p>
              <h3 className="mt-2 text-2xl font-black text-[#0a4a44]">Complete your academic details first</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-500">
                Notes and papers are filtered by your department, course, semester, and subjects after login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('profile')}
              className="rounded-2xl bg-[#0a4a44] px-6 py-4 text-sm font-black text-white transition hover:bg-[#ff9f1c]"
            >
              Update Profile
            </button>
          </div>
        </div>
      ) : null}

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
      ) : filteredItems.length ? (
        <motion.div layout className="mobile-carousel mobile-scroll-track sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ResourceCard
              key={item._id}
              item={item}
              type={resourceType}
              onDownload={handleDownload}
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
            />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12">
          <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-[#0a4a44]">{profileRequired ? 'Academic profile needed' : 'No resources found'}</h3>
          <p className="mt-2 font-medium text-gray-400">
            {profileRequired ? 'Save your academic profile to unlock matching notes and papers.' : 'Try changing the filters or search keyword.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1fr_1.4fr]">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:rounded-[40px] sm:p-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border-4 border-[#ff9f1c] bg-white text-3xl font-black text-[#0a4a44] sm:mb-8 sm:h-24 sm:w-24 sm:rounded-[32px] sm:text-4xl">
          {(user?.name || 'S').charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl sm:tracking-tighter">{user?.name || 'Student'}</h2>
        <p className="mt-2 font-bold text-teal-100/50">{user?.email || 'No email available'}</p>
        <div className="mt-8 rounded-3xl bg-white/5 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Role</p>
          <p className="mt-2 text-2xl font-black capitalize">{user?.role || 'student'}</p>
        </div>
        <div className="mt-5 grid gap-3 rounded-3xl bg-white/5 p-5 text-sm font-bold text-teal-100/70">
          <span>Roll Number: {user?.rollNumber || 'Not set'}</span>
          <span>Phone: {user?.phoneNumber || 'Not set'}</span>
          <span>Admission Year: {user?.admissionYear || 'Not set'}</span>
          <span>Department: {getAcademicName(user?.department)}</span>
          <span>Course: {getAcademicName(user?.course)}</span>
          <span>Semester: {getAcademicName(user?.semester)}</span>
          <span>Subjects: {user?.subjects?.map((subject) => subject.name).join(', ') || 'Not set'}</span>
        </div>
      </div>
      <div className="space-y-8">
        <ProfileForm
          user={user}
          form={profileForm}
          setForm={setProfileForm}
          departments={departments}
          courses={courses}
          semesters={semesters}
          subjects={subjects}
          saving={savingProfile}
          message={profileMessage}
          onSubmit={handleProfileSave}
          setupMode={!profileComplete}
        />
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:rounded-[40px] sm:p-8">
          <h3 className="mb-6 text-2xl font-black text-[#0a4a44]">Learning Activity</h3>
          <div className="mobile-carousel mobile-scroll-track md:grid-cols-3 md:gap-5">
            <StatCard icon={BookOpen} label="Notes Viewed" value={resourceType === 'notes' ? filteredItems.length : notes.length} caption="Current result set" />
            <StatCard icon={FileText} label="Papers Found" value={resourceType === 'papers' ? filteredItems.length : papers.length} caption="Available to download" />
            <StatCard icon={Upload} label="Uploads" value="Ready" caption="Student publishing enabled" />
          </div>
        </div>
      </div>
    </div>
  );

  const content = () => {
    if (activeSection === 'upload-notes' || activeSection === 'upload-papers') {
      return (
        <UploadForm
          type={activeSection === 'upload-papers' ? 'papers' : 'notes'}
          form={uploadForm}
          setForm={setUploadForm}
          departments={departments}
          courses={courses}
          semesters={semesters}
          subjects={subjects}
          loading={uploading}
          message={message}
          editingId={editingId}
          onCancel={() => {
            resetUploadForm();
            setActiveSection(resourceType);
          }}
          onSubmit={handleUpload}
        />
      );
    }

    if (activeSection === 'profile') return renderProfile();
    return renderLibrary();
  };

  if (user?.role === 'student' && !profileComplete) {
    return (
      <div className="min-h-screen bg-[#f7faf9] px-4 py-8 md:px-8">
        <div className="mx-auto mb-5 flex max-w-6xl justify-start">
          <BackButton />
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white shadow-2xl sm:rounded-[40px] sm:p-8 md:p-10">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#ff9f1c] shadow-xl shadow-black/10">
              <GraduationCap size={34} />
            </div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Student Verification</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">Finish setup to enter your dashboard</h1>
            <p className="mt-5 text-sm font-semibold leading-relaxed text-teal-100/60">
              Your department, course, semester, subjects, and roll details are required so EduHub can show only the notes, papers, and materials that match your profile.
            </p>
            <div className="mt-8 rounded-3xl bg-white/5 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100/40">Signed in as</p>
              <p className="mt-2 text-lg font-black">{user?.name}</p>
              <p className="mt-1 text-sm font-bold text-teal-100/50">{user?.email}</p>
            </div>
          </div>

          <ProfileForm
            user={user}
            form={profileForm}
            setForm={setProfileForm}
            departments={departments}
            courses={courses}
            semesters={semesters}
            subjects={subjects}
            saving={savingProfile}
            message={profileMessage}
            onSubmit={handleProfileSave}
            setupMode
          />
        </div>
      </div>
    );
  }

  return (
    <Shell
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
      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        message="This resource will be permanently removed from your library."
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setPendingDelete(null)}
        onConfirm={confirmDeleteResource}
      />    </Shell>
  );
};

export default StudentDashboard;
