import { useEffect, useState } from "react";
import { api } from "../api.js";

/** City and state for a zip code (from Zippopotam via our backend), or null while loading or if not found */
export function usePlace(zip) {
  const [place, setPlace] = useState(null);

  useEffect(() => {
    setPlace(null);
    if (zip)
      api(`/zips/${zip}`)
        .then(setPlace)
        .catch(() => {});
  }, [zip]);

  return place;
}
