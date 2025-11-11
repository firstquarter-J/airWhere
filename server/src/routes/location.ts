import { Elysia, t } from 'elysia';
import { env } from '@config/env';
import { reverseGeocode } from '@services/kakao';

export const location = new Elysia({ name: 'routes/location' }).post(
  '/location',
  async ({ body }) => {
    const { lat, lng } = body as { lat: number; lng: number };

    console.log(`[location] incoming request lat=${lat}, lng=${lng}`);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      console.warn('[location] invalid coordinates received', { lat, lng });
      return { error: 'Invalid coordinates' } as const;
    }

    const apiKey = env.KAKAO_REST_API_KEY;
    if (!apiKey) {
      return { error: 'Kakao API key not configured' } as const;
    }

    try {
      const addr = await reverseGeocode(lat, lng, apiKey);
      if (!addr) {
        console.warn('[kakao] no address found for coordinates', { lat, lng });
        return { error: 'Address not found for coordinates' } as const;
      }

      const result = {
        success: true as const,
        location: { lat, lng },
        address: addr,
        timestamp: new Date().toISOString(),
      };
      console.log('[kakao] address resolved', result.address);
      return result;
    } catch (error: any) {
      console.error('[kakao] request failed', {
        message: error?.message || String(error),
      });
      return {
        error: 'Kakao API error',
        message: error?.message || 'Request failed',
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
