import { useState } from 'react'
import Home from './pages/Home.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './pages/Results.jsx'
import { calculateMaturityScore, getStageAndRecommendations } from './lib/scoring.js'

function App() {
  const [view, setView] = useState('home')
  const [age, setAge] = useState(null)
  const [report, setReport] = useState(null)

  const handleStart = (selectedAge) => {
    setAge(selectedAge)
    setView('quiz')
  }

  const handleSubmit = (responses) => {
    const score = calculateMaturityScore(age, responses)
    setReport(getStageAndRecommendations(score, age))
    setView('results')
  }

  const handleRestart = () => {
    setAge(null)
    setReport(null)
    setView('home')
  }

  return (
    <div className="min-h-screen bg-[#14150f] text-white font-sans">
      {view === 'home' && <Home handleStart={handleStart} />}
      {view === 'quiz' && <Quiz age={age} handleSubmit={handleSubmit} />}
      {view === 'results' && (
        <Results report={report} age={age} handleRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
