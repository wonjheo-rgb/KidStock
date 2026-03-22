# Claude 작업 규칙

## 전자동 모드
- 사용자가 "전자동", "알아서 해", "자리 비울게", "질문하지 마" 등의 표현을 사용하면, 해당 세션 내에서 판단 질문을 하지 않는다. 최선의 판단으로 직접 결정하고, 작업 완료 후 결과만 보고한다.

## 자동 허용 (물어보지 않아도 되는 것)
- 파일 읽기, 검색, 탐색
- 파일 생성/수정 (로컬)
- 개발 서버 실행, 테스트 실행
- 패키지 설치 (npm install, pip install)
- git add, commit

## 반드시 확인 (자동 실행 금지)
- git push (외부에 영향)
- 파일/브랜치 삭제
- force push, reset --hard
- 유료 API 호출 (과금 발생)
- 외부 서비스 배포 (Vercel, GitHub Actions 등)
- 이메일/메시지 발송
- DB 데이터 삭제/수정

## 기본
- 항상 한국어로 응답한다.

---

# JW025. KidStock — 아들 주식투자 교육 앱

## 프로젝트 개요
아들의 키움증권 계좌를 활용한 주식 교육 앱.
관심종목 보기, 보유주식 확인, 매일 매매 의견 기록을 통해 투자 감각을 키운다.

## 핵심 원칙
1. **아이 눈높이** — 심플하고 직관적인 UI, 어려운 용어 최소화
2. **아빠 연동** — 아들의 매매 의견 → 아빠에게 전달 → 아빠가 최종 실행
3. **학습 중심** — 과거 의견 vs 실제 주가 비교로 피드백

## 재활용 자산
- `JW003.KiwoomSheets/kiwoom_api.py` — 키움 REST API (다중 계좌 지원)
- `JW003.KiwoomSheets/config.py` — 다중 계좌 설정 패턴
- `JW009.StockDiscussionExperts/web/` — Streamlit 대시보드 패턴
- 키움 REST API 노하우 (토큰 관리, 잔고조회, 시세조회)

## 기술 스택
- Backend: Python (FastAPI)
- Frontend: Streamlit (JW009 패턴) 또는 React
- DB: SQLite
- API: 키움증권 REST API
