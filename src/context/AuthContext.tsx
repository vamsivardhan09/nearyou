import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CelebrateUser {
  id: string;
  fullName: string;
  phone: string;
}

interface AuthContextType {
  user: CelebrateUser | null;
  loading: boolean;
  displayName: string;
  signOut: () => void;
  loginWithName: (fullName: string, phone: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  displayName: '',
  signOut: () => {},
  loginWithName: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CelebrateUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nearyou_mock_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read mock user", e);
    }
    setLoading(false);
  }, []);

  const loginWithName = (fullName: string, phone: string) => {
    const newUser = {
      id: `local_${Date.now()}`,
      fullName,
      phone
    };
    setUser(newUser);
    localStorage.setItem('nearyou_mock_user', JSON.stringify(newUser));
    
    // Also save to nearyou_all_users list in localStorage
    try {
      const allUsersStr = localStorage.getItem('nearyou_all_users');
      const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
      if (!allUsers.some((u: any) => u.phone === phone)) {
        allUsers.push(newUser);
        localStorage.setItem('nearyou_all_users', JSON.stringify(allUsers));
      }
    } catch (e) {
      console.warn("Could not save to all users database", e);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('nearyou_mock_user');
  };

  const displayName = user?.fullName?.trim().split(' ')[0] ?? '';

  return (
    <AuthContext.Provider value={{ user, loading, displayName, signOut, loginWithName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
