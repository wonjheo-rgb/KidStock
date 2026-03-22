"""키움증권 REST API 클라이언트 (KidStock용 — 단일 계좌)"""

import requests
from datetime import datetime, timedelta
import config

KST = config.KST


class KiwoomAPI:
    def __init__(self, account=None):
        account = account or config.ACCOUNT
        self.name = account["name"]
        self.account_no = account["account_no"]
        self.base_url = config.BASE_URL_MOCK if config.MOCK else config.BASE_URL_REAL
        self.app_key = account["app_key"]
        self.secret_key = account["app_secret"]
        self.token = None
        self.token_expires = None

    def _get_token(self):
        """접근토큰 발급 (au10001)"""
        if self.token and self.token_expires and datetime.now(KST) < self.token_expires:
            return self.token

        url = f"{self.base_url}/oauth2/token"
        headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "api-id": "au10001",
        }
        body = {
            "grant_type": "client_credentials",
            "appkey": self.app_key,
            "secretkey": self.secret_key,
        }

        resp = requests.post(url, json=body, headers=headers)
        data = resp.json()

        if data.get("return_code") != 0:
            raise Exception(f"토큰 발급 실패: {data.get('return_msg')}")

        self.token = data["token"]
        self.token_expires = datetime.strptime(data["expires_dt"], "%Y%m%d%H%M%S").replace(tzinfo=KST)
        print(f"  [{self.name}] 토큰 발급 완료 (만료: {self.token_expires})")
        return self.token

    def _request(self, api_id, body, url_path="/api/dostk/acnt"):
        """공통 API 요청 (연속조회 자동 처리)"""
        token = self._get_token()
        url = f"{self.base_url}{url_path}"

        all_results = []
        cont_yn = ""
        next_key = ""

        while True:
            headers = {
                "Content-Type": "application/json;charset=UTF-8",
                "api-id": api_id,
                "authorization": f"Bearer {token}",
            }
            if cont_yn:
                headers["cont-yn"] = cont_yn
            if next_key:
                headers["next-key"] = next_key

            resp = requests.post(url, json=body, headers=headers)
            data = resp.json()

            if data.get("return_code") != 0:
                raise Exception(f"API 호출 실패 [{api_id}]: {data.get('return_msg')}")

            all_results.append(data)

            resp_cont = resp.headers.get("cont-yn", "")
            if resp_cont == "Y":
                cont_yn = resp_cont
                next_key = resp.headers.get("next-key", "")
            else:
                break

        return all_results

    def get_account_balance(self):
        """계좌평가잔고내역 (kt00018) — 보유종목 + 총자산"""
        body = {"qry_tp": "1", "dmst_stex_tp": config.STOCK_EXCHANGE}
        results = self._request("kt00018", body)

        first = results[0]
        summary = {
            "계좌명": self.name,
            "총매입금액": self._parse_amount(first.get("tot_pur_amt", "0")),
            "총평가금액": self._parse_amount(first.get("tot_evlt_amt", "0")),
            "총평가손익": self._parse_signed_amount(first.get("tot_evlt_pl", "0")),
            "총수익률": float(first.get("tot_prft_rt", "0")),
            "추정예탁자산": self._parse_amount(first.get("prsm_dpst_aset_amt", "0")),
        }

        holdings = []
        for result in results:
            for item in result.get("acnt_evlt_remn_indv_tot", []):
                holdings.append({
                    "종목코드": item.get("stk_cd", "").replace("A", ""),
                    "종목명": item.get("stk_nm", "").strip(),
                    "보유수량": self._parse_int(item.get("rmnd_qty", "0")),
                    "매입가": self._parse_amount(item.get("pur_pric", "0")),
                    "현재가": self._parse_amount(item.get("cur_prc", "0")),
                    "매입금액": self._parse_amount(item.get("pur_amt", "0")),
                    "평가금액": self._parse_amount(item.get("evlt_amt", "0")),
                    "평가손익": self._parse_signed_amount(item.get("evltv_prft", "0")),
                    "수익률": float(item.get("prft_rt", "0")),
                })

        return {"summary": summary, "holdings": holdings}

    def get_stock_price(self, stock_code):
        """주식기본정보요청 (ka10001) — 현재가 포함"""
        body = {"stk_cd": stock_code}
        results = self._request("ka10001", body, url_path="/api/dostk/stkinfo")
        first = results[0]

        # 키움 API는 현재가에 부호를 붙임 (하락시 '-'). 절대값으로 변환
        cur_prc = abs(self._parse_signed_amount(first.get("cur_prc", "0")))
        pred_pre = self._parse_signed_amount(first.get("pred_pre", "0"))
        flu_rt = float(first.get("flu_rt", "0") or "0")
        high_prc = abs(self._parse_signed_amount(first.get("high_prc", "0") or "0"))
        low_prc = abs(self._parse_signed_amount(first.get("low_pric", "0") or "0"))

        return {
            "종목코드": stock_code,
            "종목명": first.get("stk_nm", "").strip(),
            "현재가": cur_prc,
            "전일대비": pred_pre,
            "등락률": flu_rt,
            "거래량": self._parse_int(first.get("trde_qty", "0")),
            "고가": high_prc,
            "저가": low_prc,
        }

    def get_stock_prices(self, stock_codes):
        """여러 종목 현재가 일괄 조회"""
        results = []
        for code in stock_codes:
            try:
                results.append(self.get_stock_price(code))
            except Exception as e:
                print(f"  현재가 조회 실패 [{code}]: {e}")
        return results

    @staticmethod
    def _parse_int(value):
        try:
            s = value.strip() if value else ""
            return int(s) if s else 0
        except (ValueError, AttributeError):
            return 0

    @staticmethod
    def _parse_amount(value):
        try:
            return int(value.lstrip("0") or "0")
        except (ValueError, AttributeError):
            return 0

    @staticmethod
    def _parse_signed_amount(value):
        try:
            s = value.strip()
            if s.startswith("-"):
                return -int(s[1:].lstrip("0") or "0")
            return int(s.lstrip("0") or "0")
        except (ValueError, AttributeError):
            return 0
