// import
import { Card, Heading, TabNav, IconButton, Tooltip } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import useAuthService from "../../services/authService";
import ComponentProtector from "../guard/ComponentProtector";


// [●] ROLES
const ROLES = {
  User: 4,
  Staff: 3,
  Admin: 2,
  Super: 1
};

// <●> LogoutSVG
const LogoutSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 64 64"
  >
    <g
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      clipPath="url(#a)"
    >
      <path
        stroke="#e5e7eb"
        d="M21.486 55.94h26.967a4.494 4.494 0 0 0 4.494-4.494V12.494A4.494 4.494 0 0 0 48.453 8H21.486a4.494 4.494 0 0 0-4.494 4.494v38.952a4.494 4.494 0 0 0 4.494 4.494Z"
      />
      <path
        stroke="orange"
        d="m28.976 26.011 5.993 5.959-5.993 6.026M34.969 31.97H11"
      />
    </g>

    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M9 6h45.947v51.94H9z" />
      </clipPath>
    </defs>
  </svg>
); // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// (✪) TabNavigation
const TabNavigation = () => {
  const location = useLocation();

  return (
    <div>
      <TabNav.Root >
        <TabNav.Link asChild active={location.pathname === "/"}>
          <Link to="/">🦀</Link>
        </TabNav.Link>

        <ComponentProtector allowedRoles={[ROLES.Admin, ROLES.Super]}>
          <TabNav.Link asChild active={location.pathname === "/settings"} >
            <Link to="/settings">Settings</Link>
          </TabNav.Link>
        </ComponentProtector>
      </TabNav.Root>

    </div>
  );
}; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// ★ Navbar
const Navbar = () => {
  const { logout } = useAuthService();

  const handleClick = () => {
    logout();
  };

  //──DOM──➤
  return (
    <Card id="navbar" variant="classic" className="mb-7 rounded-t-none">
      <div className=" flex justify-between items-center">
        <div className=" flex items-center">
          🦀
          <Heading color="orange" size="5" className="ml-5">
            Incite
          </Heading>
        </div>

        {/* // (○) TabNavigation */}
        <TabNavigation />

        {/* // <○> LogoutSVG */}
        <Tooltip content="Logout">
          <IconButton onClick={handleClick} variant="ghost">
            <LogoutSVG />
          </IconButton>
        </Tooltip>
      </div>
    </Card>
  );
}; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

export default Navbar;
