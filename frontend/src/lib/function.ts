export const handleLoginWithGithub = () => {
	// Clear any existing session first
	fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
	  credentials: "include",
	  method: "POST"
	}).finally(() => {
	  // Open GitHub auth in same tab for proper cookie handling
	  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	});
  };