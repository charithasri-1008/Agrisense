import { Link, useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";

function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-2xl font-bold text-green-700"
        >
          <Sprout size={30} />
          AgriSense
        </Link>

        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link to="/weather" className="hover:text-green-600">Weather</Link>
          <Link to="/market" className="hover:text-green-600">Market</Link>
          <Link to="/crop" className="hover:text-green-600">Crop AI</Link>
          <Link to="/disease" className="hover:text-green-600">Disease</Link>
          <Link to="/chatbot" className="hover:text-green-600">AI Chat</Link>
          <Link to="/profile" className="hover:text-green-600">Profile</Link>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default DashboardNavbar;