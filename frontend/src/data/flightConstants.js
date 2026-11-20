export const AIRLINES = [
  { id: 'Indigo', name: 'IndiGo', code: '6E', color: 'from-blue-600 to-indigo-700', badge: 'bg-blue-100 text-blue-800' },
  { id: 'Air_India', name: 'Air India', code: 'AI', color: 'from-red-600 to-orange-700', badge: 'bg-red-100 text-red-800' },
  { id: 'Vistara', name: 'Vistara', code: 'UK', color: 'from-purple-800 to-amber-700', badge: 'bg-purple-100 text-purple-800' },
  { id: 'SpiceJet', name: 'SpiceJet', code: 'SG', color: 'from-amber-500 to-red-600', badge: 'bg-amber-100 text-amber-800' },
  { id: 'AirAsia', name: 'AirAsia', code: 'I5', color: 'from-rose-500 to-red-600', badge: 'bg-rose-100 text-rose-800' },
  { id: 'GO_FIRST', name: 'GO FIRST', code: 'G8', color: 'from-blue-500 to-cyan-600', badge: 'bg-cyan-100 text-cyan-800' }
];

export const CITIES = [
  { id: 'Delhi', name: 'Delhi', code: 'DEL', airport: 'Indira Gandhi Intl (DEL)' },
  { id: 'Mumbai', name: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji Maharaj (BOM)' },
  { id: 'Bangalore', name: 'Bangalore', code: 'BLR', airport: 'Kempegowda Intl (BLR)' },
  { id: 'Kolkata', name: 'Kolkata', code: 'CCU', airport: 'Netaji Subhas Chandra Bose (CCU)' },
  { id: 'Hyderabad', name: 'Hyderabad', code: 'HYD', airport: 'Rajiv Gandhi Intl (HYD)' },
  { id: 'Chennai', name: 'Chennai', code: 'MAA', airport: 'Chennai Intl (MAA)' }
];

export const TIME_SLOTS = [
  { id: 'Early_Morning', label: 'Early Morning', window: '00:00 - 06:00' },
  { id: 'Morning', label: 'Morning', window: '06:00 - 12:00' },
  { id: 'Afternoon', label: 'Afternoon', window: '12:00 - 18:00' },
  { id: 'Evening', label: 'Evening', window: '18:00 - 21:00' },
  { id: 'Night', label: 'Night', window: '21:00 - 00:00' }
];

export const ARRIVAL_TIME_SLOTS = [
  { id: 'Early_Morning', label: 'Early Morning', window: '00:00 - 06:00' },
  { id: 'Morning', label: 'Morning', window: '06:00 - 12:00' },
  { id: 'Afternoon', label: 'Afternoon', window: '12:00 - 18:00' },
  { id: 'Evening', label: 'Evening', window: '18:00 - 21:00' },
  { id: 'Night', label: 'Night', window: '21:00 - 00:00' },
  { id: 'Late_Night', label: 'Late Night', window: '00:00 - 03:00' }
];

export const STOPS_OPTIONS = [
  { id: 'zero', label: 'Direct / Non-stop', desc: 'Fastest journey' },
  { id: 'one', label: '1 Stop', desc: 'Single layover' },
  { id: 'two_or_more', label: '2+ Stops', desc: 'Multi-city layovers' }
];

export const CLASS_OPTIONS = [
  { id: 'Economy', label: 'Economy Class', desc: 'Standard seating' },
  { id: 'Business', label: 'Business Class', desc: 'Premium luxury' }
];

// Typical non-stop durations in hours between city pairs
export const ROUTE_DURATIONS = {
  'Delhi-Mumbai': 2.15,
  'Mumbai-Delhi': 2.2,
  'Delhi-Bangalore': 2.75,
  'Bangalore-Delhi': 2.8,
  'Delhi-Kolkata': 2.1,
  'Kolkata-Delhi': 2.25,
  'Delhi-Hyderabad': 2.2,
  'Hyderabad-Delhi': 2.2,
  'Delhi-Chennai': 2.8,
  'Chennai-Delhi': 2.85,
  'Mumbai-Bangalore': 1.6,
  'Bangalore-Mumbai': 1.65,
  'Mumbai-Kolkata': 2.65,
  'Kolkata-Mumbai': 2.75,
  'Mumbai-Chennai': 1.85,
  'Chennai-Mumbai': 1.9,
  'Mumbai-Hyderabad': 1.4,
  'Hyderabad-Mumbai': 1.45,
};

export const POPULAR_ROUTES = [
  {
    from: 'Delhi',
    to: 'Mumbai',
    fromCode: 'DEL',
    toCode: 'BOM',
    duration: '2h 10m',
    samplePrice: '₹ 5,400',
    airline: 'IndiGo',
    airlineId: 'Indigo',
    airlineCode: '6E',
    tag: 'Busiest Corridor'
  },
  {
    from: 'Delhi',
    to: 'Bangalore',
    fromCode: 'DEL',
    toCode: 'BLR',
    duration: '2h 45m',
    samplePrice: '₹ 6,850',
    airline: 'Vistara',
    airlineId: 'Vistara',
    airlineCode: 'UK',
    tag: 'Tech Hub Route'
  },
  {
    from: 'Delhi',
    to: 'Kolkata',
    fromCode: 'DEL',
    toCode: 'CCU',
    duration: '2h 15m',
    samplePrice: '₹ 4,950',
    airline: 'SpiceJet',
    airlineId: 'SpiceJet',
    airlineCode: 'SG',
    tag: 'East Corridor'
  },
  {
    from: 'Mumbai',
    to: 'Bangalore',
    fromCode: 'BOM',
    toCode: 'BLR',
    duration: '1h 40m',
    samplePrice: '₹ 3,920',
    airline: 'AirAsia',
    airlineId: 'AirAsia',
    airlineCode: 'I5',
    tag: 'Quick Commute'
  },
  {
    from: 'Delhi',
    to: 'Hyderabad',
    fromCode: 'DEL',
    toCode: 'HYD',
    duration: '2h 15m',
    samplePrice: '₹ 5,100',
    airline: 'Air India',
    airlineId: 'Air_India',
    airlineCode: 'AI',
    tag: 'Central Hub'
  },
  {
    from: 'Delhi',
    to: 'Chennai',
    fromCode: 'DEL',
    toCode: 'MAA',
    duration: '2h 50m',
    samplePrice: '₹ 5,750',
    airline: 'IndiGo',
    airlineId: 'Indigo',
    airlineCode: '6E',
    tag: 'Coastal Route'
  }
];
