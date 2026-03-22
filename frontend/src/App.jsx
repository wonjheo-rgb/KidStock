import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import MyStocks from './pages/MyStocks'
import Diary from './pages/Diary'
import Report from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/mystocks" element={<MyStocks />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}
