import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Trophy, Target, Heart,
  ArrowRight, GraduationCap, Star, Check,
  Loader2, AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const formatCount = (value) => {
  const count = Number(value) || 0;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return String(count);
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const gridReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const AboutPage = () => {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAboutData = async () => {
      try {
        const response = await fetch(`${API_URL}/home`);
        if (!response.ok) throw new Error('Unable to load about data from backend');
        const data = await response.json();
        if (isMounted) {
          setHomeData(data);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) setErrorMessage(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAboutData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const fallback = {
      students: 0,
      notes: 0,
      papers: 0,
      subjects: 0,
      departments: 0,
      resources: 0,
    };
    return { ...fallback, ...(homeData?.stats || {}) };
  }, [homeData]);

  const values = [
    {
      title: 'Student-First',
      desc: 'Every note and paper is uploaded with one goal: making your exam preparation easier.',
      icon: <Users className="text-[#ff9f00]" />,
    },
    {
      title: 'Quality Content',
      desc: "We do not just host files. We organize notes, papers, subjects, and departments so students can find what they need quickly.",
      icon: <Star className="text-[#0a4a44]" />,
    },
    {
      title: 'Always Accessible',
      desc: 'Academic resources should be easy to reach, whether you are browsing notes, papers, or your dashboard.',
      icon: <Heart className="text-red-500" />,
    }
  ];

  const statCards = [
    { label: 'Active Students', val: formatCount(stats.students), icon: <Users /> },
    { label: 'Total Notes', val: formatCount(stats.notes), icon: <Target /> },
    { label: 'Question Papers', val: formatCount(stats.papers), icon: <Trophy /> },
    { label: 'Subjects Covered', val: formatCount(stats.subjects), icon: <Star /> },
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-25"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1800')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/90 to-white z-0" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-[#0a4a44]/5 text-[#0a4a44] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Connecting
                </>
              ) : errorMessage ? (
                <>
                  <AlertCircle size={14} className="text-red-500" /> Backend offline
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live platform stats
                </>
              )}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#0a4a44] leading-tight mb-6">
              Empowering the <br />
              <span className="text-[#ff9f00]">Next Generation.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              EduHub was born out of a simple frustration: the hours wasted searching for quality previous year papers and notes. We decided to build a home for every college resource you need.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/notes" className="bg-[#0a4a44] text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-[#083a35] transition">
                Browse Notes <ArrowRight size={20} />
              </Link>
              <Link to="/papers" className="bg-gray-50 text-[#0a4a44] px-8 py-4 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition">
                Browse Papers
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[56px] overflow-hidden border-[12px] border-white shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900" alt="Students collaborating around study resources" className="w-full h-[520px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a4a44]/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-[28px] p-5 flex items-center justify-between gap-5">
                <div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">EduHub Community</p>
                  <p className="text-[#0a4a44] text-2xl font-black">{formatCount(stats.resources)} resources</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#ff9f00] flex items-center justify-center shrink-0">
                  <GraduationCap />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-8 z-20 hidden md:block w-52 rounded-[34px] overflow-hidden border-8 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500"
                alt="Student studying notes"
                className="w-full h-48 object-cover"
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 w-40 h-40 hidden md:block"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path id="aboutCirclePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                <text className="text-[8px] font-bold uppercase tracking-[3px] fill-[#0a4a44]">
                  <textPath xlinkHref="#aboutCirclePath">ESTABLISHED 2024 - THE STUDENT HUB -</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap className="text-[#ff9f00] w-10 h-10" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={gridReveal} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statCards.map((stat, i) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={stat.label}
                className="group bg-white p-8 rounded-[34px] shadow-sm text-center border border-gray-100 hover:shadow-[0_30px_70px_-30px_rgba(10,74,68,0.35)] transition-all relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ff9f00]/70 scale-x-0 group-hover:scale-x-100 transition-transform" />
                <div className="text-[#ff9f00] mb-4 flex justify-center bg-orange-50 w-14 h-14 rounded-2xl items-center mx-auto group-hover:scale-110 transition-transform">{stat.icon}</div>
                <h3 className="text-3xl font-black text-[#0a4a44] mb-2">
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : stat.val}
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          {errorMessage && (
            <p className="text-center text-red-500 font-bold mt-8">
              {errorMessage}. Start the backend on port 5000 to load live stats.
            </p>
          )}
        </div>
      </motion.section>

      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <span className="text-[#ff9f00] font-black uppercase tracking-[0.2em] text-xs mb-4 block">
            Our Foundation
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a4a44] mb-6">
            Built on Trust & Quality
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            We are a digital campus designed to give you a competitive edge.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
          className="grid md:grid-cols-3 gap-12"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
              className="group relative p-10 rounded-[38px] bg-white border border-gray-100 transition-all hover:shadow-[0_35px_80px_-30px_rgba(10,74,68,0.28)] hover:border-[#ff9f00]/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f00]/0 to-[#ff9f00]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[38px]" />
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#0a4a44]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                {value.icon}
              </motion.div>
              <h4 className="text-2xl font-black text-[#0a4a44] mb-4 relative z-10">{value.title}</h4>
              <p className="text-gray-500 leading-relaxed text-sm font-medium relative z-10">{value.desc}</p>
              <div className="h-1 bg-[#ff9f00] mt-6 rounded-full opacity-30 w-10 group-hover:opacity-100 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="px-6 mb-24"
      >
        <div className="max-w-7xl mx-auto bg-[#0a4a44] rounded-[60px] p-10 md:p-20 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Our Mission is to democratize <span className="text-[#ff9f00]">education.</span></h2>
              <div className="space-y-4">
                {[
                  'To provide easy access to study resources.',
                  'To keep notes and papers organized by academic structure.',
                  'To bridge the gap between syllabus and exams.'
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-teal-100/80 font-bold">
                    <Check size={20} className="text-[#ff9f00]" /> {line}
                  </div>
                ))}
              </div>
              <Link to="/services" className="mt-10 bg-[#ff9f00] text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-[#e68a00] transition">
                Explore Services <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-[40px] overflow-hidden hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" alt="mission" className="w-full h-80 object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
      </motion.section>

      <section className="pb-32 px-6 text-center">
        <h3 className="text-2xl font-black text-[#0a4a44] mb-4">Want to help your peers?</h3>
        <p className="text-gray-500 mb-8">Join as a student or contributor and help the resource library grow.</p>
        <Link to="/auth" className="bg-[#ff9f00] text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2 mx-auto hover:bg-[#e68a00] transition shadow-xl shadow-orange-100">
          Apply as Contributor <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
