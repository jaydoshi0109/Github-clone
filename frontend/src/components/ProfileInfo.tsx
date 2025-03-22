
export interface UserProfile {
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
export interface UserProfileType {
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

import { Link } from "react-router-dom";

interface ProfileInfoProps {
	userProfile: UserProfileType;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile }) => {
	return (
		<div className='flex flex-col items-center text-center space-y-2'>
			<Link to={userProfile.html_url} target='_blank'>
				<img
					src={userProfile.avatar_url}
					alt={userProfile.name}
					className='w-28 h-28 rounded-full border-4 border-white/20 shadow-lg hover:scale-105 transition-transform'
				/>
			</Link>
			<h2 className='text-2xl font-semibold'>{userProfile.name}</h2>
			<p className='text-gray-400 text-sm'>@{userProfile.login}</p>
			<p className='text-xs text-gray-500'>Since {new Date(userProfile.created_at).getFullYear()}</p>

			<div className='space-y-1 mt-4 text-sm w-full'>
				<p><strong>Followers:</strong> {userProfile.followers} | <strong>Following:</strong> {userProfile.following}</p>
				<p><strong>Public Repos:</strong> {userProfile.public_repos} | <strong>Gists:</strong> {userProfile.public_gists}</p>
				{userProfile.bio && <p><strong>Bio:</strong> {userProfile.bio}</p>}
				{userProfile.company && <p><strong>Company:</strong> {userProfile.company}</p>}
				{userProfile.location && <p><strong>Location:</strong> {userProfile.location}</p>}
				{userProfile.twitter_username && <p><strong>Twitter:</strong> @{userProfile.twitter_username}</p>}
			</div>
		</div>
	);
};

export default ProfileInfo;

