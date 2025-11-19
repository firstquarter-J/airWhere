import { useState, useEffect, useCallback } from 'react';
import { getAirQuality } from '../services/api';
import { AirQualityReading } from '../types/air';

export const useAirQuality = (lat?: number, lng?: number) => {
  const [data, setData] = useState<AirQualityReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAirQuality = useCallback(async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getAirQuality({ lat, lng });

      if (response.air) {
        setData(response.air);
      } else {
        setError(response.message || '대기질 정보를 가져올 수 없습니다.');
      }
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '대기질 정보를 가져올 수 없습니다.'
      );
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchAirQuality();
  }, [fetchAirQuality]);

  return {
    data,
    error,
    loading,
    refetch: fetchAirQuality,
  };
};
