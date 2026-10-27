import db from "#db/client";

export async function createRide({
  creator_id,
  title,
  description,
  zip_code,
  meeting_spot,
  ride_date,
  difficulty,
  max_riders,
}) {
  const sql = `
  INSERT INTO rides
    (creator_id, title, description, zip_code, meeting_spot, ride_date, difficulty, max_riders)
  VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'easy'), $8)
  RETURNING *
  `;
  const {
    rows: [ride],
  } = await db.query(sql, [
    creator_id,
    title,
    description,
    zip_code,
    meeting_spot,
    ride_date,
    difficulty,
    max_riders,
  ]);
  return ride;
}

/** Upcoming rides in a zip code, soonest first, with how many riders have joined */
export async function getRidesByZip(zip_code) {
  const sql = `
  SELECT rides.*, COUNT(ride_members.user_id)::int AS rider_count
  FROM rides
  LEFT JOIN ride_members ON ride_members.ride_id = rides.id
  WHERE rides.zip_code = $1
    AND rides.ride_date >= now()
  GROUP BY rides.id
  ORDER BY rides.ride_date
  `;
  const { rows: rides } = await db.query(sql, [zip_code]);
  return rides;
}

/** One ride with the host's name and how many riders have joined */
export async function getRideById(id) {
  const sql = `
  SELECT
    rides.*,
    users.name AS creator_name,
    (SELECT COUNT(*)::int FROM ride_members WHERE ride_id = rides.id) AS rider_count
  FROM rides
  JOIN users ON users.id = rides.creator_id
  WHERE rides.id = $1
  `;
  const {
    rows: [ride],
  } = await db.query(sql, [id]);
  return ride;
}

/** Upcoming rides a user has joined, soonest first, with how many riders have joined */
export async function getRidesByUserId(user_id) {
  const sql = `
  SELECT
    rides.*,
    (SELECT COUNT(*)::int FROM ride_members WHERE ride_id = rides.id) AS rider_count
  FROM rides
  JOIN ride_members ON ride_members.ride_id = rides.id
  WHERE ride_members.user_id = $1
    AND rides.ride_date >= now()
  ORDER BY rides.ride_date
  `;
  const { rows: rides } = await db.query(sql, [user_id]);
  return rides;
}

/** Replaces a ride's details. Returns undefined if the ride doesn't exist */
export async function updateRide(
  id,
  {
    title,
    description,
    zip_code,
    meeting_spot,
    ride_date,
    difficulty,
    max_riders,
  },
) {
  const sql = `
  UPDATE rides
  SET
    title = $2,
    description = $3,
    zip_code = $4,
    meeting_spot = $5,
    ride_date = $6,
    difficulty = COALESCE($7, 'easy'),
    max_riders = $8
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [ride],
  } = await db.query(sql, [
    id,
    title,
    description,
    zip_code,
    meeting_spot,
    ride_date,
    difficulty,
    max_riders,
  ]);
  return ride;
}

/** Deletes a ride; its ride_members rows go with it (ON DELETE CASCADE) */
export async function deleteRide(id) {
  const sql = `
  DELETE FROM rides
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [ride],
  } = await db.query(sql, [id]);
  return ride;
}

/** Upcoming rides a user is hosting, soonest first, with how many riders have joined */
export async function getRidesByCreatorId(creator_id) {
  const sql = `
  SELECT
    rides.*,
    (SELECT COUNT(*)::int FROM ride_members WHERE ride_id = rides.id) AS rider_count
  FROM rides
  WHERE rides.creator_id = $1
    AND rides.ride_date >= now()
  ORDER BY rides.ride_date
  `;
  const { rows: rides } = await db.query(sql, [creator_id]);
  return rides;
}

/** The next upcoming rides anywhere, soonest first, for visitors who haven't searched */
export async function getUpcomingRides(limit = 20) {
  const sql = `
  SELECT rides.*, COUNT(ride_members.user_id)::int AS rider_count
  FROM rides
  LEFT JOIN ride_members ON ride_members.ride_id = rides.id
  WHERE rides.ride_date >= now()
  GROUP BY rides.id
  ORDER BY rides.ride_date
  LIMIT $1
  `;
  const { rows: rides } = await db.query(sql, [limit]);
  return rides;
}
