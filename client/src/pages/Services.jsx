import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Map, MessageSquare,
  ArrowRight, Zap, Star,
  Download, Clock, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';

const API_URL = '/api';
const ASSET_URL = '';

const formatCount = (value) => {
  const count = Number(value) || 0;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
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
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ServicesPage = () => {
  const [serviceData, setServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadServicesData = async () => {
      try {
        const response = await fetch(`${API_URL}/home`);
        if (!response.ok) {
          throw new Error('Unable to load services data from backend');
        }
        const data = await response.json();
        if (isMounted) {
          setServiceData(data);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadServicesData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const fallback = {
      departments: 0,
      subjects: 0,
      notes: 0,
      papers: 0,
      students: 0,
      resources: 0,
    };
    return { ...fallback, ...(serviceData?.stats || {}) };
  }, [serviceData]);

  const latestResources = serviceData?.latestResources || [];

  const services = [
    {
      id: 1,
      title: "Topper's Handwritten Notes",
      tag: "Best Seller",
      desc: "Get access to digitally scanned, high-quality handwritten notes from University toppers. Organized chapter-wise with important markings.",
      icon: <BookOpen className="text-[#ff9f00]" />,
      stats: `${formatCount(stats.notes)} Notes`,
      features: ["Verified by Faculty", "Diagrammatic Explanations", "Easy Language"],
      color: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600",
      path: "/notes",
      samplePath: "/notes?category=Handwritten"
    },
    {
      id: 2,
      title: "Chapter-wise PYQ Bank",
      tag: "Exam Essential",
      desc: "Previous 10 years question papers sorted by chapters. Stop guessing what will come in the exam and see the patterns.",
      icon: <FileText className="text-[#0a4a44]" />,
      stats: `${formatCount(stats.papers)} Papers`,
      features: ["Step-by-step Solutions", "Marking Scheme Info", "PDF Format"],
      color: "bg-teal-50",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
      path: "/papers",
      samplePath: "/papers"
    },
    {
      id: 3,
      title: "Last Minute Roadmaps",
      tag: "Saviour",
      desc: "Have only 2 days left? Our roadmaps tell you exactly which 5 topics to study to pass comfortably without failing.",
      icon: <Map className="text-blue-600" />,
      stats: `${formatCount(stats.subjects)} Subjects`,
      features: ["3-Day Study Plans", "High Weightage Topics", "Quick Revision Sheets"],
      color: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600",
      path: "/subjects",
      samplePath: "/departments"
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. HERO SECTION (Compact & Dynamic) */}
      <section className="bg-[#0a4a44] pt-32 pb-20 px-6 rounded-b-[60px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1800')"
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[#ff9f00] text-sm font-bold mb-6"
            >
              <Zap size={16} /> <span>Smart Study Solutions</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Everything You Need to <br/>
              <span className="text-[#ff9f00]">Master Your Semester</span>
            </h1>
            <p className="text-teal-100/70 max-w-2xl mx-auto lg:mx-0 text-lg mb-10">
              From handwritten notes to previous year questions, we've curated the best resources to help you excel in your college exams.
            </p>

            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold border border-white/10">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#ff9f00]" />
                  Connecting to backend
                </>
              ) : errorMessage ? (
                <>
                  <AlertCircle size={16} className="text-red-300" />
                  Backend unavailable
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Live backend data loaded
                </>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[42px] overflow-hidden border-[10px] border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900"
                alt="Student using online study services"
                className="w-full h-[430px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a4a44]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/12 border border-white/20 backdrop-blur-md rounded-3xl p-5">
                <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Available Now</p>
                <p className="text-white text-2xl font-black">{formatCount(stats.resources)} study resources</p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-44 h-36 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=500"
                alt="Handwritten study notes"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-8 -left-8 bg-white rounded-[28px] shadow-2xl border border-white/70 p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#ff9f00] flex items-center justify-center">
                <BookOpen />
              </div>
              <div>
                <p className="text-[#0a4a44] font-black text-xl">{formatCount(stats.subjects)}</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Subjects</p>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

     

      {/* 3. CORE SERVICES DISPLAY */}
      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6">
        <div className="space-y-16 md:space-y-24">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className={`flex w-full min-w-0 flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch gap-8 overflow-hidden rounded-[28px] lg:items-center lg:gap-16 lg:overflow-visible`}
            >
              {/* Image Side */}
              <div className="relative min-w-0 flex-1">
                <div className="relative z-10 overflow-hidden rounded-[30px] border-[8px] border-gray-50 shadow-2xl sm:rounded-[42px] lg:rounded-[60px] lg:border-[12px]">
                   <img src={service.image} alt={service.title} className="h-[250px] w-full object-cover sm:h-[340px] lg:h-[450px]" />
                </div>
                {/* Floating Stat Card */}
                <div className="absolute bottom-3 right-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl border border-gray-50 bg-white p-3 shadow-2xl sm:bottom-5 sm:right-5 sm:gap-4 sm:rounded-[28px] sm:p-5 lg:-bottom-6 lg:-right-10">
                  <div className={`shrink-0 rounded-2xl p-3 ${service.color}`}>
                     <Download size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-[#0a4a44] sm:text-xl">{service.stats}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:text-xs sm:tracking-widest">From Database</p>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="min-w-0 flex-1 px-1 text-left">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-[#ff9f00] sm:mb-4 sm:text-sm">{service.tag}</span>
                <h2 className="mb-4 text-2xl font-black leading-tight text-[#0a4a44] sm:text-3xl lg:mb-6 lg:text-4xl">
                  {service.title}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-gray-500 sm:text-base lg:mb-8 lg:text-lg">
                  {service.desc}
                </p>
                
                <div className="mb-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-10">
                  {service.features.map(feat => (
                    <div key={feat} className="flex min-w-0 items-center gap-3 text-sm font-bold text-gray-600">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span className="min-w-0 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <Link to={service.path} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a4a44] px-6 py-4 font-bold text-white shadow-xl shadow-teal-100 transition hover:bg-[#083a35] sm:w-auto sm:px-10">
                    Explore Now <ArrowRight size={20} />
                  </Link>
                  <Link to={service.samplePath} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-center font-bold text-[#0a4a44] transition hover:bg-gray-100 sm:w-auto sm:px-8">
                    View Samples
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. QUICK STATS BAR */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-20 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white py-16"
      >
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-[#ff9f00]/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#0a4a44]/6 blur-3xl" />

        <motion.div variants={gridReveal} className="mobile-carousel mobile-scroll-track relative z-10 mx-auto max-w-7xl md:grid-cols-4 md:gap-5 md:px-6 lg:gap-8">
           {[
             { label: "Subjects Covered", value: formatCount(stats.subjects), icon: <BookOpen/>, tone: "from-orange-50 to-amber-50" },
             { label: "Study Resources", value: formatCount(stats.resources), icon: <Star/>, tone: "from-teal-50 to-emerald-50" },
             { label: "Departments", value: formatCount(stats.departments), icon: <Clock/>, tone: "from-sky-50 to-cyan-50" },
             { label: "Students", value: formatCount(stats.students), icon: <MessageSquare/>, tone: "from-rose-50 to-orange-50" },
           ].map((stat, i) => (
             <motion.div
               key={stat.label}
               variants={cardReveal}
               whileHover={{ y: -10, scale: 1.02 }}
               transition={{ type: "spring", stiffness: 260, damping: 20 }}
               className="group relative overflow-hidden rounded-[30px] border border-gray-100 bg-white p-5 text-center shadow-sm transition-all hover:border-orange-100 hover:shadow-[0_34px_90px_-36px_rgba(10,74,68,0.5)] md:p-7"
             >
               <div className={`absolute inset-0 bg-gradient-to-br ${stat.tone} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
               <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-[#ff9f00]/70 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
               <motion.div
                 whileHover={{ rotate: [0, -6, 6, 0] }}
                 transition={{ duration: 0.45 }}
                 className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-orange-50 text-[#ff9f00] shadow-[0_14px_30px_-18px_rgba(10,74,68,0.7)] ring-1 ring-orange-100 transition-all group-hover:bg-white group-hover:shadow-xl md:h-20 md:w-20"
               >
                  {stat.icon}
               </motion.div>
               <div className="relative">
                 <motion.h3
                   initial={false}
                   className="mb-1 text-3xl font-black text-[#0a4a44] md:text-4xl"
                 >
                   {stat.value}
                 </motion.h3>
                 <p className="mx-auto max-w-[12rem] text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 md:text-xs">{stat.label}</p>
               </div>
             </motion.div>
           ))}
        </motion.div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#ff9f00] font-black uppercase tracking-widest text-sm mb-3 block">
              Latest Uploads
            </span>
            <h2 className="text-4xl font-black text-[#0a4a44]">
              Recently added resources
            </h2>
          </div>
          {errorMessage && (
            <p className="text-sm font-bold text-red-500">
              Start the backend on port 5000 to load live resources.
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-gray-400 font-bold">
            <Loader2 className="animate-spin" /> Loading resources
          </div>
        ) : latestResources.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-gray-500 font-bold">
            No notes or papers have been uploaded yet.
          </div>
        ) : (
          <motion.div variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="mobile-carousel mobile-scroll-track md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {latestResources.map((resource) => {
              const fileUrl = getFileUrl(resource.fileUrl);
              return (
              <motion.div key={`${resource.type}-${resource.id}`} variants={cardReveal}>
              <a
                href={fileUrl || (resource.type === 'note' ? '/notes' : '/papers')}
                target={fileUrl ? '_blank' : undefined}
                rel={fileUrl ? 'noreferrer' : undefined}
                className="group block bg-white border border-gray-100 rounded-[32px] p-6 hover:-translate-y-2 hover:shadow-[0_34px_80px_-28px_rgba(10,74,68,0.45)] transition-all relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[#ff9f00]/70 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff9f00] flex items-center justify-center">
                    {resource.type === 'note' ? <BookOpen /> : <FileText />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {resource.type}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#0a4a44] group-hover:text-[#ff9f00] transition-colors line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-400 font-bold mt-3 line-clamp-2">
                  {resource.subject} {resource.year ? `- ${resource.year}` : ''}
                </p>
                <div className="flex items-center gap-2 mt-6 text-[#ff9f00] font-black text-sm">
                  <Download size={16} /> Open PDF
                </div>
              </a>
              </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

    </div>
  );
};

export default ServicesPage;
