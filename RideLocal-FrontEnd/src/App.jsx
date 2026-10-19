import { Route, Routes } from 'react-router'
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import Navbar from './layout/Navbar.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<h1>RideLocal</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}
