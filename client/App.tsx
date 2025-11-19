import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocation } from './hooks/useLocation';
import { useAirQuality } from './hooks/useAirQuality';
import { AirQualityCard } from './components/AirQualityCard';

export default function App() {
  const {
    location,
    error: locationError,
    loading: locationLoading,
    refetch: refetchLocation,
  } = useLocation();
  const {
    data,
    error: airError,
    loading: airLoading,
    refetch: refetchAir,
  } = useAirQuality(location?.coords.latitude, location?.coords.longitude);

  const handleRefresh = () => {
    refetchLocation();
    refetchAir();
  };

  if (locationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>위치 정보를 가져오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (locationError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity style={styles.button} onPress={refetchLocation}>
            <Text style={styles.buttonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={locationLoading || airLoading}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>어디서나 에어췤!</Text>
          <Text style={styles.subtitle}>
            {location
              ? `위도: ${location.coords.latitude.toFixed(
                  4
                )}, 경도: ${location.coords.longitude.toFixed(4)}`
              : '위치 정보 없음'}
          </Text>
        </View>

        {airLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>대기질 정보를 가져오는 중...</Text>
          </View>
        )}

        {airError && !airLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{airError}</Text>
            <TouchableOpacity style={styles.button} onPress={refetchAir}>
              <Text style={styles.buttonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {data && !airLoading && <AirQualityCard data={data} />}

        <TouchableOpacity
          style={styles.refreshButtonBottom}
          onPress={handleRefresh}
        >
          <Text style={styles.buttonText}>새로고침</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButtonBottom: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
});
