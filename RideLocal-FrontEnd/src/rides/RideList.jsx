import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import RideCards from "./RideCards.jsx";

const steps = [
  {
    title: "Find",
    text: "Search your zip code for group rides happening nearby.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    title: "Join",
    text: "Pick a ride at your pace, from easy cruises to hard climbs.",
    icon: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" />
      </>
    ),
  },
  {
    title: "Ride",
    text: "Meet at the spot, roll out together, and make new riding friends.",
    icon: (
      <>
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
      </>
    ),
  },
];

export default function RideList() {
  const { user } = useAuth();
  // The searched zip lives in the URL (/?zip=77001), so searches can be
  // shared and the back button works
  const [searchParams, setSearchParams] = useSearchParams();
  const [rides, setRides] = useState(null);
  const [error, setError] = useState(null);

  // Show the logged-in user's zip until they search for a different one.
  // Visitors with no zip see the next rides anywhere.
  const zip = searchParams.get("zip") ?? user?.zip_code;

  useEffect(() => {
    api(zip ? `/rides?zip=${zip}` : "/rides")
      .then((rides) => {
        setRides(rides);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [zip]);

  // City and state for the searched zip, from Zippopotam via our backend
  const [place, setPlace] = useState(null);
  useEffect(() => {
    setPlace(null);
    if (zip) api(`/zips/${zip}`).then(setPlace).catch(() => {});
  }, [zip]);

  function onSearch(formData) {
    setSearchParams({ zip: formData.get("zip") });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Group rides in your neighborhood</p>
          <h1>Ride with your neighbors.</h1>
          <p>
            Find a group ride near you, or host your own and meet riders who
            live down the street.
          </p>
          <form className="search" action={onSearch} role="search">
            <label>
              <span className="visually-hidden">Zip code</span>
              <input
                name="zip"
                key={zip}
                defaultValue={zip}
                placeholder="Enter your zip code"
                inputMode="numeric"
                pattern="\d{5}"
                required
              />
            </label>
            <button>Find rides</button>
          </form>
          {!user && (
            <p className="hero-signup">
              New here? <Link to="/register">Create a free account</Link>
            </p>
          )}
        </div>
        {/* Rolling hills and a road along the bottom of the banner */}
        <svg
          className="hero-art"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 120 C200 60 350 140 550 90 S900 40 1200 100 V200 H0Z"
            fill="#ffffff"
            opacity="0.08"
          />
          <path
            d="M0 160 C250 110 450 170 700 130 S1000 100 1200 140 V200 H0Z"
            fill="#ffffff"
            opacity="0.12"
          />
          <path
            d="M0 185 C300 160 600 195 900 170 S1100 165 1200 175"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeDasharray="18 14"
            opacity="0.8"
          />
        </svg>
      </section>

      {!user && (
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.title}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {step.icon}
              </svg>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="results-header">
        <div>
          <h2>
            {zip
              ? `Upcoming rides in ${place ? `${place.city}, ${place.state} ` : ""}${zip}`
              : "Upcoming rides"}
          </h2>
          {rides && (
            <p>
              {rides.length} {rides.length === 1 ? "ride" : "rides"}
              {!user && zip && (
                <>
                  {" "}
                  · <Link to="/">Show all</Link>
                </>
              )}
            </p>
          )}
        </div>
        {user && (
          <Link className="button" to="/rides/new">
            Host a ride
          </Link>
        )}
      </div>

      {error && <p role="alert">{error}</p>}
      {rides?.length === 0 && (
        <p className="empty">
          No upcoming rides here yet.{" "}
          <Link to="/rides/new">Host the first one?</Link>
        </p>
      )}
      {rides && <RideCards rides={rides} />}
    </>
  );
}
