import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Building2, Landmark, Microscope,
  Book, Palette, Scale, Stethoscope,
  Search, ArrowRight, Zap, Star, TrendingUp, Loader2, AlertCircle,
  FileText, Download
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const ASSET_URL = 'http://localhost:5000';

const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;
  if (fileUrl.startsWith('/uploads')) return `${ASSET_URL}${fileUrl}`;
  return `${ASSET_URL}/uploads/${fileUrl}`;
};

const DepartmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState('');

  const departmentMeta = [
    {
      name: 'Engineering',
      icon: <Cpu />,
      count: '2.5k',
      color: 'bg-blue-500 text-white',
      accent: '#3b82f6',
      desc: 'Mechanical, Civil, Electrical, Aerospace & more.',
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
      popular: true
    },
    {
      name: 'Management',
      icon: <Building2 />,
      count: '1.2k',
      color: 'bg-purple-500 text-white',
      accent: '#8b5cf6',
      desc: 'MBA, BBA, Strategy, Marketing & Leadership.',
      image: "https://sp.yimg.com/ib/th/id/OIP.BJ6WO_pVfCS8erid6gwhggHaF8?pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
      popular: false
    },
    {
      name: 'Commerce',
      icon: <Landmark />,
      count: '3.1k',
      color: 'bg-amber-500 text-white',
      accent: '#f59e0b',
      desc: 'Accounting, Finance, Taxation & Audit.',
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      popular: true
    },
    {
      name: 'Computer Science',
      icon: <Book />,
      count: '5.2k',
      color: 'bg-emerald-500 text-white',
      accent: '#10b981',
      desc: 'DSA, AI/ML, Web Dev, Cybersecurity & Systems.',
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      popular: true
    },
    {
      name: 'Humanities',
      icon: <Palette />,
      count: '900',
      color: 'bg-pink-500 text-white',
      accent: '#ec4899',
      desc: 'History, Literature, Philosophy & Fine Arts.',
      image: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&q=80&w=800",
      popular: false
    },
    {
      name: 'Law',
      icon: <Scale />,
      count: '1.1k',
      color: 'bg-teal-500 text-white',
      accent: '#14b8a6',
      desc: 'Constitutional, Criminal, Corporate & International Law.',
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      popular: false
    },
    {
      name: 'Medical',
      icon: <Stethoscope />,
      count: '2.2k',
      color: 'bg-rose-500 text-white',
      accent: '#f43f5e',
      desc: 'Anatomy, Pharmacology, Surgery & Clinical Sciences.',
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      popular: true
    },
    {
      name: 'Pure Sciences',
      icon: <Microscope />,
      count: '1.8k',
      color: 'bg-violet-500 text-white',
      accent: '#7c3aed',
      desc: 'Physics, Chemistry, Mathematics & Biology.',
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
      popular: false
    },
  ];

  const fallbackMeta = {
    icon: <Book />,
    count: '0',
    color: 'bg-[#0a4a44] text-white',
    accent: '#0a4a44',
    desc: 'Explore courses, subjects, notes, and papers for this department.',
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    popular: false
  };

  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/departments`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load departments from backend');
        }

        if (isMounted) {
          setDepartments(Array.isArray(data) ? data : []);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setDepartments([]);
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDepartments();

    return () => {
      isMounted = false;
    };
  }, []);

  const allDepts = useMemo(() => {
    return departments.map((department) => {
      const meta = departmentMeta.find((item) => item.name.toLowerCase() === department.name.toLowerCase()) || fallbackMeta;

      return {
        ...meta,
        id: department._id,
        name: department.name,
        desc: department.description || meta.desc,
      };
    });
  }, [departments]);

  const filters = ["All", "Popular", "Engineering", "Sciences", "Business"];

  const filteredDepts = allDepts
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.desc.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === "All") return matchesSearch;
      if (activeFilter === "Popular") return matchesSearch && d.popular;
      if (activeFilter === "Sciences") return matchesSearch && ['Computer Science', 'Pure Sciences', 'Medical'].includes(d.name);
      return matchesSearch && d.name.toLowerCase().includes(activeFilter.toLowerCase());
    });

  const handleDepartmentClick = async (department) => {
    setSelectedDepartment(department);
    setMaterialsLoading(true);
    setMaterialsError('');

    setTimeout(() => {
      document.getElementById('department-materials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    try {
      const [notesResponse, papersResponse] = await Promise.all([
        fetch(`${API_URL}/notes?department=${department.id}`),
        fetch(`${API_URL}/papers?department=${department.id}`),
      ]);

      const [notesData, papersData] = await Promise.all([
        notesResponse.json(),
        papersResponse.json(),
      ]);

      if (!notesResponse.ok) throw new Error(notesData.message || 'Unable to load department notes');
      if (!papersResponse.ok) throw new Error(papersData.message || 'Unable to load department papers');

      const noteItems = Array.isArray(notesData) ? notesData.map((item) => ({ ...item, materialType: 'note' })) : [];
      const paperItems = Array.isArray(papersData) ? papersData.map((item) => ({ ...item, materialType: 'paper' })) : [];

      setMaterials([...noteItems, ...paperItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      setMaterials([]);
      setMaterialsError(error.message);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: -8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 95, damping: 18 }
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen overflow-hidden">
      <section className="bg-[#0a4a44] pt-32 pb-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#ff9f1c15_0%,transparent_50%)]" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-3xl text-[#ff9f1c] text-sm font-bold tracking-widest mb-8 border border-white/10"
          >
            <Star size={18} fill="currentColor" /> WORLD-CLASS EDUCATION DIRECTORY
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-[92px] font-black text-white leading-[0.95] tracking-tighter mb-8">
            Discover Your<br />
            <span className="bg-gradient-to-r from-[#ff9f1c] via-amber-300 to-[#ff9f1c] bg-clip-text text-transparent">Academic Universe</span>
          </h1>

          <p className="text-xl text-white/70 max-w-xl mx-auto mb-12">
            18,000+ resources across 50+ disciplines. Find your perfect department.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[#ff9f1c]/30 via-white/10 to-[#ff9f1c]/30 rounded-[28px] blur-2xl opacity-70 group-focus-within:opacity-100 transition-all" />

            <div className="relative flex flex-col gap-3 bg-white rounded-3xl p-3 shadow-2xl sm:flex-row sm:items-center">
              <Search className="ml-8 text-zinc-400" size={28} />
              <input
                type="text"
                placeholder="Search departments or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-zinc-400 text-[#0a4a44] font-medium sm:px-6 sm:py-7 sm:text-xl"
              />
              <button className="bg-[#0a4a44] text-white px-8 py-4 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 sm:mr-3 sm:px-10">
                Explore <ArrowRight />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-32 -left-6 hidden xl:block bg-white/10 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/20 text-white text-sm"
        >
          Trending: AI &amp; Data Science
        </motion.div>
      </section>

      <div className="sticky top-0 z-40 bg-white border-b pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-8 py-3 rounded-3xl text-sm font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-[#0a4a44] text-white shadow-lg'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-500" />
                <span className="font-semibold text-emerald-600">{departments.length} from database</span>
              </div>
              <div className="text-zinc-400">Showing {filteredDepts.length} departments</div>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {errorMessage && (
          <div className="mb-8 rounded-3xl border border-red-100 bg-red-50 p-6 font-bold text-red-600">
            <AlertCircle className="mr-2 inline" size={20} />
            {errorMessage}. Make sure the backend is running on port 5000.
          </div>
        )}

        {isLoading ? (
          <div className="py-24 flex justify-center text-zinc-400 font-bold">
            <Loader2 className="animate-spin mr-3" /> Loading departments from backend
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredDepts.map((dept) => (
                <motion.button
                  type="button"
                  layout
                  key={dept.id || dept.name}
                  variants={itemVariants}
                  whileHover={{
                    y: -14,
                    scale: 1.015,
                    transition: { type: "spring", stiffness: 260, damping: 20 }
                  }}
                  onClick={() => handleDepartmentClick(dept)}
                  className={`group bg-white rounded-[34px] overflow-hidden border text-left border-zinc-100 shadow-sm hover:shadow-[0_40px_100px_-35px_rgba(10,74,68,0.5)] transition-all duration-500 cursor-pointer relative ${
                    selectedDepartment?.id === dept.id ? 'ring-4 ring-[#ff9f1c]/30' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f1c]/0 via-transparent to-[#ff9f1c]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative h-56 aspect-video overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />

                    {dept.popular && (
                      <motion.div whileHover={{ scale: 1.05 }} className="absolute top-5 right-5 bg-white text-[#0a4a44] text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-1 shadow">
                        <Star size={14} fill="#ff9f1c" className="text-[#ff9f1c]" /> Popular
                      </motion.div>
                    )}
                  </div>

                  <div className="p-8 -mt-5 relative bg-white rounded-t-3xl">
                    <motion.div whileHover={{ rotate: [0, -7, 7, 0], scale: 1.08 }} className={`${dept.color} w-20 h-10 rounded-3xl flex items-center justify-center -mt-14 mb-6 shadow-xl ring-8 ring-white transition-transform group-hover:rotate-6`}>
                      {React.cloneElement(dept.icon, { size: 38 })}
                    </motion.div>

                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-black text-[#0a4a44] tracking-tighter group-hover:text-[#ff9f1c] transition-colors">
                        {dept.name}
                      </h3>
                    </div>

                    <p className="text-zinc-600 leading-relaxed mb-10 line-clamp-3">
                      {dept.desc}
                    </p>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Resources</div>
                        <div className="text-2xl font-black text-[#0a4a44]">{dept.count}</div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 bg-[#0a4a44] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#ff9f1c] transition-all duration-300"
                      >
                        <ArrowRight size={26} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 h-1.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ backgroundColor: dept.accent }}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredDepts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="mx-auto w-28 h-28 bg-zinc-100 rounded-full flex items-center justify-center mb-8">
              <Zap size={56} className="text-zinc-300" />
            </div>
            <h3 className="text-4xl font-black text-zinc-300 mb-4">No matches found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">We couldn't find any departments matching your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
              className="mt-10 px-10 py-4 bg-[#0a4a44] text-white rounded-3xl font-semibold hover:bg-black transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedDepartment && (
          <motion.section
            id="department-materials"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="max-w-7xl mx-auto px-6 py-20"
          >
            <div className="rounded-[42px] bg-white border border-zinc-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c] mb-2">
                    Department Materials
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a4a44] tracking-tighter">
                    {selectedDepartment.name}
                  </h2>
                  <p className="text-zinc-500 font-semibold mt-2">
                    Showing notes and papers linked to this department from MongoDB.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(null);
                    setMaterials([]);
                    setMaterialsError('');
                  }}
                  className="rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-black text-[#0a4a44] hover:bg-zinc-200"
                >
                  Clear Selection
                </button>
              </div>

              {materialsError && (
                <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 font-bold text-red-600">
                  <AlertCircle className="mr-2 inline" size={18} />
                  {materialsError}
                </div>
              )}

              {materialsLoading ? (
                <div className="py-16 flex justify-center text-zinc-400 font-bold">
                  <Loader2 className="animate-spin mr-3" /> Loading department materials
                </div>
              ) : materials.length ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {materials.map((item) => {
                    const fileUrl = getFileUrl(item.fileUrl);
                    const isPaper = item.materialType === 'paper';

                    return (
                      <motion.article
                        key={`${item.materialType}-${item._id}`}
                        variants={itemVariants}
                        className="rounded-[30px] border border-zinc-100 bg-zinc-50 p-6 hover:bg-white hover:shadow-[0_28px_80px_-38px_rgba(10,74,68,0.6)] transition-all"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a4a44] text-white">
                            {isPaper ? <FileText size={22} /> : <Book size={22} />}
                          </div>
                          <span className="rounded-2xl bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {isPaper ? 'Paper' : 'Note'}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-xl font-black leading-tight text-[#0a4a44]">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-relaxed text-zinc-500">
                          {item.description || item.subject?.name || 'No description added yet.'}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-bold text-zinc-400">
                          <div className="rounded-2xl bg-white p-3">
                            <p className="text-[#0a4a44]">{item.subject?.name || 'Subject'}</p>
                            <p>Subject</p>
                          </div>
                          <div className="rounded-2xl bg-white p-3">
                            <p className="text-[#0a4a44]">{isPaper ? item.year || 'Year' : item.category || 'Notes'}</p>
                            <p>{isPaper ? 'Year' : 'Category'}</p>
                          </div>
                        </div>

                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] py-4 text-sm font-black text-white transition hover:bg-[#e68a00]"
                          >
                            <Download size={18} /> Open PDF
                          </a>
                        ) : (
                          <button disabled className="mt-6 w-full rounded-2xl bg-zinc-200 py-4 text-sm font-black text-zinc-400">
                            No file uploaded
                          </button>
                        )}
                      </motion.article>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="rounded-[30px] border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
                  <AlertCircle className="mx-auto mb-4 text-zinc-300" size={44} />
                  <h3 className="text-2xl font-black text-[#0a4a44]">No materials found</h3>
                  <p className="mt-2 font-semibold text-zinc-400">
                    This department does not have notes or papers uploaded yet.
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentsPage;
