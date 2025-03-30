import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { UserProfile } from "../components/ProfileInfo";
import { useState, useEffect, useCallback } from "react";

const LikeProfile = ({ userProfile }: { userProfile: UserProfile }) => {
    const { authUser } = useAuthContext();
    const [hasLiked, setHasLiked] = useState(false);

    interface AuthUser {
        username: string;
    }

    const isOwnProfile = (authUser as AuthUser)?.username === userProfile.login;

    // Function to fetch the liked status
    const fetchLikedStatus = useCallback(async () => {
        if (authUser && !isOwnProfile) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/likes`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data.error) {
                    console.error("Error fetching likes:", data.error);
                    return;
                }
                // Check if the current user has liked this profile
                const liked = data.likedBy.some((likedUser: { username: string }) => likedUser.username === userProfile.login);
                setHasLiked(liked);
            } catch (error) {
                console.error("Error checking liked status:", error);
            }
        } else {
            setHasLiked(false); // Reset if authUser changes or it's the own profile
        }
    }, [authUser, isOwnProfile, userProfile.login]);

    useEffect(() => {
        fetchLikedStatus();
    }, [fetchLikedStatus]);

    const handleLikeProfile = async () => {
        if (!authUser) {
            toast.error("Please log in to like profiles.");
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/like/${userProfile.login}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                
                setHasLiked(true);
               
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!authUser || isOwnProfile) return null;

    return (
        <button
            className='p-2 text-lg w-full font-medium rounded-md bg-glass border border-blue-400 flex items-center gap-2 justify-center border-none'
            onClick={handleLikeProfile}
            disabled={hasLiked} // Disable the button if already liked
        >
            <FaHeart size={16} color={hasLiked ? "red" : undefined} /> {hasLiked ? "Liked" : "Like Profile"}
        </button>
    );
};
export default LikeProfile;