import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatRideDate } from "./formatDate.js";

export default function RideDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [ride, setRide] = useState(null);
  const [riders, setRiders] = useState([]);
  const [error, setError] = useState(null);

  async function loadRide() {
    try {
      const [ride, riders] = await Promise.all([
        api(`/rides/${id}`, { token }),
        api(`/rides/${id}/riders`, { token }),
      ]);
      setRide(ride);
      setRiders(riders);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (token) loadRide();
  }, [id, token]);

  async function onJoin() {
    try {
      await api(`/rides/${id}/join`, { method: "POST", token });
      setError(null); // clear any message left from an earlier attempt
      loadRide(); // refresh the rider count and list
    } catch (e) {
      setError(e.message);
    }
  }

  async function onLeave() {
    try {
      await api(`/rides/${id}/join`, { method: "DELETE", token });
      setError(null);
      loadRide();
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

  if (!token) {
    return (
      <section className="card auth locked">
        <h1>Log in to see this ride</h1>
        <p>
          Ride details, the meeting spot and who's going are only shown to
          RideLocal members.
        </p>
        {/* from sends them back here once they've logged in */}
        <Link className="button" to="/login" state={{ from: location.pathname }}>
          Log in
        </Link>{" "}
        <Link
          className="button secondary"
          to="/register"
          state={{ from: location.pathname }}
        >
          Create an account
        </Link>
      </section>
    );
  }

  if (!ride) return error ? <p role="alert">{error}</p> : <p className="loading">Loading...</p>;

  const isHost = user?.id === ride.creator_id;
  const hasJoined = riders.some((rider) => rider.id === user?.id);
  const isFull = ride.max_riders && ride.rider_count >= ride.max_riders;

  return (
    <>
      <article className="card ride-details">
        <h1>{ride.title}</h1>
        <p>
          Hosted by <Link to={`/users/${ride.creator_id}`}>{ride.creator_name}</Link>
        </p>
        <dl>
          <dt>When</dt>
          <dd>{formatRideDate(ride.ride_date)}</dd>
          <dt>Where</dt>
          <dd>
            {ride.meeting_spot} ({ride.zip_code})
          </dd>
          <dt>Difficulty</dt>
          <dd>
            <span className={`badge badge-${ride.difficulty}`}>
              {ride.difficulty}
            </span>
          </dd>
        </dl>
        {ride.description && <p>{ride.description}</p>}

        <div className="actions">
          {isHost ? (
            <>
              <Link className="button secondary" to={`/rides/${id}/edit`}>
                Edit ride
              </Link>
              <button className="danger" onClick={onDelete}>
                Delete ride
              </button>
            </>
          ) : hasJoined ? (
            <>
              <p>You're going!</p>
              <button className="secondary" onClick={onLeave}>
                Leave ride
              </button>
            </>
          ) : isFull ? (
            <p>This ride is full.</p>
          ) : (
            <button onClick={onJoin}>Join ride</button>
          )}
        </div>
        {error && <p role="alert">{error}</p>}
      </article>

      <h2>
        Riders ({ride.rider_count}
        {ride.max_riders && ` / ${ride.max_riders}`})
      </h2>
      <ul className="rider-list">
        {riders.map((rider) => (
          <li key={rider.id}>
            <Link to={`/users/${rider.id}`}>
              {/* Each rider gets one of four colors, picked by their id */}
              <span className={`initial initial-${rider.id % 4}`} aria-hidden="true">
                {rider.name[0]}
              </span>
              {rider.name}
              {rider.id === ride.creator_id && " (host)"}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
