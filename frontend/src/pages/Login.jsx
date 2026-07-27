import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const loadingToast = toast.loading("Signing In...");

      const res = await loginUser(formData);

      localStorage.setItem("token", res.token);

      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      toast.dismiss(loadingToast);
      toast.success("Welcome to AgriSense 🌾");

      navigate("/dashboard");

    } catch (err) {

      toast.dismiss();

      toast.error(
        err.response?.data?.message ||
        "Invalid Email or Password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          🌾 AgriSense Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;