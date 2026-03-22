export default function StockCard({ name, price, change, count }) {
  const isGain = change >= 0
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          {count !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">{count}주 보유</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-800">
            {price !== undefined ? `₩${price.toLocaleString()}` : '-'}
          </p>
          <p className={`text-sm font-semibold ${isGain ? 'text-gain' : 'text-loss'}`}>
            {isGain ? '+' : ''}{change?.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}
