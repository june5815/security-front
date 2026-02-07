# WELIVE 프론트엔드

이 프로젝트는 Next.js 기반의 프론트엔드 애플리케이션입니다. TypeScript로 작성되었으며, 백엔드 API와 연동하여 동작합니다.

## 목차

- [시작하기](#시작하기)
- [개발 환경에서 실행하기](#개발-환경에서-실행하기)
- [프로젝트 구조](#프로젝트-구조)
- [환경변수 설정](#환경변수-설정)
- [API 연동](#api-연동)
- [타입 생성](#타입-생성)
- [프로덕션 빌드](#프로덕션-빌드)

## 시작하기

### 필수 요구사항

- Node.js (v18 이상 권장)
- npm

### 패키지 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
npm install
```

## 개발 환경에서 실행하기

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 백엔드 API 주소를 설정합니다:

```bash
# .env.example 파일을 복사
cp .env.example .env
```

`.env` 파일 내용:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
```

- **로컬 백엔드와 연동**: 백엔드를 로컬에서 실행 중이라면 `http://localhost:포트번호/api` 형식으로 변경
- **개발 서버와 연동**: 배포된 개발 서버 URL 사용

### 2. 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 접속:
- 메인 페이지: <http://localhost:3000>

개발 서버는 파일 변경 시 자동으로 새로고침됩니다 (Hot Module Replacement).

## 프로젝트 구조

```
project-welive-fe/
├── src/
│   ├── entities/           # 도메인별 기능 모듈 (비즈니스 로직)
│   ├── lib/
│   │   ├── api/            # API 클라이언트 모듈
│   │   │   ├── client.ts   # Axios 인스턴스 (모든 API 요청의 중심)
│   │   │   ├── auth.ts     # 인증 관련 API
│   │   │   └── users.ts    # 사용자 관련 API
│   │   ├── stores/         # Zustand 상태 관리
│   │   └── types/          # TypeScript 타입 정의
│   │       ├── api.d.ts    # OpenAPI로부터 자동 생성된 타입
│   │       └── index.ts    # 타입 내보내기 (단일 진실 공급원)
│   ├── pages/              # Next.js Page Router 페이지 (라우팅)
│   ├── shared/             # 공유 컴포넌트 및 유틸리티
│   ├── styles/             # 전역 CSS 스타일
│   └── widgets/            # 페이지별 위젯 컴포넌트
├── docs/
│   ├── openapi.json        # OpenAPI 3.0 명세 (API 스펙)
│   ├── 1_api-layer.md      # API 레이어 패턴 설명
│   ├── 2_store.md          # 상태 관리 패턴 설명
│   └── 3_openapi-typescript.md  # 타입 생성 가이드
├── .env                    # 환경변수 (직접 생성 필요)
├── .env.example            # 환경변수 예시
└── CLAUDE.md               # 개발 가이드
```

### 주요 디렉토리 설명

- **`src/entities/`**: 도메인별 기능 모듈 (사용자, 투표, 공지사항 등 비즈니스 로직)
- **`src/lib/api/`**: 백엔드 API와 통신하는 함수들 (모든 HTTP 요청 처리)
- **`src/lib/stores/`**: 전역 상태 관리 (Zustand 기반)
- **`src/lib/types/`**: TypeScript 타입 정의 (OpenAPI 스펙에서 자동 생성)
- **`src/pages/`**: Next.js 페이지 라우팅 (URL 경로와 매핑)
- **`src/shared/`**: 재사용 가능한 공통 컴포넌트 및 유틸리티
- **`src/styles/`**: 전역 CSS 스타일 파일
- **`src/widgets/`**: 페이지별 위젯 컴포넌트 (페이지를 구성하는 큰 단위 컴포넌트)
- **`docs/`**: API 명세 및 개발 문서

## 환경변수 설정

### 사용 가능한 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API 기본 URL | `https://example.com` |

**중요**: `NEXT_PUBLIC_` 접두사가 붙은 변수만 브라우저에서 접근 가능합니다.

## API 연동

### API 클라이언트 구조

모든 API 요청은 `src/lib/api/client.ts`의 `axiosInstance`를 통해 이루어집니다:

```typescript
// src/lib/api/client.ts
import axios from 'axios';

export const API_PREFIX = '/api/v2';
const SERVER_HOST = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL: `${SERVER_HOST}${API_PREFIX}`,
  withCredentials: true,
});

export default axiosInstance;
```

**주요 특징:**
- 자동 `/api/v2` prefix 추가
- 401 에러 시 자동 토큰 리프레시 처리
- CORS 인증 정보 포함 (`withCredentials: true`)

### API 함수 예시

```typescript
// src/lib/api/users.ts
import apiClient from './client';
import type { FindAdminsParams, AdminFindAllPageResponse } from '@/lib/types';

/**
 * Get paginated list of admin users
 */
export const getAdminUsers = async (params: FindAdminsParams): Promise<AdminFindAllPageResponse> => {
  const response = await apiClient.get<AdminFindAllPageResponse>('/users/admins', { params });
  return response.data;
};
```

**패턴 설명:**
- `apiClient`를 default import로 가져오기
- 타입은 `@/lib/types`에서 import (OpenAPI에서 자동 생성됨)
- async/await 패턴 사용
- `response.data`를 반환하여 실제 데이터만 전달


## 타입 생성

이 프로젝트는 OpenAPI 명세에서 TypeScript 타입을 자동 생성합니다.

### 백엔드 API 스펙 변경 시

1. **OpenAPI 스펙 업데이트**: `docs/openapi.json` 파일 수정
2. **타입 재생성**:
   ```bash
   npm run generate:types
   ```
3. **생성된 파일**: `src/lib/types/api.d.ts` (직접 수정 금지)

### 타입 사용 예시

```typescript
// CORRECT - 항상 @/lib/types에서 import
import type { LoginRequestDto, UserRole } from '@/lib/types';

// WRONG - @/lib/types/api에서 직접 import 금지
import type { components } from '@/lib/types/api';
```

자세한 내용은 [CLAUDE.md](./CLAUDE.md) 참조.

## 프로덕션 빌드

### 빌드

프로덕션용으로 최적화된 빌드를 생성합니다:

```bash
npm run build
```

빌드 산출물은 `.next/` 폴더에 생성됩니다.

### 프로덕션 서버 실행

빌드 후 프로덕션 모드로 실행:

```bash
npm run start
```

기본적으로 <http://localhost:3000>에서 실행됩니다.

### 빌드 검증

배포 전 로컬에서 프로덕션 빌드를 테스트하는 것이 좋습니다:

```bash
npm run build && npm run start
```

## 자주 사용하는 명령어

| 명령어 | 설명 |
|--------|------|
| `npm install` | 의존성 패키지 설치 |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run generate:types` | OpenAPI에서 TypeScript 타입 생성 |
| `npm run lint` | 코드 린팅 |

## 문제 해결

### 빌드 에러 발생 시

1. `node_modules` 삭제 후 재설치:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. `.next` 폴더 삭제 후 재빌드:
   ```bash
   rm -rf .next
   npm run build
   ```

### API 연결 안 됨

1. `.env` 파일의 `NEXT_PUBLIC_API_BASE_URL` 확인
2. 백엔드 서버 실행 상태 확인
3. CORS 설정 확인 (백엔드에서 프론트엔드 도메인 허용 필요)

### 타입 에러

1. OpenAPI 스펙 최신 상태 확인
2. 타입 재생성: `npm run generate:types`
3. TypeScript 서버 재시작 (VSCode: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

## 추가 문서

- [CLAUDE.md](./CLAUDE.md) - 개발 패턴 및 컨벤션
- [docs/1_api-layer.md](./docs/1_api-layer.md) - API 레이어 상세 가이드
- [docs/2_store.md](./docs/2_store.md) - 상태 관리 가이드
- [docs/3_openapi-typescript.md](./docs/3_openapi-typescript.md) - 타입 생성 가이드
