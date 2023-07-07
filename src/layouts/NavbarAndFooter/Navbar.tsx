import { Link, NavLink, Outlet } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react/";
import { SpinnerLoading } from "../Utils/SpinnerLoading";


export const Navbar = () => {

  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    return <SpinnerLoading/>
  }
  if (authState.isAuthenticated) {
    console.log(authState.accessToken);
  }
  const handleLogout = async () => oktaAuth.signOut();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Luv 2 Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to={"/"} className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={"/search"} className="nav-link">
                Search Books
              </NavLink>
            </li>
            {authState?.isAuthenticated && 
             <li className="nav-item">
             <NavLink to={"/shelf"} className="nav-link">
               Shelf
             </NavLink>
              </li>
            }
            
            
            {authState?.isAuthenticated && 
            <li className="nav-item">
            <NavLink to={"/fees"} className="nav-link">
              Pay Fees
            </NavLink>
          </li>
            }
            {
              authState?.isAuthenticated && authState.accessToken?.claims.userType !== undefined &&
              <li className="nav-item">
              <NavLink to={"/admin"} className="nav-link">
                Admin
              </NavLink>
               </li>
            }
                     </ul>
          <ul className="navbar-nav ms-auto">
            {!authState.isAuthenticated?
            <li className="nav-item m-1">
            <Link to={"/login"} type="button" className="btn btn-outline-light">
              Sign in
            </Link>
            </li>:
            <li>
              <button className="btn btn-outline-light" onClick={handleLogout}>LogOut</button>
            </li>}
          </ul>
        </div>
      </div>
    </nav>
  );
};
