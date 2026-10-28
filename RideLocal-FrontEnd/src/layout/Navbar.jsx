import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { BikeIcon } from "./Icon.jsx";

/** The top bar with the logo and links that change once you're logged in */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Leave whatever page you were on, so nothing from your session stays up
  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <header>
      <Link className="brand" to="/">
        <BikeIcon />
        RideLocal
      </Link>
      <nav>
        {user ? (
          <>
            <span>Hi, {user.name}!</span>
            <NavLink to="/rides/new">New ride</NavLink>
            <NavLink to="/profile">My rides</NavLink>
            <button onClick={onLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
