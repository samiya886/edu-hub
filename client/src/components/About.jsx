import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Trophy, Lightbulb } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Happy Students', value: '50K+', icon: <Users className="text-[#ff9f00]" /> },
    { label: 'Study Resources', value: '10K+', icon: <Trophy className="text-[#ff9f00]" /> },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Circle (matching the inspo style) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: Image Collage with Animations */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative z-10 rounded-[60px] rounded-tr-none overflow-hidden border-[12px] border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Students collaborating" 
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Overlapping Smaller Image */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-10 -right-10 z-20 w-64 h-64 rounded-[40px] border-[8px] border-white shadow-xl overflow-hidden hidden md:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400" 
                alt="Studying" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Rotating Badge (Like the "E-learning" circle in your inspo) */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 -left-10 z-20 w-32 h-32 hidden md:block"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                <text className="text-[10px] font-bold uppercase tracking-[2px] fill-[#0a4a44]">
                  <textPath xlinkHref="#circlePath">
                    Empowering Students • Success Driven •
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lightbulb className="text-[#ff9f00] w-8 h-8" />
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#ff9f00] font-black uppercase tracking-widest text-sm mb-4 block">
              Who We Are
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-[#0a4a44] leading-tight mb-6">
              Making Quality Education <br/>
              <span className="text-gray-300">Accessible To All.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              We started with a simple goal: to help college students navigate the chaos of semester exams. By providing structured notes, verified previous year papers, and roadmap guides, we ensure you spend less time searching and more time learning.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#0a4a44] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0a4a44]">Verified Content</h4>
                  <p className="text-sm text-gray-400">All notes are reviewed by toppers and professors.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#0a4a44] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0a4a44]">Zero Cost</h4>
                  <p className="text-sm text-gray-400">Free access to all fundamental study materials.</p>
                </div>
              </div>
            </div>

            {/* Stats Block */}
            <div className="flex flex-wrap gap-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#0a4a44]">{stat.value}</h3>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/about" className="mt-10 bg-[#0a4a44] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center">
                Learn More About Us
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
