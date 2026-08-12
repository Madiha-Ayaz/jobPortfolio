import React from 'react';
import { motion } from 'framer-motion';

const Backpack: React.FC<{ open: boolean; onClick?: () => void }> = ({ open, onClick }) => {
  return (
    <div className="w-64 sm:w-80 md:w-96 mx-auto relative">
      <motion.div
        className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl shadow-2xl p-4"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
        initial={false}
        animate={open ? { rotateX: -18, scale: 1.02 } : { rotateX: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-slate-900 rounded-b-lg shadow-inner" />
        <div className="w-full h-40 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-white font-bold text-lg"> 
          <span className="select-none">School Backpack</span>
        </div>
        <div className="mt-3 text-center text-sm text-text-secondary">Click the bag to open</div>
      </motion.div>
    </div>
  );
};

export default Backpack;
