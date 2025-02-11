import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../../context/auth"; 
import toast from "react-hot-toast";
import SearchInput from "../../Form/SearchInput/SearchInput";
import useCategory from "../../../hooks/useCategory"; // import custom hook which returns all the categories
import { useCart } from "../../../context/cart";
import { Badge } from "antd";
import {MdShoppingCart} from "react-icons/md" //first two characters are name of library after slash you need to add that
import "./Header.css"
const Header = () => {
  const [auth, setAuth] = useAuth(); // globally created use state
  const [cart] = useCart();
  const categories = useCategory();
  const handleLogout = () => {  // function for getting logout
    setAuth({
      ...auth, // keeping the other things in auth as it is change only below things
      user: null,
      token: "",
    }); 
    localStorage.removeItem("auth"); // removing login data from local storage
    toast.success("Logout Successfully");
  };
  return (
    <>
 
    {/* We are styling navbar into index.css  */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid my-nav-container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand my-nav-item"> 
              🛒 ShopNow 
            </Link> 
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 my-nav-item">
              <SearchInput />
              <li className="nav-item ">
                <NavLink to="/" className="nav-link my-nav-item"> {/* NavLink is same as ancare tag, we need to use NavLink in react, href is replaced by to  */}
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown my-nav-item">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu listContaint">
                  <li>
                    <Link className="dropdown-item listContaintitemTop" to={"/categories"}>
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li className="">
                      <Link
                        className="dropdown-item listContaintitem"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {!auth?.user ? ( //we have user inside the auth if user does not exists then show login and register otherwise show below logout and other part 
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">  {/* drop down in the navigation bar when user is logged in  */}
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name} {/* first we check for auth and after that we check user and after that we get the name  */}
                    </NavLink>
                    <ul className="dropdown-menu listContaint">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user" // if role is 1 then go to the /dashboard/admin other wise go to /dashboard/user
                          }`}
                          className="dropdown-item listContaintitem header-dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}  //as we click on logout button this function will run
                          to="/login"
                          className="dropdown-item listContaintitem"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item ">
                <NavLink to="/cart" className="nav-link my-nav-item">
                  <Badge count={cart?.length} showZero offset={[10, -5]}>
                  <MdShoppingCart style={{
                    color:"white",
                    fontSize: "24px"
                  }}/> Cart
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;


