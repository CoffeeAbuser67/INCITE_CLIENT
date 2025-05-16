// import
import { Heading, TabNav, Box } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";


// (✪) TabNavigation
const TabNavigation = () => {
  const location = useLocation();

  return (
    <div>
      <TabNav.Root >
        <TabNav.Link asChild active={location.pathname === "/"}>
          <Link to="/">🦀</Link>
        </TabNav.Link>

        <TabNav.Link asChild active={location.pathname === "/settings"} >
          <Link to="/settings">Settings</Link>
        </TabNav.Link>

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
