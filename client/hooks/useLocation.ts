import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('위치 권한이 거부되었습니다.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '위치를 가져올 수 없습니다.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    location,
    error,
    loading,
    refetch: requestLocation,
  };
};
