import React, { useState, useEffect } from "react";
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate a loading process (e.g., data fetching or async operations)
    const timer = setTimeout(() => {
      setLoading(false); // After 2 seconds, stop loading
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const EmployeeRedirect = () => {
    navigate("/login");
  };
  const AdminRedirect = () => {
    navigate("/admin-login");
  };

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <div className="onboarding min-h-screen bg-gray-100 flex md:flex-row">
      {/* Left Section */}
      <div className="left w-full md:w-1/2 flex flex-col justify-center px-8 py-6">
        <h4 className=" font-bold mb-6 text-center md:text-left">
          Choose Your Option
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 cursor-pointer">
          {/* Admin Option */}
          <div
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg w-[90%] mx-auto md:w-full hover:-translate-y-10 transition-all duration-100 ease-in-out"
            onClick={AdminRedirect}
          >
            <FaUser className="text-blue-gray-900 text-2xl" />
            <h6 className="font-semibold text-center">Admin</h6>
            <p className="text-sm text-center">
              Manage your organization's settings and users.
            </p>
          </div>

          {/* Employee Option */}
          <div
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg w-[90%] mx-auto hover:-translate-y-10  transition-all duration-100 ease-in-out"
            onClick={EmployeeRedirect}
          >
            <FaUserTie className="text-blue-gray-900 text-2xl" />
            <h6 className=" font-semibold text-center">Employee</h6>
            <p className="text-sm text-center">
              Access tools and resources to manage your work.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden right md:w-1/2 md:flex items-center justify-center py-6  md:bg-blue-900 sm:bg-transparent">
        <h3 className="text-white font-bold text-center sm:text-gray-800 md:text-white">
          Welcome to MaxHelp
        </h3>
      </div>
    </div>
  );
};

export default Onboarding;
