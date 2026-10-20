import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Profile() {
  const { token, user } = useAuth();
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api("/users/me/rides", { token })
      .then(setRides)
      .catch((e) => setError(e.message));
  }, [token]);

  if (!token)
    return (
      <p>
        <Link to="/login">Log in</Link> to see your profile.
      </p>
    );
  if (!user) return <p>Loading...</p>;

  return (
    <>
      {user.profile_pic && (
        <img src={user.profile_pic} alt={user.name} width="120" />
      )}
      <h1>{user.name}</h1>
      <p>Zip code: {user.zip_code}</p>
      {user.bio && <p>{user.bio}</p>}

      <h2>My rides</h2>
      {error && <p role="alert">{error}</p>}
      {rides.length === 0 && <p>You haven't joined any rides yet.</p>}
      <ul>
        {rides.map((ride) => (
          <li key={ride.id}>
            <Link to={`/rides/${ride.id}`}>{ride.title}</Link>
            <p>
              {new Date(ride.ride_date).toLocaleString()} · {ride.meeting_spot}
            </p>
            <p>
              {ride.difficulty} · {ride.rider_count}
              {ride.max_riders && ` / ${ride.max_riders}`} riders
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
