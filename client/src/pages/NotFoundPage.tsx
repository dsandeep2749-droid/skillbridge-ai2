import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.js';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#7C5CFC] p-0.5 shadow-xl">
        <div className="w-full h-full bg-[#11182B] rounded-[14px] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#38BDF8]" />
        </div>
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-white">404</h1>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          The requested page does not exist or has been relocated.
        </p>
      </div>
      <Link to="/">
        <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
