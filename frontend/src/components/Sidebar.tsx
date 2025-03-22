import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineExplore, MdEditDocument } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";
import Logout from "./Logout";
import { useAuthContext } from "../context/AuthContext";

const Sidebar = () => {
	const { authUser } = useAuthContext();

	return (
		<aside
			className="flex flex-col items-center w-16 sticky top-0 left-0 h-screen py-8 bg-white/10 
			backdrop-blur-md border-r border-white/20 space-y-6"
		>
			<nav className="flex flex-col gap-6">
				<Link to="/" className="group">
					<img className="h-8 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" src="/github.svg" alt="Github Logo" />
				</Link>

				<Link to="/" className="sidebar-icon">
					<IoHomeSharp size={22} />
				</Link>

				{authUser && (
					<>
						<Link to="/likes" className="sidebar-icon">
							<FaHeart size={22} />
						</Link>
						<Link to="/explore" className="sidebar-icon">
							<MdOutlineExplore size={24} />
						</Link>
					</>
				)}

				{!authUser && (
					<>
						<Link to="/login" className="sidebar-icon">
							<PiSignInBold size={24} />
						</Link>
						<Link to="/signup" className="sidebar-icon">
							<MdEditDocument size={24} />
						</Link>
					</>
				)}

				{authUser && (
					<div className="mt-auto">
						<Logout />
					</div>
				)}
			</nav>
		</aside>
	);
};

export default Sidebar;
