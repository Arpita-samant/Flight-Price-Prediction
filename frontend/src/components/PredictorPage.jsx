import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plane, Calendar, Clock, ArrowRight, ArrowLeftRight, Sparkles, 
  RefreshCw, History, ChevronLeft, 
  Trash2, Download, AlertTriangle, Info, Database
} from 'lucide-react';
import { 
  AIRLINES, CITIES, TIME_SLOTS, ARRIVAL_TIME_SLOTS, 
  STOPS_OPTIONS, CLASS_OPTIONS, ROUTE_DURATIONS 
} from '../data/flightConstants';
import { 
  predictFlightPrice, fetchPredictionHistory, 
  clearAllPredictionHistory 
} from '../utils/predictionService';

const TODAY_STRING = new Date().toISOString().split('T')[0];

function getEstimatedDuration(source, destination, stops) {
  const routeKey = `${source}-${destination}`;
  const reverseKey = `${destination}-${source}`;
  const base = ROUTE_DURATIONS[routeKey] || ROUTE_DURATIONS[reverseKey] || 2.5;
  let adjusted = base;
  if (stops === 'one') adjusted += 2.0;
  if (stops === 'two_or_more') adjusted += 4.5;
  return parseFloat(adjusted.toFixed(2));
}

export default function PredictorPage({ onBackToHome, initialRoute }) {
  // Calculate default travel date (15 days from today)
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  };

  const initialSource = initialRoute?.from || 'Delhi';
  const initialDest = initialRoute?.to || 'Mumbai';
  const initialStops = 'zero';

  // Form State
  const [formData, setFormData] = useState({
    airline: initialRoute?.airlineId || 'Indigo',
    source_city: initialSource,
    destination_city: initialDest,
    departure_time: 'Morning',
    arrival_time: 'Afternoon',
    stops: initialStops,
    class: 'Economy',
    duration: getEstimatedDuration(initialSource, initialDest, initialStops),
    travel_date: getDefaultDate(),
    days_left: 15
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prediction history from Flask MySQL backend
  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetchPredictionHistory();
      setHistory(res.history || []);
      setIsDbConnected(Boolean(res.fromDb));
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistoryError('Could not load prediction history from database.');
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchPredictionHistory()
      .then((res) => {
        if (active) {
          setHistory(res.history || []);
          setIsDbConnected(Boolean(res.fromDb));
          setIsHistoryLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Failed to load history:', err);
          setHistoryError('Could not load prediction history from database.');
          setIsHistoryLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Sync date and days_left
  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = selected - today;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    setFormData(prev => ({
      ...prev,
      travel_date: e.target.value,
      days_left: diffDays
    }));
  };

  const handleDaysLeftChange = (e) => {
    const days = parseInt(e.target.value, 10) || 1;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    setFormData(prev => ({
      ...prev,
      days_left: days,
      travel_date: targetDate.toISOString().split('T')[0]
    }));
  };

  // Swap source and destination
  const handleSwapCities = () => {
    setFormData(prev => ({
      ...prev,
      source_city: prev.destination_city,
      destination_city: prev.source_city,
      duration: getEstimatedDuration(prev.destination_city, prev.source_city, prev.stops)
    }));
  };

  const handleSourceChange = (source) => {
    setFormData(prev => ({
      ...prev,
      source_city: source,
      duration: getEstimatedDuration(source, prev.destination_city, prev.stops)
    }));
  };

  const handleDestChange = (dest) => {
    setFormData(prev => ({
      ...prev,
      destination_city: dest,
      duration: getEstimatedDuration(prev.source_city, dest, prev.stops)
    }));
  };

  const handleStopsChange = (stops) => {
    setFormData(prev => ({
      ...prev,
      stops,
      duration: getEstimatedDuration(prev.source_city, prev.destination_city, stops)
    }));
  };

  // Submit prediction to ML engine
  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    
    if (formData.source_city === formData.destination_city) {
      setError('Origin and Destination cities cannot be the same!');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await predictFlightPrice(formData);
      
      const enrichedResult = {
        ...result,
        ...formData,
        predictedPrice: result.price,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setPredictionResult(enrichedResult);

      // Refresh history from MySQL backend immediately
      await loadHistory();

    } catch (err) {
      setError('Failed to calculate price prediction: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      airline: 'Indigo',
      source_city: 'Delhi',
      destination_city: 'Mumbai',
      departure_time: 'Morning',
      arrival_time: 'Afternoon',
      stops: 'zero',
      class: 'Economy',
      duration: 2.15,
      travel_date: getDefaultDate(),
      days_left: 15
    });
    setPredictionResult(null);
    setError(null);
  };

  // Clear history from database and local state
  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your prediction history?')) {
      setIsHistoryLoading(true);
      await clearAllPredictionHistory();
      await loadHistory();
    }
  };

  // Export history to JSON
  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flight_predictions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Selected airline helper
  const selectedAirlineObj = AIRLINES.find(a => a.id === formData.airline) || AIRLINES[0];

  // Price tier evaluator
  const getPriceTier = (price, flightClass) => {
    if (flightClass === 'Business') {
      if (price < 18000) return { label: 'Great Business Deal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      if (price < 28000) return { label: 'Standard Business Fare', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      return { label: 'Peak Business Fare', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
    if (price < 5000) return { label: 'Exceptional Value 🟢', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (price < 8500) return { label: 'Average Market Fare 🟡', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    return { label: 'High Demand Surge 🔴', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header / Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-2 cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Landing Page</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>Flight Price Predictor</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                ML Interface
              </span>
            </h1>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-300 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className={`grid grid-cols-1 ${predictionResult ? 'lg:grid-cols-12 gap-8' : 'max-w-3xl mx-auto'} items-start`}>
          
          {/* ================= LEFT / INPUT FORM ================= */}
          <div className={`${predictionResult ? 'lg:col-span-7' : 'w-full'} bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl`}>
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <span>Enter Flight Parameters</span>
                </h2>
                <p className="text-xs text-slate-400">Fill in the 6 parameters required by the ML model.</p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">

              {/* 1. SOURCE & DESTINATION CITIES (WITH SWAP BUTTON) */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                {/* Source City */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Source City (From)
                  </label>
                  <select
                    value={formData.source_city}
                    onChange={(e) => handleSourceChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="sm:col-span-1 flex justify-center py-1 sm:py-0 sm:pt-6">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    title="Swap Route"
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination City */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Destination City (To)
                  </label>
                  <select
                    value={formData.destination_city}
                    onChange={(e) => handleDestChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. AIRLINE SELECTION */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Airline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AIRLINES.map((airline) => {
                    const isSelected = formData.airline === airline.id;
                    return (
                      <button
                        type="button"
                        key={airline.id}
                        onClick={() => setFormData({ ...formData, airline: airline.id })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{airline.name}</div>
                          <div className="text-[10px] text-slate-400">{airline.code} Flight</div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. TRAVEL DATE & DAYS LEFT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Travel Date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.travel_date}
                    min={TODAY_STRING}
                    onChange={handleDateChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Days Left Before Flight</span>
                    </label>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {formData.days_left} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={formData.days_left}
                    onChange={handleDaysLeftChange}
                    className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 day (Last-minute)</span>
                    <span>25 days</span>
                    <span>50 days (Advance)</span>
                  </div>
                </div>
              </div>

              {/* 4. TIME SLOTS (DEPARTURE & ARRIVAL) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Departure Time */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Departure Time Slot
                  </label>
                  <select
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.window})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrival Time */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Arrival Time Slot
                  </label>
                  <select
                    value={formData.arrival_time}
                    onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    {ARRIVAL_TIME_SLOTS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.window})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. STOPS & CABIN CLASS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stops */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Number of Stops
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STOPS_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleStopsChange(opt.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          formData.stops === opt.id
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cabin Class
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CLASS_OPTIONS.map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setFormData({ ...formData, class: c.id })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          formData.class === c.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500'
                            : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. DURATION (HOURS) */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Estimated Flight Duration</span>
                  </span>
                  <span className="text-sm font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    {formData.duration} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="0.25"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Adjust based on flight schedule (direct flights are typically 1.5 - 3 hours).
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                    <span>Processing ML Model Prediction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Predict Flight Price Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* ================= RIGHT / PREDICTION RESULTS ================= */}
          {predictionResult && (
            <div className="lg:col-span-5 space-y-6">
              
              {/* MAIN PREDICTION RESULT CARD */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                
                {/* Decorative accent top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">
                    Predicted Ticket Price
                  </span>
                  
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getPriceTier(predictionResult.predictedPrice, predictionResult.class).color}`}>
                    {getPriceTier(predictionResult.predictedPrice, predictionResult.class).label}
                  </span>
                </div>

                <div>
                  {/* Price display */}
                  <div className="my-3">
                    <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-300">
                      ₹ {predictionResult.predictedPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      One-way estimated fare inclusive of standard airline taxes
                    </div>
                  </div>

                  {/* Flight Summary Pill Box */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Route:</span>
                      <span className="font-bold text-white">
                        {predictionResult.source_city} ➔ {predictionResult.destination_city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Airline:</span>
                      <span className="font-semibold text-white">{selectedAirlineObj.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Date of Travel:</span>
                      <span className="font-semibold text-white">{predictionResult.travel_date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Cabin & Stops:</span>
                      <span className="font-semibold text-blue-300">
                        {predictionResult.class} • {predictionResult.stops === 'zero' ? 'Non-stop' : `${predictionResult.stops} stop`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Time Window:</span>
                      <span className="font-medium text-slate-300">
                        Depart: {predictionResult.departure_time} | Arrive: {predictionResult.arrival_time}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Insight */}
                  <div className="mt-5 p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-300">Smart Booking Tip: </span>
                      {predictionResult.days_left < 7 
                        ? 'You are booking within 7 days of travel. Fares are at surge peak. If dates are flexible, shifting by 1-2 weeks could save up to 30%.'
                        : predictionResult.days_left > 35
                        ? 'Advance booking detected! You are locked into early-bird pricing tiers with significant savings.'
                        : 'You are within the prime 15-30 day booking window with balanced demand and inventory.'}
                    </div>
                  </div>

                  {/* Engine Source Badge */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Inference Source:</span>
                    <span className={`font-medium ${predictionResult.isLiveBackend ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {predictionResult.source}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ================= PREDICTION HISTORY SECTION (PRD SECTION 5 & 7) ================= */}
        <div className="mt-12 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <span>Prediction History</span>
                </h2>
                {isDbConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    MySQL Database
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    <Database className="w-3 h-3 text-slate-400" />
                    Local Storage
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Saved records from your previous price queries (retrieved from MySQL table).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadHistory}
                disabled={isHistoryLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh history from MySQL database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHistoryLoading ? 'animate-spin text-blue-400' : ''}`} />
                <span>Refresh</span>
              </button>

              {history.length > 0 && (
                <>
                  <button
                    onClick={handleExportHistory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/20 hover:bg-rose-900/40 text-rose-300 text-xs font-medium border border-rose-500/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* History Error Notification */}
          {historyError && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{historyError}</span>
              </div>
              <button onClick={loadHistory} className="underline hover:text-white font-medium cursor-pointer">
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {isHistoryLoading && history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              <span>Loading prediction history from MySQL...</span>
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Airline</th>
                    <th className="py-3 px-3">Prediction Time</th>
                    <th className="py-3 px-3">Days Left</th>
                    <th className="py-3 px-3">Class & Stops</th>
                    <th className="py-3 px-3 text-right">Predicted Fare</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-white">
                        {record.source || record.source_city} ➔ {record.destination || record.destination_city}
                      </td>
                      <td className="py-3.5 px-3">{record.airline}</td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {record.created_at ? (
                          <div>
                            <div className="text-white font-medium">{record.created_at.split(' ')[0]}</div>
                            <div className="text-[10px] text-slate-500">{record.created_at.split(' ')[1] || ''}</div>
                          </div>
                        ) : (
                          record.travelDate || 'N/A'
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">
                          {record.daysLeft ?? record.days_left ?? 15}d
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {record.flightClass || record.travel_class} • {record.stops === 'zero' ? 'Non-stop' : record.stops}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-400 text-sm">
                        ₹ {(record.price ?? record.predicted_price)?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              airline: record.airline,
                              source_city: record.source || record.source_city,
                              destination_city: record.destination || record.destination_city,
                              stops: record.stops,
                              class: record.flightClass || record.travel_class || 'Economy',
                              days_left: record.daysLeft ?? record.days_left ?? 15
                            }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          Reload
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
              No flight predictions recorded yet in MySQL. Run a prediction above to build your history!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
