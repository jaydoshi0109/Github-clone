// TestSession.js
import { useEffect } from "react";

const TestSession = () => {
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/test-session`, {
          credentials: "include", // ensures cookies are sent with the request
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        console.log("Test session response:", data);
      } catch (error) {
        console.error("Error fetching test session:", error);
      }
    }
    fetchSession();
  }, []);

  return null;
};

export default TestSession;
