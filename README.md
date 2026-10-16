# Map Link Converter v1.1.8

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

## 변경 사항 (v1.1.8)
- Google Maps 길찾기는 기존 좌표 목적지 전달 유지
- Apple Maps 길찾기 URL에 좌표 목적지(daddr)와 장소 이름(q)을 함께 전달 (일본어 → 영어 → 한국어 → 기본 이름 우선)
- 이름이 없으면 좌표만 전달; 대중교통·도보·자동차 선택 유지
- Apple Maps에서 길찾기 링크의 q 표시 여부는 지도 앱에 따라 달라지며, 이름 표시는 보장되지 않음

## 변경 사항 (v1.1.8)
- Apple Maps 길찾기 좌표 전용 링크로 복원; 지도 길찾기 버튼 누르면 미리보기 닫기
- 장소 목록 선택 삭제 모드와 선택/취소 및 완료 시 일반 모드 복귀
- 저장 장소 이름 선택 시 원본 링크와 저장 데이터 불러오기 (재분석하지 않음)
- 목록 버튼 모바일 4열, 분석 결과 Google/Apple/목록 저장 버튼 3열 통일
- 모바일 분석 항목 길게 누르기 공유/복사 메뉴; PC 더블클릭 미지원

## 변경 사항 (v1.1.8)
- 목록 저장: Lucide list-plus, 장소 목록 삭제: Lucide trash-2 선 아이콘
- 선택 삭제 도구를 제목 오른쪽에 겹치지 않게 배치해 목록이 아래로 밀리지 않도록 조정
- 장소 이름의 밑줄만 제거하고 클릭 기능 및 항목 구분선 유지
- 모바일 항목을 0.5초 이상 누른 뒤 손을 떼면 중간 메뉴 없이 시스템 공유 화면 요청 (Web Share API 지원 필요)

## 변경 사항 (v1.1.8)
- 선택 삭제 컨트롤을 제목 오른쪽의 동일한 flex 영역에서 전환하여 페이지 최상단으로 이동하는 absolute 위치 오류 해결
- 분석 결과 Google/Apple 지도 버튼을 미리보기 대신 좌표 기반 대중교통 길찾기 새 탭 직접 연결로 변경, 구분되는 아이콘/레이블 제공
- 개별 삭제 클릭 리스너 명시, SVG 터치 전달 개선, 삭제 성공/실패 처리 보강

## 변경 사항 (v1.1.8)
- 분석 결과 하단 Google 지도 버튼: 좌표를 검색 위치로 표시 (길찾기 아님)
- 분석 결과 하단 Apple 지도 버튼: 좌표 중심 지도 및 장소명 핀 표시 (길찾기 아님)
- 새 탭 열기 유지; 장소 목록의 기존 지도 미리보기 및 길찾기 기능은 변경하지 않음

## 변경 사항 (v1.1.8)
- 장소 목록 미리보기 iframe을 OpenStreetMap에서 Google Maps 좌표 기반 공유 임베드 URL (`maps.google.com/maps?q=...&z=16&output=embed`)로 교체
- Google Maps API 키는 사용하지 않음; 기존 길찾기·이동수단 선택·팝업 디자인 유지
- 비공식 공유 임베드 방식은 서비스 또는 브라우저 정책에 따라 동작이 달라질 수 있으며 iPhone Safari 실기기 확인 필요

## v1.1.8
- 분석 결과 및 장소 목록의 Google 지도는 map-pinned, Apple 지도는 navigation Lucide 선 아이콘으로 통일
- 장소 목록의 장소 이름 오른쪽에 음성 재생 버튼 추가; 해당 이름의 한국어/영어/일본어를 추정해 기기 기본 음성으로 재생하며 재클릭하면 정지
- 음질·음성 선택 설정은 추가하지 않음
