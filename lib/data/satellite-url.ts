/**
 * Client-safe satellite imagery URL builder.
 *
 * Priority:
 *  1. Mapbox Static Images API (if NEXT_PUBLIC_MAPBOX_TOKEN is set)
 *  2. Esri World Imagery export (free, no token required — always works)
 */

const ZOOM = 13;
const W = 600;
const H = 400;

/**
 * Returns a URL for a satellite image centred on [lat, lon].
 * Safe to call from the browser — no server required.
 */
export function buildSatelliteUrl(lat: number, lon: number): string {
  const token =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_MAPBOX_TOKEN
      : undefined;

  if (token) {
    // Mapbox Static Images
    return (
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/` +
      `${lon},${lat},${ZOOM}/${W}x${H}` +
      `?access_token=${token}`
    );
  }

  // Esri World Imagery — free, no token, works everywhere
  // Uses the map export REST endpoint which returns a JPEG
  const halfExtent = 0.05; // ~5 km at mid-latitudes
  const xmin = lon - halfExtent;
  const ymin = lat - halfExtent;
  const xmax = lon + halfExtent;
  const ymax = lat + halfExtent;
  const bbox = `${xmin},${ymin},${xmax},${ymax}`;

  return (
    `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export` +
    `?bbox=${bbox}` +
    `&bboxSR=4326` +
    `&size=${W},${H}` +
    `&imageSR=4326` +
    `&format=jpg` +
    `&f=image`
  );
}

/** Smaller thumbnail for tooltip/card preview */
export function buildSatelliteThumbnailUrl(lat: number, lon: number): string {
  const token =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_MAPBOX_TOKEN
      : undefined;

  if (token) {
    return (
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/` +
      `${lon},${lat},${ZOOM}/300x200` +
      `?access_token=${token}`
    );
  }

  const halfExtent = 0.05;
  const xmin = lon - halfExtent;
  const ymin = lat - halfExtent;
  const xmax = lon + halfExtent;
  const ymax = lat + halfExtent;
  const bbox = `${xmin},${ymin},${xmax},${ymax}`;

  return (
    `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export` +
    `?bbox=${bbox}` +
    `&bboxSR=4326` +
    `&size=300,200` +
    `&imageSR=4326` +
    `&format=jpg` +
    `&f=image`
  );
}
