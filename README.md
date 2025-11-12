# AirWhere - 미세먼지 앱

어디서나 에어췤~!

## 프로젝트 구조 (모노레포)

```
airwhere/
├── server/              # Bun + Elysia 백엔드 서버
│   ├── src/
│   │   ├── routes/     # API 엔드포인트 (air, location)
│   │   ├── services/   # 외부 API 연동 (공공데이터포털, 카카오)
│   │   ├── types/      # TypeScript 타입 정의
│   │   ├── config/     # 환경 설정
│   │   └── utils/      # 유틸리티 함수
│   ├── tests/          # 통합 테스트
│   └── index.ts        # 서버 엔트리포인트
├── client/             # React Native + Expo 모바일 앱
└── package.json        # 워크스페이스 설정
```

## 개발 환경 설정

### 전체 설치

```bash
bun install
```

### 서버 실행

```bash
# 개발 모드 (핫 리로드)
cd server
bun --watch index.ts

# 프로덕션 모드
bun run start
```

### 모바일 앱 실행

```bash
# 개발 모드 (Expo Go)
cd client
npx expo start

# 실기기 테스트
# 1. 스마트폰에서 Expo Go 앱 설치
# 2. QR 코드 스캔
```

## 주요 기능

### 🌬️ 대기질 모니터링

- **실시간 미세먼지 데이터**: PM10, PM2.5, 종합지수(KHAI)
- **위치 기반 측정소 검색**: TM 좌표 변환 + 가까운 측정소 자동 검색
- **Fallback 전략**: 측정소 데이터 없을 시 시도(sido) 기반 조회
- **공공데이터포털 연동**: 환경부 실시간 대기질 정보

### 🌍 위치 서비스

- **GPS 기반 위치 수집**: 현재 위치 자동 감지
- **역지오코딩**: 좌표 → 주소 변환 (카카오 API)
- **좌표 변환**: WGS84 → TM(중부원점) 자동 변환

## API 엔드포인트

### 대기질 서비스

- `POST /air` - 대기질 데이터 조회
  - **요청**: `{ lat: number, lng: number }`
  - **응답**: 측정소명, PM10, PM2.5, KHAI, 측정 시각

### 위치 서비스

- `POST /location` - 역지오코딩 (좌표 → 주소)
  - **요청**: `{ lat: number, lng: number }`
  - **응답**: 시도, 전체 주소, 도로명 주소

### 헬스 체크

- `GET /` - 서버 상태
- `GET /health` - 상세 헬스 체크 (타임스탬프, API 키 설정 여부)

## 기술 스택

### 백엔드

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript (strict mode)
- **좌표 변환**: proj4.js
- **외부 API**:
  - 공공데이터포털 (data.go.kr) - 대기질 데이터
  - 카카오 Local API - 역지오코딩

### 모바일 앱

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **상태 관리**: React Hooks
- **HTTP 클라이언트**: axios
- **GPS**: expo-location

## 환경 변수 설정

### 서버 (.env)

```bash
PORT=3000
KAKAO_REST_API_KEY=your_kakao_api_key
AIR_QUALITY_API_KEY=your_data_go_kr_decoded_key
```

### 모바일 앱 (.env)

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 테스트

```bash
# 서버 통합 테스트
cd server
bun test

# 테스트 케이스:
# - TM 좌표 기반 측정소 조회
# - 시도 기반 대기질 데이터 조회 (Fallback)
```

## 배포

### 서버 배포

```bash
cd server
bun build index.ts --outdir ./dist
bun start
```

### 모바일 앱 빌드

```bash
cd client

# iOS + Android 동시 빌드 (EAS Build)
eas build --platform all

# 개별 빌드
eas build --platform ios
eas build --platform android
```
