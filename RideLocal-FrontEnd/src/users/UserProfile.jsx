import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import RideCards from "../rides/RideCards.jsx";

/** Another rider's public profile and the rides they're hosting */
export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api(`/users/${id}`), api(`/users/${id}/rides`)])
      .then(([user, rides]) => {
        setUser(user);
        setRides(rides);
      })
      .catch((error) => setError(error.message));
  }, [id]);

  // Your own page has more on it, like the edit link
  if (currentUser && String(currentUser.id) === id)
    return <Navigate to="/profile" replace />;
  if (!user)
    return error ? (
      <p role="alert">{error}</p>
    ) : (
      <p className="loading">Loading...</p>
    );

  return (
    <>
      <section className="card profile-header">
        {user.profile_pic && (
          <img className="avatar" src={user.profile_pic} alt="" />
        )}
        <div>
          <h1>{user.name}</h1>
          <p>Rides around {user.zip_code}</p>
          {user.bio && <p>{user.bio}</p>}
        </div>
      </section>

      <h2>Hosting</h2>
      {rides.length === 0 ? (
        <p className="empty">{user.name} isn't hosting any upcoming rides.</p>
      ) : (
        <RideCards rides={rides} />
      )}
    </>
  );
}
