import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirQualityReading } from '../types/air';
import { getGradeInfo } from '../constants/AirQuality';

interface AirQualityCardProps {
  data: AirQualityReading;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ data }) => {
  const khaiGrade = getGradeInfo(data.khai.grade);
  const pm10Grade = getGradeInfo(data.pm10.grade);
  const pm25Grade = getGradeInfo(data.pm25.grade);

  return (
    <View style={styles.container}>
      <Text style={styles.stationName}>{data.stationName}</Text>
      <Text style={styles.dataTime}>{data.dataTime}</Text>

      <View style={[styles.khaiCard, { backgroundColor: khaiGrade.color }]}>
        <Text style={styles.khaiLabel}>통합대기지수</Text>
        <Text style={styles.khaiValue}>{data.khai.value ?? '-'}</Text>
        <Text style={styles.khaiGrade}>{khaiGrade.label}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>미세먼지 (PM10)</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{data.pm10.value ?? '-'}</Text>
            <Text style={styles.detailUnit}>㎍/㎥</Text>
          </View>
          <View
            style={[styles.gradeBadge, { backgroundColor: pm10Grade.color }]}
          >
            <Text style={styles.gradeText}>{pm10Grade.label}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>초미세먼지 (PM2.5)</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{data.pm25.value ?? '-'}</Text>
            <Text style={styles.detailUnit}>㎍/㎥</Text>
          </View>
          <View
            style={[styles.gradeBadge, { backgroundColor: pm25Grade.color }]}
          >
            <Text style={styles.gradeText}>{pm25Grade.label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dataTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  khaiCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  khaiLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  khaiValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  khaiGrade: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsContainer: {
    gap: 12,
  },
  detailItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
