export default function Report() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">🏆 투자 성적표</h1>

      {/* 레벨 카드 */}
      <div className="bg-gradient-to-r from-primary to-blue-400 rounded-2xl p-5 text-white mb-6 shadow-md text-center">
        <p className="text-3xl mb-2">⭐</p>
        <p className="text-lg font-bold">투자 레벨: Lv.1</p>
        <p className="text-sm opacity-80">꼬마 투자자</p>
        <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '10%' }} />
        </div>
        <p className="text-xs opacity-60 mt-1">다음 레벨까지 의견 5개 더!</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">📝</p>
          <p className="text-2xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-400">쓴 의견</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">🎯</p>
          <p className="text-2xl font-bold text-gray-800">-</p>
          <p className="text-xs text-gray-400">맞춘 비율</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">🔥</p>
          <p className="text-2xl font-bold text-gray-800">0일</p>
          <p className="text-xs text-gray-400">연속 기록</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">🏅</p>
          <p className="text-2xl font-bold text-gray-800">0개</p>
          <p className="text-xs text-gray-400">뱃지</p>
        </div>
      </div>

      {/* 뱃지 영역 */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-700 mb-3">🏅 뱃지 컬렉션</p>
        <div className="text-center py-6">
          <p className="text-gray-300 text-4xl mb-2">🔒</p>
          <p className="text-sm text-gray-400">
            의견을 쓰면 뱃지를 받을 수 있어!
          </p>
        </div>
      </div>
    </div>
  )
}
