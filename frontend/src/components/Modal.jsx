import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050816]/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full ${maxWidth} bg-[#0B1026] border border-[#27325A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.15)] overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27325A] flex items-center justify-between bg-[#111936]">
          <h3 className="text-lg font-bold text-[#F8FAFC] tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151B3D] transition-colors border border-transparent hover:border-[#27325A]"
          >
            <X className="w-5 h-5 text-[#A855F7]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-[#CBD5E1]">
          {children}
        </div>

      </div>
    </div>
  );
};
