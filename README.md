# Map Link Converter v1.0.2

Google Maps 및 Apple Maps 공유 URL에 포함된 장소명, 좌표, 주소, 장소 ID를 추출하는 정적 웹앱입니다.

## 배포
Settings → Pages → Deploy from a branch → main / (root) → Save.

## 파일
index.html, app.js, parser.js, styles.css, service-worker.js, manifest.webmanifest, assets/icon.svg, assets/apple-touch-icon.png.

## 제약
Google 단축 URL(maps.app.goo.gl)은 브라우저 CORS 제한으로 자동 확장되지 않습니다. 지도 중심 좌표는 실제 장소 좌표와 다를 수 있습니다. 최근 목록은 localStorage에 최대 30개 저장합니다.

## 버전
v1.0.2

## v1.0.2
- Google Maps 일반 링크 파싱 확장
- 위도·경도 함께 복사
- 일본어 장소 이름 표시 및 수동 수정 (자동 번역은 지원하지 않음)
- Google 단축 링크는 서버 리디렉션 해석이 필요합니다.


## v1.0.2
- 서버·외부 API 없이 GitHub Pages 정적 앱으로 유지
- Google Maps 단축 URL 인식 시 원본 지도 열기 버튼과 안내 제공
- 단축 URL의 자동 분석은 지원하지 않음
