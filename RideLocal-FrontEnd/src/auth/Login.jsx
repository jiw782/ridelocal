import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  async function onLogin(formData) {
    const email = formData.get('email')
    const password = formData.get('password')
    try {
      await login({ email, password })
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="auth">
      <h1>Log in</h1>
      <form className="card" action={onLogin}>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Log in</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <p>
        Need an account? <Link to="/register">Register here.</Link>
      </p>
    </div>
  )
}
