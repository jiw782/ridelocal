import { useState } from "react";

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time, not a UTC ISO string
function toLocalInput(isoDate) {
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** The create and edit ride form. `ride` fills in the fields when editing */
export default function RideForm({ ride = {}, onSubmit, submitLabel }) {
  const [error, setError] = useState(null);

  async function onSave(formData) {
    const maxRiders = formData.get("max_riders");
    try {
      await onSubmit({
        title: formData.get("title"),
        description: formData.get("description"),
        zip_code: formData.get("zip_code"),
        meeting_spot: formData.get("meeting_spot"),
        // datetime-local has no timezone, so convert it to UTC before sending
        ride_date: new Date(formData.get("ride_date")).toISOString(),
        difficulty: formData.get("difficulty"),
        // an empty box means no limit; "" would fail as an integer
        max_riders: maxRiders ? Number(maxRiders) : null,
      });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form action={onSave}>
      <label>
        Title
        <input name="title" defaultValue={ride.title} required />
      </label>
      <label>
        Description
        <textarea name="description" defaultValue={ride.description ?? ""} />
      </label>
      <label>
        Zip code
        <input
          name="zip_code"
          defaultValue={ride.zip_code}
          inputMode="numeric"
          pattern="\d{5}"
          required
        />
      </label>
      <label>
        Meeting spot
        <input name="meeting_spot" defaultValue={ride.meeting_spot} required />
      </label>
      <label>
        Date and time
        <input
          type="datetime-local"
          name="ride_date"
          defaultValue={ride.ride_date && toLocalInput(ride.ride_date)}
          required
        />
      </label>
      <label>
        Difficulty
        <select name="difficulty" defaultValue={ride.difficulty ?? "easy"}>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <label>
        Max riders (optional)
        <input
          type="number"
          name="max_riders"
          defaultValue={ride.max_riders ?? ""}
          min="1"
        />
      </label>
      <button>{submitLabel}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
