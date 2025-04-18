import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatDate } from "../utils/functions";
import { useUserProfile } from "../context/UserProfileContext"; // Import context
import { Link } from "react-router-dom"; // Import Link

const LikesPage = () => {
    interface Like {
        username: string;
        avatarUrl: string;
        likedDate: string;
    }

    const [likes, setLikes] = useState<Like[]>([]);
    const { userProfile } = useUserProfile(); // Access userProfile

    useEffect(() => {
        const getLikes = async () => {
            try {
                if (!userProfile) return; // Prevent unnecessary fetch
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/likes`, { credentials: "include" });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setLikes(data.likedBy);
            } catch (error: any) {
                toast.error(error.message);
            }
        };
        getLikes();
    }, [userProfile]); // Only fetch if userProfile exists

    return (
        <div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
            <table className='w-full text-sm text-left rtl:text-right bg-glass overflow-hidden'>
                <thead className='text-xs uppercase bg-glass'>
                    <tr>
                        <th scope='col' className='p-4'><div className='flex items-center'>No</div></th>
                        <th scope='col' className='px-6 py-3'>Username</th>
                        <th scope='col' className='px-6 py-3'>Date</th>
                        <th scope='col' className='px-6 py-3'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {likes.map((user, idx) => (
                        <tr className='bg-glass border-b' key={user.username}>
                            <td className='w-4 p-4'><div className='flex items-center'><span>{idx + 1}</span></div></td>
                            <th scope='row' className='flex items-center px-6 py-4 whitespace-nowrap '>
                                <img className='w-10 h-10 rounded-full' src={user.avatarUrl} alt='User Avatar' />
                                <div className='ps-3'>
                                    <Link to={`/profile/${user.username}`} className='text-base font-semibold text-blue-500 hover:underline'>
                                        {user.username}
                                    </Link>
                                </div>
                            </th>
                            <td className='px-6 py-4'>{formatDate(user.likedDate)}</td>
                            <td className='px-6 py-4'>
                                <div className='flex items-center'>
                                    <FaHeart size={22} className='text-red-500 mx-2' />
                                    Liked your profile
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LikesPage;