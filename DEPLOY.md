# Netlify 배포 가이드

## 1. Netlify 사이트 생성

1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 저장소 선택
4. 다음 설정으로 사이트 생성:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

## 2. GitHub Secrets 설정

Netlify 대시보드에서 다음 정보를 복사하여 GitHub 저장소의 Secrets에 추가:

### Settings > Secrets and variables > Actions에서 추가:

- `NETLIFY_AUTH_TOKEN`: Netlify 계정의 Personal Access Token
- `NETLIFY_SITE_ID`: Netlify 사이트의 Site ID

### Personal Access Token 생성:
1. Netlify 대시보드 > User settings > Applications
2. "Personal access tokens" 탭
3. "New access token" 클릭
4. 토큰 이름 입력 후 생성
5. 생성된 토큰을 복사하여 `NETLIFY_AUTH_TOKEN`에 추가

### Site ID 확인:
1. Netlify 대시보드 > Site overview
2. Site settings > General
3. "Site details" 섹션에서 Site ID 복사
4. `NETLIFY_SITE_ID`에 추가

## 3. 자동 배포

이제 main 브랜치에 푸시할 때마다 자동으로 Netlify에 배포됩니다.

## 4. 수동 배포

GitHub Actions 탭에서 "Deploy to Netlify" 워크플로우를 수동으로 실행할 수도 있습니다.

## 5. 도메인 설정

Netlify 대시보드에서:
1. Site settings > Domain management
2. Custom domain 추가 또는 기본 netlify.app 도메인 사용

## 환경 변수

필요한 환경 변수들:
- `FRED_API_KEY`: FRED API 키 (필요시)

## 빌드 로그 확인

배포 실패 시 GitHub Actions 탭에서 빌드 로그를 확인할 수 있습니다.

