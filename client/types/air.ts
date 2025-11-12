// 백엔드 API 응답 타입

export interface PmData {
  value: number | null;
  grade: number | null;
}

export interface AirQualityReading {
  stationName: string;
  pm10: PmData;
  pm25: PmData;
  khai: PmData;
  dataTime: string;
}

export interface AirQualityResponse {
  success: boolean;
  data: AirQualityReading;
}

export interface LocationRequest {
  lat: number;
  lng: number;
}

export interface LocationResponse {
  success: boolean;
  data: {
    sido: string;
    fullAddress: string;
    roadAddress: string;
  };
}
