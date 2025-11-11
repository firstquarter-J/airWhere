export const DEFAULT_FETCH_TIMEOUT_MS = 8000;

// External API bases and paths
export const DATA_GO_BASE = 'https://apis.data.go.kr';
export const PATH_NEARBY_STATION =
  'B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList';
export const PATH_STATION_REALTIME =
  'B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';
export const PATH_SIDO_REALTIME =
  'B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
export const KAKAO_COORD2ADDR_URL_BASE =
  'https://dapi.kakao.com/v2/local/geo/coord2address.json';

// Common API defaults
export const AIR_API_VER = '1.3';
export const DEFAULT_SIDO_NUM_ROWS = 100;
export const DEFAULT_PAGE_NO = 1;

// Geo/Projection constants
export const KOREA_EPSG_5186 = 'EPSG:5186';
export const KOREA_EPSG_5186_DEF =
  '+proj=tmerc +lat_0=38 +lon_0=127 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs';

