import { useState, useEffect } from 'react'
import { api } from '../api'
import StockCard from '../components/StockCard'

export default function MyStocks() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(api('/api/balance'))
      .then(res => res.json())
      .then(data => {
        setBalance(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  const { summary, holdings } = balance || { summary: {}, holdings: [] }
  const totalAsset = summary.추정예탁자산 || 0
  const totalBuy = summary.총매입금액 || 0
  const totalEval = summary.총평가금액 || 0
  const totalPl = summary.총평가손익 || 0
  const totalRate = summary.총수익률 || 0

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">💰 내 주식</h1>

      {/* 요약 */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">총 자산</p>
            <p className="text-lg font-bold text-gray-800">₩{totalAsset.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">수익</p>
            <p className={`text-lg font-bold ${totalPl >= 0 ? 'text-gain' : 'text-loss'}`}>
              {totalPl >= 0 ? '+' : ''}₩{totalPl.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">산 금액</p>
            <p className="text-sm font-semibold text-gray-700">₩{totalBuy.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">지금 값어치</p>
            <p className="text-sm font-semibold text-gray-700">₩{totalEval.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 보유 종목 리스트 */}
      {holdings.length > 0 ? (
        <div className="space-y-3">
          {holdings.map(h => (
            <div key={h.종목코드} className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-gray-800">{h.종목명}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  h.평가손익 >= 0 ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'
                }`}>
                  {h.수익률 >= 0 ? '+' : ''}{h.수익률.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">보유</p>
                  <p className="font-semibold text-gray-700">{h.보유수량}주</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">산 가격</p>
                  <p className="font-semibold text-gray-700">₩{h.매입가.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">지금 가격</p>
                  <p className="font-semibold text-gray-700">₩{h.현재가.toLocaleString()}</p>
                </div>
              </div>
              {/* 수익 바 */}
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${h.평가손익 >= 0 ? 'bg-gain' : 'bg-loss'}`}
                  style={{ width: `${Math.min(Math.abs(h.수익률) * 2 + 10, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-bold text-gray-600">아직 주식이 없어!</p>
          <p className="text-sm text-gray-400 mt-1">처음 살 종목을 골라보자</p>
        </div>
      )}
    </div>
  )
}
