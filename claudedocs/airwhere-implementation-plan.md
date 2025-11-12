# airWhere React Native + Expo 앱 구현 계획

**작성일**: 2025-11-12
**목표**: 빠른 MVP 출시 (5-7일)
**범위**: 위치 기반 미세먼지 표시 (핵심 기능만)

---

## 📋 전체 Phase 개요

| Phase   | 작업 내용                      | 예상 시간 | 상태    |
| ------- | ------------------------------ | --------- | ------- |
| Phase 1 | README 업데이트 및 계획 문서화 | 10분      | ✅ 완료 |
| Phase 2 | Expo 프로젝트 초기화           | 5분       | ⏳ 대기 |
| Phase 3 | 프로젝트 구조 생성             | 10분      | ⏳ 대기 |
| Phase 4 | 핵심 코드 구현                 | 2-3시간   | ⏳ 대기 |
| Phase 5 | 테스트 및 검증                 | 30분      | ⏳ 대기 |
| Phase 6 | 배포 준비                      | 20분      | ⏳ 대기 |

**총 예상 시간**: 약 4시간

---

## Phase 1: README 업데이트 및 계획 문서화 ✅

### 완료된 작업

- [x] README.md 업데이트
  - [x] Flutter → React Native + Expo로 변경
  - [x] 실제 API 엔드포인트 반영 (POST /air, POST /location)
  - [x] 프로젝트 구조 업데이트
  - [x] 기술 스택 정확히 기재
  - [x] 개발/배포 가이드 추가
- [x] 구현 계획 문서 생성 (이 문서)

### 결과물

- 업데이트된 README.md
- 전체 구현 계획 문서 (claudedocs/airwhere-implementation-plan.md)

---

## Phase 2: Expo 프로젝트 초기화

### 목표

client/ 디렉토리에 React Native + Expo 프로젝트를 생성하고 기본 설정을 완료합니다.

### 체크리스트

- [ ] Expo 프로젝트 생성
  ```bash
  cd client
  npx create-expo-app . --template expo-template-blank-typescript
  ```
- [ ] 필수 패키지 설치
  ```bash
  npx expo install expo-location expo-constants
  npm install axios
  ```
- [ ] .env 파일 생성
  ```bash
  EXPO_PUBLIC_API_URL=http://localhost:3000
  ```
- [ ] app.json 기본 설정
  - 앱 이름: "AirWhere"
  - 번들 식별자 설정
  - 위치 권한 설명 추가

### 예상 소요 시간

5분

### 결과물

- 초기화된 Expo 프로젝트
- 설치된 의존성 패키지
- 기본 환경 설정 파일

---

## Phase 3: 프로젝트 구조 생성

### 목표

확장 가능한 디렉토리 구조와 기본 파일을 생성합니다.

### 디렉토리 구조

```
client/
├── app/
│   ├── _layout.tsx             # Root layout
│   └── index.tsx               # 메인 화면
├── components/
│   ├── AirQualityCard.tsx      # 대기질 표시 카드
│   └── PermissionRequest.tsx   # 권한 요청 컴포넌트
├── services/
│   └── api.ts                  # axios API 클라이언트
├── types/
│   └── air.ts                  # TypeScript 타입 정의
├── constants/
│   └── AirQuality.ts           # 등급 색상, 메시지 상수
├── hooks/
│   ├── useLocation.ts          # GPS 위치 수집 hook
│   └── useAirQuality.ts        # 대기질 데이터 hook
├── app.json                    # Expo 설정
├── .env                        # 환경 변수
└── tsconfig.json               # TypeScript 설정
```

### 체크리스트

- [ ] 디렉토리 생성
  - [ ] components/
  - [ ] services/
  - [ ] types/
  - [ ] constants/
  - [ ] hooks/
- [ ] 기본 파일 생성 (빈 템플릿)
  - [ ] types/air.ts
  - [ ] constants/AirQuality.ts
  - [ ] services/api.ts

### 예상 소요 시간

10분

### 결과물

- 체계적인 프로젝트 구조
- 기본 파일 템플릿

---

## Phase 4: 핵심 코드 구현

### 목표

MVP 핵심 기능을 구현합니다.

### 4.1 TypeScript 타입 정의 (types/air.ts)

```typescript
// 백엔드 API 응답 타입
export interface PmData {
  value: number | null;
  grade: number | null;
}

export interface KhaiData {
  value: number | null;
  grade: number | null;
}

export interface AirQualityReading {
  stationName: string;
  dataTime: string;
  pm10: PmData;
  pm25: PmData;
  khai?: KhaiData;
}

export interface LocationRequest {
  lat: number;
  lng: number;
}

export interface AirQualityResponse {
  success: boolean;
  data: AirQualityReading;
}
```

### 4.2 등급 상수 (constants/AirQuality.ts)

```typescript
export const AIR_QUALITY_GRADES = {
  1: { label: '좋음', color: '#3B82F6' }, // 파란색
  2: { label: '보통', color: '#10B981' }, // 초록색
  3: { label: '나쁨', color: '#F59E0B' }, // 주황색
  4: { label: '매우 나쁨', color: '#EF4444' }, // 빨간색
};

export const getGradeInfo = (grade: number | null) => {
  if (!grade) return { label: '정보 없음', color: '#6B7280' };
  return AIR_QUALITY_GRADES[grade as keyof typeof AIR_QUALITY_GRADES];
};
```

### 4.3 API 서비스 (services/api.ts)

```typescript
import axios from 'axios';
import Constants from 'expo-constants';
import type { LocationRequest, AirQualityResponse } from '@/types/air';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAirQuality = async (
  coords: LocationRequest
): Promise<AirQualityResponse> => {
  const response = await apiClient.post<AirQualityResponse>('/air', coords);
  return response.data;
};

export const getLocation = async (coords: LocationRequest) => {
  const response = await apiClient.post('/location', coords);
  return response.data;
};
```

### 4.4 GPS 위치 Hook (hooks/useLocation.ts)

```typescript
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
        setError('위치 권한이 거부되었습니다');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);
    } catch (err) {
      setError('위치를 가져올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { location, error, loading, refetch: requestLocation };
};
```

### 4.5 대기질 Hook (hooks/useAirQuality.ts)

```typescript
import { useState, useEffect } from 'react';
import { getAirQuality } from '@/services/api';
import type { AirQualityReading } from '@/types/air';

export const useAirQuality = (lat?: number, lng?: number) => {
  const [data, setData] = useState<AirQualityReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAirQuality = async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getAirQuality({ lat, lng });
      setData(response.data);
    } catch (err) {
      setError('대기질 정보를 가져올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality();
  }, [lat, lng]);

  return { data, error, loading, refetch: fetchAirQuality };
};
```

### 4.6 대기질 카드 컴포넌트 (components/AirQualityCard.tsx)

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AirQualityReading } from '@/types/air';
import { getGradeInfo } from '@/constants/AirQuality';

interface AirQualityCardProps {
  data: AirQualityReading;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ data }) => {
  const pm10Grade = getGradeInfo(data.pm10.grade);
  const pm25Grade = getGradeInfo(data.pm25.grade);

  return (
    <View style={styles.card}>
      <Text style={styles.station}>{data.stationName}</Text>
      <Text style={styles.time}>{data.dataTime}</Text>

      <View style={styles.pmContainer}>
        <View style={[styles.pmBox, { backgroundColor: pm10Grade.color }]}>
          <Text style={styles.pmLabel}>PM10</Text>
          <Text style={styles.pmValue}>{data.pm10.value ?? '-'}</Text>
          <Text style={styles.pmGrade}>{pm10Grade.label}</Text>
        </View>

        <View style={[styles.pmBox, { backgroundColor: pm25Grade.color }]}>
          <Text style={styles.pmLabel}>PM2.5</Text>
          <Text style={styles.pmValue}>{data.pm25.value ?? '-'}</Text>
          <Text style={styles.pmGrade}>{pm25Grade.label}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  station: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  pmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  pmBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pmLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  pmValue: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  pmGrade: {
    fontSize: 14,
    color: '#fff',
  },
});
```

### 4.7 메인 화면 (app/index.tsx)

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { useAirQuality } from '@/hooks/useAirQuality';
import { AirQualityCard } from '@/components/AirQualityCard';

export default function HomeScreen() {
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>위치를 가져오는 중...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (airLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>대기질 정보를 가져오는 중...</Text>
      </View>
    );
  }

  if (airError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{airError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data && <AirQualityCard data={data} />}

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>새로고침</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 체크리스트

- [ ] 타입 정의 작성 (types/air.ts)
- [ ] 등급 상수 정의 (constants/AirQuality.ts)
- [ ] API 클라이언트 구현 (services/api.ts)
- [ ] GPS Hook 구현 (hooks/useLocation.ts)
- [ ] 대기질 Hook 구현 (hooks/useAirQuality.ts)
- [ ] 대기질 카드 컴포넌트 (components/AirQualityCard.tsx)
- [ ] 메인 화면 구현 (app/index.tsx)
- [ ] Layout 설정 (app/\_layout.tsx)

### 예상 소요 시간

2-3시간

### 결과물

- 완전히 동작하는 MVP 앱
- 타입 안정성 보장
- 에러 처리 완료

---

## Phase 5: 테스트 및 검증

### 목표

실제 환경에서 앱을 테스트하고 버그를 수정합니다.

### 테스트 시나리오

#### 5.1 GPS 권한 테스트

- [ ] 위치 권한 허용 시나리오
- [ ] 위치 권한 거부 시나리오
- [ ] GPS 꺼져있을 때 시나리오

#### 5.2 API 연동 테스트

- [ ] 서버 실행 확인 (`cd server && bun --watch index.ts`)
- [ ] API 호출 성공 시나리오
- [ ] 네트워크 오류 시나리오
- [ ] 타임아웃 시나리오

#### 5.3 UI/UX 테스트

- [ ] 로딩 상태 표시 확인
- [ ] 에러 메시지 표시 확인
- [ ] 새로고침 기능 동작 확인
- [ ] 등급별 색상 표시 확인

#### 5.4 실기기 테스트

```bash
# Expo Go로 테스트
cd client
npx expo start

# QR 코드로 실기기 연결
# iOS: Camera 앱으로 스캔
# Android: Expo Go 앱에서 스캔
```

### 체크리스트

- [ ] 서버 로컬 실행
- [ ] Expo 개발 서버 실행
- [ ] 실기기 연결 (Expo Go)
- [ ] 모든 시나리오 테스트 통과
- [ ] 버그 수정

### 예상 소요 시간

30분

### 결과물

- 검증된 MVP 앱
- 버그 수정 완료

---

## Phase 6: 배포 준비

### 목표

앱 배포를 위한 설정을 완료합니다.

### 6.1 app.json 최종 설정

```json
{
  "expo": {
    "name": "AirWhere",
    "slug": "airwhere",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3B82F6"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.airwhere",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "현재 위치의 대기질 정보를 제공하기 위해 위치 권한이 필요합니다."
      }
    },
    "android": {
      "package": "com.yourcompany.airwhere",
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    },
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

### 6.2 환경별 설정

```bash
# .env.development
EXPO_PUBLIC_API_URL=http://localhost:3000

# .env.production
EXPO_PUBLIC_API_URL=https://api.airwhere.com
```

### 6.3 EAS Build 설정

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 계정 로그인
eas login

# 프로젝트 설정
eas build:configure

# 빌드 실행 (선택사항)
eas build --platform all
```

### 체크리스트

- [ ] app.json 최종 설정
- [ ] 환경 변수 설정
- [ ] 앱 아이콘 준비 (1024x1024)
- [ ] 스플래시 이미지 준비
- [ ] EAS Build 설정 (선택사항)

### 예상 소요 시간

20분

### 결과물

- 배포 준비 완료된 앱
- EAS Build 설정 (선택)

---

## 🎯 MVP 완성 기준

다음 기능이 모두 동작하면 MVP 완성:

- ✅ 앱 실행 시 위치 권한 요청
- ✅ GPS로 현재 위치 수집
- ✅ POST /air API 호출
- ✅ PM10/PM2.5 수치 및 등급 표시
- ✅ 측정소명, 측정 시각 표시
- ✅ 로딩 상태 표시
- ✅ 에러 처리 (권한 거부, 네트워크 오류)
- ✅ 새로고침 기능

---

## 📝 다음 단계 (Phase 2 이후 확장)

MVP 완성 후 추가할 수 있는 기능:

### 단기 (1-2주)

- 위치 목록 (최근 조회, 즐겨찾기)
- 상세 정보 화면 (KHAI, 등급 설명)
- 로컬 캐싱 (AsyncStorage)
- 다크 모드

### 중기 (3-4주)

- 알림 기능 (특정 등급 초과 시)
- 시계열 그래프
- 위젯 (홈 화면)
- 앱 배포 (App Store, Google Play)

### 장기 (1-2개월)

- 다국어 지원 (i18n)
- 예보 기능
- 사용자 설정
- 공유 기능

---

## 🔧 트러블슈팅

### 문제 1: Expo Go에서 API 연결 안 됨

**원인**: localhost는 실기기에서 접근 불가
**해결**:

```typescript
// services/api.ts에서 로컬 IP 사용
const API_URL = 'http://192.168.x.x:3000'; // 개발 PC의 로컬 IP
```

### 문제 2: 위치 권한 항상 거부됨

**원인**: app.json에 권한 설명 누락
**해결**:

```json
"ios": {
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "..."
  }
}
```

### 문제 3: TypeScript 경로 별칭 인식 안 됨

**원인**: tsconfig.json 설정 누락
**해결**:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## ✅ Phase 1 완료 체크

- [x] README.md 업데이트 완료
- [x] 구현 계획 문서 작성 완료
- [ ] Phase 2 진행 준비 완료

**다음 Phase**: Phase 2 - Expo 프로젝트 초기화
