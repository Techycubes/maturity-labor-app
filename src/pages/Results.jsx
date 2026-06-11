function Results({ report, age, handleRestart }) {
  if (!report) return null

  const { stage, score, tips, workTypes, workReadinessLevel } = report

  const readinessColor = {
    low: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    medium: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    high: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  }[workReadinessLevel]

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      {/* Score header */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
          Your Maturity Score
        </p>
        <p className="mt-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-7xl font-extrabold text-transparent">
          {score}
        </p>
        <h1 className="mt-4 text-3xl font-bold">{stage.label}</h1>
        <p className="mt-1 text-gray-400">
          Ages {stage.ageRange.min}–{stage.ageRange.max} · You are {age}
        </p>
        <span
          className={`mt-4 inline-block rounded-full border px-4 py-1 text-sm font-semibold capitalize ${readinessColor}`}
        >
          Work readiness: {workReadinessLevel}
        </span>
      </div>

      <p className="mt-8 leading-relaxed text-gray-300">{stage.description}</p>

      {/* Maximization tips */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-purple-300">
          How to Maximize This Stage
        </h2>
        <ol className="mt-4 space-y-3">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-800 bg-[#1a1a2e] p-4 text-sm leading-relaxed text-gray-200"
            >
              <span className="mr-2 font-bold text-purple-400">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ol>
      </section>

      {/* Suggested work */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-blue-300">
          Suggested Work Types
        </h2>
        <ul className="mt-4 space-y-2">
          {workTypes.map((work) => (
            <li
              key={work}
              className="rounded-xl border border-gray-800 bg-[#1a1a2e] px-4 py-3 text-sm text-gray-200"
            >
              {work}
            </li>
          ))}
        </ul>
      </section>

      {/* Research note */}
      <section className="mt-10 rounded-xl border border-gray-800 bg-[#13131f] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Research Basis
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          {stage.researchNote.citation}
        </p>
        <a
          href={stage.researchNote.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-blue-400 underline-offset-2 hover:underline"
        >
          {stage.researchNote.institution} →
        </a>
      </section>

      <button
        type="button"
        onClick={handleRestart}
        className="mt-12 w-full rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-gray-200 transition hover:border-purple-500 hover:text-white"
      >
        Take It Again
      </button>
    </div>
  )
}

export default Results
