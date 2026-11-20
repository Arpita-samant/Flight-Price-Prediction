import React from 'react';
import { Plane, Sparkles, Home } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300">
            <Plane className="w-6 h-6 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                SkyPredict
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                ML AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Flight Price Prediction System
            </p>
          </div>
        </div>

        {/* Center Nav Links for Landing Page */}
        {currentPage === 'landing' && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#popular-routes" className="hover:text-blue-400 transition-colors">
              Popular Routes
            </a>
          </div>
        )}

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          {currentPage === 'landing' ? (
            <button
              onClick={() => onNavigate('predictor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Predict Flight Price</span>
              <span className="hidden sm:inline">→</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
