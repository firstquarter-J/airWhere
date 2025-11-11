export interface AirQualityReading {
  stationName: string;
  dataTime: string;
  pm10: { value: number | null; grade: number | null };
  pm25: { value: number | null; grade: number | null };
  khai?: { value: number | null; grade: number | null };
}
