import axios from 'axios';
import Constants from 'expo-constants';
import { AirQualityResponse, LocationRequest, LocationResponse } from '../types/air';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAirQuality = async (coords: LocationRequest): Promise<AirQualityResponse> => {
  const response = await apiClient.post<AirQualityResponse>('/air', coords);
  return response.data;
};

export const getLocation = async (coords: LocationRequest): Promise<LocationResponse> => {
  const response = await apiClient.post<LocationResponse>('/location', coords);
  return response.data;
};
