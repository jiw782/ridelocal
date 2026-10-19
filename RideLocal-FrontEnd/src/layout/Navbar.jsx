import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header>
      <Link to="/">RideLocal</Link>
      <nav>
        {user ? (
          <>
            <span>Hi, {user.name}!</span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
