import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RideList() {
  const { user } = useAuth();
  const [searchedZip, setSearchedZip] = useState(null);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  // Show the logged-in user's zip until they search for a different one
  const zip = searchedZip ?? user?.zip_code;

  useEffect(() => {
    if (!zip) return;
    api(`/rides?zip=${zip}`)
      .then((rides) => {
        setRides(rides);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [zip]);

  function onSearch(formData) {
    setSearchedZip(formData.get("zip"));
  }

  return (
    <>
      <h1>Upcoming rides</h1>
      <form action={onSearch}>
        <label>
          Zip code
          <input
            name="zip"
            key={zip}
            defaultValue={zip}
            inputMode="numeric"
            pattern="\d{5}"
            required
          />
        </label>
        <button>Search</button>
      </form>
      {error && <p role="alert">{error}</p>}

      {zip && rides.length === 0 && <p>No upcoming rides in {zip}.</p>}
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
