import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  LayoutGrid, 
  MessageSquare, 
  Zap, 
  Download,
  ArrowUpRight 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "Handwritten Notes",
      desc: "Comprehensive, topper-verified notes for all engineering & commerce subjects.",
      icon: <BookOpen className="w-7 h-7" />,
      color: "bg-orange-50 text-[#ff9f00]",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400", // Notebook vibe
      tag: "Most Popular",
      path: "/notes"
    },
    {
      title: "Previous Year Papers",
      desc: "Organized collection of university PYQs from the last 10 years with solutions.",
      icon: <FileText className="w-7 h-7" />,
      color: "bg-teal-50 text-[#0a4a44]",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400", // Exam vibe
      tag: "Essential",
      path: "/papers"
    },
    {
      title: "Subject Roadmap",
      desc: "Step-by-step guides on how to clear difficult subjects in less than 15 days.",
      icon: <LayoutGrid className="w-7 h-7" />,
      color: "bg-blue-50 text-blue-600",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400", // Strategy vibe
      tag: "New",
      path: "/subjects"
    }
  ];

  const features = [
    { name: "One-Click Download", icon: <Download size={20}/> },
    { name: "Doubt Support", icon: <MessageSquare size={20}/> },
    { name: "Daily Updates", icon: <Zap size={20}/> },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#ff9f00] mb-4">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[#0a4a44] leading-tight">
              Everything you need to <br/> 
              <span className="text-gray-300">Ace your Semester.</span>
            </h3>
          </div>
          <div className="flex gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm font-bold text-gray-500">
                <span className="text-[#0a4a44]">{f.icon}</span>
                {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              to={service.path}
              key={index} 
              className="group relative bg-white border border-gray-100 rounded-[40px] p-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image Container (Matches the right-side cards in your inspo) */}
              <div className="relative h-64 w-full overflow-hidden rounded-[32px] mb-6">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-[#0a4a44]">
                  {service.tag}
                </div>
                {/* Arrow Button */}
                <div className="absolute bottom-4 right-4 bg-[#ff9f00] text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" aria-hidden="true">
                  <ArrowUpRight size={24} />
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-4">
                <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6`}>
                  {service.icon}
                </div>
                <h4 className="text-2xl font-black text-[#0a4a44] mb-3">{service.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                  {service.desc}
                </p>
                
                <span className="mt-6 text-[#0a4a44] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Browse Section <Zap size={14} className="fill-[#ff9f00] text-[#ff9f00]" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-[#0a4a44] rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            <div className="z-10 text-center md:text-left">
                <h4 className="text-3xl font-black text-white mb-2">Can't find your subject?</h4>
                <p className="text-teal-100/60 font-medium">Request specific notes and our team will upload them within 24 hours.</p>
            </div>
            <Link to="/auth" className="z-10 mt-6 md:mt-0 bg-[#ff9f00] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#e68a00] transition shadow-xl shadow-black/20">
                Request Notes Now
            </Link>
            
            {/* Design elements to match Opndoo's abstract shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff9f00]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </div>

      </div>
    </section>
  );
};

export default Services;
