"""KidStock 설정 — .env에서 로드"""

import os
import json
from datetime import timezone, timedelta

# .env 파일 자동 로드
_env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(_env_path):
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            if key and key not in os.environ:
                os.environ[key] = value

# 계좌 설정 (단일 계좌)
_account_env = os.environ.get("KIWOOM_ACCOUNT")
if _account_env:
    ACCOUNT = json.loads(_account_env)
else:
    raise RuntimeError("KIWOOM_ACCOUNT 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.")

# API 설정
MOCK = os.environ.get("KIWOOM_MOCK", "false").lower() == "true"
STOCK_EXCHANGE = os.environ.get("STOCK_EXCHANGE", "KRX")

# 한국 표준시
KST = timezone(timedelta(hours=9))

# API URL
BASE_URL_REAL = "https://api.kiwoom.com"
BASE_URL_MOCK = "https://mockapi.kiwoom.com"
