import { useLocation, useNavigate } from 'react-router';
import { Home, Grid, PlusCircle, Image, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentScreen?: string;
  onNavigate?: (screen: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', path: '/', label: 'Home', icon: Home },
  { id: 'packages', path: '/packages', label: 'Explore', icon: Grid },
  { id: 'create', path: '/create', label: 'Create', icon: PlusCircle },
  { id: 'gallery', path: '/gallery', label: 'Gallery', icon: Image },
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function BottomNav({ onNavigate }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on create flow and event sub-routes
  const hidden = ['/create', '/event/'].some(p => location.pathname.startsWith(p));
  if (hidden) return null;

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleClick = (item: typeof NAV_ITEMS[0]) => {
    if (onNavigate) onNavigate(item.id);
    else navigate(item.path);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="grid grid-cols-5 px-2 py-2 pb-safe">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-2xl relative transition-all"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(212,165,116,0.15)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <item.icon
                className="w-5 h-5 relative z-10 transition-all"
                style={{ color: active ? '#d4a574' : '#8a7968' }}
              />
              <span
                className="text-xs font-light relative z-10 transition-all"
                style={{ color: active ? '#d4a574' : '#8a7968' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
