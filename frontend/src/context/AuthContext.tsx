import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";



interface AuthUserType {
  username: string;
  avatarUrl: string;
}

interface AuthContextType {
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
  loading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check`, {
          credentials: 'include'
        });
        
        const data = await res.json();
        console.log('Auth check response:', data);
        
        if (data.authenticated) {
          setAuthUser(data.user);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // Check again after page load (for OAuth redirects)
    const handleLoad = () => checkAuthStatus();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};