/** "Sat, Dec 5, 8:00 AM" in the viewer's own time zone */
export function formatRideDate(isoDate) {
  return new Date(isoDate).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
