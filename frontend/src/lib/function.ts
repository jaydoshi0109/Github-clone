export const handleLoginWithGithub = () => {
	window.open(`${import.meta.env.VITE_BACKEND_URL}/api/auth/github`, "_self");
};