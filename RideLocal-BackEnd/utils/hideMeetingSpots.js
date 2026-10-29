/** Meeting spots are for logged-in users only, so visitors get rides without them */
export function hideMeetingSpots(rides, user) {
  if (user) return rides;
  return rides.map(({ meeting_spot, ...ride }) => ride);
}
