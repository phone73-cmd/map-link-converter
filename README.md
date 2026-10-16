# Map Link Converter v1.1.2

Apple Maps 공유 링크에서 기본 장소 이름, 한국어·영어·일본어 이름(링크에 포함된 경우), 위도·경도, 주소를 추출하는 정적 웹앱입니다.

## 지원
- Apple Maps 링크만 분석 (Google Maps 링크 분석 미지원)
- 기본 장소 이름 항상 표시, 다국어 이름 접기/펼치기 및 실제 등록 언어 개수·미리보기
- 언어별 이름 직접 편집·복사 및 저장 목록에 보존
- 좌표 통합 복사, Google Maps/Apple Maps 현재 위치 출발 길찾기
- 장소 목록 순번, 개별/전체 선택, 선택 삭제, 전체 삭제
- iPhone Safari 기본 붙여넣기 사용 (클립보드 읽기 버튼 없음)
- 기존 localStorage 키 유지, v1.0.8 장소 목록 호환
- GitHub Pages 및 오프라인 PWA

## 변경 사항 (v1.0.9)
- Apple place ID와 전체 정보 복사 제거
- 한국어·영어·일본어 이름을 접힌 다국어 영역으로 정리
- Google/Apple 지도 열기 및 목록 좌표 복사
- 목록 다중 선택 삭제, 버튼 및 명칭 정리
- 저장 시 placeId 제거, 기존 데이터는 읽기 호환

## 배포
Settings → Pages → Deploy from a branch → main / (root) → Save.

## 파일
index.html, app.js, parser.js, styles.css, service-worker.js, manifest.webmanifest, assets/icon.svg, assets/apple-touch-icon.png.

## 변경 사항 (v1.0.10)
- 링크 분석·지우기 버튼 위치 교체
- 초기 안내 문구 '공유 링크를 입력하세요.' 삭제 (오류·완료 메시지는 유지)

## 변경 사항 (v1.1.0)
- 지우기 버튼을 기존 secondary 스타일로 통일
- Apple Maps URL에 좌표 기반 q 및 ll 파라미터를 함께 사용해 좌표 핀 표시
- 분석 결과와 저장 목록의 Google Maps/Apple Maps 버튼을 누르면 앱 내부 dialog에서 OpenStreetMap 좌표 핀 미리보기 표시
- 미리보기 안에서 Google Maps/Apple Maps 외부 앱/웹으로 각각 열기 제공
- Google Maps/Apple Maps 웹페이지 자체를 iframe에 삽입하지 않음 (임베딩 제한 회피)
- 지도 미리보기에는 인터넷 연결이 필요하며, 기존 Apple Maps 전용 URL 분석은 유지

## 변경 사항 (v1.1.1)
- 기존 OpenStreetMap 지도 미리보기와 위치 핀 유지
- 지도 미리보기 안에 대중교통·도보·자동차 이동수단 선택 추가 (기본값 대중교통)
- Google Maps는 destination 및 travelmode를 포함한 길찾기 URL 사용 (출발지 생략 → 지도 앱에서 현재 위치 사용)
- Apple Maps는 daddr 및 dirflg를 포함한 길찾기 URL 사용 (출발지 생략 → 지도 앱에서 현재 위치 사용)
- 지도 앱 및 사용자 위치 권한에 따라 실제 출발지 지정·경로 지원 여부가 달라질 수 있음
- 휠체어 및 경사 관련 옵션은 포함하지 않음

## 변경 사항 (v1.1.2)
- Google Maps 길찾기는 기존 좌표 목적지 전달 유지
- Apple Maps 길찾기 URL에 좌표 목적지(daddr)와 장소 이름(q)을 함께 전달 (일본어 → 영어 → 한국어 → 기본 이름 우선)
- 이름이 없으면 좌표만 전달; 대중교통·도보·자동차 선택 유지
- Apple Maps에서 길찾기 링크의 q 표시 여부는 지도 앱에 따라 달라지며, 이름 표시는 보장되지 않음
