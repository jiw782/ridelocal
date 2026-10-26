import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  // Whenever the token changes, save it and load the user it belongs to
  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token')
      setUser(null)
      return
    }
    localStorage.setItem('token', token)
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setUser)
      .catch(() => setToken(null)) // the token expired or is invalid, so log out
  }, [token])

  async function authenticate(path, body) {
    const res = await fetch(`/api/users/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw Error(await res.text())
    const result = await res.json()
    setToken(result.token)
    setUser(result.user)
  }

  const register = (info) => authenticate('register', info)
  const login = (credentials) => authenticate('login', credentials)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
