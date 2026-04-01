import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import ComparePage from './pages/ComparePage'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  return (
    <BrowserRouter>
      <div style={{minHeight:'100vh',
                   backgroundColor:'#f0fdf4'}}>
        <Navbar />
        <Routes>
          <Route path="/"
            element={<HomePage />} />
          <Route path="/result/:id"
            element={<ResultPage />} />
          <Route path="/history"
            element={<HistoryPage />} />
          <Route path="/compare"
            element={<ComparePage />} />
          <Route path="/leaderboard"
            element={<LeaderboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App