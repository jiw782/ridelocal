import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

/** The sign-up form */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  async function onRegister(formData) {
    try {
      await register({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        zip_code: formData.get("zip_code"),
      });
      // Go back to the page that sent them here, like a ride they wanted to see
      navigate(location.state?.from ?? "/");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="auth">
      <h1>Register</h1>
      <form className="card" action={onRegister}>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <label>
          Zip code
          <input name="zip_code" inputMode="numeric" pattern="\d{5}" required />
        </label>
        <button>Register</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Log in here.</Link>
      </p>
    </div>
  );
}
