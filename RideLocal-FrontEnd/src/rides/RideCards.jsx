import { Link } from "react-router";
import { formatRideDate } from "./formatDate.js";

/** A list of rides as cards, used by the ride search and profile pages */
export default function RideCards({ rides }) {
  return (
    <ul className="ride-list">
      {rides.map((ride) => {
        const date = new Date(ride.ride_date);
        return (
          <li key={ride.id}>
            {/* The full date is in the text below, so screen readers skip this */}
            <div className="date-tile" aria-hidden="true">
              <span>{date.toLocaleString(undefined, { month: "short" })}</span>
              <span>{date.getDate()}</span>
            </div>
            <div>
              <Link to={`/rides/${ride.id}`}>{ride.title}</Link>
              <p>
                {formatRideDate(ride.ride_date)} · {ride.meeting_spot}
              </p>
              <p>
                <span className={`badge badge-${ride.difficulty}`}>
                  {ride.difficulty}
                </span>{" "}
                {ride.rider_count}
                {ride.max_riders && ` / ${ride.max_riders}`}{" "}
                {ride.rider_count === 1 && !ride.max_riders ? "rider" : "riders"}
              </p>
              {/* How full the ride is; the count above already says it in words */}
              {ride.max_riders && (
                <div className="spots" aria-hidden="true">
                  <div
                    style={{
                      width: `${Math.min(100, (ride.rider_count / ride.max_riders) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
