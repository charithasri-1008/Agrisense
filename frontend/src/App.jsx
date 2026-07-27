import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Weather from "./pages/Weather";
import CropRecommendation from "./pages/CropRecommendation";
import Chatbot from "./pages/Chatbot";
import DiseaseDetection from "./pages/DiseaseDetection";
import MarketPrices from "./pages/MarketPrices";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />

        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MarketPrices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crop"
          element={
            <ProtectedRoute>
              <CropRecommendation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/disease"
          element={
            <ProtectedRoute>
              <DiseaseDetection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;