import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import useAcademicOptions from '../hooks/useAcademicOptions';
import {
  Search, FileText, Download, Filter,
  ChevronRight, Calendar, BookOpen,
  Star, Share2, AlertCircle, Zap, Loader2
} from 'lucide-react';

const API_URL = '/api';
const ASSET_URL = '';

const examTypes = ['All', 'Final', 'Mid-term', 'Quiz', 'Assignment'];

const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;
  if (fileUrl.startsWith('/uploads')) return `${ASSET_URL}${fileUrl}`;
  return `${ASSET_URL}/uploads/${fileUrl}`;
};

const formatDate = (date) => {
  if (!date) return 'Recently';
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(date));
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const gridReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const PapersPage = () => {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [submittedSearch, setSubmittedSearch] = useState(searchParams.get('search') || '');
  const [activeType, setActiveType] = useState(searchParams.get('examType') || 'All');
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [academicFilters, setAcademicFilters] = useState({
    department: searchParams.get('department') || '',
    course: searchParams.get('course') || '',
    semester: searchParams.get('semester') || '',
    subject: searchParams.get('subject') || '',
  });
  const isStudent = user?.role === 'student';
  const academicOptions = useAcademicOptions(academicFilters);
  const scopeMessage = isStudent && academicFilters.department && 'You can filter by your subjects' || '';

  useEffect(() => {
    let isMounted = true;

    const loadPapers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
        if (activeType !== 'All') params.set('examType', activeType);
        Object.entries(academicFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const response = await fetch(`${API_URL}/papers?${params.toString()}`);
        if (!response.ok) throw new Error('Unable to load papers from backend');

        const data = await response.json();
        if (isMounted) {
          setPapers(Array.isArray(data) ? data : []);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) setErrorMessage(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPapers();

    return () => {
      isMounted = false;
    };
  }, [activeType, submittedSearch, academicFilters]);

  const totalViews = useMemo(
    () => papers.reduce((sum, paper) => sum + (Number(paper.views) || 0), 0),
    [papers]
  );

  const handleSearch = (event) => {
    event?.preventDefault();
    setSubmittedSearch(searchQuery);
    const params = new URLSearchParams();
    if (activeType !== 'All') params.set('examType', activeType);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    Object.entries(academicFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    const params = new URLSearchParams();
    if (type !== 'All') params.set('examType', type);
    if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
    Object.entries(academicFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const updateAcademicFilters = (next) => {
    setAcademicFilters(next);
    const params = new URLSearchParams();
    if (activeType !== 'All') params.set('examType', activeType);
    if (submittedSearch.trim()) params.set('search', submittedSearch.trim());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSubmittedSearch('');
    setActiveType('All');
    setAcademicFilters({ department: '', course: '', semester: '', subject: '' });
    setSearchParams({});
  };

  const sharePaper = async (paper) => {
    const fileUrl = getFileUrl(paper.fileUrl) || window.location.href;
    if (navigator.share) {
      await navigator.share({ title: paper.title, url: fileUrl });
      return;
    }
    await navigator.clipboard.writeText(fileUrl);
    window.alert('Paper link copied to clipboard.');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="bg-[#0a4a44] pt-32 pb-24 px-6 rounded-b-[60px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1800')"
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[#ff9f00] text-xs font-black uppercase tracking-widest mb-6"
            >
              <FileText size={14} /> <span>Live PYQ Resource Bank</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-8">
              Find Your <span className="text-[#ff9f00]">Exam Papers</span>
            </h1>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 relative group flex flex-col gap-3 sm:block">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-gray-400 group-focus-within:text-[#ff9f00] transition-colors" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search subjects, titles, or years..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-2xl py-5 pl-14 pr-5 shadow-2xl focus:outline-none text-[#0a4a44] font-bold text-base sm:pr-32 sm:text-lg"
              />
              <button type="submit" className="w-full bg-[#0a4a44] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#083a35] transition-all sm:absolute sm:right-3 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:py-2.5">
                Find Papers
              </button>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[42px] overflow-hidden border-[10px] border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=900"
                alt="Exam papers and study documents"
                className="w-full h-[430px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a4a44]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/12 border border-white/20 backdrop-blur-md rounded-3xl p-5">
                <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Updated Papers</p>
                <p className="text-white text-2xl font-black">{papers.length || 'Live'} resources ready</p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-44 h-36 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500"
                alt="Students reviewing exam material"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-8 -left-8 bg-white rounded-[28px] shadow-2xl border border-white/70 p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#ff9f00] flex items-center justify-center">
                <Calendar />
              </div>
              <div>
                <p className="text-[#0a4a44] font-black text-xl">{activeType}</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Exam Type</p>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 bg-white/90 backdrop-blur border border-gray-100 rounded-[32px] p-4 md:p-5 shadow-[0_20px_60px_-35px_rgba(10,74,68,0.35)] sticky top-24 z-20">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2 text-gray-400 mr-2">
              <Filter size={18} />
            </div>
            {examTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeType === type
                    ? 'bg-[#ff9f00] text-white shadow-lg shadow-orange-100 scale-[1.02]'
                    : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-[#0a4a44]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="text-gray-400 text-sm font-bold bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            {isLoading ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading</span>
            ) : errorMessage ? (
              <span className="inline-flex items-center gap-2 text-red-500"><AlertCircle size={16} /> Backend unavailable</span>
            ) : (
              <>Showing <span className="text-[#0a4a44]">{papers.length}</span> results, <span className="text-[#0a4a44]">{totalViews}</span> views</>
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

        {scopeMessage && !errorMessage && (
          <div className="bg-orange-50 border border-orange-100 text-[#0a4a44] rounded-3xl p-6 mb-8 font-bold">
            {scopeMessage}
          </div>
        )}

        {isLoading ? (
          <div className="py-24 flex justify-center text-gray-400 font-bold">
            <Loader2 className="animate-spin mr-3" /> Loading papers from backend
          </div>
        ) : (
          <motion.div variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {papers.map((paper) => {
                const fileUrl = getFileUrl(paper.fileUrl);
                return (
                  <motion.div
                    layout
                    variants={cardReveal}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={paper._id}
                    className="group bg-white rounded-[36px] border border-gray-100 p-4 transition-all hover:shadow-[0_40px_90px_-28px_rgba(10,74,68,0.42)] hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-x-8 bottom-0 h-1 bg-[#ff9f00]/70 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                    <div className="absolute top-6 right-6 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {formatDate(paper.createdAt)}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-orange-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
                      <FileText className="text-[#0a4a44] group-hover:text-[#ff9f00]" size={18} />
                    </div>

                    <h3 className="text-lg font-black text-[#0a4a44] mb-1.5 leading-tight group-hover:text-[#ff9f00] transition-colors">
                      {paper.title}
                    </h3>

                    <p className="text-gray-400 text-xs font-bold flex items-center gap-2 mb-4">
                      <BookOpen size={12} /> {paper.subject?.name || 'General Subject'}
                    </p>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Calendar size={12} /> {paper.year}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Zap size={12} className="text-[#ff9f00] fill-[#ff9f00]" /> {paper.examType}
                      </div>
                    </div>

                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#ff9f00] hover:bg-[#e68a00] text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100 mb-4 group-hover:shadow-xl text-sm"
                        title="Open PDF document"
                      >
                        <FileText size={14} /> Open Document
                      </a>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-[#0a4a44]">{paper.views || 0}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Views</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => sharePaper(paper)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#0a4a44] transition-all" title="Share paper">
                          <Share2 size={20} />
                        </button>
                        {fileUrl ? (
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="bg-[#ff9f00] text-white p-3 rounded-xl hover:bg-[#e68a00] shadow-lg shadow-orange-100 transition-all" title="Open PDF">
                            <Download size={20} />
                          </a>
                        ) : (
                          <button disabled className="bg-gray-200 text-gray-400 p-3 rounded-xl cursor-not-allowed" title="No file uploaded">
                            <Download size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {papers.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-[#0a4a44] mb-2">No Papers Found</h3>
                <p className="text-gray-400 mb-8">
                  Try searching for a different title or exam type.
                </p>
                <button onClick={resetFilters} className="text-[#ff9f00] font-black flex items-center gap-2 mx-auto hover:underline">
                  Reset all filters <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 mt-12"
      >
        <div className="bg-[#0a4a44] rounded-[50px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Can't find your exam paper?</h2>
            <p className="text-teal-100/60 font-medium">Login and request or upload a paper from your dashboard.</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/auth" className="relative z-10 mt-8 md:mt-0 bg-[#ff9f00] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3">
              Request a Paper <Star size={18} fill="white" />
            </Link>
          </motion.div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </motion.section>
    </div>
  );
};

export default PapersPage;
