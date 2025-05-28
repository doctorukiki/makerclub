# OAuth 설정 가이드

## 1. Google OAuth 설정

### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. "API 및 서비스" > "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션" 선택
6. 승인된 리디렉션 URI 추가:
    - 개발환경: `http://localhost:5173/auth/callback`
    - 프로덕션: `https://yourdomain.com/auth/callback`

### Supabase 설정

1. Supabase 대시보드 > Authentication > Providers
2. Google 활성화
3. Google Cloud Console에서 받은 Client ID와 Client Secret 입력
4. Redirect URL 확인: `https://your-project.supabase.co/auth/v1/callback`

## 2. Kakao OAuth 설정

### Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 추가
3. "제품 설정" > "카카오 로그인" 활성화
4. Redirect URI 설정:
    - 개발환경: `http://localhost:5173/auth/callback`
    - 프로덕션: `https://yourdomain.com/auth/callback`
5. 동의항목 설정:
    - 닉네임 (필수)
    - 프로필 사진 (선택)
    - 카카오계정(이메일) (필수)

### Supabase 설정

1. Supabase 대시보드 > Authentication > Providers
2. Kakao 활성화 (Custom Provider로 설정 필요)
3. Kakao에서 받은 REST API 키를 Client ID로 입력
4. Client Secret은 Kakao Admin 키 사용

## 3. 환경 변수 설정

`.env` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. 테스트

1. 개발 서버 실행: `npm run dev`
2. `/signup_glow` 페이지 접속
3. "Google로 계속하기" 또는 "Kakao로 계속하기" 버튼 클릭
4. OAuth 플로우 테스트

## 5. 주의사항

-   OAuth 콜백 URL은 정확히 일치해야 합니다
-   HTTPS가 필요한 경우가 많으므로 프로덕션에서는 HTTPS 사용
-   Kakao의 경우 비즈니스 채널 등록이 필요할 수 있습니다
-   각 플랫폼의 정책을 확인하고 준수해야 합니다

## 6. 트러블슈팅

### 일반적인 오류들:

-   `redirect_uri_mismatch`: 리디렉션 URI 불일치
-   `invalid_client`: 클라이언트 ID/Secret 오류
-   `access_denied`: 사용자가 권한 거부

### 디버깅:

-   브라우저 개발자 도구의 Network 탭 확인
-   Supabase 대시보드의 Auth 로그 확인
-   서버 콘솔 로그 확인
