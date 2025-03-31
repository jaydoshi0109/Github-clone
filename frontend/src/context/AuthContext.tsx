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
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check`, {
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });
        
        const data = await res.json();
        
        if (data.authenticated) {
          setAuthUser(data.user);
        } else {
          // Clear any potential stale auth state
          setAuthUser(null);
          // Force logout if session exists but not authenticated
          if (data.sessionExists) {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
              credentials: "include",
              method: "POST"
            });
          }
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
    
    // Also check auth state after page load (for OAuth redirects)
    window.addEventListener('load', checkUserLoggedIn);
    return () => window.removeEventListener('load', checkUserLoggedIn);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};