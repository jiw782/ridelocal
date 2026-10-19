import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RideDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
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

      {!user ? (
        <p>
          <Link to="/login">Log in</Link> to join this ride.
        </p>
      ) : hasJoined ? (
        <p>You're going!</p>
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
