import proj4 from 'proj4';
import type { TMCoord } from '@types-app/geo';
import { KOREA_EPSG_5186, KOREA_EPSG_5186_DEF } from '@config/constants';

// Define Korea 2000 / Central Belt 2010 (EPSG:5186)
// 중부원점: lon_0=127, lat_0=38, GRS80
proj4.defs(KOREA_EPSG_5186, KOREA_EPSG_5186_DEF);

// Convert WGS84 (lat, lng) to TM coordinates locally (no external API)
export function toTMCoord(lat: number, lng: number): TMCoord {
  const [x, y] = proj4(proj4.WGS84, KOREA_EPSG_5186, [lng, lat]);
  return { tmX: x, tmY: y } satisfies TMCoord;
}
