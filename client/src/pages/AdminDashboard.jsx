import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../components/NotificationBell';
import NotificationHandlerPanel from '../components/NotificationHandlerPanel';
import { API_URL } from '../config/api';
import {
  GraduationCap, Menu, ArrowRight, ArrowLeft, LogOut,
  LayoutDashboard, UserCircle, BookOpen, FileText, PenTool,
  LayoutGrid, Calendar, Users, Bell, Megaphone,
  TrendingUp, PlusCircle, Clock, CheckCircle,
  Upload, Loader2, AlertCircle, Plus, ChevronRight, ChevronDown,
  Layers, Hash, Activity,
  Briefcase, Code, BarChart3, File, Eye, Download, Search,
  ShieldCheck, FileClock, Building2, Pencil, Trash2, Save, X
} from 'lucide-react';

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

const DeleteConfirmModal = ({ open, title = 'Delete this item?', message, isDeleting, onCancel, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061816]/55 px-4 py-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) onCancel(); }}>
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-[0_28px_80px_-24px_rgba(2,24,22,0.55)]" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500"><Trash2 size={22} /></div>
            <div className="min-w-0"><h2 id="delete-confirm-title" className="text-lg font-black text-[#0a4a44]">{title}</h2><p className="mt-2 text-sm font-semibold leading-relaxed text-gray-500">{message}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onCancel} disabled={isDeleting} className="min-h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:bg-gray-50 disabled:opacity-60">Cancel</button>
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="min-h-12 rounded-2xl bg-red-500 px-4 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-600 disabled:bg-red-300">{isDeleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

const adminFormIcons = {
  'Add Courses': BookOpen,
  'Add Semester': Calendar,
  'Add Subject': LayoutGrid,
  'Add Papers': FileText,
  'Add Notes': PenTool,
};

// --- SUB-COMPONENT: ENHANCED ACTION FORM ---
const AdminActionForm = ({ activeTab }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    department: '',
    course: '',
    semester: '',
    subject: '',
    name: '',
    title: '',
    description: '',
    year: '',
    examType: '',
    category: 'Digital PDF',
    chapters: 1,
    isPremium: false,
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/departments`);
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Unable to load departments:', error);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (!formData.department) {
        setCourses([]);
        setFormData(prev => ({ ...prev, course: '', semester: '', subject: '' }));
        return;
      }
      try {
        const response = await fetch(`/api/courses?department=${formData.department}`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Unable to load courses:', error);
      }
    };
    loadCourses();
  }, [formData.department]);

  useEffect(() => {
    const loadSemesters = async () => {
      if (!formData.course) {
        setSemesters([]);
        setFormData(prev => ({ ...prev, semester: '', subject: '' }));
        return;
      }
      try {
        const query = new URLSearchParams({
          department: formData.department,
          course: formData.course,
        }).toString();
        const response = await fetch(`/api/semesters?${query}`);
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error('Unable to load semesters:', error);
      }
    };
    loadSemesters();
  }, [formData.course, formData.department]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!formData.semester) {
        setSubjects([]);
        setFormData(prev => ({ ...prev, subject: '' }));
        return;
      }
      try {
        const query = new URLSearchParams({
          department: formData.department,
          course: formData.course,
          semester: formData.semester,
        }).toString();
        const response = await fetch(`/api/subjects?${query}`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Unable to load subjects:', error);
      }
    };
    loadSubjects();
  }, [formData.semester, formData.course, formData.department]);

  const resetForm = () => {
    setFormData({
      department: '',
      course: '',
      semester: '',
      subject: '',
      name: '',
      title: '',
      description: '',
      year: '',
      examType: '',
      category: 'Digital PDF',
      chapters: 1,
      isPremium: false,
    });
    setFile(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      let endpoint = '';
      let payload = {};
      const authHeader = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      };

      if (activeTab === 'Add Courses') {
        endpoint = '/api/courses';
        payload = {
          name: formData.name,
          department: formData.department,
        };
      } else if (activeTab === 'Add Semester') {
        endpoint = '/api/semesters';
        payload = {
          name: formData.name,
          department: formData.department,
          course: formData.course,
        };
      } else if (activeTab === 'Add Subject') {
        endpoint = '/api/subjects';
        payload = {
          name: formData.name,
          department: formData.department,
          course: formData.course,
          semester: formData.semester,
        };
      } else if (activeTab === 'Add Notes') {
        endpoint = '/api/notes';
        if (!file) throw new Error('Please attach a PDF document');

        payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('department', formData.department);
        payload.append('course', formData.course);
        payload.append('semester', formData.semester);
        payload.append('subject', formData.subject);
        payload.append('category', formData.category);
        payload.append('isPremium', formData.isPremium);
        payload.append('chapters', formData.chapters);
        payload.append('file', file);
        requestOptions = { method: 'POST', headers: authHeader };
      } else if (activeTab === 'Add Papers') {
        endpoint = '/api/papers';
        if (!file) throw new Error('Please attach a PDF document');

        payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('department', formData.department);
        payload.append('course', formData.course);
        payload.append('semester', formData.semester);
        payload.append('subject', formData.subject);
        payload.append('year', formData.year);
        payload.append('examType', formData.examType);
        payload.append('isPremium', formData.isPremium);
        payload.append('file', file);
        requestOptions = { method: 'POST', headers: authHeader };
      }

      const response = await fetch(endpoint, {
        ...requestOptions,
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save resource');
      }

      setIsSuccess(true);
      resetForm();
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error);
    }

    setIsProcessing(false);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
  };

  const renderInputField = (label, children, index = 0) => (
    <motion.div custom={index} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-3 relative group">
      <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2 flex items-center gap-2">{label}</label>
      {children}
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative overflow-hidden border-b border-gray-200 bg-[#0a4a44] p-5 text-white sm:p-6">
        <BackButton />
          <div className="relative z-10">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#ff9f1c] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block shadow-lg shadow-orange-950/20">
              System Entry Mode
            </motion.span>
            <h2 className="mb-2 flex min-w-0 items-center gap-3 text-2xl font-black sm:gap-4 sm:text-4xl">
              {React.createElement(adminFormIcons[activeTab] || BookOpen, { className: 'text-[#ff9f1c]' })}
              {activeTab}
            </h2>
            <p className="text-sm font-medium leading-relaxed text-teal-100/60 sm:text-lg">Manage semester, course, and subject relationships with MongoDB.</p>
          </div>
          <Layers className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2 lg:gap-10">
            {renderInputField(
              <><GraduationCap size={14} /> Department</>,
              <div className="relative">
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>,
              1
            )}

            {(activeTab === 'Add Semester' || activeTab === 'Add Subject' || activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><BookOpen size={14} /> Course</>,
              <div className="relative">
                <select
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  disabled={!formData.department}
                  className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>,
              2
            )}

            {(activeTab === 'Add Subject' || activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><Layers size={14} /> Semester</>,
              <div className="relative">
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  disabled={!formData.course}
                  className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
                >
                  <option value="" disabled>Select Semester</option>
                  {semesters.map((semester) => (
                    <option key={semester._id} value={semester._id}>{semester.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>,
              3
            )}

            {activeTab === 'Add Courses' && renderInputField(
              <><BookOpen size={14} /> Course Name</>,
              <input
                type="text"
                required
                placeholder="Example: B.Tech"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              4
            )}

            {activeTab === 'Add Semester' && renderInputField(
              <><Calendar size={14} /> Semester Name</>,
              <input
                type="text"
                required
                placeholder="Example: 3rd Semester"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              4
            )}

            {activeTab === 'Add Subject' && renderInputField(
              <><Hash size={14} /> Subject Name</>,
              <input
                type="text"
                required
                placeholder="Example: Data Structures"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              4
            )}

            {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><Hash size={14} /> Subject</>,
              <div className="relative">
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={!formData.semester}
                  className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>,
              4
            )}

            {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><FileText size={14} /> Title</>,
              <input
                type="text"
                required
                placeholder={activeTab === 'Add Notes' ? 'Notes Title' : 'Paper Title'}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              5
            )}

            {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><PenTool size={14} /> Description</>,
              <textarea
                required
                placeholder="Short description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[150px] p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm resize-none"
              />,
              6
            )}

            {activeTab === 'Add Papers' && renderInputField(
              <><Calendar size={14} /> Exam Year</>,
              <input
                type="number"
                required
                placeholder="2024"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              7
            )}

            {activeTab === 'Add Papers' && renderInputField(
              <><Layers size={14} /> Exam Type</>,
              <select
                required
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
              >
                <option value="" disabled>Select Exam Type</option>
                <option value="Mid-term">Mid-term</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
              </select>,
              8
            )}

          </div>

          {activeTab === 'Add Notes' && (
            <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Publish Year</label>
                <input
                  type="number"
                  min="2000"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
                />
              </div>
            </motion.div>
          )}

          {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && (
            <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible" className="relative border-4 border-dashed border-gray-100 rounded-[26px] p-5 text-center group hover:border-[#ff9f1c] bg-gray-50/20 transition-all cursor-pointer sm:rounded-[28px] sm:p-10 lg:p-16">
              <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setFile(e.target.files[0])} />
              <div className="space-y-6">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mx-auto shadow-2xl sm:h-28 sm:w-28 sm:rounded-[40px]">
                  <Upload className={file ? 'text-green-500' : 'text-[#ff9f1c]'} size={34} />
                </motion.div>
                <div className="space-y-2">
                  <p className="break-words text-[#0a4a44] font-black text-lg sm:text-3xl">{file ? file.name : 'Attach PDF Document'}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.2em]">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB - READY` : 'Max File Size: 15MB - PDF only'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[30px] border border-red-100 bg-red-50 p-6 text-red-700">
              {errorMessage}
            </motion.div>
          )}

          <div className="pt-6">
            <button
              disabled={isProcessing}
              className={`flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-center text-base font-black shadow-[0_30px_60px_-15px_rgba(255,159,28,0.3)] transition-all sm:gap-4 sm:rounded-2xl sm:py-7 sm:text-2xl ${isProcessing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#ff9f1c] text-white hover:bg-[#e68a00] hover:-translate-y-2 active:scale-95'}`}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle size={22} className="sm:h-7 sm:w-7" />}
              {isProcessing ? 'Processing...' : activeTab === 'Add Courses' ? 'Add Course' : activeTab === 'Add Semester' ? 'Add Semester' : activeTab === 'Add Subject' ? 'Add Subject' : activeTab === 'Add Notes' ? 'Upload Notes' : 'Upload Paper'}
            </button>
          </div>

          <AnimatePresence>
            {isSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-4 p-8 rounded-[40px] bg-green-50 text-green-700 border-2 border-green-100 shadow-inner">
                <div className="bg-green-500 text-white p-1 rounded-full"><Plus size={18} className="rotate-45" /></div>
                <p className="font-black text-lg tracking-tight">Saved successfully to MongoDB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

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
  isPremium: false,
  chapters: 1,
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
    {children}
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

const ResourceCard = ({ item, type, onOpen, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.005 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-[0_24px_70px_-38px_rgba(10,74,68,0.35)] sm:p-5"
  >
    <div className="absolute inset-x-5 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-[#ff9f1c]/80 transition-transform duration-500 group-hover:scale-x-100" />
    <div className="mb-4 flex min-w-0 items-start gap-3">
      <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff9f1c]/10 text-[#ff9f1c] group-hover:bg-orange-50 group-hover:shadow-md">
        {type === 'notes' ? <BookOpen size={19} /> : <FileText size={19} />}
      </motion.div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-base font-black leading-tight text-[#0a4a44]">{item.title}</h3>
        <p className="mt-1 truncate text-xs font-bold text-gray-400">{item.subject?.name || 'Unassigned subject'}</p>
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

    <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 sm:gap-3">
      <button type="button" onClick={() => onOpen(item.fileUrl)} className="flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-[#0a4a44] px-2.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#ff9f1c] sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm">
        <Download size={15} /> Open
      </button>
      <button type="button" onClick={() => onEdit(item, type)} className="flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-2.5 py-2 text-xs font-black text-[#0a4a44] shadow-sm transition hover:bg-[#0a4a44] hover:text-white sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm">
        <Pencil size={14} /> Edit
      </button>
      <button type="button" onClick={() => onDelete(item._id, type)} className="flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-2.5 py-2 text-xs font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white sm:min-h-12 sm:gap-2 sm:px-3 sm:text-sm">
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </motion.div>
);

const AdminResourceManager = ({ type, mode }) => {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(emptyResource);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(mode === 'upload');

  const isNotes = type === 'notes';
  const isUploadMode = mode === 'upload';

  useEffect(() => {
    loadResources();
    loadDepartments();
    setShowForm(mode === 'upload');
    resetForm(mode === 'upload');
  }, [type, mode]);

  useEffect(() => {
    if (formData.department) loadCourses(formData.department);
  }, [formData.department]);

  useEffect(() => {
    if (formData.course) loadSemesters(formData.course);
  }, [formData.course]);

  useEffect(() => {
    if (formData.semester) loadSubjects(formData.semester);
  }, [formData.semester]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${type}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Unable to load ${type}`);
      setResources(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      setMessage(error.message);
      setResources([]);
    }
    setIsLoading(false);
  };

  const loadDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      setDepartments(await response.json());
    } catch (error) {
      console.error('Unable to load departments:', error);
    }
  };

  const loadCourses = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/courses?department=${departmentId}`);
      setCourses(await response.json());
    } catch (error) {
      console.error('Unable to load courses:', error);
    }
  };

  const loadSemesters = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/semesters?course=${courseId}`);
      setSemesters(await response.json());
    } catch (error) {
      console.error('Unable to load semesters:', error);
    }
  };

  const loadSubjects = async (semesterId) => {
    try {
      const response = await fetch(`${API_URL}/subjects?semester=${semesterId}`);
      setSubjects(await response.json());
    } catch (error) {
      console.error('Unable to load subjects:', error);
    }
  };

  const resetForm = (keepForm = mode === 'upload') => {
    setFormData(emptyResource);
    setEditingId(null);
    setShowForm(keepForm);
  };

  const handleOpen = (fileUrl) => {
    if (!fileUrl) {
      setMessage('File is missing or the URL is invalid.');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  const handleEdit = (item, editType = type) => {
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
      isPremium: Boolean(item.isPremium),
      chapters: item.chapters || 1,
    });
    setEditingId(item._id);
    setShowForm(true);
    setMessage(`Editing ${editType === 'notes' ? 'note' : 'paper'}. Leave the file empty to keep the current document.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('department', formData.department);
      payload.append('course', formData.course);
      payload.append('semester', formData.semester);
      payload.append('subject', formData.subject);
      payload.append('isPremium', formData.isPremium);
      if (formData.file) payload.append('file', formData.file);

      if (isNotes) {
        payload.append('category', formData.category);
        payload.append('chapters', formData.chapters || 1);
      } else {
        payload.append('year', Number(formData.year));
        payload.append('examType', formData.examType);
      }

      const response = await fetch(`${API_URL}/${type}${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save resource');

      setMessage(editingId ? 'Resource updated successfully.' : 'Resource uploaded successfully.');
      resetForm(mode === 'upload');
      await loadResources();
    } catch (error) {
      setMessage(error.message);
    }

    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/${pendingDelete.type}/${pendingDelete.id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete resource');
      setPendingDelete(null);
      setMessage('Resource deleted successfully.');
      await loadResources();
    } catch (error) {
      setMessage(error.message);
    }
    setIsDeleting(false);
  };

  const filteredResources = resources.filter((item) => {
    const query = searchQuery.toLowerCase();
    return item.title?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query) || item.subject?.name?.toLowerCase().includes(query);
  });

  const renderForm = () => (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
      <div className="mb-5 border-b border-gray-200 pb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9f1c]">Admin Resource Control</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0a4a44] sm:text-3xl">{editingId ? 'Edit' : 'Upload'} {isNotes ? 'Notes' : 'Question Paper'}</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-500">Use the same upload and edit workflow available in the teacher dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <section className="border-b border-gray-200 p-5 sm:p-6">
          <h3 className="text-base font-black text-[#0a4a44]">Resource Information</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Title"><input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100" /></Field>
            <Field label="Description"><textarea required rows="4" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100" /></Field>
          </div>
        </section>

        <section className="border-b border-gray-200 p-5 sm:p-6">
          <h3 className="text-base font-black text-[#0a4a44]">Academic Details</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Department"><select required value={formData.department} onChange={(event) => setFormData({ ...formData, department: event.target.value, course: '', semester: '', subject: '' })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option value="">Select Department</option>{departments.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field>
            <Field label="Course"><select required disabled={!formData.department} value={formData.course} onChange={(event) => setFormData({ ...formData, course: event.target.value, semester: '', subject: '' })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option value="">Select Course</option>{courses.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field>
            <Field label="Semester"><select required disabled={!formData.course} value={formData.semester} onChange={(event) => setFormData({ ...formData, semester: event.target.value, subject: '' })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option value="">Select Semester</option>{semesters.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field>
            <Field label="Subject"><select required disabled={!formData.semester} value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option value="">Select Subject</option>{subjects.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field>
            {isNotes ? (
              <><Field label="Category"><select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option>Digital PDF</option><option>Handwritten</option><option>Revision Sheets</option><option>Topper Special</option></select></Field><Field label="Chapters"><input type="number" min="1" value={formData.chapters} onChange={(event) => setFormData({ ...formData, chapters: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]" /></Field></>
            ) : (
              <><Field label="Year"><input required type="number" min="2000" max="2100" value={formData.year} onChange={(event) => setFormData({ ...formData, year: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]" /></Field><Field label="Exam Type"><select value={formData.examType} onChange={(event) => setFormData({ ...formData, examType: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44]"><option>Mid-term</option><option>Final</option><option>Quiz</option><option>Assignment</option></select></Field></>
            )}
          </div>
        </section>

        <section className="border-b border-gray-200 p-5 sm:p-6">
          <h3 className="text-base font-black text-[#0a4a44]">Document Upload</h3>
          <div className="mt-5 rounded-md border border-gray-300 bg-gray-50 p-4">
            <input required={!editingId && !formData.existingFileUrl} type="file" accept="application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*" onChange={(event) => setFormData({ ...formData, file: event.target.files[0] || null })} className="block w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] file:mr-4 file:rounded-md file:border-0 file:bg-[#0a4a44] file:px-4 file:py-2 file:text-sm file:font-black file:text-white" />
            <p className="mt-3 text-xs font-semibold text-gray-500">{formData.file ? `${formData.file.name} - ${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : editingId ? 'Leave empty to keep the current document.' : 'Upload a document, maximum 15MB.'}</p>
          </div>
        </section>

        {message && <div className="mx-5 mt-5 rounded-md border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44] sm:mx-6">{message}</div>}

        <div className="grid gap-3 p-5 sm:flex sm:justify-end sm:p-6">
          {(editingId || (!isUploadMode && showForm)) && <button type="button" onClick={() => resetForm(false)} className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-black text-[#0a4a44] transition hover:bg-gray-50">Cancel</button>}
          <button type="submit" disabled={isSaving} className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ff9f1c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#e68a00] disabled:bg-gray-300"><Upload size={18} /> {isSaving ? 'Submitting...' : editingId ? 'Update Resource' : `Submit ${isNotes ? 'Notes' : 'Paper'}`}</button>
        </div>
      </form>
    </motion.div>
  );

  if (isUploadMode || showForm || editingId) return renderForm();

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Admin Library</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">{isNotes ? 'Notes Library' : 'Paper Vault'}</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">Open, edit, delete, and maintain uploaded {type} with the same workflow as the teacher dashboard.</p>
          </div>
          <button type="button" onClick={() => resetForm(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-5 text-sm font-black text-white shadow-lg shadow-orange-950/20"><Plus size={18} /> New {isNotes ? 'Note' : 'Paper'}</button>
        </div>
      </div>

      <div className="mobile-carousel mobile-scroll-track md:grid-cols-3 md:gap-5">
        {[
          { label: isNotes ? 'Notes' : 'Papers', value: resources.length, caption: isNotes ? 'Total admin notes' : 'Total admin papers', icon: isNotes ? BookOpen : FileText },
          { label: 'Search Active', value: searchQuery ? 1 : 0, caption: 'Keyword search only', icon: Search },
          { label: 'File Actions', value: 'Open', caption: 'Open, edit, delete', icon: Download },
        ].map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`Search ${type}`} className="w-full rounded-2xl bg-gray-50 py-4 pl-12 pr-4 font-bold text-[#0a4a44] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ff9f1c]" />
        </div>
      </div>

      {message && <div className="rounded-2xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">{message}</div>}

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="mx-auto mb-4 animate-spin text-[#ff9f1c]" size={42} /><p className="font-bold text-gray-400">Loading resources...</p></div>
      ) : filteredResources.length ? (
        <motion.div layout className="mobile-carousel mobile-scroll-track sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredResources.map((item) => <ResourceCard key={item._id} item={item} type={type} onOpen={handleOpen} onEdit={handleEdit} onDelete={(id, resourceType) => setPendingDelete({ id, type: resourceType })} />)}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12"><AlertCircle className="mx-auto mb-4 text-gray-300" size={48} /><h3 className="text-2xl font-black text-[#0a4a44]">No resources found</h3><p className="mt-2 font-medium text-gray-400">Upload a new {isNotes ? 'note' : 'paper'} or try another search.</p></div>
      )}

      <DeleteConfirmModal open={Boolean(pendingDelete)} message="This resource will be permanently removed from the admin library." isDeleting={isDeleting} onCancel={() => !isDeleting && setPendingDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
};

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState('');
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const loadDepartments = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load departments');
      }

      setDepartments(data);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create department');
      }

      setFormData({ name: '', description: '' });
      setMessage('Department created successfully');
      await loadDepartments();
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsSaving(false);
  };

  const startEditing = (department) => {
    setEditingId(department._id);
    setEditData({
      name: department.name || '',
      description: department.description || '',
    });
    setMessage('');
    setErrorMessage('');
  };

  const cancelEditing = () => {
    setEditingId('');
    setEditData({ name: '', description: '' });
  };

  const handleUpdate = async (departmentId) => {
    setIsSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(editData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update department');
      }

      cancelEditing();
      setMessage('Department updated successfully');
      await loadDepartments();
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsSaving(false);
  };

  const handleDelete = (departmentId) => {
    setPendingDelete(departmentId);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/departments/${pendingDelete}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete department');
      }

      setPendingDelete(null);
      setMessage('Department deleted successfully');
      await loadDepartments();
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsSaving(false);
  };

  return (
    <motion.div key="departments" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <section className="rounded-[26px] border border-gray-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#22b8a9]">Academic Structure</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0a4a44] md:text-4xl">Department Management</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-gray-500">
              Create and maintain departments used by course, semester, subject, notes, and paper filters.
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0a4a44] text-white">
            <Building2 size={22} />
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.2fr_auto]">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Department name"
            className="rounded-2xl border-2 border-transparent bg-gray-50 px-4 py-4 text-sm font-bold text-[#0a4a44] outline-none transition-all placeholder:text-gray-400 focus:border-[#22c7b8] focus:bg-white"
          />
          <input
            type="text"
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Optional description"
            className="rounded-2xl border-2 border-transparent bg-gray-50 px-4 py-4 text-sm font-bold text-[#0a4a44] outline-none transition-all placeholder:text-gray-400 focus:border-[#22c7b8] focus:bg-white"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-5 py-4 text-sm font-black text-white transition hover:bg-[#e68a00] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Create
          </button>
        </form>

        {(message || errorMessage) && (
          <div className={`mt-4 rounded-2xl border p-4 text-sm font-bold ${errorMessage ? 'border-red-100 bg-red-50 text-red-700' : 'border-green-100 bg-green-50 text-green-700'}`}>
            {errorMessage || message}
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#ff9f1c]" size={42} />
          <p className="font-bold text-gray-400">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12">
          <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-[#0a4a44]">No departments found</h3>
          <p className="mt-2 font-medium text-gray-400">Create a department to start building the academic structure.</p>
        </div>
      ) : (
        <motion.div layout className="mobile-carousel mobile-scroll-track sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {departments.map((department) => {
            const isEditing = editingId === department._id;
            return (
              <motion.div key={department._id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.005 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-[0_24px_70px_-38px_rgba(10,74,68,0.35)]">
                <div className="absolute inset-x-5 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-[#ff9f1c]/80 transition-transform duration-500 group-hover:scale-x-100" />
                {isEditing ? (
                  <div className="space-y-3">
                    <Field label="Department Name">
                      <input value={editData.name} onChange={(event) => setEditData((prev) => ({ ...prev, name: event.target.value }))} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100" />
                    </Field>
                    <Field label="Description">
                      <input value={editData.description} onChange={(event) => setEditData((prev) => ({ ...prev, description: event.target.value }))} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f1c] focus:ring-2 focus:ring-orange-100" />
                    </Field>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button type="button" onClick={() => handleUpdate(department._id)} disabled={isSaving} className="min-h-11 rounded-2xl bg-[#0a4a44] text-xs font-black text-white transition hover:bg-[#ff9f1c] disabled:bg-gray-200">Save</button>
                      <button type="button" onClick={cancelEditing} className="min-h-11 rounded-2xl bg-gray-50 text-xs font-black text-[#0a4a44] transition hover:bg-gray-100">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center gap-3">
                      <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff9f1c]/10 text-[#ff9f1c] group-hover:bg-orange-50 group-hover:shadow-md">
                        <Building2 size={19} />
                      </motion.div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-[#0a4a44]">{department.name}</h3>
                        <p className="truncate text-xs font-bold text-gray-400">Department</p>
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-2 min-h-[38px] text-sm font-medium leading-relaxed text-gray-500">{department.description || 'No description added yet.'}</p>
                    <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                      <button type="button" onClick={() => startEditing(department)} className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-2.5 py-2 text-xs font-black text-[#0a4a44] shadow-sm transition hover:bg-[#0a4a44] hover:text-white"><Pencil size={14} /> Edit</button>
                      <button type="button" onClick={() => handleDelete(department._id)} disabled={isSaving} className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-2.5 py-2 text-xs font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white disabled:bg-gray-50 disabled:text-gray-300"><Trash2 size={14} /> Delete</button>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
      <DeleteConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete this department?"
        message="Linked courses must be removed first. This action cannot be undone."
        isDeleting={isSaving}
        onCancel={() => !isSaving && setPendingDelete(null)}
        onConfirm={confirmDelete}
      />    </motion.div>

  );
};

const AdminOverview = ({ users, isLoadingUsers, setActiveTab, homeData }) => {
  const totalUsers = users.length;
  const students = users.filter((user) => user.role === 'student').length;
  const teachers = users.filter((user) => user.role === 'teacher').length;
  const resourceStats = homeData?.stats || {};
  const overviewStats = [
    { label: 'Total Users', value: totalUsers, caption: 'Registered accounts', icon: Users },
    { label: 'Admin Notes', value: resourceStats.notes ?? 0, caption: 'Notes in admin library', icon: BookOpen },
    { label: 'Admin Papers', value: resourceStats.papers ?? 0, caption: 'Papers in admin library', icon: FileText },
  ];

  return (
    <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">EduAdmin Control</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">Admin Dashboard</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">
              Manage users, academic structure, notes, and papers with the same dashboard experience teachers use every day.
            </p>
          </div>
          <button type="button" onClick={() => setActiveTab('Upload Notes')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-5 text-sm font-black text-white shadow-lg shadow-orange-950/20">
            <Upload size={18} /> Upload Resource
          </button>
        </div>
      </div>

      <div className="mobile-carousel mobile-scroll-track md:grid-cols-3 md:gap-5">
        {overviewStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      <section className="grid gap-5">
        <div className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9f1c]">Account Mix</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-[#0a4a44]">Users by role</h3>
          <div className="mt-5 space-y-3">
            {[['Students', students], ['Teachers', teachers], ['Admins', users.filter((user) => user.role === 'admin').length]].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm font-black text-[#0a4a44]"><span>{label}</span><span>{isLoadingUsers ? '-' : value}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
const AdminUsersPanel = ({ users, isLoading, errorMessage, onReload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter]);

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();
    const roleMatches = roleFilter === 'all' || user.role === roleFilter;
    const searchMatches = user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query) || user.role?.toLowerCase().includes(query);
    return roleMatches && searchMatches;
  });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / 8));
  const pagedUsers = filteredUsers.slice((page - 1) * 8, page * 8);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/users/${pendingDelete._id || pendingDelete.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete user');
      setPendingDelete(null);
      setMessage('User deleted successfully.');
      await onReload();
    } catch (error) {
      setMessage(error.message);
    }
    setIsSaving(false);
  };

  return (
    <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="rounded-[28px] bg-[#0a4a44] p-5 text-white sm:p-8 md:rounded-[40px] md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">Admin Users</p>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl md:tracking-tighter">User Directory</h2>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-teal-100/60">Search users, filter by role, review account info, and delete accounts with the same dashboard card system.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <div className="rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search users" className="w-full rounded-2xl bg-gray-50 py-4 pl-12 pr-4 font-bold text-[#0a4a44] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ff9f1c]" /></div></div>
        <Field label="Role Filter"><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="w-full rounded-2xl border border-gray-100 bg-white p-4 font-bold text-[#0a4a44] shadow-sm"><option value="all">All roles</option><option value="student">Students</option><option value="teacher">Teachers</option><option value="admin">Admins</option></select></Field>
      </div>

      {(message || errorMessage) ? <div className="rounded-2xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 p-4 text-sm font-bold text-[#0a4a44]">{message || errorMessage}</div> : null}

      {isLoading ? (
        <div className="py-20 text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#ff9f1c]/20 border-t-[#ff9f1c]" /><p className="font-bold text-gray-400">Loading users...</p></div>
      ) : pagedUsers.length ? (
        <motion.div layout className="mobile-carousel mobile-scroll-track sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {pagedUsers.map((item) => (
            <motion.div key={item._id || item.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.005 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-[0_24px_70px_-38px_rgba(10,74,68,0.35)]">
              <div className="absolute inset-x-5 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-[#ff9f1c]/80 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="mb-4 flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0a4a44] text-sm font-black text-white">{(item.name || item.email || 'U').charAt(0).toUpperCase()}</div><div className="min-w-0"><h3 className="truncate text-base font-black text-[#0a4a44]">{item.name || 'Unnamed User'}</h3><p className="truncate text-xs font-bold text-gray-400">{item.email}</p></div></div>
              <Field label="Role"><div className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm font-black capitalize text-[#0a4a44]">{item.role || 'student'}</div></Field>
              <div className="mt-auto rounded-2xl bg-gray-50/90 p-3 text-sm font-bold text-gray-400"><p>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Joined date unavailable'}</p></div>
              <div className="mt-3 border-t border-gray-100 pt-3"><button type="button" onClick={() => setPendingDelete(item)} className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-2.5 py-2 text-xs font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"><Trash2 size={14} /> Delete</button></div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-6 text-center sm:p-12"><AlertCircle className="mx-auto mb-4 text-gray-300" size={48} /><h3 className="text-2xl font-black text-[#0a4a44]">No users found</h3><p className="mt-2 font-medium text-gray-400">Try changing the search keyword or role filter.</p></div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:flex-row"><button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="min-h-11 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-black text-[#0a4a44] disabled:opacity-40">Prev</button><p className="text-sm font-black text-gray-400">Page {page} of {totalPages}</p><button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="min-h-11 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-black text-[#0a4a44] disabled:opacity-40">Next</button></div>

      <DeleteConfirmModal open={Boolean(pendingDelete)} title="Delete this user?" message="This account will be permanently removed from the platform." isDeleting={isSaving} onCancel={() => !isSaving && setPendingDelete(null)} onConfirm={confirmDelete} />
    </motion.div>
  );
};
// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setSidebarOpen] = useState(getIsDesktop);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersErrorMessage, setUsersErrorMessage] = useState('');
  const mainContentRef = useRef(null);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      mainContentRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [activeTab]);

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


  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setUsersErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const rawResponse = await response.text();
      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error('Users API is not available yet. Restart the backend server so /api/users is loaded.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load users');
      }

      setUsers(data);
    } catch (error) {
      setUsersErrorMessage(error.message);
    }

    setIsLoadingUsers(false);
  };
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${API_URL}/home?uploaderRole=admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) setHomeData(data);
      } catch (error) {
        console.error('Unable to load shared resource summary:', error);
      }
    };


    fetchUsers();
    fetchHomeData();
    const interval = window.setInterval(fetchHomeData, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Notes', icon: <BookOpen size={22} /> },
    { name: 'Papers', icon: <FileText size={22} /> },
    { name: 'Upload Notes', icon: <Upload size={22} /> },
    { name: 'Upload Papers', icon: <Upload size={22} /> },
    { name: 'Departments', icon: <Building2 size={22} /> },
    { name: 'Add Courses', icon: <BookOpen size={22} /> },
    { name: 'Add Semester', icon: <Calendar size={22} /> },
    { name: 'Add Subject', icon: <LayoutGrid size={22} /> },
    { name: 'Users', icon: <Users size={22} /> },
    { name: 'Notification Handler', icon: <Megaphone size={22} /> },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fcfdfe] font-sans selection:bg-[#ff9f1c]/30">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close admin sidebar overlay"
          />
        )}
      </AnimatePresence>
      
      {/* SIDEBAR */}
      <motion.aside
        animate={{
          x: isSidebarOpen || isDesktop ? 0 : '-100%',
          width: isSidebarOpen || !isDesktop ? 280 : 96,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="fixed left-0 top-0 z-50 flex h-dvh max-w-[calc(100vw-16px)] flex-col overflow-hidden bg-[#0a4a44] text-white shadow-2xl lg:h-screen lg:translate-x-0"
      >
        <div className="flex shrink-0 items-center gap-4 p-5 sm:p-7">
          <div className="rounded-2xl bg-[#ff9f1c] p-2.5 shadow-xl shadow-orange-950/20"><GraduationCap size={24} /></div>
          {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-tighter">EduAdmin<span className="text-[#ff9f1c]">.</span></motion.span>}
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                if (!isDesktop) setSidebarOpen(false);
              }}
              className={`group relative flex w-full items-center gap-4 rounded-[22px] px-4 py-3.5 transition-all duration-300 sm:px-5 ${activeTab === item.name ? "bg-[#ff9f1c] text-white shadow-[0_20px_40px_-10px_rgba(255,159,28,0.35)]" : "text-teal-100/50 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              {activeTab === item.name && <motion.div layoutId="adminActivePill" className="absolute -left-1 h-8 w-2 rounded-full bg-white" />}
            </button>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/5 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#ff9f1c] bg-white text-[#0a4a44] font-black">
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{user?.name || 'Admin'}</p>
                <p className="truncate text-[10px] font-bold uppercase tracking-widest text-teal-100/40">Admin Access</p>
              </div>
            )}
          </div>
        </div></motion.aside>

      {/* MAIN CONTENT */}
      <main ref={mainContentRef} className={`${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[96px]'} min-w-0 overflow-x-hidden transition-[margin] duration-300`}>
        <header className="eduhub-dashboard-header sticky top-0 z-30 flex h-20 items-center justify-between gap-2 border-b border-gray-100 bg-white/80 px-3 backdrop-blur-2xl sm:px-4 md:px-8 lg:h-24 lg:px-10">
          <div className="eduhub-dashboard-header-left flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="eduhub-dashboard-menu-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-[#0a4a44] shadow-sm transition hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tighter text-[#0a4a44] sm:text-xl md:text-2xl">
                {activeTab}
              </h1>
            </div>
          </div>

          <div className="eduhub-dashboard-header-actions flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <NotificationBell />
            <BackButton />
            <div className="hidden items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-2 pr-5 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a4a44] text-sm font-black text-white">
                {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black leading-none text-[#0a4a44]">{user?.name || 'Admin'}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{user?.email || 'admin@eduhub'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="min-w-0 p-3 sm:p-6 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            
            {activeTab === 'Dashboard' ? (
              <AdminOverview users={users} isLoadingUsers={isLoadingUsers} setActiveTab={setActiveTab} homeData={homeData} />
            ) : activeTab === 'Notes' ? (
              <AdminResourceManager key="admin-notes" type="notes" mode="library" />
            ) : activeTab === 'Papers' ? (
              <AdminResourceManager key="admin-papers" type="papers" mode="library" />
            ) : activeTab === 'Upload Notes' ? (
              <AdminResourceManager key="admin-upload-notes" type="notes" mode="upload" />
            ) : activeTab === 'Upload Papers' ? (
              <AdminResourceManager key="admin-upload-papers" type="papers" mode="upload" />
            ) : activeTab === 'Departments' ? (
              <DepartmentManagement />
            ) : activeTab === 'Users' ? (
              <AdminUsersPanel users={users} isLoading={isLoadingUsers} errorMessage={usersErrorMessage} onReload={fetchUsers} />
            ) : activeTab === 'Notification Handler' ? (
              <NotificationHandlerPanel />
            ) : (
              <AdminActionForm activeTab={activeTab} key={activeTab} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;





