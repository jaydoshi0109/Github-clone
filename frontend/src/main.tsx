import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { UserProfileProvider } from "./context/UserProfileContext.jsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
			<UserProfileProvider>
				<App />
			</UserProfileProvider>
			</AuthContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);