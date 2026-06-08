import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAcademicOptions from '../hooks/useAcademicOptions';
import {
  Search, BookOpen, Download, Star,
  Calendar, Eye, ShieldCheck, ArrowRight,
  Loader2, AlertCircle
} from 'lucide-react';

const API_URL = '/api';
const ASSET_URL = '';

const categories = ['All', 'Handwritten', 'Digital PDF', 'Revision Sheets', 'Topper Special'];
const noteImages = [
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
];

const formatDate = (date) => {
  if (!date) return 'Recently';
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(date));
};

const formatViews = (value) => {
  const count = Number(value) || 0;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};

const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;
  if (fileUrl.startsWith('/uploads')) return `${ASSET_URL}${fileUrl}`;
  return `${ASSET_URL}/uploads/${fileUrl}`;
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const gridReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const NotesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [submittedSearch, setSubmittedSearch] = useState(searchParams.get('search') || '');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [academicFilters, setAcademicFilters] = useState({
    department: searchParams.get('department') || '',
    course: searchParams.get('course') || '',
    semester: searchParams.get('semester') || '',
    subject: searchParams.get('subject') || '',
  });
  const academicOptions = useAcademicOptions(academicFilters);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'All') params.set('category', activeCategory);
        if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
        Object.entries(academicFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const response = await fetch(`${API_URL}/notes?${params.toString()}`);
        if (!response.ok) throw new Error('Unable to load notes from backend');

        const data = await response.json();
        if (isMounted) {
          setNotes(Array.isArray(data) ? data : []);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) setErrorMessage(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, submittedSearch, academicFilters]);

  const totalViews = useMemo(
    () => notes.reduce((sum, note) => sum + (Number(note.views) || 0), 0),
    [notes]
  );

  const handleSearch = (event) => {
    event?.preventDefault();
    setSubmittedSearch(searchQuery);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    Object.entries(academicFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
    Object.entries(academicFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const updateAcademicFilters = (next) => {
    setAcademicFilters(next);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSubmittedSearch('');
    setActiveCategory('All');
    setAcademicFilters({ department: '', course: '', semester: '', subject: '' });
    setSearchParams({});
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="relative pt-40 pb-32 px-6 overflow-hidden rounded-b-[80px]">
        <div
          className="absolute inset-0 z-0 bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a4a44]/90 via-[#0a4a44]/70 to-white z-0" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#ff9f00] px-5 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest mb-8 shadow-xl"
          >
            <ShieldCheck size={16} /> <span>Live notes from backend</span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-10 leading-none">
            Study Smart. <br />
            <span className="text-[#ff9f00]">Not Hard.</span>
          </h1>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group flex flex-col gap-3 sm:block">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl -m-2 opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              placeholder="Ex: Data Structures or Economics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full bg-white rounded-3xl py-5 pl-14 pr-5 shadow-2xl focus:outline-none text-[#0a4a44] font-bold text-base placeholder:text-gray-300 sm:py-6 sm:pr-44 sm:text-xl"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff9f00] transition-colors" size={28} />
            <button type="submit" className="relative w-full bg-[#0a4a44] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-[#083a35] transition-all sm:absolute sm:right-4 sm:top-1/2 sm:w-auto sm:-translate-y-1/2">
              Find Notes
            </button>
          </form>
        </div>
      </section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10 bg-white/90 backdrop-blur border border-gray-100 rounded-[32px] p-4 md:p-5 shadow-[0_20px_60px_-35px_rgba(10,74,68,0.35)] sticky top-24 z-20">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  activeCategory === category
                    ? 'bg-[#ff9f00] text-white shadow-lg shadow-orange-100 scale-[1.02]'
                    : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-[#0a4a44]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm font-bold bg-gray-50 rounded-2xl px-4 py-3">
            {isLoading ? (
              <span className="text-gray-400 inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading</span>
            ) : errorMessage ? (
              <span className="text-red-500 inline-flex items-center gap-2"><AlertCircle size={16} /> Backend unavailable</span>
            ) : (
              <span className="text-gray-400">Showing <span className="text-[#0a4a44]">{notes.length}</span> notes, {formatViews(totalViews)} views</span>
            )}
          </div>
        </div>

        <div className="mb-8 grid gap-3 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-5">
          <select
            value={academicFilters.department}
            onChange={(e) => updateAcademicFilters({ department: e.target.value, course: '', semester: '', subject: '' })}
            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00]"
          >
            <option value="">All Departments</option>
            {academicOptions.departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
          </select>
          <select
            value={academicFilters.course}
            disabled={!academicFilters.department}
            onChange={(e) => updateAcademicFilters({ ...academicFilters, course: e.target.value, semester: '', subject: '' })}
            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00] disabled:opacity-50"
          >
            <option value="">All Courses</option>
            {academicOptions.courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
          </select>
          <select
            value={academicFilters.semester}
            disabled={!academicFilters.course}
            onChange={(e) => updateAcademicFilters({ ...academicFilters, semester: e.target.value, subject: '' })}
            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00] disabled:opacity-50"
          >
            <option value="">All Semesters</option>
            {academicOptions.semesters.map((semester) => <option key={semester._id} value={semester._id}>{semester.name}</option>)}
          </select>
          <select
            value={academicFilters.subject}
            disabled={!academicFilters.semester}
            onChange={(e) => updateAcademicFilters({ ...academicFilters, subject: e.target.value })}
            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00] disabled:opacity-50"
          >
            <option value="">All Subjects</option>
            {academicOptions.subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
          </select>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f00] px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-100 transition-all hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9f00] focus:ring-offset-2"
          >
            <Search size={18} /> Search
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-3xl p-6 mb-8 font-bold">
            {errorMessage}. Make sure the backend is running on port 5000.
          </div>
        )}

        {isLoading ? (
          <div className="py-24 flex justify-center text-gray-400 font-bold">
            <Loader2 className="animate-spin mr-3" /> Loading notes from backend
          </div>
        ) : notes.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#0a4a44] mb-2">No Notes Found</h3>
            <p className="text-gray-400 mb-8">
              Try another search or category.
            </p>
            <button onClick={resetFilters} className="text-[#ff9f00] font-black hover:underline">
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {notes.map((note, i) => {
                const fileUrl = getFileUrl(note.fileUrl);
                return (
                  <motion.div
                    layout
                    variants={cardReveal}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    key={note._id}
                    className="group bg-white rounded-[36px] border border-gray-100 p-3 transition-all hover:shadow-[0_44px_100px_-30px_rgba(10,74,68,0.42)] hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-x-10 bottom-0 h-1 bg-[#ff9f00]/70 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                    <div className="relative h-48 w-full rounded-[28px] overflow-hidden mb-4">
                      <img src={noteImages[i % noteImages.length]} alt={note.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a4a44]/60 via-[#0a4a44]/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                      {fileUrl && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="bg-white text-[#0a4a44] px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl whitespace-nowrap">
                            <Eye size={16} /> Quick Preview
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="px-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                          <Calendar size={14} /> {formatDate(note.createdAt)}
                        </div>
                        <div className="flex items-center gap-1 text-[#ff9f00] font-black bg-orange-50 px-2.5 py-1 rounded-full">
                          <Star size={16} fill="currentColor" /> {note.rating || 0}
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-[#0a4a44] leading-tight mb-1.5 group-hover:text-[#ff9f00] transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xs font-bold text-gray-400 mb-4">
                        {note.subject?.name || 'General Subject'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-lg font-black text-[#0a4a44]">{formatViews(note.views)}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Views</p>
                          </div>
                        </div>
                        {fileUrl ? (
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="bg-[#ff9f00] text-white p-4 rounded-3xl shadow-lg shadow-orange-100 hover:scale-110 transition-transform" title="Open PDF">
                            <Download size={24} />
                          </a>
                        ) : (
                          <button disabled className="bg-gray-200 text-gray-400 p-4 rounded-3xl cursor-not-allowed" title="No file uploaded">
                            <Download size={24} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <div className="bg-[#0a4a44] rounded-[60px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">Contribute Your Notes & <br /> <span className="text-[#ff9f00]">Earn Rewards.</span></h3>
            <p className="text-teal-100/60 font-medium text-lg leading-relaxed mb-8">Help your fellow students ace their exams. Login and upload from your dashboard.</p>
            <Link to="/auth" className="bg-white text-[#0a4a44] px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-[#ff9f00] hover:text-white transition-all shadow-xl">
              Upload Now <ArrowRight size={20} />
            </Link>
          </div>
          <div className="relative z-10 hidden lg:block w-80">
            <div className="bg-white/10 p-10 rounded-[50px] rotate-6 border border-white/10 backdrop-blur-sm">
              <BookOpen size={100} className="text-[#ff9f00] mx-auto" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </motion.section>
    </div>
  );
};

export default NotesPage;
