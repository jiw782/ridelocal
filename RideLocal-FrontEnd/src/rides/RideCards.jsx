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
                {ride.max_riders && ` / ${ride.max_riders}`} riders
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
