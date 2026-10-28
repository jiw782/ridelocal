// Zip code lookups from Zippopotam (https://api.zippopotam.us), free with no API key
const cache = new Map();

/** City, state and coordinates for a US zip code, or null if the zip doesn't exist */
export async function lookupZip(zip) {
  if (!/^\d{5}$/.test(zip)) return null;
  if (cache.has(zip)) return cache.get(zip);

  const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (res.status === 404) {
    cache.set(zip, null);
    return null;
  }
  if (!res.ok) throw Error(`Zippopotam returned ${res.status}`);

  const data = await res.json();
  const place = data.places[0];
  const location = {
    zip,
    city: place["place name"],
    state: place["state abbreviation"],
    lat: Number(place.latitude),
    lng: Number(place.longitude),
  };
  cache.set(zip, location);
  return location;
}
