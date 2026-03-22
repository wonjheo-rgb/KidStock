import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  // 관심종목 불러오기
  const loadWatchlist = () => {
    fetch(api('/api/watchlist'))
      .then(res => res.json())
      .then(data => {
        setWatchlist(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadWatchlist() }, [])

  // 종목 검색
  useEffect(() => {
    if (!showSearch) return
    fetch(api(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`))
      .then(res => res.json())
      .then(setSearchResults)
      .catch(() => {})
  }, [searchQuery, showSearch])

  // 관심종목 추가
  const addStock = async (stock) => {
    await fetch(api('/api/watchlist'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stock_code: stock.code,
        stock_name: stock.name,
        category: stock.category,
      }),
    })
    setShowSearch(false)
    setSearchQuery('')
    loadWatchlist()
  }

  // 관심종목 제거
  const removeStock = async (code) => {
    await fetch(api(`/api/watchlist/${code}`), { method: 'DELETE' })
    loadWatchlist()
  }

  // 카테고리별 그룹핑
  const grouped = {}
  watchlist.forEach(w => {
    if (!grouped[w.category]) grouped[w.category] = []
    grouped[w.category].push(w)
  })

  const categoryEmoji = {
    '게임': '🎮', '엔터': '🎤', '먹거리': '🍫', 'IT': '💻',
    '생활': '🏠', '자동차': '🚗', '배터리': '🔋', '기타': '📌',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">⭐ 관심종목</h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
        >
          {showSearch ? '✕ 닫기' : '+ 추가'}
        </button>
      </div>

      {/* 검색 패널 */}
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="종목 이름, 카테고리로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            autoFocus
          />
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {searchResults.map(s => {
              const alreadyAdded = watchlist.some(w => w.stock_code === s.code)
              return (
                <div
                  key={s.code}
                  className="flex items-center justify-between bg-card rounded-xl p-3 border border-gray-100"
                >
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                  {alreadyAdded ? (
                    <span className="text-xs text-gray-300 px-3 py-1">추가됨</span>
                  ) : (
                    <button
                      onClick={() => addStock(s)}
                      className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-bold active:scale-95 transition-transform"
                    >
                      + 추가
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 관심종목 리스트 */}
      {watchlist.length === 0 && !showSearch ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-bold text-gray-600 text-lg">관심종목을 추가해보자!</p>
          <p className="text-sm text-gray-400 mt-2">
            좋아하는 게임, 과자, 유튜브 회사를<br />찾아서 추가해봐
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, stocks]) => (
          <div key={category} className="mb-5">
            <p className="text-sm font-bold text-gray-500 mb-2">
              {categoryEmoji[category] || '📌'} {category}
            </p>
            <div className="space-y-2">
              {stocks.map(s => {
                const isGain = s.change_rate >= 0
                return (
                  <div
                    key={s.stock_code}
                    className="flex items-center justify-between bg-card rounded-xl p-3 border border-gray-100 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{s.stock_name}</p>
                    </div>
                    <div className="text-right mr-3">
                      {s.price > 0 ? (
                        <>
                          <p className="font-bold text-gray-800 text-sm">
                            ₩{s.price.toLocaleString()}
                          </p>
                          <p className={`text-xs font-semibold ${isGain ? 'text-gain' : 'text-loss'}`}>
                            {isGain ? '▲' : '▼'} {Math.abs(s.change_rate).toFixed(2)}%
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-300">시세 없음</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeStock(s.stock_code)}
                      className="text-gray-300 hover:text-loss text-lg px-1"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
