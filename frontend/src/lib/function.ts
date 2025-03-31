export const handleLoginWithGithub = async () => {
	try {
	  // Clear existing session first
	  await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	  });
	  
	  // Initiate GitHub auth
	  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	} catch (error) {
	  console.error('Logout failed:', error);
	  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	}
  };