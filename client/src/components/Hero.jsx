import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Star, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-[#0a4a44] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a4a44]/90 via-[#0a4a44]/70 to-[#0a4a44]/90" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT - UPDATED AS PER YOUR REQUEST */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Start your journey today
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1]">
              Empowering You <br />
              with Digital <span className="text-[#ff9f1c] relative">
                Skills
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="#ff9f1c" strokeWidth="2" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-white/90 max-w-lg leading-relaxed">
              Our platform makes education flexible and convenient, so you can 
              achieve your goals wherever and whenever you choose.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/notes" className="bg-[#ff9f1c] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-black/20 flex items-center gap-2 group hover:bg-[#f39200]">
                Browse Notes
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/papers" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 hover:bg-white/15">
                Exam Papers
                <FileText className="w-5 h-5" />
              </Link>
              <Link to="/services" className="text-white/80 hover:text-white px-2 py-4 font-bold transition-colors inline-flex items-center gap-2">
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social Proof / Reviews */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white object-cover"
                    src={`https://i.pravatar.cc/150?u=${i+10}`}
                    alt="User"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  1k+
                </div>
              </div>
              <div>
                <div className="flex text-[#ff9f1c] gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  <span className="text-white font-bold ml-2">(4.5)</span>
                </div>
                <p className="text-sm text-white/80 font-medium">1000+ Reviews of our course</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - UNCHANGED */}
          <div className="relative">
            {/* Main Large Image */}
            <div className="relative z-20 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/30">
              <img 
                src="https://img.freepik.com/premium-photo/back-school-children-getting-admission-school-class-room-school-view-4k-hd-wallpaper_1262886-2357.jpg"
                alt="Girl studying"
                className="w-full aspect-[4/4.5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Image 1 - Top Right */}
            <div className="absolute -top-8 -right-8 w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-30 hidden xl:block">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                alt="Girl working"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Image 2 - Bottom Left */}
            <div className="absolute -bottom-10 -left-8 w-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-30 hidden lg:block">
              <img 
                src="https://tse1.mm.bing.net/th/id/OIP.XH--SJ8TGJgYWwsALq5eggHaEK?pid=Api&P=0&h=180"
                alt="Girl coding"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
