import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        console.log("Checking authentication status...");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check`, { 
          credentials: "include",
          headers: {
            "Accept": "application/json"
          }
        });
        console.log("Authentication response status:", res.status);
        const data = await res.json();
        console.log("Authentication data received:", data);
        setAuthUser(data.user);
      } catch (error: any) {
        console.error("Authentication error:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
