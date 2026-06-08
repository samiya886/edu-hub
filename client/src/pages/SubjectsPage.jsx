import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAcademicOptions from '../hooks/useAcademicOptions';
import { 
  Search, BookOpen, Video, FileText, 
  Star, Clock, ChevronRight, Filter, 
  CheckCircle, GraduationCap, Layout
} from 'lucide-react';

const API_URL = '/api';

const SubjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: '', course: '', semester: '' });
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [resourceError, setResourceError] = useState('');
  const { departments, courses, semesters, subjects, error } = useAcademicOptions(filters);

  const subjectImages = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
  ];

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return subjects;
    return subjects.filter((subject) =>
      [
        subject.name,
        subject.department?.name,
        subject.course?.name,
        subject.semester?.name,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [searchQuery, subjects]);

  useEffect(() => {
    let active = true;

    const loadResources = async () => {
      try {
        const params = new URLSearchParams({ isApproved: 'true' });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const [notesResponse, papersResponse] = await Promise.all([
          fetch(`${API_URL}/notes?${params.toString()}`),
          fetch(`${API_URL}/papers?${params.toString()}`),
        ]);
        const [notesData, papersData] = await Promise.all([notesResponse.json(), papersResponse.json()]);

        if (!notesResponse.ok) throw new Error(notesData.message || 'Unable to load notes');
        if (!papersResponse.ok) throw new Error(papersData.message || 'Unable to load papers');

        if (active) {
          setNotes(Array.isArray(notesData) ? notesData : []);
          setPapers(Array.isArray(papersData) ? papersData : []);
          setResourceError('');
        }
      } catch (err) {
        if (active) {
          setNotes([]);
          setPapers([]);
          setResourceError(err.message);
        }
      }
    };

    loadResources();

    return () => {
      active = false;
    };
  }, [filters]);

  const resourceCounts = useMemo(() => {
    const counts = {};

    notes.forEach((note) => {
      const subjectId = note.subject?._id || note.subject;
      if (!subjectId) return;
      counts[subjectId] = counts[subjectId] || { notes: 0, papers: 0 };
      counts[subjectId].notes += 1;
    });

    papers.forEach((paper) => {
      const subjectId = paper.subject?._id || paper.subject;
      if (!subjectId) return;
      counts[subjectId] = counts[subjectId] || { notes: 0, papers: 0 };
      counts[subjectId].papers += 1;
    });

    return counts;
  }, [notes, papers]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden rounded-b-[60px]">
        {/* The Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-fixed"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2000')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Deep Teal Overlay (Matches Opndoo palette) */}
        <div className="absolute inset-0 bg-[#0a4a44]/85 backdrop-blur-sm z-0" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-[#ff9f00] text-xs font-black uppercase tracking-widest mb-6"
          >
            <GraduationCap size={16} /> <span>Subject Directory</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
            Master Your <span className="text-[#ff9f00]">Syllabus.</span>
          </h1>

          {/* Large Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search real subjects from the selected path..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-6 px-14 shadow-2xl focus:outline-none text-[#0a4a44] font-bold text-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff9f00] transition-colors" size={24} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#ff9f00] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20">
              Find Subject
            </button>
          </div>
        </div>
      </section>

      {/* 2. BACKEND FILTER (Floating Bar) */}
      <section className="max-w-7xl mx-auto px-6 -translate-y-1/2">
        <div className="bg-white shadow-2xl rounded-[32px] p-4 grid gap-3 border border-gray-100 md:grid-cols-[auto_1fr_1fr_1fr]">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[#0a4a44] font-bold shrink-0">
            <Filter size={18} /> <span>Filter</span>
          </div>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ department: e.target.value, course: '', semester: '' })}
            className="min-w-0 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00]"
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>{department.name}</option>
            ))}
          </select>
          <select
            value={filters.course}
            disabled={!filters.department}
            onChange={(e) => setFilters({ ...filters, course: e.target.value, semester: '' })}
            className="min-w-0 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>{course.name}</option>
            ))}
          </select>
          <select
            value={filters.semester}
            disabled={!filters.course}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            className="min-w-0 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester._id} value={semester._id}>{semester.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. SUBJECTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredSubjects.map((sub, i) => {
              const counts = resourceCounts[sub._id] || { notes: 0, papers: 0 };
              const subjectQuery = new URLSearchParams({
                department: sub.department?._id || filters.department,
                course: sub.course?._id || filters.course,
                semester: sub.semester?._id || filters.semester,
                subject: sub._id,
              }).toString();

              return (
              <motion.div 
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -12, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                key={sub._id}
                className="group bg-white rounded-[42px] border border-gray-100 p-4 transition-all hover:shadow-[0_40px_95px_-35px_rgba(10,74,68,0.45)] overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-transparent to-orange-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* Image Section */}
                <div className="relative h-56 w-full rounded-[34px] overflow-hidden mb-6">
                  <img src={subjectImages[i % subjectImages.length]} alt={sub.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#0a4a44] uppercase tracking-widest">
                    {sub.semester?.name || 'Semester'}
                  </div>
                  <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="absolute top-4 right-4 bg-[#ff9f00] text-white p-2 rounded-full shadow-lg">
                    <CheckCircle size={16} />
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="px-4 pb-4 relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-black text-[#0a4a44] leading-tight group-hover:text-[#ff9f00] transition-colors">
                      {sub.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#ff9f00] font-black">
                      <Star size={16} fill="currentColor" /> {sub.rating}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Layout size={14} /> {sub.department?.name || 'Department'} / {sub.course?.name || 'Course'}
                  </p>

                  {/* Resource Counts */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {[
                      { icon: <BookOpen size={14}/>, label: "Notes", val: counts.notes },
                      { icon: <FileText size={14}/>, label: "Papers", val: counts.papers },
                      { icon: <Video size={14}/>, label: "Videos", val: 0 }
                    ].map((res, i) => (
                      <motion.div key={i} whileHover={{ y: -4 }} className="bg-gray-50 rounded-2xl p-3 text-center border border-transparent group-hover:border-gray-100 transition-colors">
                        <div className="flex justify-center text-gray-400 mb-1 group-hover:text-[#ff9f00] transition-colors">{res.icon}</div>
                        <p className="text-sm font-black text-[#0a4a44]">{res.val}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{res.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/notes?${subjectQuery}`} className="bg-[#0a4a44] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff9f00] transition-all shadow-lg shadow-teal-100">
                      Notes <ChevronRight size={18} />
                    </Link>
                    <Link to={`/papers?${subjectQuery}`} className="bg-gray-50 text-[#0a4a44] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff9f00] hover:text-white transition-all">
                      Papers <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
                <div className="absolute inset-x-8 bottom-0 h-1 bg-[#ff9f00]/70 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 rounded-full" />
              </motion.div>
            );})}
          </AnimatePresence>
        </motion.div>

        {/* 4. EMPTY STATE */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-32">
             <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-gray-200" />
             </div>
             <h3 className="text-2xl font-black text-[#0a4a44] mb-2">Subject not found</h3>
             <p className="text-gray-400 mb-8">{error || resourceError || 'Select a department, course, and semester to load matching subjects from the backend.'}</p>
             <button onClick={() => setSearchQuery('')} className="bg-[#ff9f00] text-white px-8 py-3 rounded-xl font-bold">
               Clear Search
             </button>
          </div>
        )}
      </section>

      {/* 5. QUICK STATS BAR */}
      <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="bg-[#0a4a44] mx-6 py-16 rounded-[60px] text-white">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-12">
          <motion.div variants={cardVariants} whileHover={{ y: -8 }} className="flex items-center gap-6 rounded-[30px] bg-white/5 p-5 border border-white/10">
             <div className="bg-white/10 p-4 rounded-3xl"><Clock size={32} className="text-[#ff9f00]" /></div>
             <div>
                <h4 className="text-2xl font-black">24/7 Access</h4>
                <p className="text-teal-100/50 text-sm font-medium">Study anytime, anywhere.</p>
             </div>
          </motion.div>
          <motion.div variants={cardVariants} whileHover={{ y: -8 }} className="flex items-center gap-6 rounded-[30px] bg-white/5 p-5 border border-white/10">
             <div className="bg-white/10 p-4 rounded-3xl"><CheckCircle size={32} className="text-[#ff9f00]" /></div>
             <div>
                <h4 className="text-2xl font-black">Expert Verified</h4>
                <p className="text-teal-100/50 text-sm font-medium">Topper-reviewed materials.</p>
             </div>
          </motion.div>
          <motion.div variants={cardVariants} whileHover={{ y: -8 }} className="flex items-center gap-6 rounded-[30px] bg-white/5 p-5 border border-white/10">
             <div className="bg-white/10 p-4 rounded-3xl"><Video size={32} className="text-[#ff9f00]" /></div>
             <div>
                <h4 className="text-2xl font-black">Video Guides</h4>
                <p className="text-teal-100/50 text-sm font-medium">Visual learning roadmaps.</p>
             </div>
          </motion.div>
        </motion.div>
      </motion.section>

    </div>
  );
};

export default SubjectsPage;
