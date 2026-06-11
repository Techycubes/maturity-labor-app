import { useState } from 'react'

function Home({ handleStart }) {
  const [age, setAge] = useState('')

  const parsedAge = Number(age)
  const isValidAge = Number.isInteger(parsedAge) && parsedAge >= 6 && parsedAge <= 25

  const onStart = () => {
    if (isValidAge) handleStart(parsedAge)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="max-w-3xl bg-gradient-to-r from-[#e0925c] via-[#e3b264] to-[#a0bd6f] bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl">
        Discover Your Maturity Profile
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
        A research-backed assessment for ages 6–25. Built on Ivy League
        developmental science, this app helps you understand where you are
        developmentally, how to make the most of childhood and adolescence,
        and when you're ready to start working.
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-4">
        <label htmlFor="age-input" className="text-sm font-medium uppercase tracking-wider text-stone-400">
          Enter your age
        </label>
        <input
          id="age-input"
          type="number"
          min={6}
          max={25}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onStart()}
          placeholder="6–25"
          className="w-32 rounded-xl border border-stone-700 bg-[#1e2016] px-4 py-3 text-center text-2xl font-semibold text-white outline-none transition focus:border-[#d9a05b] focus:ring-2 focus:ring-[#d9a05b]/40"
        />
        <button
          type="button"
          onClick={onStart}
          disabled={!isValidAge}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#d9885a] to-[#9cb46a] px-8 py-4 text-lg font-semibold text-[#14150f] shadow-lg shadow-[#7a5a2e]/30 transition hover:from-[#e3996b] hover:to-[#abc480] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start Assessment
        </button>
        {age !== '' && !isValidAge && (
          <p className="text-sm text-[#e0987c]">Please enter a whole number between 6 and 25.</p>
        )}
      </div>

      <p className="mt-16 max-w-md text-xs leading-relaxed text-stone-500">
        Assessment content is informed by published research from Harvard,
        Yale, Princeton, and Cornell. This tool is educational and is not a
        clinical or diagnostic instrument.
      </p>
    </div>
  )
}

export default Home
