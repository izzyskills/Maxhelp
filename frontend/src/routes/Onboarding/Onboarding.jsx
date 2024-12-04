import React, { useState, useEffect } from "react";
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { Tab, Tabs } from "@nextui-org/react";
import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
import AdminLogin from "../AdminLogin/AdminLogin";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const { pathname } = useLocation();

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
    <div className="flex w-full flex-col p-4 px-8 mt-8">
      <Tabs
        aria-label="Options"
        selectedKey={pathname}
        color="primary"
        variant="bordered"
      >
        <Tab
          key="/onboarding/login"
          href="/onboarding/login"
          title={
            <div className="flex items-center space-x-2">
              <FaUserTie className="text-2xl" />
              <span className="font-semibold text-center">Employee</span>
            </div>
          }
        />
        <Tab
          key="/onboarding/admin-login"
          href="/onboarding/admin-login"
          title={
            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl" />
              <span className="font-semibold text-center">Admin</span>
            </div>
          }
        />
      </Tabs>
      <Routes>
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default Onboarding;
