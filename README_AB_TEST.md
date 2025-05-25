# A/B 테스트 설정 가이드

## 개요

Here&Now 프로젝트에서는 두 가지 랜딩 페이지 버전에 대한 A/B 테스트를 지원합니다:

-   **Original Version** (`/landing`): 기본 청색 테마의 기업형 디자인
-   **Glow Version** (`/landing_glow`): 다크 테마의 소셜 네트워크 디자인

## 설정 방법

### 1. 테스트 모드 변경

`app/routes/_index.tsx` 파일의 `AB_TEST_CONFIG` 객체를 수정하세요:

```typescript
const AB_TEST_CONFIG = {
	// 'random' 또는 'round_robin' 선택
	mode: "random" as "random" | "round_robin",
	// 50/50 분할 비율 (random 모드에서만 사용)
	glowPageRatio: 0.5,
};
```

### 2. 테스트 모드 설명

#### Random 모드

-   각 방문자를 랜덤하게 두 버전 중 하나로 할당
-   `glowPageRatio` 설정으로 비율 조정 가능 (0.0 = 100% Original, 1.0 = 100% Glow)
-   기본값: 50/50 분할

#### Round Robin 모드

-   시간 기반으로 번갈아가며 버전 표시
-   기본 주기: 10초마다 전환
-   주기 변경은 `cycleLength` 값 수정 (밀리초 단위)

### 3. 개발 환경에서의 디버그

개발 환경에서는 각 랜딩 페이지 우상단에 다음 정보가 표시됩니다:

-   현재 A/B 테스트 모드 (random/round_robin)
-   현재 표시된 버전 (original/glow)

### 4. 주기 조정 (Round Robin 모드)

라운드로빈 주기를 변경하려면 다음 코드를 수정하세요:

```typescript
// 예: 30초마다 전환
const cycleLength = 30000; // 30초

// 예: 5분마다 전환
const cycleLength = 300000; // 5분
```

## 모니터링

### URL 파라미터를 통한 추적

개발 환경에서는 다음 파라미터가 자동으로 추가됩니다:

-   `ab_test`: 현재 테스트 모드
-   `variant`: 표시된 버전

예시: `http://localhost:5176/landing?ab_test=random&variant=original`

### 프로덕션 환경 고려사항

프로덕션에서 A/B 테스트를 운영할 때는:

1. 각 사용자에게 일관된 경험을 제공하기 위해 쿠키나 세션 기반 할당 고려
2. 분석 도구와 연동하여 전환율 측정
3. 통계적 유의성 확보를 위한 충분한 샘플 크기 확보

## 직접 접근

A/B 테스트와 별개로 특정 버전에 직접 접근 가능:

-   Original: `http://localhost:5176/landing`
-   Glow: `http://localhost:5176/landing_glow`
