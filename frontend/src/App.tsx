import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LikesPage from "./pages/LikesPage";

import Sidebar from "./components/Sidebar";
import { useAuthContext } from "./context/AuthContext";

function App() {
	const { authUser, loading } = useAuthContext();
	console.log("Authenticated user:", authUser);

	if (loading) return null;

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
			<Sidebar />
			<main className="flex-1 max-w-5xl mx-auto my-8 px-6 transition-all duration-300">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
					<Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
					<Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
					<Route path="/likes" element={authUser ? <LikesPage /> : <Navigate to="/login" />} />
				</Routes>
			</main>
			<Toaster position="top-center" />
		</div>
	);
}

export default App;
