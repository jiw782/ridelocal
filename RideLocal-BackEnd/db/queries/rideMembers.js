import db from "#db/client";

/**
 * Adds a user to a ride. Returns undefined instead of joining if the ride
 * doesn't exist, is already full, or the user has already joined.
 */
export async function joinRide(rideId, userId) {
  const sql = `
  INSERT INTO ride_members (ride_id, user_id)
  SELECT $1, $2
  FROM rides
  WHERE rides.id = $1
    AND (
      rides.max_riders IS NULL
      OR (SELECT COUNT(*) FROM ride_members WHERE ride_id = $1) < rides.max_riders
    )
  ON CONFLICT DO NOTHING
  RETURNING *
  `;
  const {
    rows: [member],
  } = await db.query(sql, [rideId, userId]);
  return member;
}

/** Everyone who has joined a ride, with what the riders list needs to show them */
export async function getRidersByRideId(rideId) {
  const sql = `
  SELECT users.id, users.name, users.profile_pic
  FROM ride_members
  JOIN users ON users.id = ride_members.user_id
  WHERE ride_members.ride_id = $1
  ORDER BY users.name
  `;
  const { rows: riders } = await db.query(sql, [rideId]);
  return riders;
}

/** Removes a user from a ride. Returns undefined if they hadn't joined it */
export async function leaveRide(rideId, userId) {
  const sql = `
  DELETE FROM ride_members
  WHERE ride_id = $1 AND user_id = $2
  RETURNING *
  `;
  const {
    rows: [member],
  } = await db.query(sql, [rideId, userId]);
  return member;
}
