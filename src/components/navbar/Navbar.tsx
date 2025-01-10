// import
import { Card, Heading, TabNav, IconButton, Tooltip } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import useAuthService from "../../utils/authService";
import ComponentProtector from "../guard/ComponentProtector";

// WARN Repeated SVG
// <●> CrescerFlowerSVG
const CrescerFlowerSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="CFSVG"
    data-name="CrescerFlowerSVG"
    viewBox="0 0 120 100"
    width="42px"
    height="35px"
    opacity="1"
  >
    <defs>
      <style>
        {
          ".cls-2{stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill:#f26122}"
        }
      </style>
    </defs>
    <path
      d="M89.3 47.9c7.9.6 19.2 2.8 20.1 12.5 1.1 9-6.1 19.1-15.7 18.7-4.3-.2-7.7-3.2-10.8-6.1-2.6-2.4-5.3-4.7-7.9-7.1-3.6-3.2-10.3-8.3-5.9-13.3 2.3-2.4 6.3-2.7 9.5-3.3 3.5-.5 7-1.3 10.5-1.4h.2Z"
      style={{
        fill: "#f16122",
        stroke: "#000",
        strokeMiterlimit: 10,
        strokeWidth: 2,
      }}
    />
    <path
      d="M58.4 28.9c.1 4.4.8 11.3-2.7 14.4-2 1.7-4.9 2.1-7.3.8-1.6-.8-3.1-2.2-4.5-3.5-3.8-3.8-7.8-7.3-11-11.6-8.7-11.6 3.7-24.4 16.2-22.3 11.2 2.3 8.7 13.2 9.3 21.8v.4ZM101.9 29.7c0 5.4-2.7 9.4-7.5 10.7-7.7 2.1-15.4 3.9-23.2 5.7-4.2.9-8.5-3.5-7-7.3C67 31.3 70.8 24.3 77.1 19c4.7-3.9 10-5.3 15.7-2.5s8.5 7.7 9.1 13.1ZM29.1 69.6c-8.1.4-17.7-5.3-17.9-14.1-.2-7.3 6.9-12.3 13.6-12.8 7.8-.7 19.2 1.9 24.3 7.9 1.9 3 1.7 7.7-1 10.2-2.7 2.3-6.4 3.5-9.6 5.1-3.2 1.3-6.1 3.1-9.1 3.7h-.2ZM73.3 81.1c.5 8.7-9.1 13.6-16.5 13.5-6 0-13.2-3.8-14.6-10.1-1.3-6.2 2.9-12 6.2-17 4.1-6.8 5.7-4.8 12.5-5.9 5.9-1.7 7.6 3 9.3 8.1 1.1 3.7 2.6 7.3 3.2 11v.4Z"
      className="cls-2"
    />
    <path
      d="M70.6 51.5c0 6.9-5.5 13.1-11.3 12.9-5.6-.1-10.9-6.1-10.9-12.2s5-12.1 11.4-11.9c6.3.1 10.9 4.8 10.8 11.3Z"
      style={{
        stroke: "#000",
        strokeMiterlimit: 10,
        strokeWidth: 2,
        fill: "#f6eb00",
      }}
    />
  </svg>
);

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
          <Link to="/">Home</Link>
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
          {/* // <○> CrescerFlowerSVG */}
          <CrescerFlowerSVG />
          <Heading color="orange" size="5" className="ml-5">
            Crescer
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
