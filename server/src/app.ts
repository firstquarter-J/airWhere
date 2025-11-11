import { Elysia } from 'elysia';
import { env } from '@config/env';
import { location } from '@routes/location';
import { air } from '@routes/air';

export const app = new Elysia()
  .get('/', () => 'AirWhere API Server')
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: {
      kakao: Boolean(env.KAKAO_REST_API_KEY),
      air: Boolean(env.AIR_QUALITY_API_KEY),
    },
  }))
  .use(location)
  .use(air);
