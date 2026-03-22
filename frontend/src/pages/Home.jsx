import { useState, useEffect } from 'react'
import { api } from '../api'
import StockCard from '../components/StockCard'

export default function Home() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(api('/api/balance'))
      .then(res => res.json())
      .then(data => {
        setBalance(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-400">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-gray-400">연결 실패</p>
          <p className="text-xs text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const { summary, holdings } = balance
  const totalAsset = summary.추정예탁자산
  const totalPl = summary.총평가손익
  const totalRate = summary.총수익률
  const isGain = totalPl >= 0

  return (
    <div className="px-4 pt-6">
      {/* 인사 */}
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        👋 래원아, 안녕!
      </h1>

      {/* 총 자산 카드 */}
      <div className="bg-primary rounded-2xl p-5 text-white mb-6 shadow-md">
        <p className="text-sm opacity-80 mb-1">💰 내 총 자산</p>
        <p className="text-3xl font-bold">
          ₩{totalAsset.toLocaleString()}
        </p>
        {totalPl !== 0 && (
          <p className={`text-sm mt-1 ${isGain ? 'text-green-200' : 'text-red-200'}`}>
            {isGain ? '📈' : '📉'} {isGain ? '+' : ''}₩{totalPl.toLocaleString()} ({totalRate >= 0 ? '+' : ''}{totalRate.toFixed(2)}%)
          </p>
        )}
      </div>

      {/* 오늘 할 일 */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <p className="font-bold text-gray-700 mb-3">📋 오늘 할 일</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
            오늘의 매매 의견 쓰기
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
            관심종목 확인하기
          </label>
        </div>
      </div>

      {/* 보유 종목 */}
      {holdings.length > 0 ? (
        <div>
          <p className="font-bold text-gray-700 mb-3">📈 내 주식</p>
          <div className="space-y-3">
            {holdings.map(h => (
              <StockCard
                key={h.종목코드}
                name={h.종목명}
                price={h.현재가}
                change={h.수익률}
                count={h.보유수량}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-bold text-gray-700">아직 주식이 없어!</p>
          <p className="text-sm text-gray-400 mt-1">
            관심종목에서 마음에 드는 종목을 골라보자
          </p>
        </div>
      )}
    </div>
  )
}
