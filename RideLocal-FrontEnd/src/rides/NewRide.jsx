import { Link, useNavigate } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import RideForm from "./RideForm.jsx";

export default function NewRide() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return (
      <p>
        Please <Link to="/login">log in</Link> to create a ride.
      </p>
    );
  }

  async function onCreate(ride) {
    const created = await api("/rides", { token, body: ride });
    navigate(`/rides/${created.id}`);
  }

  return (
    <>
      <h1>Create a ride</h1>
      <RideForm
        // key remounts the form once the user loads, so their zip fills in
        key={user?.id}
        ride={{ zip_code: user?.zip_code }}
        onSubmit={onCreate}
        submitLabel="Create ride"
      />
    </>
  );
}
