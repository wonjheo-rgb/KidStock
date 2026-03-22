"""키움 API 연결 테스트"""

from kiwoom_api import KiwoomAPI


def main():
    print("=" * 50)
    print("KidStock — 키움증권 API 연결 테스트")
    print("=" * 50)

    api = KiwoomAPI()

    # 1. 토큰 발급 테스트
    print("\n1. 토큰 발급 테스트...")
    try:
        token = api._get_token()
        print(f"   ✅ 성공! 토큰: {token[:20]}...")
    except Exception as e:
        print(f"   ❌ 실패: {e}")
        return

    # 2. 계좌 잔고 조회
    print("\n2. 계좌 잔고 조회...")
    try:
        balance = api.get_account_balance()
        summary = balance["summary"]
        holdings = balance["holdings"]

        print(f"   ✅ 성공!")
        print(f"   💰 총 자산: ₩{summary['추정예탁자산']:,}")
        print(f"   📈 총 매입: ₩{summary['총매입금액']:,}")
        print(f"   📊 총 평가: ₩{summary['총평가금액']:,}")
        print(f"   {'📈' if summary['총평가손익'] >= 0 else '📉'} 손익: ₩{summary['총평가손익']:,} ({summary['총수익률']:+.2f}%)")

        if holdings:
            print(f"\n   보유종목 ({len(holdings)}개):")
            for h in holdings:
                emoji = "🟢" if h["평가손익"] >= 0 else "🔴"
                print(f"   {emoji} {h['종목명']} | {h['보유수량']}주 | ₩{h['현재가']:,} | {h['수익률']:+.2f}%")
        else:
            print("\n   보유종목 없음 (빈 계좌)")
    except Exception as e:
        print(f"   ❌ 실패: {e}")

    print("\n" + "=" * 50)
    print("연결 테스트 완료!")


if __name__ == "__main__":
    main()
