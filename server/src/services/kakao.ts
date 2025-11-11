import type { KakaoAddress } from '@types-app/kakao';
export type { KakaoAddress } from '@types-app/kakao';
import { KAKAO_COORD2ADDR_URL_BASE } from '@config/constants';
import { fetchWithTimeout } from '@utils/http';

export async function reverseGeocode(
  lat: number,
  lng: number,
  apiKey: string
): Promise<KakaoAddress | null> {
  const url = `${KAKAO_COORD2ADDR_URL_BASE}?x=${lng}&y=${lat}&input_coord=WGS84`;
  const response = await fetchWithTimeout(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message || response.statusText || 'Kakao request failed';
    throw new Error(message);
  }

  if (!data.documents || data.documents.length === 0) {
    return null;
  }

  const address = data.documents[0];
  const sido = address.address?.region_1depth_name || '';

  return {
    sido,
    full: address.address?.address_name || '',
    roadAddress: address.road_address?.address_name || '',
  } satisfies KakaoAddress;
}
