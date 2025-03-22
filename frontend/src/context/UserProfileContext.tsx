import { createContext, useContext, useEffect, useState } from "react";
import { RepoType } from "../components/Repos"; 
interface UserProfileType {
	avatar_url: string;
	bio: string | null;
	blog: string | null;
	company: string | null;
	followers: number;
	following: number;
	html_url: string;
	location: string | null;
	name: string;
	public_repos: number;
	public_gists: number;
	twitter_username: string | null;
	login: string;
	email: string | null;
	created_at: string;
}



interface UserProfileContextType {
	userProfile: UserProfileType | null;
	setUserProfile: React.Dispatch<React.SetStateAction<UserProfileType | null>>;
	repos: RepoType[];
	setRepos: React.Dispatch<React.SetStateAction<RepoType[]>>;
}


const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
	const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
	const [repos, setRepos] = useState<RepoType[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		const savedProfile = localStorage.getItem("userProfile");
		const savedRepos = localStorage.getItem("repos");
		if (savedProfile) {
			setUserProfile(JSON.parse(savedProfile));
		}
		if (savedRepos) {
			setRepos(JSON.parse(savedRepos));
		}
	}, []);

	// Save userProfile to localStorage whenever it changes
	useEffect(() => {
		if (userProfile) {
			localStorage.setItem("userProfile", JSON.stringify(userProfile));
		} else {
			localStorage.removeItem("userProfile");
		}
	}, [userProfile]);

	// Save repos to localStorage whenever it changes
	useEffect(() => {
		if (repos.length > 0) {
			localStorage.setItem("repos", JSON.stringify(repos));
		} else {
			localStorage.removeItem("repos");
		}
	}, [repos]);

	return (
		<UserProfileContext.Provider value={{ userProfile, setUserProfile, repos, setRepos }}>
			{children}
		</UserProfileContext.Provider>
	);
};

export const useUserProfile = () => {
	const context = useContext(UserProfileContext);
	if (!context) {
		throw new Error("useUserProfile must be used within a UserProfileProvider");
	}
	return context;
};
