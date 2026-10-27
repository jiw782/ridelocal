import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

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
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
        </svg>
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
