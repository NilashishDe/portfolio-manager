import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/portfolio" className="font-bold text-xl text-gray-800">
              PortfolioManager
            </Link>
          </div>
          <div className="flex items-center">
            {token ? (
              <>
                {/* --- NEW --- */}
                <Link to="/watchlist" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Watchlist</Link>
                <Link to="/portfolio" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Portfolio</Link>
                <button onClick={handleLogout} className="ml-4 bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="ml-4 bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}