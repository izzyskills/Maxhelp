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
    navigate("/onboarding");
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <li className="flex items-center gap-x-2 p-1 text-[1.05rem]">
        <TbHomeDown className="text-[#90A4AE]" />
        <Link to="/" className="flex items-center" aria-label="Home">
          Home
        </Link>
      </li>
      <li className="flex items-center gap-x-2 p-1 text-[1.05rem]">
        <IoPeopleSharp className="text-[#90A4AE]" />
        <Link to="/about" className="flex items-center" aria-label="About Us">
          About Us
        </Link>
      </li>
    </ul>
  );

  return (
    <Navbar onMenuOpenChange={setOpenNav}>
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
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <div className="hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              fullWidth
              variant="gradient"
              size="sm"
              color="blue"
              className="hidden lg:inline-block py-2 text-[1.05rem]"
              onClick={redirect}
            >
              <span>Try it Now</span>
            </Button>
          </div>
        </div>
      </NavbarContent>
      <NavbarMenu open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex items-center gap-x-1">
            <Button
              variant="gradient"
              color="blue"
              size="text-[1.05rem]"
              className="w-6/2"
              onClick={redirect}
            >
              <span>Try it Now</span>
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarList;
