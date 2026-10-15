# Map Link Converter v1.0.8

Apple Maps 공유 링크에서 장소명, 위도·경도, 주소, 장소 ID를 추출하는 정적 웹앱입니다.

## 지원
- Apple Maps 링크 분석 및 좌표 통합 복사
- 한국어·일본어 장소 이름 표시·수동 수정
- 최근 저장 장소 및 Apple Maps 지도 열기
- GitHub Pages 배포, 오프라인 PWA

## 변경 사항 (v1.0.8)
- 한국어 장소 이름 입력·자동 추출·개별 복사 추가
- 위도·경도 개별 행 및 전체 복사 내 중복 좌표 제거; 통합 좌표만 유지

## 이전 변경 (v1.0.7)
- Google Maps 일반/단축 링크 분석 및 관련 버튼과 안내 화면 제거
- Google Maps 링크 입력 시 Apple Maps 전용 안내
- 기존 Google Maps 저장 기록은 목록에서 표시하지 않음
- 지도 열기 동작을 Apple Maps로 변경

## 배포
Settings → Pages → Deploy from a branch → main / (root) → Save.

## 파일
index.html, app.js, parser.js, styles.css, service-worker.js, manifest.webmanifest, assets/icon.svg, assets/apple-touch-icon.png.
