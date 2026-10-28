import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import RideCards from "../rides/RideCards.jsx";

/** Your own profile, with the rides you're hosting and the rides you've joined */
export default function Profile() {
  const { token, user } = useAuth();
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api("/users/me/rides", { token })
      .then(setRides)
      .catch((error) => setError(error.message));
  }, [token]);

  if (!token)
    return (
      <p className="empty">
        <Link to="/login">Log in</Link> to see your profile.
      </p>
    );
  if (!user) return <p className="loading">Loading...</p>;

  // Hosts are riders on their own rides too, so split them out
  const hosting = rides.filter((ride) => ride.creator_id === user.id);
  const joined = rides.filter((ride) => ride.creator_id !== user.id);

  return (
    <>
      <section className="card profile-header">
        {user.profile_pic && (
          <img className="avatar" src={user.profile_pic} alt="" />
        )}
        <div>
          <h1>{user.name}</h1>
          <p>Zip code: {user.zip_code}</p>
          {user.bio && <p>{user.bio}</p>}
          <Link to="/profile/edit">Edit profile</Link>
        </div>
      </section>

      {error && <p role="alert">{error}</p>}

      <h2>Hosting</h2>
      {hosting.length === 0 ? (
        <p className="empty">
          You aren't hosting any upcoming rides.{" "}
          <Link to="/rides/new">Create one?</Link>
        </p>
      ) : (
        <RideCards rides={hosting} />
      )}

      <h2>Joined</h2>
      {joined.length === 0 ? (
        <p className="empty">
          You haven't joined any upcoming rides. <Link to="/">Find one?</Link>
        </p>
      ) : (
        <RideCards rides={joined} />
      )}
    </>
  );
}
