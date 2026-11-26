import { BeforeAfter } from '../components/BeforeAfter'
import { Evaluation } from '../components/Evaluation'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Quickstart } from '../components/Quickstart'
import { Sequence } from '../components/Sequence'
import { SiteHeader } from '../components/SiteHeader'
import { Tools } from '../components/Tools'
import { scoreboard } from '../lib/scoreboard-data'
import type { ScoreState } from '../lib/scoreboard'

export function HowItWorks({ score = scoreboard }: { score?: ScoreState }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero score={score} />
        <Tools />
        <Sequence />
        <Evaluation score={score} />
        <BeforeAfter />
        <Quickstart />
      </main>
      <Footer />
    </>
  )
}
