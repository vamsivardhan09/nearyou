import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, X, Calendar, MapPin, Clock, Eye, Trash2, Database, ArrowLeft, User, Phone, Lock, Users, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface SavedBooking {
  id: string;
  recipientName: string;
  targetDate: string;
  message: string;
  location: string;
  budget: string;
  whatsappNumber?: string;
  recipientEmail?: string;
  extraText1?: string;
  extraSelect1?: string;
  surpriseTitle: string;
  surpriseType: 'digital' | 'real-world';
  price: number;
  paymentMethod: string;
  utrNumber?: string;
  paymentScreenshot?: string;
  appliedDiscountCode?: string;
  status: 'Pending Verification' | 'Approved' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface RegisterUser {
  id: string;
  fullName: string;
  phone: string;
}

export function AdminScreen() {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('nearyou_admin_logged_in') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [users, setUsers] = useState<RegisterUser[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'users'>('bookings');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<SavedBooking | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);

  // Load Bookings & Users from Supabase AND localStorage, merging both
  const loadData = async () => {
    try {
      // 1. Fetch Bookings — merge Supabase + localStorage
      let supabaseBookings: SavedBooking[] = [];
      let localBookings: SavedBooking[] = [];
      let supabaseAvailable = false;

      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('nearyou_bookings')
          .select('*');
          
        if (!error && data) {
          supabaseAvailable = true;
          supabaseBookings = (data as SavedBooking[]).map(b => ({
            ...b,
            price: typeof b.price === 'number' ? b.price : Number(b.price) || 0,
          }));
        } else if (error) {
          console.warn('Supabase bookings query failed:', error.message);
        }
      } catch (dbErr) {
        console.warn('Failed to connect to Supabase for bookings:', dbErr);
      }

      // Always load localStorage too
      try {
        const storedBookings = localStorage.getItem('nearyou_bookings');
        if (storedBookings) {
          const parsed = JSON.parse(storedBookings);
          if (Array.isArray(parsed)) {
            localBookings = parsed;
          }
        }
      } catch (parseErr) {
        console.warn('Failed to parse local bookings:', parseErr);
      }

      // Merge & deduplicate by ID (Supabase takes priority)
      const bookingMap = new Map<string, SavedBooking>();
      if (Array.isArray(localBookings)) {
        localBookings.forEach(b => {
          if (b && b.id) bookingMap.set(b.id, b);
        });
      }
      if (Array.isArray(supabaseBookings)) {
        supabaseBookings.forEach(b => {
          if (b && b.id) bookingMap.set(b.id, b);
        });
      }
      const mergedBookings = Array.from(bookingMap.values());

      // Sort safely
      mergedBookings.sort((a, b) => {
        const dateA = a.createdAt || '';
        const dateB = b.createdAt || '';
        try {
          return dateB.localeCompare(dateA);
        } catch {
          return 0;
        }
      });

      setBookings(mergedBookings);

      // Sync: push any local-only bookings to Supabase
      if (supabaseAvailable && Array.isArray(localBookings)) {
        const supabaseIds = new Set(supabaseBookings.map(b => b.id));
        const localOnly = localBookings.filter(b => !supabaseIds.has(b.id));
        if (localOnly.length > 0) {
          try {
            // Sanitize bookings: remove paymentScreenshot (too large for DB)
            const sanitized = localOnly.map(b => ({
              ...b,
              paymentScreenshot: b.paymentScreenshot && b.paymentScreenshot.length > 5000 
                ? null 
                : b.paymentScreenshot,
            }));
            await supabase.from('nearyou_bookings').upsert(sanitized, { onConflict: 'id' });
            console.log(`Synced ${localOnly.length} local-only booking(s) to Supabase`);
          } catch (syncErr) {
            console.warn('Failed to sync local bookings to Supabase:', syncErr);
          }
        }
      }

      // 2. Fetch Users — same merge approach
      let supabaseUsers: RegisterUser[] = [];
      let localUsers: RegisterUser[] = [];

      try {
        const { data, error } = await supabase
          .from('nearyou_all_users')
          .select('*');
          
        if (!error && data) {
          supabaseUsers = data as RegisterUser[];
        }
      } catch (dbErr) {
        console.warn('Failed to load users from Supabase:', dbErr);
      }

      try {
        const storedUsers = localStorage.getItem('nearyou_all_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed)) {
            localUsers = parsed;
          }
        }
      } catch (parseErr) {
        console.warn('Failed to parse local users:', parseErr);
      }

      // Merge users
      const userMap = new Map<string, RegisterUser>();
      if (Array.isArray(localUsers)) {
        localUsers.forEach(u => {
          if (u && u.id) userMap.set(u.id, u);
        });
      }
      if (Array.isArray(supabaseUsers)) {
        supabaseUsers.forEach(u => {
          if (u && u.id) userMap.set(u.id, u);
        });
      }
      const mergedUsers = Array.from(userMap.values());

      if (mergedUsers.length === 0) {
        // Fallback default mock user database
        const defaultUsers = [
          { id: 'local_1', fullName: 'Harsha Vardhan', phone: '9876543210' },
          { id: 'local_2', fullName: 'Priya Sharma', phone: '9123456789' },
          { id: 'local_3', fullName: 'Rohan Verma', phone: '8877665544' }
        ];
        localStorage.setItem('nearyou_all_users', JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
      } else {
        setUsers(mergedUsers);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
      // Auto-refresh every 15 seconds to pick up new bookings
      const interval = setInterval(loadData, 15000);
      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      sessionStorage.setItem('nearyou_admin_logged_in', 'true');
      setIsAdminLoggedIn(true);
    } else {
      setLoginError('Invalid Administrator credentials. Try admin / admin');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem('nearyou_admin_logged_in');
    setIsAdminLoggedIn(false);
  };

  // Update Status
  const updateStatus = async (id: string, newStatus: SavedBooking['status']) => {
    try {
      // Update in Supabase
      try {
        const { error } = await supabase
          .from('nearyou_bookings')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) console.warn('Failed to update status in Supabase:', error.message);
      } catch (dbErr) {
        console.warn('Supabase status update error:', dbErr);
      }

      // Update local storage
      const stored = localStorage.getItem('nearyou_bookings');
      if (stored) {
        const list: SavedBooking[] = JSON.parse(stored);
        const updated = list.map(b => b.id === id ? { ...b, status: newStatus } : b);
        localStorage.setItem('nearyou_bookings', JSON.stringify(updated));
      }
      
      // Update state
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Booking
  const deleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      // Delete from Supabase
      try {
        const { error } = await supabase.from('nearyou_bookings').delete().eq('id', id);
        if (error) console.warn('Failed to delete booking in Supabase:', error.message);
      } catch (dbErr) {
        console.warn('Supabase delete booking error:', dbErr);
      }

      // Delete from local storage
      const stored = localStorage.getItem('nearyou_bookings');
      if (stored) {
        const list: SavedBooking[] = JSON.parse(stored);
        const updated = list.filter(b => b.id !== id);
        localStorage.setItem('nearyou_bookings', JSON.stringify(updated));
      }
      
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelectedBooking(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete User Profile
  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile?')) return;
    try {
      // Delete from Supabase
      try {
        const { error } = await supabase.from('nearyou_all_users').delete().eq('id', id);
        if (error) console.warn('Failed to delete user in Supabase:', error.message);
      } catch (dbErr) {
        console.warn('Supabase delete user error:', dbErr);
      }

      // Delete from local storage
      const stored = localStorage.getItem('nearyou_all_users');
      if (stored) {
        const list: RegisterUser[] = JSON.parse(stored);
        const updated = list.filter(u => u.id !== id);
        localStorage.setItem('nearyou_all_users', JSON.stringify(updated));
      }
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Seed Mock Bookings
  const seedMockBookings = async () => {
    const mockBookings: SavedBooking[] = [
      {
        id: 'NY-882312',
        recipientName: 'Harsha Vardhan',
        targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        message: 'Happy birthday champ! Stay amazing.',
        location: 'Indiranagar, Bangalore',
        budget: 'premium',
        whatsappNumber: '+91 98765 43210',
        surpriseTitle: 'Live Singer Doorstep',
        surpriseType: 'real-world',
        price: 1998,
        paymentMethod: 'upi (Manual UPI Verification)',
        utrNumber: '654321098765',
        appliedDiscountCode: 'SURPRISE10',
        status: 'Pending Verification',
        createdAt: new Date(Date.now() - 3600000 * 2).toLocaleString()
      },
      {
        id: 'NY-471209',
        recipientName: 'Priya Sharma',
        targetDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        message: 'Looking forward to our movie date!',
        location: 'PVR Nexus Mall, Bangalore',
        budget: 'grand',
        extraText1: 'MARRY ME PRIYA!',
        surpriseTitle: 'Cinema Theater Surprise',
        surpriseType: 'real-world',
        price: 6998,
        paymentMethod: 'card (Auto Success)',
        status: 'Approved',
        createdAt: new Date(Date.now() - 3600000 * 5).toLocaleString()
      },
      {
        id: 'NY-229124',
        recipientName: 'Rohan Verma',
        targetDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        message: 'Congrats on your new job!',
        location: 'Digital Delivery',
        budget: 'base',
        recipientEmail: 'rohan.verma@email.com',
        surpriseTitle: 'WhatsApp Surprise',
        surpriseType: 'digital',
        price: 99,
        paymentMethod: 'upi (Auto Success)',
        status: 'Completed',
        createdAt: new Date(Date.now() - 86400000 * 2).toLocaleString()
      }
    ];

    // Seed to Supabase (non-blocking, fails gracefully)
    try {
      await supabase.from('nearyou_bookings').insert(mockBookings);
    } catch (dbErr) {
      console.warn('Failed to seed mock bookings in Supabase:', dbErr);
    }

    localStorage.setItem('nearyou_bookings', JSON.stringify(mockBookings));
    setBookings(mockBookings);
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  // Render Login Panel
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fdfbf8' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[32px] p-8 border border-black/5 shadow-2xl relative"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-normal text-2xl text-[#2d2520]">Admin Control Login</h1>
            <p className="font-light text-xs text-[#8a7968] mt-1">Access all user accounts, transactions, and booking configurations.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Admin Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                <input 
                  type="text" 
                  placeholder="Enter administrator username" 
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl text-xs font-medium outline-none border border-black/10 focus:border-[#d4a574]"
                  style={{ background: '#fafafa' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                <input 
                  type="password" 
                  placeholder="Enter secure password" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl text-xs font-medium outline-none border border-black/10 focus:border-[#d4a574]"
                  style={{ background: '#fafafa' }}
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 text-[11px] font-semibold text-center text-red-600 bg-red-50 border border-red-100 rounded-xl">
                ⚠️ {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 rounded-2xl text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-[#d4a574]/10 transition"
              style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
            >
              Verify Credentials
            </button>
          </form>

          <button 
            onClick={() => window.location.href = '/home'}
            className="w-full mt-4 py-3 rounded-2xl border border-black/5 text-[#8a7968] hover:bg-black/5 text-xs font-medium transition"
          >
            Return to User Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: '#fdfbf8' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-black/5 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = '/home'} className="p-2.5 rounded-full bg-white border border-black/5 text-[#8a7968] hover:text-[#2d2520] transition shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#d4a574]" />
                <h1 className="font-normal text-2xl text-[#2d2520]">Admin Control Center</h1>
              </div>
              <p className="font-light text-xs text-[#8a7968] mt-0.5">Manage user bookings, verify transaction receipts, and control surprise statuses.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={loadData}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <button 
              onClick={seedMockBookings}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#d4a574]/10 border border-[#d4a574]/20 text-[#d4a574] hover:bg-[#d4a574]/20 transition flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              Seed Demo Data
            </button>
            <button 
              onClick={handleAdminLogout}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Admin Logout
            </button>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex gap-4 border-b border-black/5 pb-4 mb-6">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-2 text-sm font-semibold transition ${activeTab === 'bookings' ? 'text-[#d4a574] border-b-2 border-[#d4a574]' : 'text-[#8a7968] hover:text-[#2d2520]'}`}
          >
            🎟️ Booking Orders ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-sm font-semibold transition ${activeTab === 'users' ? 'text-[#d4a574] border-b-2 border-[#d4a574]' : 'text-[#8a7968] hover:text-[#2d2520]'}`}
          >
            👥 Registered Users ({users.length})
          </button>
        </div>

        {activeTab === 'bookings' ? (
          /* Dashboard Grid - Bookings */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Bookings List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {([
                  { id: 'all', label: 'All Bookings' },
                  { id: 'Pending Verification', label: 'Pending Verification' },
                  { id: 'Approved', label: 'Approved' },
                  { id: 'Completed', label: 'Completed' },
                  { id: 'Cancelled', label: 'Cancelled' }
                ] as const).map(tab => {
                  const active = filterStatus === tab.id;
                  const count = tab.id === 'all' ? bookings.length : bookings.filter(b => b.status === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`text-xs px-4 py-2 rounded-full font-medium whitespace-nowrap transition border flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#d4a574] text-white border-[#d4a574]'
                          : 'bg-white text-[#8a7968] border-black/5 hover:border-black/10'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-black/5 text-[#8a7968]'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-sm">
                    <p className="text-sm font-medium text-[#8a7968]">No bookings found matching this filter.</p>
                    <p className="text-xs font-light text-[#8a7968] mt-1">Book a surprise from the home screen or click "Seed Demo Data" to test.</p>
                  </div>
                ) : (
                  filteredBookings.map(booking => {
                    return (
                      <div 
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className={`p-5 rounded-3xl bg-white border transition cursor-pointer hover:-translate-y-0.5 ${
                          selectedBooking?.id === booking.id
                            ? 'border-[#d4a574] shadow-md'
                            : 'border-black/5 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#8a7968]">{booking.id}</span>
                              <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                                booking.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : booking.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : booking.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <h3 className="font-normal text-base text-[#2d2520] mt-1.5">
                              {booking.surpriseTitle} <span className="text-xs font-light text-[#8a7968]">for {booking.recipientName}</span>
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 items-center mt-3 text-xs text-[#8a7968] font-light">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#d4a574]" />
                                {booking.targetDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#d4a574]" />
                                {booking.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/5">
                            <div className="text-right">
                              <span className="text-xs text-[#8a7968] font-light block">Total Price</span>
                              <span className="text-sm font-semibold text-[#e8573a]">₹{booking.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button className="p-2 rounded-full bg-[#d4a574]/10 text-[#d4a574] hover:bg-[#d4a574]/20 transition">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Details Sidebar Panel */}
            <div className="lg:col-span-1">
              {selectedBooking ? (
                <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-md sticky top-6 space-y-6">
                  
                  {/* Panel Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#8a7968]">{selectedBooking.id}</span>
                      <h3 className="font-normal text-lg text-[#2d2520] mt-0.5">{selectedBooking.surpriseTitle}</h3>
                      <span className="text-[10px] text-[#8a7968] block mt-1">Booked on: {selectedBooking.createdAt}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="p-1 rounded-full bg-black/5 text-[#8a7968] hover:bg-black/10 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4 text-xs">
                    
                    {/* Client Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2 border border-slate-100">
                      <span className="text-[10px] font-semibold text-[#8a7968] uppercase tracking-wider block">Recipient Info</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="text-[#8a7968] block text-[10px]">Name</span>
                          <span className="font-medium text-[#2d2520]">{selectedBooking.recipientName}</span>
                        </div>
                        {selectedBooking.whatsappNumber && (
                          <div>
                            <span className="text-[#8a7968] block text-[10px]">WhatsApp</span>
                            <span className="font-medium text-[#2d2520]">{selectedBooking.whatsappNumber}</span>
                          </div>
                        )}
                        {selectedBooking.recipientEmail && (
                          <div className="col-span-2">
                            <span className="text-[#8a7968] block text-[10px]">Email</span>
                            <span className="font-medium text-[#2d2520]">{selectedBooking.recipientEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Setup Fields */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2 border border-slate-100">
                      <span className="text-[10px] font-semibold text-[#8a7968] uppercase tracking-wider block">Surprise Context</span>
                      <div className="space-y-1.5">
                        {selectedBooking.message && (
                          <div>
                            <span className="text-[#8a7968] block text-[10px]">Message/Script</span>
                            <p className="font-medium text-[#2d2520] bg-white p-2 rounded-lg border border-black/5 mt-0.5 leading-relaxed">{selectedBooking.message}</p>
                          </div>
                        )}
                        {selectedBooking.extraText1 && (
                          <div>
                            <span className="text-[#8a7968] block text-[10px]">On-screen Text / Info</span>
                            <span className="font-medium text-[#2d2520]">{selectedBooking.extraText1}</span>
                          </div>
                        )}
                        {selectedBooking.extraSelect1 && (
                          <div>
                            <span className="text-[#8a7968] block text-[10px]">Version / Material Selection</span>
                            <span className="font-medium text-[#2d2520] capitalize">{selectedBooking.extraSelect1}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#8a7968] block text-[10px]">Experience Level</span>
                          <span className="font-medium text-[#2d2520] capitalize">{selectedBooking.budget} package</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="p-3.5 rounded-2xl bg-[#d4a574]/5 space-y-2 border border-[#d4a574]/10">
                      <span className="text-[10px] font-semibold text-[#d4a574] uppercase tracking-wider block">Receipt & Payment</span>
                      <div className="space-y-1 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-[#8a7968]">Method</span>
                          <span className="font-medium text-[#2d2520]">{selectedBooking.paymentMethod}</span>
                        </div>
                        {selectedBooking.utrNumber && (
                          <div className="flex justify-between">
                            <span className="text-[#8a7968]">UTR Ref Code</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-black/5">{selectedBooking.utrNumber}</span>
                          </div>
                        )}
                        {selectedBooking.appliedDiscountCode && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Discount Code</span>
                            <span className="font-semibold">{selectedBooking.appliedDiscountCode}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-semibold border-t border-black/5 pt-1.5 mt-1.5">
                          <span className="text-[#2d2520]">Grand Total</span>
                          <span className="text-[#e8573a]">₹{selectedBooking.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Screenshot (if exists) */}
                    {selectedBooking.paymentScreenshot && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-[#8a7968] uppercase tracking-wider block">Uploaded Payment Screenshot</span>
                        <div 
                          onClick={() => setScreenshotModalUrl(selectedBooking.paymentScreenshot || null)}
                          className="relative h-44 rounded-2xl overflow-hidden border border-black/5 shadow-inner cursor-zoom-in hover:opacity-90 transition group"
                        >
                          <img 
                            src={selectedBooking.paymentScreenshot} 
                            alt="Transaction screenshot" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-white text-[10px] font-bold bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to Zoom</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Action Controls */}
                  <div className="pt-4 border-t border-black/5 space-y-2">
                    <span className="text-[10px] font-semibold text-[#8a7968] uppercase tracking-wider block mb-1">Administrative Actions</span>
                    
                    {selectedBooking.status === 'Pending Verification' && (
                      <button 
                        onClick={() => updateStatus(selectedBooking.id, 'Approved')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve & Confirm Booking
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => updateStatus(selectedBooking.id, 'Completed')}
                        disabled={selectedBooking.status === 'Completed'}
                        className="py-2 px-1 rounded-xl border border-black/5 bg-[#d4a574]/10 text-[#d4a574] hover:bg-[#d4a574]/20 disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Clock className="w-3 h-3" />
                        Mark Complete
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedBooking.id, 'Cancelled')}
                        disabled={selectedBooking.status === 'Cancelled'}
                        className="py-2 px-1 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <X className="w-3 h-3" />
                        Cancel Booking
                      </button>
                    </div>

                    <button 
                      onClick={() => deleteBooking(selectedBooking.id)}
                      className="w-full py-2 rounded-xl text-red-600 border border-red-100 hover:bg-red-50 text-[10px] font-bold flex items-center justify-center gap-1 transition mt-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Record Permanently
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center text-[#8a7968]">
                  <Shield className="w-8 h-8 text-[#d4a574] mx-auto mb-2 opacity-60" />
                  <h4 className="text-sm font-medium text-[#2d2520]">No Booking Selected</h4>
                  <p className="text-xs font-light mt-1">Select a booking card from the list to view its full transaction summary and update its status.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Users Database View */
          <div className="bg-white rounded-[32px] border border-black/5 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h3 className="font-semibold text-lg text-[#2d2520]">Registered User Database</h3>
                <p className="text-xs text-[#8a7968] font-light">List of all users who have signed up or placed orders in the local database.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-black/5 text-[#8a7968] font-semibold">
                    <th className="py-4 px-3">Member ID</th>
                    <th className="py-4 px-3">Full Name</th>
                    <th className="py-4 px-3">Phone Number</th>
                    <th className="py-4 px-3">Booking Orders placed</th>
                    <th className="py-4 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium text-[#2d2520]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#8a7968] font-light">
                        No user profiles recorded. Sign in as a user first.
                      </td>
                    </tr>
                  ) : (
                    users.map(u => {
                      const userBookingCount = bookings.filter(b => b.recipientName.toLowerCase() === u.fullName.toLowerCase()).length;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-3 font-mono text-[#8a7968]">{u.id}</td>
                          <td className="py-4 px-3 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#d4a574]/15 text-[#d4a574] font-bold text-[10px] flex items-center justify-center">
                              {u.fullName.slice(0,1).toUpperCase()}
                            </div>
                            <span>{u.fullName}</span>
                          </td>
                          <td className="py-4 px-3 font-mono">{u.phone}</td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${userBookingCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-[#8a7968]'}`}>
                              {userBookingCount} Bookings
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Screenshot Zoom Modal */}
      <AnimatePresence>
        {screenshotModalUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setScreenshotModalUrl(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-white p-2"
            >
              <img src={screenshotModalUrl} alt="Receipt proof zoom" className="rounded-2xl max-h-[80vh] w-auto object-contain mx-auto" />
              <button 
                onClick={() => setScreenshotModalUrl(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
