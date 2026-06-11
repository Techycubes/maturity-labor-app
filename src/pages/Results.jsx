function Results({ report, age, handleRestart }) {
  if (!report) return null

  const { stage, score, tips, workTypes, workReadinessLevel } = report

  const readinessColor = {
    low: 'bg-[#c96e4a]/15 text-[#e0987c] border-[#c96e4a]/40',
    medium: 'bg-[#d9a24e]/15 text-[#e8c07a] border-[#d9a24e]/40',
    high: 'bg-[#8fae5e]/15 text-[#b6d086] border-[#8fae5e]/40',
  }[workReadinessLevel]

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      {/* Score header */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
          Your Maturity Score
        </p>
        <p className="mt-2 bg-gradient-to-r from-[#e0925c] via-[#e3b264] to-[#a0bd6f] bg-clip-text text-7xl font-extrabold text-transparent">
          {score}
        </p>
        <h1 className="mt-4 text-3xl font-bold">{stage.label}</h1>
        <p className="mt-1 text-stone-400">
          Ages {stage.ageRange.min}–{stage.ageRange.max} · You are {age}
        </p>
        <span
          className={`mt-4 inline-block rounded-full border px-4 py-1 text-sm font-semibold capitalize ${readinessColor}`}
        >
          Work readiness: {workReadinessLevel}
        </span>
      </div>

      <p className="mt-8 leading-relaxed text-stone-300">{stage.description}</p>

      {/* Maximization tips */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[#e3b06a]">
          How to Maximize This Stage
        </h2>
        <ol className="mt-4 space-y-3">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="rounded-xl border border-stone-800 bg-[#1e2016] p-4 text-sm leading-relaxed text-stone-200"
            >
              <span className="mr-2 font-bold text-[#d9a05b]">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ol>
      </section>

      {/* Suggested work */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[#a8c47e]">
          Suggested Work Types
        </h2>
        <ul className="mt-4 space-y-2">
          {workTypes.map((work) => (
            <li
              key={work}
              className="rounded-xl border border-stone-800 bg-[#1e2016] px-4 py-3 text-sm text-stone-200"
            >
              {work}
            </li>
          ))}
        </ul>
      </section>

      {/* Research note */}
      <section className="mt-10 rounded-xl border border-stone-800 bg-[#181a11] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
          Research Basis
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-300">
          {stage.researchNote.citation}
        </p>
        <a
          href={stage.researchNote.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-[#a8c47e] underline-offset-2 hover:underline"
        >
          {stage.researchNote.institution} →
        </a>
      </section>

      <button
        type="button"
        onClick={handleRestart}
        className="mt-12 w-full rounded-xl border border-stone-700 px-8 py-4 text-lg font-semibold text-stone-200 transition hover:border-[#d9a05b] hover:text-white"
      >
        Take It Again
      </button>
    </div>
  )
}

export default Results
