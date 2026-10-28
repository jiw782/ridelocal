import bcrypt from "bcrypt";
import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

/** Fills the database with demo users, rides, and riders who have joined them */
async function seed() {
  // Every seed user logs in with this password
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Maya",
      email: "maya@example.com",
      zip: "77001",
      bio: "Weekend loops and coffee stops.",
    },
    { name: "Chris", email: "chris@example.com", zip: "77001", bio: null },
    {
      name: "Dana",
      email: "dana@example.com",
      zip: "77001",
      bio: "New to group rides.",
    },
    {
      name: "Sam",
      email: "sam@example.com",
      zip: "77002",
      bio: "Training for my first century.",
    },
    { name: "Priya", email: "priya@example.com", zip: "77002", bio: null },
    {
      name: "Leo",
      email: "leo@example.com",
      zip: "77003",
      bio: "Sunset rides only.",
    },
    {
      name: "Alex",
      email: "alex@example.com",
      zip: "77006",
      bio: "Montrose local. Will stop for tacos.",
    },
    {
      name: "Jordan",
      email: "jordan@example.com",
      zip: "77006",
      bio: "Road bike, gravel bike, any bike.",
    },
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

    // Demo rides in 77006 on fixed dates (date is "YYYY-MM-DD", local time)
    {
      creator: "Alex",
      title: "Montrose coffee crawl",
      description: "Three coffee shops, ten easy miles, lots of talking.",
      zip: "77006",
      meetingSpot: "Menil Collection lawn",
      date: "2026-11-07",
      hour: 9,
      difficulty: "easy",
      maxRiders: 12,
      riders: ["Jordan", "Maya", "Dana", "Chris"],
    },
    {
      creator: "Jordan",
      title: "Buffalo Bayou loop",
      description:
        "Both sides of the bayou trail at a steady pace. Lights recommended.",
      zip: "77006",
      meetingSpot: "Waugh Drive Bridge",
      date: "2026-11-10",
      hour: 18,
      difficulty: "moderate",
      maxRiders: 10,
      riders: ["Alex", "Sam"],
    },
    {
      creator: "Maya",
      title: "Beginner skills clinic",
      description:
        "Practice group riding basics: signaling, spacing and stopping safely.",
      zip: "77006",
      meetingSpot: "Cherryhurst Park",
      date: "2026-11-14",
      hour: 10,
      difficulty: "easy",
      maxRiders: null,
      riders: ["Dana"],
    },
    {
      creator: "Sam",
      title: "Tuesday tempo",
      description: "Fast and focused. Expect 20+ mph on the flats.",
      zip: "77006",
      meetingSpot: "Westheimer & Montrose",
      date: "2026-11-17",
      hour: 6,
      difficulty: "hard",
      maxRiders: 4,
      // Full, so the demo can show what a full ride looks like
      riders: ["Priya", "Jordan", "Leo"],
    },
    {
      creator: "Alex",
      title: "Friday night lights ride",
      description: "A slow social ride under the city lights. Bring blinkies!",
      zip: "77006",
      meetingSpot: "Menil Collection lawn",
      date: "2026-11-20",
      hour: 19,
      difficulty: "easy",
      maxRiders: 20,
      riders: ["Leo", "Chris", "Priya"],
    },
    {
      creator: "Jordan",
      title: "Turkey burner",
      description: "Burn off Thanksgiving dinner with a moderate 25-miler.",
      zip: "77006",
      meetingSpot: "Waugh Drive Bridge",
      date: "2026-11-27",
      hour: 8,
      difficulty: "moderate",
      maxRiders: 15,
      riders: ["Alex", "Maya", "Sam", "Dana"],
    },
    {
      creator: "Priya",
      title: "Heights hill climb",
      description:
        "Up and over the Heights bridges, regrouping after each one.",
      zip: "77006",
      meetingSpot: "Fairview Street Bike Shop",
      date: "2026-12-05",
      hour: 7,
      difficulty: "hard",
      maxRiders: 8,
      riders: ["Sam"],
    },
    {
      creator: "Alex",
      title: "Holiday lights tour",
      description:
        "Cruise the best-decorated streets in Montrose. Santa hats welcome.",
      zip: "77006",
      meetingSpot: "Cherryhurst Park",
      date: "2026-12-13",
      hour: 18,
      difficulty: "easy",
      maxRiders: null,
      riders: [],
    },
  ];

  for (const ride of rides) {
    let rideDate;
    if (ride.date) {
      const [year, month, day] = ride.date.split("-").map(Number);
      rideDate = new Date(year, month - 1, day, ride.hour);
    } else {
      rideDate = new Date();
      rideDate.setDate(rideDate.getDate() + ride.daysFromNow);
      rideDate.setHours(ride.hour, 0, 0, 0);
    }

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
