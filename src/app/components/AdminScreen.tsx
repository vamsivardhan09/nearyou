import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, X, Calendar, MapPin, DollarSign, Tag, Clock, Eye, Trash2, Database, ArrowLeft } from 'lucide-react';

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

export function AdminScreen() {
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<SavedBooking | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);

  // Load Bookings
  const loadBookings = () => {
    try {
      const stored = localStorage.getItem('nearyou_bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Update Status
  const updateStatus = (id: string, newStatus: SavedBooking['status']) => {
    try {
      const stored = localStorage.getItem('nearyou_bookings');
      if (stored) {
        const list: SavedBooking[] = JSON.parse(stored);
        const updated = list.map(b => b.id === id ? { ...b, status: newStatus } : b);
        localStorage.setItem('nearyou_bookings', JSON.stringify(updated));
        setBookings(updated);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Booking
  const deleteBooking = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const stored = localStorage.getItem('nearyou_bookings');
      if (stored) {
        const list: SavedBooking[] = JSON.parse(stored);
        const updated = list.filter(b => b.id !== id);
        localStorage.setItem('nearyou_bookings', JSON.stringify(updated));
        setBookings(updated);
        setSelectedBooking(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Seed Mock Bookings
  const seedMockBookings = () => {
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
    localStorage.setItem('nearyou_bookings', JSON.stringify(mockBookings));
    setBookings(mockBookings);
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

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
              onClick={seedMockBookings}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#d4a574]/10 border border-[#d4a574]/20 text-[#d4a574] hover:bg-[#d4a574]/20 transition flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              Seed Demo Data
            </button>
            <button 
              onClick={() => {
                if (window.confirm('Delete all bookings?')) {
                  localStorage.removeItem('nearyou_bookings');
                  setBookings([]);
                  setSelectedBooking(null);
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Database
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
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
                  const isPending = booking.status === 'Pending Verification';
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
