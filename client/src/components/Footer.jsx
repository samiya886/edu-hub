import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Mail 
} from 'lucide-react';   // Keeping only non-brand icons

// Import social icons from react-icons
import { 
  FaInstagram, 
  FaXTwitter,      // New X (Twitter) icon
  FaLinkedin 
} from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      { name: 'Study Notes', href: '/notes' },
      { name: 'PYQ Bank', href: '/papers' },
      { name: 'Subject Guides', href: '/subjects' },
      { name: 'Semester Roadmaps', href: '/roadmaps' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'Contribute Notes', href: '/upload' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Copyright Info', href: '/copyright' },
    ]
  };

  return (
    <footer className="bg-[#0a4a44] rounded-t-[60px] pt-20 pb-10 px-6 text-white overflow-hidden relative">
      
      {/* Background Decorative Shape */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* COLUMN 1: Logo & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg">
                <GraduationCap className="text-[#0a4a44] w-6 h-6" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Edu<span className="text-[#ff9f00]">Hub</span>
              </span>
            </div>

            <p className="text-teal-100/60 leading-relaxed text-sm max-w-xs font-medium">
              Empowering college students with topper-verified study materials and previous year papers to ace every semester.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-white/10 p-2 rounded-xl hover:bg-[#ff9f00] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="bg-white/10 p-2 rounded-xl hover:bg-[#ff9f00] hover:text-white transition-all"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>

              <a
                href="#"
                className="bg-white/10 p-2 rounded-xl hover:bg-[#ff9f00] hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* COLUMN 2 & 3: Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-teal-100/60 hover:text-[#ff9f00] text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-teal-100/60 hover:text-[#ff9f00] text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Updated</h4>

            <p className="text-teal-100/60 text-sm mb-6 font-medium">
              Get the latest notes and exam updates delivered to your inbox.
            </p>

            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-[#ff9f00] transition-colors"
              />

              <button className="absolute right-2 top-2 bg-[#ff9f00] text-white p-2.5 rounded-xl hover:bg-[#e68a00] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 text-teal-100/40 text-xs">
              <Mail size={14} />
              <span>support@eduhub.com</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="text-teal-100/40 text-xs font-medium">
            © {currentYear} EduHub Education Private Limited. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-teal-100/40 hover:text-white text-xs transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1 text-teal-100/40 text-xs font-medium">
            Made with{' '}
            {/* <Heart
              size={12}
              className="text-red-400 fill-red-400"
            />{' '} */}
            for Students
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;