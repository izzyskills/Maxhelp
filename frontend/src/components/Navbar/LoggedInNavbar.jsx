import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaSignOutAlt } from "react-icons/fa";
import DarkMode from "./DarkMode";

const LoggedInNav = ({ username, email, isAdmin }) => {
  const navigate = useNavigate();
  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("employee_email");
    navigate("/");
  };

  return (
    <Navbar
      maxWidth="full"
      isBordered
      className="bg-background-300 no-underline "
    >
      <NavbarContent className="">
        <NavbarMenuToggle aria-label="Toggle menu" className="sm:hidden" />
        <NavbarBrand>MaxHelp Enterprises</NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary no-underline ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/feedbacks"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary no-underline ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          Customers Feedback
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary no-underline ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          Products Inventory
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary no-underline ${isActive ? "text-primary" : "text-muted-foreground"}`
            }
          >
            Notifications
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin-employees"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary no-underline ${isActive ? "text-primary" : "text-muted-foreground"}`
            }
          >
            Employess
          </NavLink>
        )}
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4" justify="end">
        <DarkMode />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              showFallback
              isBordered
              color="success"
              src={avatarUrl}
              name={username}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="profile">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
            </DropdownItem>
            <DropdownItem
              key="logout"
              onClick={handleLogout}
              className="text-danger"
            >
              <FaSignOutAlt className="mr-2" /> Log out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default LoggedInNav;
