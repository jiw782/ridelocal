import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function NewRide() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!token) {
    return (
      <p>
        Please <Link to="/login">log in</Link> to create a ride.
      </p>
    );
  }

  async function onCreate(formData) {
    const maxRiders = formData.get("max_riders");
    const ride = {
      title: formData.get("title"),
      description: formData.get("description"),
      zip_code: formData.get("zip_code"),
      meeting_spot: formData.get("meeting_spot"),
      // datetime-local has no timezone, so convert it to UTC before sending
      ride_date: new Date(formData.get("ride_date")).toISOString(),
      difficulty: formData.get("difficulty"),
      // an empty box means no limit; "" would fail as an integer
      max_riders: maxRiders ? Number(maxRiders) : null,
    };
    try {
      const created = await api("/rides", { token, body: ride });
      navigate(`/rides/${created.id}`);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Create a ride</h1>
      <form action={onCreate}>
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Description
          <textarea name="description" />
        </label>
        <label>
          Zip code
          <input
            name="zip_code"
            defaultValue={user?.zip_code}
            inputMode="numeric"
            pattern="\d{5}"
            required
          />
        </label>
        <label>
          Meeting spot
          <input name="meeting_spot" required />
        </label>
        <label>
          Date and time
          <input type="datetime-local" name="ride_date" required />
        </label>
        <label>
          Difficulty
          <select name="difficulty">
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Max riders (optional)
          <input type="number" name="max_riders" min="1" />
        </label>
        <button>Create ride</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </>
  );
}
