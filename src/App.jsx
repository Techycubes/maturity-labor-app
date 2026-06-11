import { useState } from 'react'
import Home from './pages/Home.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './pages/Results.jsx'
import {
  calculateMaturityScore,
  calculateDomainScores,
  getStageAndRecommendations,
} from './lib/scoring.js'

function App() {
  const [view, setView] = useState('home')
  const [age, setAge] = useState(null)
  const [result, setResult] = useState(null)

  const handleStart = (selectedAge) => {
    setAge(selectedAge)
    setView('quiz')
  }

  const handleSubmit = (responses) => {
    const score = calculateMaturityScore(age, responses)
    const { stage, tips, workTypes, workReadinessLevel } =
      getStageAndRecommendations(score, age)
    const domainScores = calculateDomainScores(responses)

    setResult({ score, stage, tips, workTypes, workReadinessLevel, domainScores })
    setView('results')
  }

  const handleRestart = () => {
    setAge(null)
    setResult(null)
    setView('home')
  }

  return (
    <div className="min-h-screen bg-[#14150f] text-white font-sans">
      {view === 'home' && <Home handleStart={handleStart} />}
      {view === 'quiz' && <Quiz age={age} handleSubmit={handleSubmit} />}
      {view === 'results' && result && (
        <Results
          score={result.score}
          stage={result.stage}
          tips={result.tips}
          workTypes={result.workTypes}
          workReadinessLevel={result.workReadinessLevel}
          domainScores={result.domainScores}
          age={age}
          handleRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
