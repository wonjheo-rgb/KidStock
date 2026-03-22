export default function Diary() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dayStr = days[today.getDay()] + '요일'

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">📝 매매 일기</h1>
      <p className="text-sm text-gray-400 mb-6">{dateStr} {dayStr}</p>

      <div className="text-center py-12">
        <p className="text-5xl mb-4">✏️</p>
        <p className="font-bold text-gray-600 text-lg">오늘의 의견을 써보자!</p>
        <p className="text-sm text-gray-400 mt-2">
          어떤 주식을 사고 싶어?<br />왜 그렇게 생각해?
        </p>
        <button className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
          ✏️ 의견 쓰기
        </button>
      </div>
    </div>
  )
}
