import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation(); // gives current route

  // simple check
  // If user is on /login → hideNavbar = true
  // If user is on /register → hideNavbar = true
  // Otherwise → hideNavbar = false
 
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";  

  return (
    <>
      <Header />
      <Navbar />
      {/* Show navbar only when NOT login/register 
      If hideNavbar is true, navbar does NOT show
      If hideNavbar is false, navbar shows */}
      
    
      {!hideNavbar && <Navbar />}

      <Outlet />

      {!hideNavbar && <Footer />}  
      
    </>
  );
};

export default Layout;
