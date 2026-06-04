// import React from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

// const CTA = () => {
//   return (
//     <section className="py-20 px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Main CTA Container */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="relative bg-[#0a4a44] rounded-[60px] overflow-hidden p-8 md:p-20 text-center md:text-left shadow-2xl"
//         >
//           {/* Abstract Background Shapes (Opndoo Style) */}
//           <div className="absolute top-0 right-0 w-1/2 h-full bg-[#bef264]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
//           <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#ff9f00]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

//           <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12">
            
//             {/* LEFT SIDE: Text Content */}
//             <div>
//               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[#ff9f00] text-sm font-bold mb-6">
//                 <Sparkles size={16} />
//                 <span>Join 50,000+ Students Today</span>
//               </div>
              
//               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
//                 Stop Stressing, <br />
//                 <span className="text-[#ff9f00]">Start Excelling.</span>
//               </h2>
              
//               <p className="text-teal-100/70 text-lg mb-10 max-w-md leading-relaxed">
//                 Get instant access to curated notes, previous year papers, and a community of toppers. Your academic success is just one click away.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-[#ff9f00] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-black/20 flex items-center justify-center gap-3 transition-colors hover:bg-[#e68a00]"
//                 >
//                   Create Free Account <ArrowRight size={20} />
//                 </motion.button>
                
//                 <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
//                   <Zap size={20} className="text-[#ff9f00]" /> How it Works
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT SIDE: Visual Elements */}
//             <div className="relative hidden lg:block">
//               {/* Main Image in the "Hole" design like the inspo */}
//               <div className="relative z-10 w-full h-[400px] rounded-[50px] overflow-hidden border-[10px] border-white/5 shadow-inner">
//                  <img 
//                    src="https://images.unsplash.com/photo-1523240715630-974bb1ad1932?auto=format&fit=crop&q=80&w=600" 
//                    alt="Successful Student"
//                    className="w-full h-full object-cover"
//                  />
//               </div>

//               {/* Floating Success Card */}
//               <motion.div 
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -top-6 -right-6 bg-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4"
//               >
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
//                   <Star size={24} fill="currentColor" />
//                 </div>
//                 <div>
//                   <p className="text-[#0a4a44] font-black text-xl leading-none">98%</p>
//                   <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pass Rate</p>
//                 </div>
//               </motion.div>

//               {/* Floating Floating Notification */}
//               <motion.div 
//                 animate={{ y: [0, 15, 0] }}
//                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//                 className="absolute -bottom-10 left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3"
//               >
//                  <div className="w-8 h-8 bg-[#ff9f00] rounded-full" />
//                  <p className="text-white text-sm font-medium">New PYQs Uploaded 5m ago</p>
//               </motion.div>
//             </div>

//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CTA;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

const CompactCTA = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-[#0a4a44] rounded-[40px] overflow-hidden p-8 md:p-12 shadow-xl"
        >
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#bef264]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff9f00]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* TEXT SIDE */}
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[#ff9f00] text-xs font-bold mb-4">
                <Sparkles size={14} />
                <span>Join 50k+ Students</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Ready to Ace Your <br />
                <span className="text-[#ff9f00]">Semester Exams?</span>
              </h2>
              
              <p className="text-teal-100/70 text-sm md:text-base font-medium">
                Get instant access to topper notes and PYQs. <br className="hidden md:block"/>
                Your academic success is just one click away.
              </p>
            </div>

            {/* ACTION SIDE */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
               {/* Smaller Floating Indicator */}
               <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm mr-4"
              >
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                 <span className="text-white text-xs font-bold">1.2k Online Now</span>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/auth" className="bg-[#ff9f00] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 flex items-center gap-2 hover:bg-[#e68a00] transition-colors">
                  Join for Free <ArrowRight size={18} />
                </Link>
              </motion.div>
              
              <Link to="/services" className="text-white/60 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                <Zap size={16} className="text-[#ff9f00]" /> Explore All
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompactCTA;
