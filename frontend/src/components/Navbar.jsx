import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-green-700"
        >
          <Sprout size={32} />
          AgriSense
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-green-600 transition">
            Home
          </Link>

          <a href="#features" className="hover:text-green-600 transition">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-green-600 transition">
            How It Works
          </a>

          <Link to="/login" className="hover:text-green-600 transition">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-green-50"
          >
            Home
          </Link>

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-green-50"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-green-50"
          >
            How It Works
          </a>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-green-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block m-4 text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Get Started
          </Link>

        </div>
      )}
    </nav>
  );
}

export default Navbar;