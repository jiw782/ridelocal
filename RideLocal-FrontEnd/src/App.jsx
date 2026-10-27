import { Route, Routes } from "react-router";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Navbar from "./layout/Navbar.jsx";
import RideList from "./rides/RideList.jsx";
import RideDetails from "./rides/RideDetails.jsx";
import NewRide from "./rides/NewRide.jsx";
import EditRide from "./rides/EditRide.jsx";
import Profile from "./users/Profile.jsx";
import EditProfile from "./users/EditProfile.jsx";
import UserProfile from "./users/UserProfile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<RideList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/rides/new" element={<NewRide />} />
          <Route path="/rides/:id/edit" element={<EditRide />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/users/:id" element={<UserProfile />} />
        </Routes>
      </main>
    </>
  );
}
