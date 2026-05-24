import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40",
    secondary: "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700",
    ghost: "bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white",
    danger: "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 ${hover ? 'hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'violet' }) => {
  const variants = {
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    zinc: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, error, type = 'text', className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2 w-full text-left">
      {label && <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>}
      <div className="relative">
        <input 
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-600 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};
