import { Elysia, t } from 'elysia';
import { env } from '@config/env';
import { reverseGeocode } from '@services/kakao';
import { toTMCoord } from '@services/geo';
import { getAirQualityByTM, getAirQualityBySido } from '@services/air';

export const air = new Elysia({ name: 'routes/air' }).post(
  '/air',
  async ({ body }) => {
    const { lat, lng } = body as { lat: number; lng: number };

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return { error: 'Invalid coordinates' } as const;
    }

    const airKey = env.AIR_QUALITY_API_KEY;
    if (!airKey) return { error: 'Air quality API key not configured' } as const;

    try {
      // 1) Try nearest-station path using TM coordinates
      const tm = await toTMCoord(lat, lng);
      const airViaTM = await getAirQualityByTM(tm.tmX, tm.tmY, airKey);
      if (airViaTM) {
        return {
          success: true as const,
          location: { lat, lng },
          air: airViaTM,
          timestamp: new Date().toISOString(),
        } as const;
      }

      // 2) Fallback: reverse geocode to get sido, then use sido-based realtime
      const kakaoKey = env.KAKAO_REST_API_KEY;
      if (!kakaoKey) {
        return {
          success: true as const,
          location: { lat, lng },
          air: null,
          message: 'No nearby station and Kakao key not configured for fallback',
          timestamp: new Date().toISOString(),
        } as const;
      }

      const address = await reverseGeocode(lat, lng, kakaoKey);
      if (!address?.sido) {
        return {
          success: true as const,
          location: { lat, lng },
          air: null,
          message: 'No nearby station and unable to resolve address',
          timestamp: new Date().toISOString(),
        } as const;
      }

      const airViaSido = await getAirQualityBySido(address.sido, airKey);
      if (!airViaSido) {
        return {
          success: true as const,
          location: { lat, lng },
          address,
          air: null,
          message: 'No data available for region',
          timestamp: new Date().toISOString(),
        } as const;
      }

      return {
        success: true as const,
        location: { lat, lng },
        address,
        air: airViaSido,
        timestamp: new Date().toISOString(),
      } as const;
    } catch (error: any) {
      return {
        error: 'Air data fetch failed',
        message: error?.message || 'Unknown error',
      } as const;
    }
  },
  {
    body: t.Object({
      lat: t.Number(),
      lng: t.Number(),
    }),
  }
);
