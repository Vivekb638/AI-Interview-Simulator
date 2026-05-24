import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../ui';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 ${isScrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-display font-bold text-white tracking-tight">Interview<span className="text-violet-500">.ai</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link to={user?.role === 'Recruiter' || user?.role === 'Admin' ? '/recruiter/profile' : '/student/profile'}>
              <Button className="text-sm">Go to Profile <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-sm">Get Started <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-900 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-lg font-medium text-zinc-300">{link.name}</Link>
              ))}
              <hr className="border-zinc-900" />
              {isAuthenticated ? (
                <Link to={user?.role === 'Recruiter' || user?.role === 'Admin' ? '/recruiter/profile' : '/student/profile'} className="btn-primary w-full text-center py-3 rounded-xl bg-violet-600 text-white font-bold">
                  Go to Profile
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-lg font-medium text-zinc-300">Log in</Link>
                  <Link to="/signup" className="btn-primary w-full text-center py-3 rounded-xl bg-violet-600 text-white font-bold">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
