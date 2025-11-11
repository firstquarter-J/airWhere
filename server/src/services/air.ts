import {
  DATA_GO_BASE,
  PATH_NEARBY_STATION,
  PATH_STATION_REALTIME,
  PATH_SIDO_REALTIME,
  AIR_API_VER,
  DEFAULT_SIDO_NUM_ROWS,
  DEFAULT_PAGE_NO,
} from '@config/constants';
import { fetchWithTimeout } from '@utils/http';
import type { AirQualityReading } from '@types-app/air';
export type { AirQualityReading } from '@types-app/air';

// Find nearest measurement station using TM coordinates
async function getNearestStationName(
  tmX: number,
  tmY: number,
  apiKey: string
): Promise<string | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    tmX: String(tmX),
    tmY: String(tmY),
  });

  const url = `${DATA_GO_BASE}/${PATH_NEARBY_STATION}?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  const resultCode = json?.response?.header?.resultCode;
  if (resultCode && resultCode !== '00') {
    throw new Error(json?.response?.header?.resultMsg || 'Nearby station API error');
  }
  if (!res.ok) {
    const message =
      json?.response?.header?.resultMsg ||
      res.statusText ||
      'Nearby station request failed';
    throw new Error(message);
  }

  const items = json?.response?.body?.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[0]?.stationName ?? null;
}

// Get real-time measurements for a station
async function getRealtimeByStation(
  stationName: string,
  apiKey: string
): Promise<AirQualityReading | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    stationName,
    dataTerm: 'DAILY',
    ver: AIR_API_VER,
  });

  const url = `${DATA_GO_BASE}/${PATH_STATION_REALTIME}?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  const resultCode = json?.response?.header?.resultCode;
  if (resultCode && resultCode !== '00') {
    throw new Error(json?.response?.header?.resultMsg || 'Realtime measure API error');
  }
  if (!res.ok) {
    const message =
      json?.response?.header?.resultMsg ||
      res.statusText ||
      'Realtime measure request failed';
    throw new Error(message);
  }

  const item = json?.response?.body?.items?.[0];
  if (!item) return null;

  const toNum = (v: any): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    stationName: item.stationName ?? stationName,
    dataTime: item.dataTime,
    pm10: { value: toNum(item.pm10Value), grade: toNum(item.pm10Grade) },
    pm25: { value: toNum(item.pm25Value), grade: toNum(item.pm25Grade) },
    khai: { value: toNum(item.khaiValue), grade: toNum(item.khaiGrade) },
  } satisfies AirQualityReading;
}

export async function getAirQualityByTM(
  tmX: number,
  tmY: number,
  apiKey: string
): Promise<AirQualityReading | null> {
  const stationName = await getNearestStationName(tmX, tmY, apiKey);
  if (!stationName) return null;
  return getRealtimeByStation(stationName, apiKey);
}

// Fallback: get first available station reading within a province (sido)
export async function getAirQualityBySido(
  sidoName: string,
  apiKey: string
): Promise<AirQualityReading | null> {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    sidoName,
    numOfRows: String(DEFAULT_SIDO_NUM_ROWS),
    pageNo: String(DEFAULT_PAGE_NO),
    ver: AIR_API_VER,
  });

  const url = `${DATA_GO_BASE}/${PATH_SIDO_REALTIME}?${params.toString()}`;
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  const resultCode = json?.response?.header?.resultCode;
  if (resultCode && resultCode !== '00') {
    throw new Error(json?.response?.header?.resultMsg || 'Sido realtime API error');
  }
  if (!res.ok) {
    const message =
      json?.response?.header?.resultMsg ||
      res.statusText ||
      'Sido realtime request failed';
    throw new Error(message);
  }

  const item = json?.response?.body?.items?.[0];
  if (!item) return null;

  const toNum = (v: any): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    stationName: item.stationName,
    dataTime: item.dataTime,
    pm10: { value: toNum(item.pm10Value), grade: toNum(item.pm10Grade) },
    pm25: { value: toNum(item.pm25Value), grade: toNum(item.pm25Grade) },
    khai: { value: toNum(item.khaiValue), grade: toNum(item.khaiGrade) },
  } satisfies AirQualityReading;
}
