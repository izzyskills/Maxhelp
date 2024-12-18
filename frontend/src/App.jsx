import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import NavbarList from "./components/Navbar/NavbarList";
import Footer from "./components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import HomePage from "./routes/HomePage/HomePage";
import AboutPage from "./routes/AboutPage/AboutPage";
import Onboarding from "./routes/Onboarding/Onboarding";
import AdminLogin from "./routes/AdminLogin/AdminLogin";
import Dashboard from "./routes/Dashboard/Dashboard";
import Employee from "./routes/Employee/Employee";
import Notification from "./routes/Notification/Notification";
import Feedback from "./routes/Feedbacks/Feedback";
import Inventory from "./routes/Inventory/Inventory";
import EmployeeLogin from "./routes/EmployeeLogin/EmployeeLogin";
import LoggedInNav from "./components/Navbar/LoggedInNavbar";
import { ThemeProvider } from "./context/ThemeProvider";

const App = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();

  // Define routes where sidebar should be shown
  const showSidebarRoutes = [
    "/dashboard",
    "/admin-employees",
    "/notifications",
    "/feedbacks",
    "/inventory",
  ];

  // Fetch username from localStorage when the app loads
  useEffect(() => {
    // Exclude routes that should not trigger login checks
    const noLoginRequiredRoutes = [
      "/",
      "/about",
      "/onboarding",
      "/login",
      "/onboarding/login",
      "/onboarding/admin-login",
    ];

    if (noLoginRequiredRoutes.includes(location.pathname)) {
      return; // Don't perform login check for these routes
    }

    // Check for stored username
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Redirect to login if username is not found in localStorage
      navigate("/onboarding/login");
    }
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect to login if email is not found in localStorage
      navigate("/onboarding/login");
    }
  }, [location.pathname, navigate]);

  const isAdmin = localStorage.getItem("role") === "admin";
  // Determine whether to show the Navbar and Footer
  const showNavbarFooter = ![
    "/admin-login",
    "/onboarding/login",
    "/onboarding/admin-login",
    "/login",
    "/dashboard",
    "/admin-employees",
    "/notifications",
    "/feedbacks",
    "/inventory",
  ].includes(location.pathname);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen min-w-full text-foreground bg-background">
        {/* Navbar: Conditionally render based on current route */}
        {showNavbarFooter && <NavbarList />}
        {showSidebarRoutes.includes(location.pathname) && (
          <LoggedInNav username={username} email={email} isAdmin={isAdmin} />
        )}

        <div className="flex">
          {/* Sidebar: Conditionally render on specific routes */}
          <div className="flex-1">
            {/* Define Routes for the application */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/onboarding/*" element={<Onboarding />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-employees" element={<Employee />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/feedbacks" element={<Feedback />} />
              <Route path="/inventory" element={<Inventory />} />

              {/* Employee Routes */}
              <Route path="/login" element={<EmployeeLogin />} />
            </Routes>
          </div>
        </div>

        {/* Footer: Conditionally render based on current route */}
        {showNavbarFooter && <Footer />}

        {/* Global Toast Notification Container */}
        <ToastContainer
          position="bottom-right"
          autoClose={2100}
          hideProgressBar={false}
          newestOnTop={true}
          transition={Bounce}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
