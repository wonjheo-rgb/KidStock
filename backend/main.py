"""KidStock FastAPI 서버"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kiwoom_api import KiwoomAPI
from db import get_db
from stock_master import search_stocks, get_categories

app = FastAPI(title="KidStock API")

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173,https://kidstock.vercel.app").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

api = KiwoomAPI()


# ── 계좌 ──

@app.get("/api/balance")
def get_balance():
    """계좌 잔고 + 보유종목"""
    return api.get_account_balance()


# ── 종목 검색 ──

@app.get("/api/stocks/search")
def stock_search(q: str = ""):
    """종목 검색 (이름, 카테고리, 설명)"""
    return search_stocks(q)


@app.get("/api/stocks/categories")
def stock_categories():
    """카테고리별 종목 목록"""
    return get_categories()


@app.get("/api/stocks/price/{stock_code}")
def stock_price(stock_code: str):
    """개별 종목 현재가"""
    return api.get_stock_price(stock_code)


# ── 관심종목 ──

class WatchlistItem(BaseModel):
    stock_code: str
    stock_name: str
    category: str = "기타"


@app.get("/api/watchlist")
def get_watchlist():
    """관심종목 목록 + 현재가"""
    conn = get_db()
    rows = conn.execute("SELECT * FROM watchlist ORDER BY category, created_at").fetchall()
    conn.close()

    watchlist = [dict(r) for r in rows]

    # 현재가 조회 (장 중에만 의미있음)
    codes = [w["stock_code"] for w in watchlist]
    if codes:
        prices = api.get_stock_prices(codes)
        price_map = {p["종목코드"]: p for p in prices}
        for w in watchlist:
            p = price_map.get(w["stock_code"], {})
            w["price"] = p.get("현재가", 0)
            w["change_rate"] = p.get("등락률", 0)
            w["change_amount"] = p.get("전일대비", 0)

    return watchlist


@app.post("/api/watchlist")
def add_watchlist(item: WatchlistItem):
    """관심종목 추가"""
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO watchlist (stock_code, stock_name, category) VALUES (?, ?, ?)",
            (item.stock_code, item.stock_name, item.category),
        )
        conn.commit()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


@app.delete("/api/watchlist/{stock_code}")
def remove_watchlist(stock_code: str):
    """관심종목 제거"""
    conn = get_db()
    conn.execute("DELETE FROM watchlist WHERE stock_code = ?", (stock_code,))
    conn.commit()
    conn.close()
    return {"success": True}


# ── 기타 ──

@app.get("/api/health")
def health():
    """서버 상태 확인"""
    return {"status": "ok"}
