import React from 'react';
import { 
  Plane, Sparkles, ArrowRight,
  Cpu, ArrowUpRight, 
  SlidersHorizontal, BarChart4, ChevronRight
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/flightConstants';
import flightHeroImg from '../assets/flight-hero.png';

export default function LandingPage({ onStartPredicting, onSelectRoute }) {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow gradients background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/25 to-purple-600/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Predict Flight Ticket Prices{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                  Before Booking
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Flight prices change rapidly based on timing, airlines, and stops. Our Machine Learning web application estimates ticket fares instantly so you always know if a price is reasonable before you pay.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onStartPredicting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
                >
                  <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Start Predicting Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-all duration-200"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">92%</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">Model Precision</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">6 Major</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">Airlines Supported</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 100ms</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">Instant Inference</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Airplane Image */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              
              {/* Radial glow background */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="relative w-full max-w-lg mx-auto">
                {/* Airplane & Globe 3D Graphic */}
                <div className="relative z-10 animate-float flex justify-center">
                  <img
                    src={flightHeroImg}
                    alt="Flight Price Prediction Plane & Globe"
                    className="w-full max-w-md h-auto object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.35)] hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Floating Smart Fare Pill Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 z-20 bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3.5 whitespace-nowrap">
                  <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Plane className="w-5 h-5 -rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">DEL ✈ BOM</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-bold">Best Value</span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-white">
                      ₹ 5,840 <span className="text-xs text-slate-400 font-normal">est. fare</span>
                    </div>
                  </div>
                  <button
                    onClick={onStartPredicting}
                    className="ml-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    Predict Now
                  </button>
                </div>

                {/* Floating AI Model Badge on top right */}
                <div className="hidden sm:flex absolute -top-3 -right-2 z-20 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl rounded-xl px-3 py-2 shadow-xl items-center gap-2 text-xs font-medium text-slate-200">
                  <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                  <span>AI Fare Engine Active</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (PRD SECTION 8 & 10) */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              How The Prediction Engine Works
            </h3>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              From entering your travel details to receiving an intelligent ticket price prediction in under a second.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/40 transition-all flex flex-col">
              <div className="text-4xl font-black text-slate-800 mb-4">01</div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">1. Enter Journey Details</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Choose your airline, source, destination, departure time slot, stops, class, and journey date.
              </p>
              <div className="mt-auto text-xs text-blue-400 font-medium">
                • 9 Key Flight Parameters
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/40 transition-all flex flex-col">
              <div className="text-4xl font-black text-slate-800 mb-4">02</div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">2. ML Model Computes Fare</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The Python backend receives inputs and passes them into our trained Random Forest Regressor pipeline.
              </p>
              <div className="mt-auto text-xs text-indigo-400 font-medium">
                • OneHot Encoding + Regression
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/40 transition-all flex flex-col">
              <div className="text-4xl font-black text-slate-800 mb-4">03</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6">
                <BarChart4 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">3. Instant Price & History</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Receive the estimated fare in ₹ INR with fare quality insights, saved automatically for future reference.
              </p>
              <div className="mt-auto text-xs text-emerald-400 font-medium">
                • Saved to Prediction History
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. POPULAR ROUTES SECTION */}
      <section id="popular-routes" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">
                Top Corridors
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                Popular Domestic Flight Routes
              </h3>
              <p className="mt-3 text-slate-400 text-base max-w-xl">
                Click any route below to immediately load it into the ML predictor and test estimated fares.
              </p>
            </div>
            <button
              onClick={onStartPredicting}
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Custom Route Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_ROUTES.map((route, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    {route.tag}
                  </span>
                  <span className="text-xs text-slate-400">{route.duration}</span>
                </div>

                <div className="flex items-center justify-between my-4">
                  <div>
                    <div className="text-2xl font-black text-white">{route.fromCode}</div>
                    <div className="text-xs text-slate-400">{route.from}</div>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <Plane className="w-4 h-4 text-blue-400" />
                    <div className="w-full h-0.5 bg-slate-800 mt-1" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{route.toCode}</div>
                    <div className="text-xs text-slate-400">{route.to}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">Typical Fare from</div>
                    <div className="text-lg font-bold text-white">{route.samplePrice}</div>
                  </div>

                  <button
                    onClick={() => onSelectRoute(route)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>Predict Fare</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-8 sm:p-14 text-center shadow-2xl overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-blue-900/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Ready to Find the Best Time to Fly?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
                Enter your journey parameters right now and get accurate price estimations generated by our Machine Learning engine.
              </p>

              <div className="mt-8">
                <button
                  onClick={onStartPredicting}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl hover:scale-105 active:scale-100 transition-all duration-200 cursor-pointer"
                >
                  <Plane className="w-5 h-5 text-blue-600 -rotate-45" />
                  <span>Launch Flight Price Predictor</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-500 -rotate-45" />
            <span className="font-bold text-slate-300">Flight Price Prediction System</span>
          </div>
          <div>
            © 2026 Flight Price Prediction System. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
