// import
import { Heading, TabNav, Box } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import ComponentProtector from "../guard/ComponentProtector";

// [●] ROLES
const ROLES = {
  User: 4,
  Staff: 3,
  Admin: 2,
  Super: 1
};

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

  return (   //── ⋙────DOM──➤
    <Box id="navbar" className="w-full h-14 absolute bg-white-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 z-10">
      <div className=" flex justify-between items-center">
        <div className=" flex items-center">
          🦀
          <Heading color="orange" size="5" className="ml-5">
            Incite
          </Heading>
        </div>

        {/* // (○) TabNavigation */}
        <TabNavigation />

      </div>
    </Box>
  );
}; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

export default Navbar;
