import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  async function onRegister(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const zip_code = formData.get('zip_code')
    try {
      await register({ name, email, password, zip_code })
      navigate('/')
    } catch (e) {
      setError(e.message)
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
  )
}
