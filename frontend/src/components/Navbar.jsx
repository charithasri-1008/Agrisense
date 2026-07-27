import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-green-700"
        >
          <Sprout size={32} />
          AgriSense
        </Link>

        <div className="flex items-center gap-6">
  <Link
    to="/"
    className="hover:text-green-600 transition"
  >
    Home
  </Link>

  <a
    href="#features"
    className="hover:text-green-600 transition"
  >
    Features
  </a>

  <a
    href="#how-it-works"
    className="hover:text-green-600 transition"
  >
    How It Works
  </a>

  <Link
    to="/login"
    className="hover:text-green-600 transition"
  >
    Login
  </Link>

  <Link
    to="/register"
    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
  >
    Get Started
  </Link>
</div>
      </div>
    </nav>
  );
}

export default Navbar;