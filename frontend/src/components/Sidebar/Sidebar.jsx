import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaBell, FaBackward } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { FiMenu } from "react-icons/fi"; // Hamburger icon
import { IoMdLogOut } from "react-icons/io";
import { Button } from "@nextui-org/button";

const Sidebar = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("employee_email");
    navigate("/");
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-[250px]" : "w-[100px]"
      } fixed top-0 left-0 h-full bg-blue-900 p-4 justify-center space-y-6 flex items-start flex-col transition-width z-10 duration-300 md:w-[190px] lg:w-[250px]`}
    >
      <div className="flex flex-col justify-between items-center w-full">
        {/* Hamburger Menu for small screens */}
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden border-none text-white"
          variant="outlined"
        >
          {sidebarOpen ? <IoMdLogOut size={24} /> : <FiMenu size={24} />}
        </Button>
        <img
          src="/admin.svg"
          alt="Logo.png"
          className="mb-6 w-2/4 md:w-[60%] flex items-center justify-start  md:block"
        />
      </div>

      {!sidebarOpen && (
        <h5 className="mb-8 hidden md:block text-center text-[1.03rem] text-white">
          Welcome Back {username.charAt(0).toUpperCase() + username.slice(1)}
        </h5>
      )}
      {sidebarOpen && (
        <h6 className="mb-8 text-center text-white">
          Welcome Back {username.charAt(0).toUpperCase() + username.slice(1)}
        </h6>
      )}

      {/* Sidebar Navigation */}
      <Listbox variant="flat" aria-label="Sidebar menu">
        <ListboxItem
          key="dashboard"
          description="Go to dashboard"
          startContent={<FaHome className="text-white" />}
          onClick={() => handleNavigate("/dashboard")}
        >
          <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
            Dashboard
          </span>
        </ListboxItem>

        <ListboxItem
          key="inventory"
          description="View inventory"
          startContent={<FaBox className="text-white" />}
          onClick={() => handleNavigate("/inventory")}
        >
          <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
            Inventory
          </span>
        </ListboxItem>

        {role !== "employee" && (
          <ListboxItem
            key="admin-employees"
            description="Manage employees"
            startContent={<FaUsers className="text-white" />}
            onClick={() => handleNavigate("/admin-employees")}
          >
            <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
              Employee
            </span>
          </ListboxItem>
        )}

        <ListboxItem
          key="feedbacks"
          description="View feedbacks"
          startContent={<FaBackward className="text-white" />}
          onClick={() => handleNavigate("/feedbacks")}
        >
          <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
            Feedback
          </span>
        </ListboxItem>

        {role !== "employee" && (
          <ListboxItem
            key="notifications"
            description="View notifications"
            startContent={<FaBell className="text-white" />}
            onClick={() => handleNavigate("/notifications")}
          >
            <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
              Notifications
            </span>
          </ListboxItem>
        )}

        <ListboxItem
          key="logout"
          description="Logout from the application"
          startContent={<CiLogout className="text-white" />}
          onClick={handleLogout}
          className="text-danger"
          color="danger"
        >
          <span className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
            Logout
          </span>
        </ListboxItem>
      </Listbox>
    </div>
  );
};

export default Sidebar;
