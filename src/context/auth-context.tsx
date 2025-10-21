import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Character, AuthContextType } from '@/types/auth.types';
import { currentMockUser, setMockUser } from '@/lib/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mode = (import.meta.env.VITE_APP_MODE || 'development') as 'development' | 'production';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      if (mode === 'development') {
        // Mock authentication - simulate async check
        await new Promise(resolve => setTimeout(resolve, 500));
        // You can change which mock user to use here
        // Options: 'withCharacter', 'withoutCharacter', 'anotherUser'
        setMockUser('withoutCharacter'); // Change this to test different states
        setUser(currentMockUser);
      } else {
        // Production - Real Discord OAuth
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    if (mode === 'development') {
      // Mock login - just set the user
      console.log('🎭 Development Mode: Mock login');
      setMockUser('withoutCharacter'); // or 'withCharacter' to test with existing character
      setUser(currentMockUser);
    } else {
      // Production - Redirect to Discord OAuth
      window.location.href = `${apiBaseUrl}/auth/discord`;
    }
  };

  const logout = async () => {
    if (mode === 'development') {
      // Mock logout
      console.log('🎭 Development Mode: Mock logout');
      setUser(null);
    } else {
      // Production logout
      try {
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        setUser(null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const refreshUser = async () => {
    if (mode === 'development') {
      // Mock refresh
      console.log('🎭 Development Mode: Mock refresh user');
      setUser({ ...currentMockUser });
    } else {
      // Production refresh
      await checkAuth();
    }
  };

  const updateCharacter = (character: Character) => {
    console.log('[AuthContext] updateCharacter called with:', character);
    if (user) {
      const updatedUser = { ...user, character };
      setUser(updatedUser);
      console.log('[AuthContext] User updated with character:', updatedUser);
      
      if (mode === 'development') {
        // Update the mock data too
        currentMockUser.character = character;
      }
    } else {
      console.warn('[AuthContext] Cannot update character: user is null');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    mode,
    login,
    logout,
    refreshUser,
    updateCharacter,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC to protect routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please login to continue</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
