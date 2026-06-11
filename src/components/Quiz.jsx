import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import allQuestions from '../data/questions.json'

function Quiz({ age, handleSubmit }) {
  const questions = useMemo(() => {
    if (age == null) return allQuestions
    return allQuestions.filter(
      (q) => age >= q.ageRange.min && age <= q.ageRange.max
    )
  }, [age])

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState([])

  // Locks out double-clicks and clicks landing during the exit animation,
  // which would otherwise record a duplicate response or double-submit.
  const answerLock = useRef(false)
  useEffect(() => {
    answerLock.current = false
  }, [currentQuestion])

  const question = questions[currentQuestion]
  const progress = (currentQuestion / questions.length) * 100

  const onAnswer = (value) => {
    if (answerLock.current) return
    answerLock.current = true

    const next = [
      ...responses,
      { id: question.id, domain: question.domain, value },
    ]
    setResponses(next)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit(next)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-10">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-stone-400">
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="capitalize">{question.domain.replace('_', ' ')}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e2016]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#d9885a] to-[#9cb46a]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>

      {/* Question card */}
      <div className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
              {question.text}
            </h2>

            <div className="mt-8 flex flex-col gap-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAnswer(option.value)}
                  className="group rounded-xl border border-stone-700 bg-[#1e2016] px-5 py-4 text-left text-base text-stone-200 transition hover:border-[#d9a05b] hover:bg-[#d9a05b]/10 focus:outline-none focus:ring-2 focus:ring-[#d9a05b]/60 active:bg-[#d9a05b]/20"
                >
                  <span className="transition group-hover:text-white">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs leading-relaxed text-stone-500">
              Source: {question.source}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Quiz
