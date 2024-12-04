import React, { useEffect } from "react";
import { TbHomeDown } from "react-icons/tb";
import { IoPeopleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import DarkMode from "./DarkMode";

const NavbarList = () => {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const redirect = () => {
    navigate("/onboarding/login");
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-6">
      {/* <li className="flex items-center gap-x-2 p-1 text-[1.05rem]"> */}
      {/*   <TbHomeDown className="text-[#90A4AE]" /> */}
      {/*   <Link to="/" className="flex items-center" aria-label="Home"> */}
      {/*     Home */}
      {/*   </Link> */}
      {/* </li> */}
      {/* <li className="flex items-center gap-x-2 p-1 text-[1.05rem]"> */}
      {/*   <IoPeopleSharp className="text-[#90A4AE]" /> */}
      {/*   <Link to="/about" className="flex items-center" aria-label="About Us"> */}
      {/*     About Us */}
      {/*   </Link> */}
      {/* </li> */}
    </ul>
  );

  return (
    <Navbar className="bg-background-300" onMenuOpenChange={setOpenNav}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={openNav ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="mr-4 cursor-pointer py-1.5 text-[1.05rem]">
            MaxHelp Enterprises
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <div className="hidden md:flex">{navList}</div>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4" justify="end">
        <DarkMode />
        <Button size="sm" color="primary" variant="shadow" onClick={redirect}>
          <span>Log In As Staff</span>
        </Button>
      </NavbarContent>
      <NavbarMenu open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button
            color="primary"
            size="  text-[1.05rem]"
            variant="shadow"
            onClick={redirect}
          >
            <span>Log In As Staff</span>
          </Button>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarList;
