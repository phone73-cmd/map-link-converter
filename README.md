# Map Link Converter v1.2.0 — Firebase test branch

**Testing only — do not merge into main before acceptance testing.**

- Firebase Google popup login and per-user Firestore collection `users/{uid}/places/{placeId}`.
- Local backup snapshot before migration; JSON export/import; remove 30-place cap.
- Sync changes with offline local queue, 30-day soft-delete trash and restore.
- Logout hides cloud places and leaves local-only places visible.
- Family sharing is intentionally not enabled.

## Validation gates

1. Verify Google Auth authorized domains for staging host and production GitHub Pages.
2. Test Safari desktop/iPhone and installed PWA; popup restrictions may require alternative auth UX.
3. Backup local data separately from each device; verify imported names, coordinates and URLs.
4. Verify first-login migration, cloud merge, offline queue, cross-device deletion, trash restore and account switching.
5. Check Firestore rules, permission denied paths, failed writes and storage quota.
6. Only deploy to production after isolated staging environment and data restore tests.

## Notes

This is an initial test implementation. Automatic snapshot is stored locally under `mlc-initial-backup-v1.2.0`; it is not a guaranteed remote backup. JSON export is recommended before use. Firebase web config is public; never commit service account credentials.

# Map Link Converter v1.1.9

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

## 변경 사항 (v1.1.9)
- Google Maps 길찾기는 기존 좌표 목적지 전달 유지
- Apple Maps 길찾기 URL에 좌표 목적지(daddr)와 장소 이름(q)을 함께 전달 (일본어 → 영어 → 한국어 → 기본 이름 우선)
- 이름이 없으면 좌표만 전달; 대중교통·도보·자동차 선택 유지
- Apple Maps에서 길찾기 링크의 q 표시 여부는 지도 앱에 따라 달라지며, 이름 표시는 보장되지 않음

## 변경 사항 (v1.1.9)
- Apple Maps 길찾기 좌표 전용 링크로 복원; 지도 길찾기 버튼 누르면 미리보기 닫기
- 장소 목록 선택 삭제 모드와 선택/취소 및 완료 시 일반 모드 복귀
- 저장 장소 이름 선택 시 원본 링크와 저장 데이터 불러오기 (재분석하지 않음)
- 목록 버튼 모바일 4열, 분석 결과 Google/Apple/목록 저장 버튼 3열 통일
- 모바일 분석 항목 길게 누르기 공유/복사 메뉴; PC 더블클릭 미지원

## 변경 사항 (v1.1.9)
- 목록 저장: Lucide list-plus, 장소 목록 삭제: Lucide trash-2 선 아이콘
- 선택 삭제 도구를 제목 오른쪽에 겹치지 않게 배치해 목록이 아래로 밀리지 않도록 조정
- 장소 이름의 밑줄만 제거하고 클릭 기능 및 항목 구분선 유지
- 모바일 항목을 0.5초 이상 누른 뒤 손을 떼면 중간 메뉴 없이 시스템 공유 화면 요청 (Web Share API 지원 필요)

## 변경 사항 (v1.1.9)
- 선택 삭제 컨트롤을 제목 오른쪽의 동일한 flex 영역에서 전환하여 페이지 최상단으로 이동하는 absolute 위치 오류 해결
- 분석 결과 Google/Apple 지도 버튼을 미리보기 대신 좌표 기반 대중교통 길찾기 새 탭 직접 연결로 변경, 구분되는 아이콘/레이블 제공
- 개별 삭제 클릭 리스너 명시, SVG 터치 전달 개선, 삭제 성공/실패 처리 보강

## 변경 사항 (v1.1.9)
- 분석 결과 하단 Google 지도 버튼: 좌표를 검색 위치로 표시 (길찾기 아님)
- 분석 결과 하단 Apple 지도 버튼: 좌표 중심 지도 및 장소명 핀 표시 (길찾기 아님)
- 새 탭 열기 유지; 장소 목록의 기존 지도 미리보기 및 길찾기 기능은 변경하지 않음

## 변경 사항 (v1.1.9)
- 장소 목록 미리보기 iframe을 OpenStreetMap에서 Google Maps 좌표 기반 공유 임베드 URL (`maps.google.com/maps?q=...&z=16&output=embed`)로 교체
- Google Maps API 키는 사용하지 않음; 기존 길찾기·이동수단 선택·팝업 디자인 유지
- 비공식 공유 임베드 방식은 서비스 또는 브라우저 정책에 따라 동작이 달라질 수 있으며 iPhone Safari 실기기 확인 필요

## v1.1.9
- 분석 결과 및 장소 목록의 Google 지도는 map-pinned, Apple 지도는 navigation Lucide 선 아이콘으로 통일
- 장소 목록의 장소 이름 오른쪽에 음성 재생 버튼 추가; 해당 이름의 한국어/영어/일본어를 추정해 기기 기본 음성으로 재생하며 재클릭하면 정지
- 음질·음성 선택 설정은 추가하지 않음

## v1.1.9
- 장소 목록 음성 재생 시 기기의 해당 언어 음성 중 향상/고음질 등으로 표시된 음성을 우선 선택하고 기본 음성보다 적합한 대안이 있으면 우선 적용
- 슈퍼 컴팩트로 식별되는 음성은 후순위 처리, 별도 음성 선택 UI 없음
- Web Speech API에서 음질 등급을 보장하지 않으므로 실제 고음질 여부는 기기 및 iOS 환경에 따라 달라짐


## v1.2.1
- 상단 헤더에 Lucide 스타일 설정(톱니바퀴) 버튼 추가
- 클라우드 동기화, Google 로그인/로그아웃, JSON 백업/복원, 휴지통을 설정 모달로 이동
- 기존 기능 및 Firebase 데이터 구조 변경 없음


## v1.2.2
- 장소 목록 정렬 선택: 최근 저장순(기본), 오래된 저장순, 이름순, 이름 역순
- 로컬/클라우드 통합 정렬, 브라우저별 선택값 저장
- 기존 데이터는 변경하지 않고 목록 표시 순서만 정렬; 새 로컬 저장에는 updatedAt 기록
- 기존 날짜 필드가 없는 오래된 장소는 기존 목록 위치를 동률 순서로 사용


## v1.2.3
- 기능 식별이 중요한 버튼(분석, 지우기, 선택/전체 삭제, 로그인/로그아웃, 백업/복원, 휴지통, 정렬)에 간결한 Lucide 계열 선 아이콘 추가
- 버튼의 기존 텍스트와 동작 유지, 기존 장소·Firebase 데이터 구조 변경 없음


## v1.2.4
- 상단 왼쪽 앱 심볼을 파스텔 블루 지도 핀(선택안 2)으로 교체
- PWA SVG 아이콘도 같은 파스텔 블루 디자인으로 통일
- iOS 홈 화면 PNG 아이콘은 기존 파일 유지(별도 PNG 교체 필요)
- 기존 데이터·동기화 기능 변경 없음


## v1.2.5
- 설정 버튼 파스텔 블루 톱니바퀴 디자인 적용
- 설정창 바깥 클릭 닫힘 방지
- 백업, 복원, 휴지통, 로그아웃 순서로 한 행 배치
- JSON 표시 문구 삭제, 파일 형식과 데이터 구조는 유지
- 작은 화면의 버튼 크기 및 여백 정리


## v1.2.6
- 오프라인 연결 상태 안내와 새 버전 업데이트 버튼 추가
- 서비스 워커 업데이트는 사용자 선택 후 활성화, 이전 버전 캐시 범위 제한
- 상단 설명 문구 변경: Apple 지도 링크를 좌표정보로...
- 좌표 및 결과 복사 버튼에 Lucide copy 아이콘 적용
- 설정 아이콘을 라벤더 톱니바퀴 스타일로 변경
- 로컬 저장소 및 Firebase 동기화 데이터 형식 유지
- Firebase 외부 모듈의 오프라인 초기화 및 iPhone 실제 동작은 별도 검증 필요


## v1.2.7
- 선택 삭제 버튼의 배경색과 테두리 제거
- 사용자가 첨부한 라벤더 입체 톱니바퀴 이미지를 설정 버튼으로 적용 (96px 최적화 이미지)
- 설정 버튼의 배경색, 테두리 및 그림자 제거, 기존 클릭 기능 유지
- 서비스 워커 캐시 버전 및 이미지 자산 갱신


## v1.2.8
- 1번 지도핀 + 접이식 지도 시안을 바탕으로 라벤더·파스텔 3D 스타일 SVG 아이콘 제작
- 헤더 왼쪽 로고, 브라우저 favicon 및 PWA manifest SVG 아이콘 교체
- 서비스 워커 캐시 버전 갱신
- iOS apple-touch-icon PNG는 아직 기존 파일이며, 새 아이콘으로 통일하려면 별도 교체 필요


## v1.2.9
- 일본어 장소명과 좌표를 기준으로 OpenStreetMap Nominatim 무료 역지오코딩에서 다국어 이름 조회
- 동일 이름이 확인된 경우 비어 있는 한국어·영어 이름만 자동 입력; 기존 입력값 보존
- 조회 실패 또는 오프라인에서 기존 링크 분석과 저장 기능 유지
- 7일 로컬 조회 캐시, 5초 요청 시간 제한 적용
- 기존 Firebase 및 로컬 장소 데이터 구조 유지
- 아이폰 홈 화면용 새 투명 PNG 아이콘 교체는 별도 미완료 항목
- 공용 Nominatim의 사용 정책 및 실제 iPhone Safari/PWA 동작은 추가 검증 필요


## v1.2.10
- 일본어 장소 이름의 공백·구분점 및 메인 게이트 등의 접미어 차이를 고려한 무료 장소명 대조
- 자동 검색 성공·불일치·데이터 부재·오프라인·서버 오류 상태를 다국어 영역에 표시
- 검색 결과가 다른 장소일 수 있으면 자동 입력하지 않음; 사용자 입력값 보존
- 캐시 키 v2로 변경해 기존 실패 가능 결과 재조회; 앱 및 서비스 워커 버전 일치
- 무료 역지오코딩은 가장 가까운 지도 객체만 반환하므로 출입구별 한국어 이름 자동 완성은 보장하지 않음
- iPhone 실제 작동과 홈 화면용 투명 PNG 아이콘 교체는 미검증·미완료


## v1.2.11
- 사용자 제공 라벤더 지도핀 이미지를 기반으로 투명 PNG(180×180) 아이콘 추가
- 웹앱 헤더, 브라우저 favicon, iOS apple-touch-icon, PWA manifest 아이콘을 새 PNG로 연결
- SVG 아이콘은 manifest의 보조 확장형 아이콘으로 유지
- 서비스 워커 캐시 및 화면 버전 갱신
- iPhone 홈 화면에 이미 설치된 앱은 아이콘 갱신을 위해 다시 추가해야 할 수 있음
- PNG는 저장소 업로드 제한을 고려한 최적화 버전이며 원본 대비 색상 수가 줄어듦


## v1.2.12
- 장소 목록에 저장된 한국어, 일본어, 영어 이름을 순서대로 표시하며 빈칸과 중복은 생략
- 분석 결과 다국어 입력 필드와 요약 순서를 한국어, 일본어, 영어로 통일
- 로컬 저장 및 Firebase 데이터 스키마 변경 없음
- 무료 다국어 자동 검색 정확도 개선은 후속 검증 대상


## v1.2.13
- 좌표 역검색 시 일본어·한국어·영어 후보 이름과 원래 장소 이름을 대조
- 확인된 OSM name:ja, name:ko, name:en 값을 비어 있는 다국어 필드에만 채움
- 기존 이름 및 사용자 수정값 보존; 일치 확인이 안 되는 좌표 단독 검색은 보류
- 실제 일본 현지 지도 데이터 커버리지 및 iPhone PWA 동작 미검증


## v1.2.14
- 다국어 자동 조회(Nominatim), 관련 캐시 조회·생성, 조회 상태 표시 및 API 호출 코드 제거
- 다국어 이름 직접 입력·복사·저장 기능 유지
- 장소 목록 번호와 이름을 분리하여 일본어·영어 줄이 첫 이름의 시작 위치에 정렬
- 로컬 및 Firebase 저장 데이터 구조 변경 없음
