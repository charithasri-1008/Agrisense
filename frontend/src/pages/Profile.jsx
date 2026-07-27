import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const res = await getProfile();

      setUser(res.user);

    } catch (err) {

      console.log(err);

      toast.error("Unable to load profile");

    } finally {

      setLoading(false);

    }
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged Out Successfully 👋");

    setTimeout(() => {
      navigate("/login");
    }, 1200);

  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-8">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl overflow-hidden">

        <div className="bg-green-700 text-white p-10 text-center">

          <div className="w-28 h-28 rounded-full bg-white text-green-700 text-5xl font-bold flex items-center justify-center mx-auto shadow-lg">

            {user.name.charAt(0).toUpperCase()}

          </div>

          <h1 className="text-4xl font-bold mt-5">
            {user.name}
          </h1>

          <p className="mt-2 text-green-100">
            🌾 AgriSense Farmer
          </p>

        </div>

        <div className="p-8 space-y-5">

          <div className="bg-green-50 rounded-2xl p-5">

            <h3 className="font-semibold text-green-700">
              📧 Email
            </h3>

            <p className="mt-2 text-gray-700">
              {user.email}
            </p>

          </div>

          <div className="bg-blue-50 rounded-2xl p-5">

            <h3 className="font-semibold text-blue-700">
              🆔 User ID
            </h3>

            <p className="mt-2 text-gray-700 break-all">
              {user.id}
            </p>

          </div>

          <div className="bg-yellow-50 rounded-2xl p-5">

            <h3 className="font-semibold text-yellow-700">
              📅 Member Since
            </h3>

            <p className="mt-2 text-gray-700">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>

          </div>

          <button
            onClick={logout}
            className="w-full mt-5 bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-xl font-bold text-lg"
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;