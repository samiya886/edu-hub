
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, BookOpen, Download, Eye, FileText, Loader2, Star } from 'lucide-react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import CTA from '../components/Cta'

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
  return `${ASSET_URL}/uploads/${encodeURIComponent(fileUrl)}`;
};

const getResourceFileUrl = (resource) => {
  if (!resource || resource.fileAvailable === false) return '';
  return getFileUrl(resource.fileUrl || resource.fileName || '');
};

const getFileExtension = (fileUrl = '') => {
  const cleanUrl = fileUrl.split('?')[0].split('#')[0];
  const match = cleanUrl.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
};

const sanitizeFileName = (name) => name.trim().replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '') || 'eduhub-file';

const getDownloadFileName = (resource, fileUrl) => {
  const extension = getFileExtension(fileUrl);
  const base = sanitizeFileName(resource.title || 'eduhub-file');
  if (!extension || base.toLowerCase().endsWith(`.${extension}`)) return base;
  return `${base}.${extension}`;
};

const getDownloadUrl = (fileUrl, fileName) => {
  const url = new URL(fileUrl, window.location.origin);
  url.searchParams.set('download', '1');
  url.searchParams.set('filename', fileName);
  return url.toString();
};

const assertReachableFile = async (fileUrl) => {
  if (!fileUrl) throw new Error('This upload does not have a valid file URL.');
  const response = await fetch(fileUrl, { method: 'HEAD' });
  if (!response.ok) throw new Error('The file is missing or the URL is invalid.');
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileError, setFileError] = useState('');
  const [openingResource, setOpeningResource] = useState('');
  const [downloadingResource, setDownloadingResource] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/home`);
        if (!response.ok) {
          throw new Error('Unable to load home data from backend');
        }
        const data = await response.json();
        if (isMounted) {
          setHomeData(data);
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

    loadHomeData();
    const interval = window.setInterval(loadHomeData, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => {
    const fallback = {
      departments: 0,
      courses: 0,
      subjects: 0,
      resources: 0,
      notes: 0,
      papers: 0,
      students: 0,
    };
    return { ...fallback, ...(homeData?.stats || {}) };
  }, [homeData]);

  const latestResources = homeData?.latestResources || [];

  const openResource = async (resource, fileUrl) => {
    const resourceKey = `${resource.type}-${resource.id}`;
    const pendingWindow = window.open('', '_blank');
    setOpeningResource(resourceKey);
    setFileError('');
    try {
      await assertReachableFile(fileUrl);
      if (pendingWindow) {
        pendingWindow.opener = null;
        pendingWindow.location.href = fileUrl;
      } else {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      if (pendingWindow) pendingWindow.close();
      setFileError(error.message || 'Unable to open this file.');
    } finally {
      setOpeningResource('');
    }
  };

  const downloadResource = async (resource, fileUrl) => {
    const resourceKey = `${resource.type}-${resource.id}`;
    setDownloadingResource(resourceKey);
    setFileError('');
    try {
      await assertReachableFile(fileUrl);
      const fileName = getDownloadFileName(resource, fileUrl);
      const link = document.createElement('a');
      link.href = getDownloadUrl(fileUrl, fileName);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setFileError(error.message || 'Unable to download this file.');
    } finally {
      setDownloadingResource('');
    }
  };

  return (
    <>
      <Hero/>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="bg-white px-6 -mt-2 relative z-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-orange-100/70 shadow-[0_30px_90px_-35px_rgba(10,74,68,0.35)] rounded-[36px] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ff9f00]/10 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#0a4a44]/5 blur-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <p className="text-[#ff9f00] text-xs font-black uppercase tracking-widest mb-2">
                  Live From Backend
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-[#0a4a44]">
                  EduHub resources at a glance
                </h2>
              </div>
              {(isLoading || errorMessage) && (
                <div className="flex items-center gap-2 text-sm font-bold">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2 text-gray-400">
                      <Loader2 size={16} className="animate-spin" /> Connecting to backend
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-red-500">
                      <AlertCircle size={16} /> Backend unavailable
                    </span>
                  )}
                </div>
              )}
            </div>

            <motion.div variants={staggerGrid} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {[
                ['Departments', stats.departments, '/departments'],
                ['Subjects', stats.subjects, '/subjects'],
                ['Notes', stats.notes, '/notes'],
                ['Papers', stats.papers, '/papers'],
              ].map(([label, value, path]) => (
                <motion.div key={label} variants={cardReveal}>
                <Link to={path} className="group block rounded-3xl bg-white/80 backdrop-blur border border-white p-5 hover:bg-white hover:shadow-[0_20px_50px_-25px_rgba(10,74,68,0.35)] hover:-translate-y-1 transition-all">
                  <div className="mb-4 h-1.5 w-10 rounded-full bg-[#ff9f00]/70 group-hover:w-16 transition-all" />
                  <p className="text-3xl font-black text-[#0a4a44]">{formatCount(value)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1 flex items-center justify-between">
                    {label}
                    <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </p>
                </Link>
                </motion.div>
              ))}
            </motion.div>

            {errorMessage && (
              <p className="mt-5 text-sm font-medium text-red-500">
                {errorMessage}. Make sure the backend server is running on port 5000.
              </p>
            )}
          </div>
        </div>
      </motion.section>

      <Services/>
      <About/>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-20 bg-gradient-to-b from-gray-50 to-white px-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[#ff9f00]/5 blur-3xl" />
        <div className="absolute left-0 bottom-10 h-72 w-72 rounded-full bg-[#0a4a44]/5 blur-3xl" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <p className="text-[#ff9f00] text-xs font-black uppercase tracking-widest mb-3">
                Fresh Uploads
              </p>
              <h2 className="text-4xl font-black text-[#0a4a44]">
                Latest study material
              </h2>
            </div>
            <div className="flex gap-3">
              <Link to="/notes" className="px-5 py-3 rounded-2xl bg-white text-[#0a4a44] font-bold border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                View Notes
              </Link>
              <Link to="/papers" className="px-5 py-3 rounded-2xl bg-[#0a4a44] text-white font-bold hover:bg-[#083a35] hover:-translate-y-0.5 hover:shadow-lg transition-all">
                View Papers
              </Link>
            </div>
          </div>

          {fileError && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600 flex items-center gap-2">
              <AlertCircle size={16} /> {fileError}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-400 font-bold">
              <Loader2 className="animate-spin" /> Loading latest resources
            </div>
          ) : latestResources.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-gray-500 font-medium">
              No uploaded resources found yet.
            </div>
          ) : (
            <motion.div variants={staggerGrid} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestResources.map((resource) => {
                const fileUrl = getResourceFileUrl(resource);
                const resourceKey = `${resource.type}-${resource.id}`;
                const isOpening = openingResource === resourceKey;
                const isDownloading = downloadingResource === resourceKey;

                const content = (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-[#ff9f00] flex items-center justify-center shadow-inner">
                        {resource.type === 'note' ? <BookOpen /> : <FileText />}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#0a4a44] group-hover:text-[#ff9f00] transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mt-2 line-clamp-2">
                      {resource.subject} {resource.year ? `- ${resource.year}` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-[#ff9f00] font-black text-sm">
                        <Star size={16} fill="currentColor" /> {resource.rating || 0}
                      </span>
                      <span className="text-xs font-black text-[#0a4a44] inline-flex items-center gap-1">
                        {resource.fileAvailable === false ? 'Missing file' : fileUrl ? 'Ready' : 'Missing file'} <ArrowRight size={14} />
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (fileUrl) openResource(resource, fileUrl);
                          else setFileError('This uploaded file is missing on the server. Please re-upload it.');
                        }}
                        disabled={isOpening || isDownloading}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0a4a44] px-4 py-3 text-xs font-black text-white shadow-lg shadow-teal-100 transition hover:bg-[#083b36] disabled:opacity-70"
                        aria-label={`Open ${resource.title}`}
                      >
                        {isOpening ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (fileUrl) downloadResource(resource, fileUrl);
                          else setFileError('This uploaded file is missing on the server. Please re-upload it.');
                        }}
                        disabled={!fileUrl || isOpening || isDownloading}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff9f00] text-white shadow-lg shadow-orange-100 transition hover:bg-[#e68a00] disabled:opacity-50"
                        aria-label={`Download ${resource.title}`}
                        title="Download"
                      >
                        {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      </button>
                    </div>
                  </>
                );

                return (
                  <motion.div key={resourceKey} variants={cardReveal}>
                    <div className="group block w-full text-left bg-white rounded-[32px] border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-[0_34px_80px_-28px_rgba(10,74,68,0.5)] transition-all relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#ff9f00]/70 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      {content}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.section>

      <CTA/>
    </>
  )
}

export default Home
