import { describe, test, expect } from "bun:test";
import { env } from "@config/env";
import { toTMCoord } from "@services/geo";
import { getAirQualityByTM, getAirQualityBySido, type AirQualityReading } from "@services/air";
import { reverseGeocode } from "@services/kakao";

// This is an integration test that calls real external APIs.
// It will be skipped automatically if required API keys are not configured.

const HAS_KEYS = Boolean(env.AIR_QUALITY_API_KEY && env.KAKAO_REST_API_KEY);

function assertReadingShape(reading: AirQualityReading) {
  expect(typeof reading.stationName).toBe("string");
  expect(typeof reading.dataTime).toBe("string");
  // Values may be null depending on station data availability
  if (reading.pm10.value !== null) expect(typeof reading.pm10.value).toBe("number");
  if (reading.pm25.value !== null) expect(typeof reading.pm25.value).toBe("number");
  if (reading.khai?.value != null) expect(typeof reading.khai.value).toBe("number");
}

describe("integration: air quality APIs", () => {
  if (!HAS_KEYS) {
    test.skip("skipped: missing AIR_QUALITY_API_KEY or KAKAO_REST_API_KEY", () => {});
    return;
  }

  test("nearest-station via TM coordinates", async () => {
    const lat = 37.5665; // Seoul City Hall area
    const lng = 126.9780;

    const tm = await toTMCoord(lat, lng);
    expect(Number.isFinite(tm.tmX)).toBe(true);
    expect(Number.isFinite(tm.tmY)).toBe(true);

    const reading = await getAirQualityByTM(tm.tmX, tm.tmY, env.AIR_QUALITY_API_KEY);
    expect(reading === null || typeof reading === "object").toBe(true);
    if (reading) assertReadingShape(reading);
  });

  test("fallback: sido-based realtime by reverse geocode", async () => {
    const lat = 37.5665;
    const lng = 126.9780;

    const addr = await reverseGeocode(lat, lng, env.KAKAO_REST_API_KEY);
    expect(addr && typeof addr.sido === "string").toBe(true);
    if (!addr) return;

    const reading = await getAirQualityBySido(addr.sido, env.AIR_QUALITY_API_KEY);
    expect(reading === null || typeof reading === "object").toBe(true);
    if (reading) assertReadingShape(reading);
  });
});
