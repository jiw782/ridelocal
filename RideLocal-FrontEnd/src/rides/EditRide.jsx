import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import RideForm from "./RideForm.jsx";

export default function EditRide() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/rides/${id}`)
      .then(setRide)
      .catch((e) => setError(e.message));
  }, [id]);

  if (!token) {
    return (
      <p>
        Please <Link to="/login">log in</Link> to edit a ride.
      </p>
    );
  }
  if (!ride || !user)
    return error ? <p role="alert">{error}</p> : <p>Loading...</p>;
  if (ride.creator_id !== user.id) return <p>Only the host can edit this ride.</p>;

  async function onSave(changes) {
    await api(`/rides/${id}`, { method: "PUT", token, body: changes });
    navigate(`/rides/${id}`);
  }

  return (
    <>
      <h1>Edit ride</h1>
      <RideForm ride={ride} onSubmit={onSave} submitLabel="Save changes" />
      <Link to={`/rides/${id}`}>Cancel</Link>
    </>
  );
}
