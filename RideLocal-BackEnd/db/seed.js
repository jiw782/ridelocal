import bcrypt from "bcrypt";
import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Every seed user logs in with this password
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    { name: "Maya", email: "maya@example.com", zip: "77001", bio: "Weekend loops and coffee stops." },
    { name: "Chris", email: "chris@example.com", zip: "77001", bio: null },
    { name: "Dana", email: "dana@example.com", zip: "77001", bio: "New to group rides." },
    { name: "Sam", email: "sam@example.com", zip: "77002", bio: "Training for my first century." },
    { name: "Priya", email: "priya@example.com", zip: "77002", bio: null },
    { name: "Leo", email: "leo@example.com", zip: "77003", bio: "Sunset rides only." },
  ];

  const userIds = {};
  for (const user of users) {
    const {
      rows: [{ id }],
    } = await db.query(
      `INSERT INTO users (name, email, password_hash, zip_code, bio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [user.name, user.email, passwordHash, user.zip, user.bio],
    );
    userIds[user.name] = id;
  }

  // daysFromNow keeps every ride in the future, so they always show as upcoming
  const rides = [
    {
      creator: "Maya",
      title: "Saturday morning loop",
      description: "A relaxed loop through downtown at a chatty pace.",
      zip: "77001",
      meetingSpot: "Main St Coffee",
      daysFromNow: 2,
      hour: 8,
      difficulty: "easy",
      maxRiders: 10,
      riders: ["Chris", "Dana", "Sam"],
    },
    {
      creator: "Chris",
      title: "Beginner meetup",
      description: "Never ridden in a group? Start here.",
      zip: "77001",
      meetingSpot: "Library steps",
      daysFromNow: 5,
      hour: 7,
      difficulty: "easy",
      maxRiders: null,
      riders: ["Dana"],
    },
    {
      creator: "Sam",
      title: "Sunset park ride",
      description: "Rolling hills, steady pace, back before dark.",
      zip: "77002",
      meetingSpot: "Hermann Park gate",
      daysFromNow: 3,
      hour: 18,
      difficulty: "moderate",
      maxRiders: 8,
      riders: ["Priya", "Maya", "Leo"],
    },
    {
      creator: "Priya",
      title: "Hill repeats",
      description: "Six climbs, regroup at the top of each one.",
      zip: "77002",
      meetingSpot: "Bike shop on 5th",
      daysFromNow: 7,
      hour: 6,
      difficulty: "hard",
      maxRiders: 6,
      riders: ["Sam"],
    },
    {
      creator: "Leo",
      title: "Bayou trail cruise",
      description: null,
      zip: "77003",
      meetingSpot: "Trailhead parking lot",
      daysFromNow: 4,
      hour: 17,
      difficulty: "easy",
      maxRiders: 12,
      riders: [],
    },
  ];

  for (const ride of rides) {
    const rideDate = new Date();
    rideDate.setDate(rideDate.getDate() + ride.daysFromNow);
    rideDate.setHours(ride.hour, 0, 0, 0);

    const {
      rows: [{ id: rideId }],
    } = await db.query(
      `INSERT INTO rides
         (creator_id, title, description, zip_code, meeting_spot, ride_date, difficulty, max_riders)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        userIds[ride.creator],
        ride.title,
        ride.description,
        ride.zip,
        ride.meetingSpot,
        rideDate,
        ride.difficulty,
        ride.maxRiders,
      ],
    );

    // The host is a member of their own ride, so they count toward max_riders
    for (const rider of [ride.creator, ...ride.riders]) {
      await db.query(
        `INSERT INTO ride_members (ride_id, user_id) VALUES ($1, $2)`,
        [rideId, userIds[rider]],
      );
    }
  }
}
