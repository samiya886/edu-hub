import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, ArrowRight, ArrowLeft, LogOut,
  LayoutDashboard, UserCircle, BookOpen, FileText, PenTool,
  LayoutGrid, Calendar, Users, Bell,
  TrendingUp, PlusCircle, Clock, CheckCircle,
  Upload, Loader2, AlertCircle, Plus, ChevronRight, ChevronDown,
  Layers, Hash, Activity,
  Briefcase, Code, BarChart3, File, Star, Eye,
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
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 text-sm font-black text-[#0a4a44] shadow-sm transition hover:border-[#ff9f1c]/40 hover:bg-orange-50 hover:text-[#ff9f1c] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c]/40 focus:ring-offset-2 sm:px-4"
      aria-label="Go back"
    >
      <span>Back</span>
    </button>
  );
};

const API_URL = '/api';
const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

// --- SUB-COMPONENT: ENHANCED ACTION FORM ---
const AdminActionForm = ({ activeTab }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    category: '',
    chapters: 1,
    isPremium: false,
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
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
      category: '',
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="bg-white rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden relative sm:rounded-[50px]">
        <div className="bg-[#0a4a44] p-5 text-white relative overflow-hidden sm:p-8 lg:p-12">
        <BackButton />
          <div className="relative z-10">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#ff9f1c] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block shadow-lg shadow-orange-950/20">
              System Entry Mode
            </motion.span>
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3 sm:text-4xl sm:gap-4">
              {activeTab === 'Add Notes' ? <PenTool className="text-[#ff9f1c]" /> : activeTab === 'Add Papers' ? <FileText className="text-[#ff9f1c]" /> : <BookOpen className="text-[#ff9f1c]" />}
              {activeTab}
            </h2>
            <p className="text-teal-100/60 font-medium text-lg">Manage semester, course, and subject relationships with MongoDB.</p>
          </div>
          <Layers className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 sm:p-8 sm:space-y-8 lg:p-12 lg:space-y-10">
          <div className="grid gap-5 md:grid-cols-2 lg:gap-10">
            {renderInputField(
              <><GraduationCap size={14} /> Department</>,
              <div className="relative">
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
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
                  className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
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
                  className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
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

            {activeTab === 'Add Subject' && renderInputField(
              <><Hash size={14} /> Subject Name</>,
              <input
                type="text"
                required
                placeholder="Example: Data Structures"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              4
            )}

            {activeTab === 'Add Courses' && renderInputField(
              <><BookOpen size={14} /> Course Name</>,
              <input
                type="text"
                required
                placeholder="Example: B.Tech"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
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
                className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
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
                  className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
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
                className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
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
                className="w-full min-h-[150px] p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm resize-none"
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
                className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
              />,
              7
            )}

            {activeTab === 'Add Papers' && renderInputField(
              <><Layers size={14} /> Exam Type</>,
              <select
                required
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
              >
                <option value="" disabled>Select Exam Type</option>
                <option value="Mid-term">Mid-term</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
              </select>,
              8
            )}

            {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && renderInputField(
              <><Star size={14} /> Category</>,
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
              >
                <option value="" disabled>Select Category</option>
                <option value="Handwritten">Handwritten</option>
                <option value="Digital PDF">Digital PDF</option>
                <option value="Revision Sheets">Revision Sheets</option>
                <option value="Topper Special">Topper Special</option>
              </select>,
              9
            )}
          </div>

          {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && (
            <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Chapters</label>
                <input
                  type="number"
                  min="1"
                  value={formData.chapters}
                  onChange={(e) => setFormData({ ...formData, chapters: Number(e.target.value) })}
                  className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Premium</label>
                <select
                  value={formData.isPremium ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.value === 'true' })}
                  className="w-full p-5 bg-gray-50 rounded-3xl outline-none font-bold text-[#0a4a44] appearance-none cursor-pointer border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white transition-all shadow-sm"
                >
                  <option value="false">Standard</option>
                  <option value="true">Premium</option>
                </select>
              </div>
              {activeTab === 'Add Notes' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Publish Year</label>
                  <input
                    type="number"
                    min="2000"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#ff9f1c] focus:bg-white outline-none font-bold text-[#0a4a44] transition-all shadow-sm"
                  />
                </div>
              )}
            </motion.div>
          )}

          {(activeTab === 'Add Notes' || activeTab === 'Add Papers') && (
            <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible" className="relative border-4 border-dashed border-gray-100 rounded-[26px] p-5 text-center group hover:border-[#ff9f1c] bg-gray-50/20 transition-all cursor-pointer sm:rounded-[50px] sm:p-10 lg:p-16">
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
              className={`w-full min-h-14 px-4 py-4 rounded-2xl font-black text-base shadow-[0_30px_60px_-15px_rgba(255,159,28,0.3)] transition-all flex items-center justify-center gap-3 sm:rounded-[35px] sm:py-7 sm:text-2xl sm:gap-4 ${isProcessing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#ff9f1c] text-white hover:bg-[#e68a00] hover:-translate-y-2 active:scale-95'}`}
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle size={28} />}
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

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState('');
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleDelete = async (departmentId) => {
    const confirmed = window.confirm('Delete this department? Linked courses must be removed first.');
    if (!confirmed) return;

    setIsSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete department');
      }

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

      <section className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]">
        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="mx-auto mb-4 animate-spin text-[#ff9f1c]" size={42} />
            <p className="font-bold text-gray-400">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="font-bold text-gray-400">No departments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mobile-table-wrap">
            <table className="responsive-table department-table w-full min-w-[760px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.22em] text-gray-400">
                <tr>
                  <th className="px-5 py-4 font-black">Department</th>
                  <th className="px-5 py-4 font-black">Description</th>
                  <th className="px-5 py-4 font-black">Created</th>
                  <th className="px-5 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departments.map((department) => {
                  const isEditing = editingId === department._id;

                  return (
                    <tr key={department._id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            required
                            value={editData.name}
                            onChange={(event) => setEditData((prev) => ({ ...prev, name: event.target.value }))}
                            className="w-full rounded-xl bg-gray-50 px-3 py-3 text-sm font-black text-[#0a4a44] outline-none ring-2 ring-transparent focus:ring-[#22c7b8]"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0a4a44] text-white">
                              <Building2 size={17} />
                            </div>
                            <p className="text-sm font-black text-[#0a4a44]">{department.name}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.description}
                            onChange={(event) => setEditData((prev) => ({ ...prev, description: event.target.value }))}
                            className="w-full rounded-xl bg-gray-50 px-3 py-3 text-sm font-bold text-[#0a4a44] outline-none ring-2 ring-transparent focus:ring-[#22c7b8]"
                          />
                        ) : (
                          <p className="text-sm font-bold text-gray-500">{department.description || 'No description'}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-500">
                        {department.createdAt ? new Date(department.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button type="button" onClick={() => handleUpdate(department._id)} disabled={isSaving} className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-100 disabled:text-gray-300" aria-label="Save department">
                                <Save size={17} />
                              </button>
                              <button type="button" onClick={cancelEditing} className="grid h-10 w-10 place-items-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-gray-100" aria-label="Cancel edit">
                                <X size={17} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => startEditing(department)} className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100" aria-label="Edit department">
                                <Pencil size={17} />
                              </button>
                              <button type="button" onClick={() => handleDelete(department._id)} disabled={isSaving} className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:text-gray-300" aria-label="Delete department">
                                <Trash2 size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </motion.div>
  );
};

const AdminOverview = ({ users, isLoadingUsers, setActiveTab, homeData }) => {
  const totalUsers = users.length;
  const students = users.filter((user) => user.role === 'student').length;
  const teachers = users.filter((user) => user.role === 'teacher').length;
  const admins = users.filter((user) => user.role === 'admin').length;
  const pendingRequests = 0;
  const safeTotal = Math.max(totalUsers, 1);
  const resourceStats = homeData?.stats || {};
  const latestResources = homeData?.latestResources || [];

  const overviewCards = [
    { label: 'Total Users', value: totalUsers, icon: <Users size={22} />, accent: 'bg-[#0a4a44] text-white' },
    { label: 'Students', value: students, icon: <GraduationCap size={22} />, accent: 'bg-blue-50 text-blue-600' },
    { label: 'Admin Notes', value: resourceStats.notes ?? 0, icon: <BookOpen size={22} />, accent: 'bg-green-50 text-green-600' },
    { label: 'Admin Papers', value: resourceStats.papers ?? 0, icon: <FileText size={22} />, accent: 'bg-orange-50 text-[#ff9f1c]' },
  ];

  const mixCards = [
    { label: 'Students', value: students, percent: Math.max((students / safeTotal) * 100, students ? 12 : 3), color: 'bg-blue-500' },
    { label: 'Teachers', value: teachers, percent: Math.max((teachers / safeTotal) * 100, teachers ? 12 : 3), color: 'bg-green-500' },
    { label: 'Admins', value: admins, percent: Math.max((admins / safeTotal) * 100, admins ? 12 : 3), color: 'bg-[#ff9f1c]' },
  ];

  return (
    <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <section className="rounded-[26px] border border-gray-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#22b8a9]">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0a4a44] md:text-4xl">EduHub Control Center</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-gray-500">
              Review users, teachers, students, academic content, and pending admin work from one compact view.
            </p>
          </div>
          <button onClick={() => setActiveTab('Users')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0a4a44] px-5 py-3 text-sm font-black text-white transition hover:bg-[#083b36]">
            <Users size={18} />
            View Users
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <div key={card.label} className="rounded-[20px] border border-gray-100 bg-gray-50 p-4">
              <div className={`mb-4 grid h-10 w-10 place-items-center rounded-2xl ${card.accent}`}>
                {card.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{card.label}</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-[#0a4a44]">{isLoadingUsers ? '-' : card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[26px] border border-gray-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#22b8a9]">Account Mix</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-[#0b1220]">Students, teachers, and admins</h2>
            </div>
            <TrendingUp className="text-[#22b8a9]" size={22} />
          </div>

          <div className="mt-5 space-y-4">
            {mixCards.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-black text-[#0b1220]">
                  <span>{item.label}</span>
                  <span>{isLoadingUsers ? '-' : item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-gray-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff9f1c]">Admin Review</p>
          <h3 className="mt-2 text-xl font-black leading-tight text-[#0a4a44]">EduHub activity summary</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Admin Material', `${resourceStats.resources ?? 0} admin notes and papers visible in the admin dashboard.`],
              ['Teacher Accounts', `${teachers} teacher profile${teachers === 1 ? '' : 's'} available.`],
              ['Student Access', `${students} student account${students === 1 ? '' : 's'} connected to EduHub.`],
              ['Pending Requests', `${pendingRequests} request${pendingRequests === 1 ? '' : 's'} waiting for review.`],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[18px] border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-[#22b8a9]" />
                  <p className="text-sm font-black text-[#0b1220]">{title}</p>
                </div>
                <p className="mt-1 text-xs font-semibold leading-5 text-gray-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-gray-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#22b8a9]">Admin Library</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-[#0b1220]">Latest admin uploads</h2>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-600">Auto refresh</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {latestResources.length ? latestResources.map((resource) => (
            <div key={`${resource.type}-${resource.id}`} className="rounded-[18px] border border-gray-100 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{resource.type}</p>
              <p className="mt-2 line-clamp-2 text-sm font-black text-[#0a4a44]">{resource.title}</p>
              <p className="mt-1 truncate text-xs font-bold text-gray-400">{resource.subject}</p>
            </div>
          )) : (
            <p className="text-sm font-bold text-gray-400">No admin resources uploaded yet.</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};

const AdminUsersPanel = ({ users, isLoading, errorMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query);

    return matchesSearch;
  });

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-0"
    >
      <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]">
        <div className="border-b border-gray-100 p-4 md:p-5">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-2xl border-2 border-transparent bg-gray-50 py-4 pl-12 pr-4 text-sm font-bold text-[#0a4a44] outline-none transition-all placeholder:text-gray-400 focus:border-[#22c7b8] focus:bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="mx-auto mb-4 animate-spin text-[#ff9f1c]" size={42} />
            <p className="font-bold text-gray-400">Loading users...</p>
          </div>
        ) : errorMessage ? (
          <div className="p-12 text-center text-red-600 font-bold">{errorMessage}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="font-bold text-gray-400">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mobile-table-wrap">
              <table className="responsive-table w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.22em] text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-black">User</th>
                    <th className="px-5 py-4 font-black">Email</th>
                    <th className="px-5 py-4 font-black">Role</th>
                    <th className="px-5 py-4 font-black">Joined</th>
                    <th className="px-5 py-4 font-black text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#22c7b8] bg-[#0a4a44] text-sm font-black text-white">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#0a4a44]">{user.name || 'Unnamed User'}</p>
                            <p className="text-[11px] font-bold text-gray-400">Account profile</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-500">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest ${
                          user.role === 'admin'
                            ? 'bg-orange-50 text-[#ff9f1c]'
                            : user.role === 'teacher'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl bg-[#07131f] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#0a4a44]"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const navigate = useNavigate();
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

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUsersErrorMessage('');

      try {
        const response = await fetch('/api/users', {
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

    fetchUsers();
    fetchHomeData();
    const interval = window.setInterval(fetchHomeData, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Departments', icon: <Building2 size={22} /> },
    { name: 'Add Courses', icon: <BookOpen size={22} /> },
    { name: 'Add Papers', icon: <FileText size={22} /> },
    { name: 'Add Notes', icon: <PenTool size={22} /> },
    { name: 'Add Subject', icon: <LayoutGrid size={22} /> },
    { name: 'Add Semester', icon: <Calendar size={22} /> },
    { name: 'Users', icon: <Users size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-[#ff9f1c]/30">
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
          width: isSidebarOpen ? 280 : 100,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="fixed left-0 top-0 z-50 flex h-screen max-w-[calc(100vw-24px)] flex-col overflow-hidden bg-[#0a4a44] text-white shadow-2xl lg:translate-x-0"
      >
        <div className="flex shrink-0 items-center gap-4 p-6 sm:p-8">
          <div className="bg-[#ff9f1c] p-2.5 rounded-2xl shadow-xl shadow-orange-950/20"><PlusCircle className="text-white" size={24} /></div>
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
              className={`w-full flex items-center gap-5 px-5 py-3.5 rounded-[22px] transition-all duration-300 relative group ${activeTab === item.name ? "bg-[#ff9f1c] text-white shadow-[0_20px_40px_-10px_rgba(255,159,28,0.3)]" : "text-teal-100/40 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
              {activeTab === item.name && <motion.div layoutId="activePill" className="absolute left-[-4px] w-2 h-8 bg-white rounded-full" />}
            </button>
          ))}
        </nav>

       
      </motion.aside>

      {/* MAIN CONTENT */}
      <main ref={mainContentRef} className={`${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[100px]'} min-w-0 overflow-x-hidden transition-[margin] duration-300`}>
        <header className="bg-white/70 backdrop-blur-2xl border-b border-gray-100 h-20 px-4 flex items-center justify-between sticky top-0 z-30 sm:px-6 lg:h-24 lg:px-10">
           <div className="flex min-w-0 items-center gap-4 lg:gap-6">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-3 bg-gray-50 rounded-2xl text-[#0a4a44] hover:bg-gray-100 transition-all border border-gray-100 shadow-sm">{isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}</button><button onClick={() => navigate(-1)} aria-label="Back" className="p-2 bg-gray-50 rounded-2xl text-[#0a4a44] hover:bg-gray-100 transition"><ArrowLeft size={20} /></button>
              <h2 className="truncate font-black text-[#0a4a44] text-lg tracking-tighter sm:text-xl lg:text-2xl">{activeTab} Hub</h2>
           </div>
           <div className="flex items-center gap-2 sm:gap-5">
              <div className="hidden bg-gray-50 p-3 rounded-2xl text-gray-400 hover:text-[#ff9f1c] cursor-pointer transition-all sm:block"><Bell size={22}/></div>
              <div className="hidden h-10 w-[1.5px] bg-gray-100 mx-2 sm:block" />
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-3xl border border-gray-100 sm:gap-4 sm:pr-6">
                 <div className="w-10 h-10 rounded-2xl bg-[#0a4a44] border-2 border-[#ff9f1c] overflow-hidden shadow-lg"><img src="https://i.pravatar.cc/100?img=12" alt="admin" /></div>
                 <div className="text-left hidden sm:block">
                    <p className="text-[13px] font-black text-[#0a4a44] leading-none mb-1">Chief Manager</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #SYS_882</p>
                 </div>
              </div>
           </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-12">
          <AnimatePresence mode="wait">
            
            {activeTab === 'Dashboard' ? (
              <AdminOverview users={users} isLoadingUsers={isLoadingUsers} setActiveTab={setActiveTab} homeData={homeData} />
            ) : activeTab === 'Departments' ? (
              <DepartmentManagement />
            ) : activeTab === 'Users' ? (
              <AdminUsersPanel users={users} isLoading={isLoadingUsers} errorMessage={usersErrorMessage} />
            ) : (
              /* THE DYNAMIC ACTION FORM (Used for Notes, Papers, Subjects, etc.) */
              <AdminActionForm activeTab={activeTab} key={activeTab} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
