import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserProfile } from "../context/UserProfileContext";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";
import { RepoType } from "../components/Repos";
  
const HomePage = () => {
	const { userProfile, setUserProfile, repos, setRepos } = useUserProfile();
	const [loading, setLoading] = useState<boolean>(false);
	const [sortType, setSortType] = useState<"recent" | "stars" | "forks">("recent");

	const getUserProfileAndRepos = useCallback(async (username = "jaydoshi0109") => {
		setLoading(true);
		try {
			const res = await fetch(`http://localhost:5000/api/users/profile/${username}`);
			const { repos, userProfile } = await res.json();
			repos.sort((a: RepoType, b: RepoType) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
			setRepos(repos);
			setUserProfile(userProfile);
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [setUserProfile, setRepos]);

	useEffect(() => {
		if (!userProfile || repos.length === 0) {
			getUserProfileAndRepos();
		}
	}, [userProfile, repos.length, getUserProfileAndRepos]);

	const onSearch = async (e: React.FormEvent, username: string) => {
		e.preventDefault();
		setLoading(true);
		setRepos([]);
		setUserProfile(null);
		await getUserProfileAndRepos(username);
		setSortType("recent");
	};

	const onSort = (sortType: "recent" | "stars" | "forks") => {
		if (sortType === "recent") {
			repos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		} else if (sortType === "stars") {
			repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortType === "forks") {
			repos.sort((a, b) => b.forks_count - a.forks_count);
		}
		setSortType(sortType);
		setRepos([...repos]);
	};

	return (
		<div className='container mx-auto px-4 py-6 space-y-6'>
			<Search onSearch={onSearch} />
			{repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
			{loading && <Spinner />}
			{!loading && (
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{userProfile && (
						<div className='lg:col-span-1 bg-white shadow-xl rounded-2xl p-6 glassmorphism'>
							<ProfileInfo userProfile={userProfile} />
						</div>
					)}
					{repos.length > 0 && (
						<div className='lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 glassmorphism'>
							<Repos repos={repos} />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default HomePage;
