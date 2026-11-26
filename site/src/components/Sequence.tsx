import { Section, SectionHead } from './Section'

type Msg = {
  n: number
  from: 'agent' | 'server'
  to: 'server' | 'atlas' | 'agent'
  label: string
  mobile: string
  tone?: 'warn' | 'ok'
}

const BEFORE: Msg[] = [
  { n: 1, from: 'agent', to: 'server', label: 'list_components()', mobile: 'Agent → server' },
  { n: 2, from: 'server', to: 'atlas', label: 'read registry', mobile: 'Server → Atlas' },
  { n: 3, from: 'server', to: 'agent', label: '13 components', mobile: 'Server → agent' },
  { n: 4, from: 'agent', to: 'server', label: 'get_component("Table")', mobile: 'Agent → server' },
  { n: 5, from: 'server', to: 'agent', label: 'props · import · rules', mobile: 'Server → agent' },
]
const LOOP: Msg[] = [
  { n: 6, from: 'agent', to: 'server', label: 'validate_screen(code)', mobile: 'Agent → server' },
  { n: 7, from: 'server', to: 'agent', label: '4 issues', mobile: 'Server → agent', tone: 'warn' },
  { n: 9, from: 'agent', to: 'server', label: 'validate_screen(code)', mobile: 'Agent → server' },
  { n: 10, from: 'server', to: 'agent', label: '0 issues', mobile: 'Server → agent', tone: 'ok' },
]

function Row({ m }: { m: Msg }) {
  const toAtlas = m.to === 'atlas'
  const ret = m.to === 'agent'
  return (
    <div className="seq-msg max-[600px]:h-auto max-[600px]:border-b max-[600px]:px-3.5 max-[600px]:py-2.5 max-[600px]:last:border-b-0">
      <span
        className="seq-line max-[600px]:hidden"
        data-dir={ret ? 'l' : 'r'}
        data-ret={ret ? '' : undefined}
        style={{ left: toAtlas ? '50%' : '16.66%', width: '33.33%' }}
        aria-hidden
      />
      <span
        className={`seq-label max-[600px]:hidden ${m.tone === 'warn' ? 'text-destructive' : m.tone === 'ok' ? 'text-success' : ''}`}
        style={{ left: toAtlas ? '66.66%' : '33.33%' }}
        aria-hidden
      >
        <b className="step-num">{m.n}</b>
        {m.label}
      </span>
      <p className="hidden text-sm max-[600px]:block">
        <b className="step-num">{m.n}</b>
        {m.mobile}
        <small className="block font-mono text-[13px] text-foreground">{m.label}</small>
      </p>
    </div>
  )
}

export function Sequence() {
  return (
    <Section id="flow">
      <div className="wrap">
        <SectionHead eyebrow="02 · Flow" title={<span id="flow-title">One request, start to finish</span>}>
          stdio when it runs on your machine, HTTP for the public read-only endpoint. Same tools either way.
        </SectionHead>
        <div className="mt-6 max-w-[880px]">
          <div
            role="img"
            aria-label="Sequence: the agent lists components and gets Table; it validates its code, gets 4 issues, fixes the code and validates again until 0 issues."
            className="relative rounded-lg border pb-3 max-[600px]:py-1"
          >
            <div className="grid grid-cols-3 rounded-t-lg border-b bg-muted max-[600px]:hidden">
              {[
                ['Coding agent', 'Claude Code'],
                ['Atlas MCP server', 'stdio · HTTP'],
                ['Atlas design system', 'tokens · components · rules'],
              ].map(([t, s]) => (
                <div key={t} className="px-3 py-3.5 text-center text-[15px] font-semibold">
                  {t}
                  <small className="block text-[13px] font-normal text-muted-foreground">{s}</small>
                </div>
              ))}
            </div>
            {['16.66%', '50%', '83.33%'].map((l) => (
              <span key={l} className="seq-lifeline max-[600px]:hidden" style={{ left: l }} aria-hidden />
            ))}
            {BEFORE.map((m) => (
              <Row key={m.n} m={m} />
            ))}
            <div className="relative mt-1 pt-3.5 max-[600px]:m-2">
              <span
                className="pointer-events-none absolute inset-x-2.5 top-0 -bottom-1 rounded-lg border-[1.5px] border-dashed border-input"
                aria-hidden
              />
              <span
                className="absolute -top-[11px] left-3 bg-background px-1.5 text-xs/5 font-semibold text-muted-foreground"
                aria-hidden
              >
                loop until 0 issues
              </span>
              <Row m={LOOP[0]!} />
              <Row m={LOOP[1]!} />
              <div className="seq-msg max-[600px]:h-auto max-[600px]:border-b max-[600px]:px-3.5 max-[600px]:py-2.5">
                <svg
                  className="absolute top-1.5 left-[16.66%] overflow-visible max-[600px]:hidden"
                  width="64"
                  height="30"
                  viewBox="0 0 64 30"
                  aria-hidden
                >
                  <path
                    d="M0 4 H40 a10 10 0 0 1 10 10 v2 a10 10 0 0 1 -10 10 H8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 21 L4 26 L12 31"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="seq-label max-[600px]:hidden"
                  style={{ left: 'calc(16.66% + 72px)', top: 9, transform: 'none' }}
                  aria-hidden
                >
                  <b className="step-num">8</b>fix the code
                </span>
                <p className="hidden text-sm max-[600px]:block">
                  <b className="step-num">8</b>Agent fixes its own code
                  <small className="block font-mono text-[13px] text-foreground">
                    tokens, real components, valid props
                  </small>
                </p>
              </div>
              <Row m={LOOP[2]!} />
              <Row m={LOOP[3]!} />
            </div>
          </div>
          <p className="mt-2.5 flex flex-wrap justify-end gap-6 text-sm text-muted-foreground" aria-hidden>
            <span>
              <i className="mr-2 inline-block w-8 border-t-2 border-foreground align-middle" />
              call
            </span>
            <span>
              <i className="mr-2 inline-block w-8 border-t-2 border-dashed border-muted-foreground align-middle" />
              response
            </span>
            <span>
              <i className="mr-2 inline-block h-3 w-[18px] rounded-r border-2 border-l-0 border-foreground align-middle" />
              the agent's own step
            </span>
          </p>
        </div>
      </div>
    </Section>
  )
}
