import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import resources from '../data/resources.json'
<<<<<<< HEAD
import { getScoreInterpretation } from '../lib/scoring.js'
=======
>>>>>>> ef163329e9d9168b9ab62c8a5e5f307988d799fe

const READINESS = {
  high: { label: 'High', cls: 'bg-[#8fae5e]/15 text-[#b6d086] border-[#8fae5e]/40' },
  medium: { label: 'Medium', cls: 'bg-[#d9a24e]/15 text-[#e8c07a] border-[#d9a24e]/40' },
  low: { label: 'Low', cls: 'bg-[#c96e4a]/15 text-[#e0987c] border-[#c96e4a]/40' },
}

const DOMAIN_COLORS = {
  emotional: '#d9885a',
  cognitive: '#e3b264',
  social: '#9cb46a',
  physical: '#6f9e8a',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function CountUp({ value, duration = 1200 }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutCubic for a natural settle
      const eased = 1 - Math.pow(1 - progress, 3)
      setN(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{n}</>
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-stone-700 bg-[#181a11] px-3 py-2 text-sm text-stone-200 shadow-lg">
      <span className="font-semibold">{payload[0].payload.domain}</span>
      <span className="ml-2 text-stone-400">{payload[0].value}/100</span>
    </div>
  )
}

function Results({
  score,
  stage,
  tips,
  workTypes,
  workReadinessLevel,
  domainScores,
  age,
  handleRestart,
}) {
  const readiness = READINESS[workReadinessLevel] ?? READINESS.medium
<<<<<<< HEAD
  const interpretation = getScoreInterpretation(score, age)
=======
>>>>>>> ef163329e9d9168b9ab62c8a5e5f307988d799fe

  const gaugeData = [{ name: 'score', value: score }]

  const barData = [
    { domain: 'Emotional', score: domainScores?.emotional ?? 0, color: DOMAIN_COLORS.emotional },
    { domain: 'Cognitive', score: domainScores?.cognitive ?? 0, color: DOMAIN_COLORS.cognitive },
    { domain: 'Social', score: domainScores?.social ?? 0, color: DOMAIN_COLORS.social },
    { domain: 'Physical', score: domainScores?.physical ?? 0, color: DOMAIN_COLORS.physical },
  ]

  return (
    <motion.div
      className="mx-auto w-full max-w-2xl px-6 py-14"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Score gauge */}
      <motion.div variants={item} className="flex flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
          Your Maturity Score
        </p>

        <div className="relative mt-4 h-56 w-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="78%"
              outerRadius="100%"
              data={gaugeData}
              startAngle={90}
              endAngle={-270}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d9885a" />
                  <stop offset="100%" stopColor="#9cb46a" />
                </linearGradient>
              </defs>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: '#1e2016' }}
                dataKey="value"
                cornerRadius={30}
                angleAxisId={0}
                fill="url(#scoreGradient)"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-white">
              <CountUp value={score} />
            </span>
            <span className="text-sm text-stone-400">out of 100</span>
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold">{stage.label}</h1>
        <p className="mt-1 text-stone-400">
          Ages {stage.ageRange.min}–{stage.ageRange.max} · You are {age}
        </p>
        <span
          className={`mt-4 inline-block rounded-full border px-4 py-1 text-sm font-semibold ${readiness.cls}`}
        >
          Work readiness: {readiness.label}
        </span>
<<<<<<< HEAD

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#e8c07a]">
          {interpretation.message}
        </p>
      </motion.div>

      {/* Stage description */}
      <motion.p variants={item} className="mt-8 leading-relaxed text-stone-300">
        {stage.description}
      </motion.p>

=======
      </motion.div>

      {/* Stage description */}
      <motion.p variants={item} className="mt-8 leading-relaxed text-stone-300">
        {stage.description}
      </motion.p>

>>>>>>> ef163329e9d9168b9ab62c8a5e5f307988d799fe
      {/* Domain breakdown chart */}
      <motion.section variants={item} className="mt-12">
        <h2 className="text-xl font-bold text-[#e3b06a]">Domain Breakdown</h2>
        <div className="mt-4 rounded-xl border border-stone-800 bg-[#181a11] p-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f3322" vertical={false} />
              <XAxis
                dataKey="domain"
                tick={{ fill: '#a8a29e', fontSize: 12 }}
                axisLine={{ stroke: '#2f3322' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#a8a29e', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: '#ffffff08' }} content={<ChartTooltip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} isAnimationActive>
                {barData.map((entry) => (
                  <Cell key={entry.domain} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Maximize Your Childhood */}
      <motion.section variants={item} className="mt-12">
<<<<<<< HEAD
        <h2 className="text-xl font-bold text-[#e3b06a]">
          {age >= 18 ? 'Maximize This Stage' : 'Maximize Your Childhood'}
        </h2>
=======
        <h2 className="text-xl font-bold text-[#e3b06a]">Maximize Your Childhood</h2>
>>>>>>> ef163329e9d9168b9ab62c8a5e5f307988d799fe
        <div className="mt-4 grid gap-3">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-800 bg-[#1e2016] p-4 text-sm leading-relaxed text-stone-200"
            >
              <span className="mr-2 font-bold text-[#d9a05b]">{i + 1}.</span>
              {tip}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Work Readiness */}
      <motion.section variants={item} className="mt-12">
        <h2 className="text-xl font-bold text-[#a8c47e]">Work Readiness</h2>
        <p className="mt-1 text-sm text-stone-400">
          Suggested work types for this stage:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {workTypes.map((work) => (
            <li
              key={work}
              className="rounded-xl border border-stone-800 bg-[#1e2016] px-4 py-3 text-sm text-stone-200"
            >
              {work}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Research Sources */}
      <motion.section variants={item} className="mt-12">
        <h2 className="text-xl font-bold text-stone-200">Research Sources</h2>
        <p className="mt-1 text-sm text-stone-400">
          This stage draws on {stage.researchNote.institution}:
        </p>
        <a
          href={stage.researchNote.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-xl border border-stone-800 bg-[#181a11] p-4 text-sm leading-relaxed text-stone-300 transition hover:border-[#d9a05b]"
        >
          {stage.researchNote.citation}
          <span className="mt-2 block text-[#a8c47e]">
            {stage.researchNote.institution} →
          </span>
        </a>

        <p className="mt-6 text-sm text-stone-400">Further reading:</p>
        <ul className="mt-3 grid gap-2">
          {resources.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col rounded-xl border border-stone-800 bg-[#1e2016] px-4 py-3 transition hover:border-[#d9a05b]"
              >
                <span className="text-sm font-medium text-stone-200">{r.title}</span>
                <span className="mt-1 text-xs text-[#a8c47e]">
                  {r.institution} · {r.year} →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Retake */}
      <motion.button
        variants={item}
        type="button"
        onClick={handleRestart}
        className="mt-12 w-full rounded-xl border border-stone-700 px-8 py-4 text-lg font-semibold text-stone-200 transition hover:border-[#d9a05b] hover:text-white"
      >
        Retake Assessment
      </motion.button>
    </motion.div>
  )
}

export default Results
