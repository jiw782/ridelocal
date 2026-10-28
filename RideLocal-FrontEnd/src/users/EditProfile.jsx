import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

/** The form for editing your name, zip code, bio and picture */
export default function EditProfile() {
  const { token, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!token)
    return (
      <p>
        <Link to="/login">Log in</Link> to edit your profile.
      </p>
    );
  if (!user) return <p className="loading">Loading...</p>;

  async function onSave(formData) {
    const changes = {
      name: formData.get("name"),
      zip_code: formData.get("zip_code"),
      bio: formData.get("bio"),
      profile_pic: formData.get("profile_pic"),
    };
    try {
      const updated = await api("/users/me", {
        method: "PUT",
        token,
        body: changes,
      });
      setUser(updated); // so the navbar and profile show the new details
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <h1>Edit profile</h1>
      <form className="card" action={onSave}>
        <label>
          Name
          <input name="name" defaultValue={user.name} required />
        </label>
        <label>
          Zip code
          <input
            name="zip_code"
            defaultValue={user.zip_code}
            inputMode="numeric"
            pattern="\d{5}"
            required
          />
        </label>
        <label>
          Bio
          <textarea name="bio" defaultValue={user.bio ?? ""} />
        </label>
        <label>
          Profile picture URL
          <input
            type="url"
            name="profile_pic"
            defaultValue={user.profile_pic ?? ""}
          />
        </label>
        <button>Save changes</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <Link className="button secondary" to="/profile">
        Cancel
      </Link>
    </>
  );
}
