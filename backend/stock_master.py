"""KRX 종목 마스터 — 아이가 알만한 종목 위주 + 검색 기능"""

# 아이 눈높이 종목 리스트 (카테고리별)
# 추후 KRX 전체 종목으로 확장 가능
STOCK_LIST = [
    # 게임·엔터
    {"code": "259960", "name": "크래프톤", "category": "게임", "desc": "배틀그라운드 만든 회사"},
    {"code": "251270", "name": "넷마블", "category": "게임", "desc": "세븐나이츠, 모두의마블 만든 회사"},
    {"code": "036570", "name": "엔씨소프트", "category": "게임", "desc": "리니지 만든 회사"},
    {"code": "263750", "name": "펄어비스", "category": "게임", "desc": "검은사막 만든 회사"},
    {"code": "112040", "name": "위메이드", "category": "게임", "desc": "미르 시리즈 만든 회사"},
    {"code": "041510", "name": "에스엠", "category": "엔터", "desc": "에스파, NCT 소속사"},
    {"code": "352820", "name": "하이브", "category": "엔터", "desc": "BTS, 뉴진스 소속사"},
    {"code": "122870", "name": "와이지엔터", "category": "엔터", "desc": "블랙핑크 소속사"},
    {"code": "035900", "name": "JYP Ent.", "category": "엔터", "desc": "있지, 스트레이키즈 소속사"},

    # 먹거리
    {"code": "271560", "name": "오리온", "category": "먹거리", "desc": "초코파이, 포카칩 만드는 회사"},
    {"code": "004990", "name": "롯데지주", "category": "먹거리", "desc": "롯데리아, 롯데월드 하는 회사"},
    {"code": "097950", "name": "CJ제일제당", "category": "먹거리", "desc": "비비고 만두, 햇반 만드는 회사"},
    {"code": "005300", "name": "롯데칠성", "category": "먹거리", "desc": "칠성사이다, 펩시 만드는 회사"},
    {"code": "280360", "name": "롯데웰푸드", "category": "먹거리", "desc": "빼빼로, 가나초콜릿 만드는 회사"},

    # IT·플랫폼
    {"code": "035720", "name": "카카오", "category": "IT", "desc": "카카오톡 만든 회사"},
    {"code": "035420", "name": "NAVER", "category": "IT", "desc": "네이버 검색, 웹툰 하는 회사"},
    {"code": "005930", "name": "삼성전자", "category": "IT", "desc": "갤럭시 폰, 반도체 만드는 회사"},
    {"code": "000660", "name": "SK하이닉스", "category": "IT", "desc": "컴퓨터 메모리 만드는 회사"},
    {"code": "066570", "name": "LG전자", "category": "IT", "desc": "TV, 냉장고, 에어컨 만드는 회사"},

    # 생활·패션
    {"code": "018260", "name": "삼성에스디에스", "category": "생활", "desc": "삼성 IT서비스 회사"},
    {"code": "030000", "name": "제일기획", "category": "생활", "desc": "광고 만드는 회사"},
    {"code": "090430", "name": "아모레퍼시픽", "category": "생활", "desc": "화장품 만드는 회사"},
    {"code": "051900", "name": "LG생활건강", "category": "생활", "desc": "샴푸, 치약 만드는 회사"},

    # 자동차·로봇
    {"code": "005380", "name": "현대차", "category": "자동차", "desc": "현대 자동차 만드는 회사"},
    {"code": "000270", "name": "기아", "category": "자동차", "desc": "기아 자동차 만드는 회사"},
    {"code": "012330", "name": "현대모비스", "category": "자동차", "desc": "자동차 부품 만드는 회사"},

    # 배터리·에너지
    {"code": "373220", "name": "LG에너지솔루션", "category": "배터리", "desc": "전기차 배터리 만드는 회사"},
    {"code": "006400", "name": "삼성SDI", "category": "배터리", "desc": "배터리, 전자재료 만드는 회사"},
]


def search_stocks(query):
    """종목명 또는 카테고리로 검색"""
    query = query.strip().lower()
    if not query:
        return STOCK_LIST

    results = []
    for s in STOCK_LIST:
        if (query in s["name"].lower() or
            query in s["category"].lower() or
            query in s["desc"].lower() or
            query in s["code"]):
            results.append(s)
    return results


def get_categories():
    """카테고리 목록"""
    cats = {}
    for s in STOCK_LIST:
        cat = s["category"]
        if cat not in cats:
            cats[cat] = []
        cats[cat].append(s)
    return cats
