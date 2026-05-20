import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { HomePage } from './components/HomePage';
import { UserHome } from './components/UserHome';
import { PackageListingScreen } from './components/PackageListingScreen';
import { PackageDetailsScreen } from './components/PackageDetailsScreen';
import { EventCreationScreen } from './components/EventCreationScreen';
import { MemoryUploadScreen } from './components/MemoryUploadScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { SingleEventDashboard } from './components/SingleEventDashboard';
import { GalleryHomeScreen } from './components/GalleryHomeScreen';
import { MemoryStoryScreen } from './components/MemoryStoryScreen';
import { StoryUploadScreen } from './components/StoryUploadScreen';
import { BottomNav } from './components/BottomNav';
import { OnboardingFlow } from '../pages/OnboardingFlow';
import { useLocation } from 'react-router';

// Full-screen loading state
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfbf8' }}>
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#d4a574', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

// Protected Route: redirects unauthenticated users to onboarding
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

// Bottom nav wrapper (hides on certain routes)
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide nav on creation/upload flows and public landing
  const hideNavPaths = ['/create', '/onboarding', '/upload'];
  const hideNav = hideNavPaths.some(p => location.pathname.startsWith(p)) 
    || (location.pathname === '/' && !user);

  const handleNavigate = (screen: string) => {
    window.location.href = screen === 'home' ? '/home' : `/${screen}`;
  };

  return (
    <>
      {children}
      {!hideNav && (
        <BottomNav 
          currentScreen={location.pathname.replace('/', '') || 'home'} 
          onNavigate={handleNavigate} 
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen pb-16 md:pb-0 font-light text-[#2d2520]" style={{ background: '#fdfbf8' }}>
          <AppLayout>
            <Routes>
              {/* Public landing */}
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />

              {/* Public browseable */}
              <Route path="/packages" element={<PackageListingScreen />} />
              <Route path="/package/:id" element={<PackageDetailsScreen />} />
              <Route path="/upload" element={<MemoryUploadScreen />} />

              {/* Protected — requires auth */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <EventCreationScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardScreen />
                  </ProtectedRoute>
                }
              />

              {/* Event-scoped */}
              <Route path="/event/:id" element={<SingleEventDashboard />} />
              <Route path="/event/:id/upload" element={<MemoryUploadScreen />} />
              <Route path="/event/:id/gallery" element={<GalleryHomeScreen />} />

              {/* Gallery & Memory Stories */}
              <Route path="/gallery" element={<GalleryHomeScreen />} />
              <Route path="/gallery/:templateId" element={<MemoryStoryScreen />} />
              <Route path="/gallery/:templateId/upload" element={<StoryUploadScreen />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}