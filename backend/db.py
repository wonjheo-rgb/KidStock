"""SQLite DB 관리"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "kidstock.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_code TEXT NOT NULL UNIQUE,
            stock_name TEXT NOT NULL,
            category TEXT DEFAULT '기타',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS opinions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_code TEXT NOT NULL,
            stock_name TEXT NOT NULL,
            opinion TEXT NOT NULL,
            reason TEXT,
            price_at_opinion INTEGER,
            status TEXT DEFAULT '대기중',
            dad_comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()


# 앱 시작 시 DB 초기화
init_db()
