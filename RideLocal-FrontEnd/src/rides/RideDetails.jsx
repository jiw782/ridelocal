import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RideDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [riders, setRiders] = useState([]);
  const [error, setError] = useState(null);

  async function loadRide() {
    try {
      const [ride, riders] = await Promise.all([
        api(`/rides/${id}`),
        api(`/rides/${id}/riders`),
      ]);
      setRide(ride);
      setRiders(riders);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadRide();
  }, [id]);

  async function onJoin() {
    try {
      await api(`/rides/${id}/join`, { method: "POST", token });
      loadRide(); // refresh the rider count and list
    } catch (e) {
      setError(e.message);
    }
  }

  async function onLeave() {
    try {
      await api(`/rides/${id}/join`, { method: "DELETE", token });
      loadRide(); // refresh the rider count and list
    } catch (e) {
      setError(e.message);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this ride? Everyone who joined will lose it.")) return;
    try {
      await api(`/rides/${id}`, { method: "DELETE", token });
      navigate("/profile");
    } catch (e) {
      setError(e.message);
    }
  }

  if (!ride) return error ? <p role="alert">{error}</p> : <p>Loading...</p>;

  const hasJoined = riders.some((rider) => rider.id === user?.id);
  const isFull = ride.max_riders && ride.rider_count >= ride.max_riders;

  return (
    <>
      <h1>{ride.title}</h1>
      <p>Hosted by {ride.creator_name}</p>
      <p>{new Date(ride.ride_date).toLocaleString()}</p>
      <p>
        Meet at {ride.meeting_spot} ({ride.zip_code})
      </p>
      <p>Difficulty: {ride.difficulty}</p>
      {ride.description && <p>{ride.description}</p>}

      {user?.id === ride.creator_id && (
        <p>
          <Link to={`/rides/${id}/edit`}>Edit ride</Link>{" "}
          <button onClick={onDelete}>Delete ride</button>
        </p>
      )}

      {!user ? (
        <p>
          <Link to="/login">Log in</Link> to join this ride.
        </p>
      ) : hasJoined ? (
        <p>
          You're going!{" "}
          {ride.creator_id !== user.id && (
            <button onClick={onLeave}>Leave ride</button>
          )}
        </p>
      ) : isFull ? (
        <p>This ride is full.</p>
      ) : (
        <button onClick={onJoin}>Join ride</button>
      )}
      {error && <p role="alert">{error}</p>}

      <h2>
        Riders ({ride.rider_count}
        {ride.max_riders && ` / ${ride.max_riders}`})
      </h2>
      <ul>
        {riders.map((rider) => (
          <li key={rider.id}>{rider.name}</li>
        ))}
      </ul>
    </>
  );
}
