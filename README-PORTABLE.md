# Macro Watchtower - 포터블 버전

## 📦 파일 구성
- `macro-watchtower-portable.zip`: 모든 파일이 포함된 압축 파일 (약 500KB)

## 🚀 사용 방법

### 1단계: 파일 압축 해제
```bash
unzip macro-watchtower-portable.zip
```

### 2단계: 웹 서버 실행
```bash
# Python 3 사용
python3 -m http.server 8000

# 또는 Python 2 사용
python -m SimpleHTTPServer 8000

# 또는 Node.js 사용 (npx serve가 설치된 경우)
npx serve . -p 8000
```

### 3단계: 브라우저에서 접속
- `http://localhost:8000` 으로 접속
- 또는 `http://localhost:8000/dashboard` 로 직접 접속

## 💡 특징
- ✅ **독립 실행**: 인터넷 없이도 실행 가능
- ✅ **실시간 데이터**: 인터넷 연결 시 FRED API에서 실시간 데이터 업데이트
- ✅ **모든 기능**: 원본과 동일한 모든 기능 포함
- ✅ **호환성**: Python이 있는 모든 컴퓨터에서 실행 가능

## 🔧 문제 해결
- **포트 충돌**: 다른 포트 사용 (예: `python3 -m http.server 8080`)
- **Python 없음**: Node.js의 `npx serve` 사용
- **권한 문제**: `chmod +x` 명령으로 실행 권한 부여

## 📱 지원 브라우저
- Chrome, Firefox, Safari, Edge 등 모든 최신 브라우저

---
**Macro Watchtower v0.1.0** - US 경제 지표 모니터링 대시보드
