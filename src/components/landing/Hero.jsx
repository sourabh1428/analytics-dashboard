'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollScrub } from '@/src/lib/scrollScrub'

const TICKER_ITEMS = [
  'BILL #2406-0047 SENT — RAMESH K. ✓✓',
  'REMINDER FIRED 09:00 — SUNITA G.',
  '₹1,240 COLLECTED — VERMA MEDICAL',
  'FOLLOW-UP BOOKED — 28 DAYS',
  'CUSTOMER RECOVERED — MOHAN D.',
  'BROADCAST 234/300 DELIVERED',
]

const RAIL_NODES = ['01 — LOG THE SALE', '02 — BILL PRINTS', '03 — SENT ON WHATSAPP', '04 — REMINDER BOOKED']
const RAIL_THRESHOLDS = [0.16, 0.44, 0.6, 0.78]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="overflow-hidden border-t border-ink bg-paper-alt">
      <div className="flex w-max animate-eb-ticker whitespace-nowrap py-[11px] font-mono text-xs tracking-[0.12em] text-ink-soft motion-reduce:animate-none">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-[18px]">{item}</span>
            <span className="text-green">{'//'}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const NAV_HEIGHT = 64

export default function Hero() {
  const posthog = usePostHog()

  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const hintRef = useRef(null)
  const progRef = useRef(null)
  const clockRef = useRef(null)
  const railFillRef = useRef(null)
  const nodeRefs = useRef([])
  const aLayerRef = useRef(null)
  const aLineRefs = useRef([])
  const machineRef = useRef(null)
  const paperRef = useRef(null)
  const wireRef = useRef(null)
  const packetRef = useRef(null)
  const phoneRef = useRef(null)
  const bubRefs = useRef([])
  const tickRef = useRef(null)
  const stampRef = useRef(null)
  const bLineRefs = useRef([])
  const bCtaRef = useRef(null)

  useScrollScrub({
    wrapperRef: trackRef,
    stageRef,
    stickyOffset: NAV_HEIGHT,
    mouseParallax: true,
    onUpdate: (p, { mx, my }) => {
      if (hintRef.current) hintRef.current.style.opacity = String(1 - seg(p, 0.01, 0.05))
      if (progRef.current) progRef.current.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%'
      if (clockRef.current) {
        clockRef.current.textContent =
          p < 0.28
            ? '08:59 — OPENING THE SHUTTER'
            : p < 0.5
              ? '18:32 — SALE LOGGED, BILL PRINTS'
              : p < 0.68
                ? '18:32 — SENT ON WHATSAPP'
                : p < 0.84
                  ? '18:33 — CUSTOMER REPLIES'
                  : '09:00, NEXT MONTH — REMINDER FIRES ITSELF'
      }

      aLineRefs.current.forEach((l, i) => {
        if (!l) return
        const drift = -p * 26 * (1 + i * 0.35)
        const out = seg(p, 0.12 + i * 0.03, 0.24 + i * 0.03)
        l.style.transform = `translateY(${drift - out * 118}%)`
      })
      if (aLayerRef.current) aLayerRef.current.style.opacity = String(1 - seg(p, 0.2, 0.28))

      const mIn = seg(p, 0.16, 0.3)
      const mOut = seg(p, 0.84, 0.92)
      if (machineRef.current) {
        machineRef.current.style.opacity = String(mIn * (1 - mOut * 0.88))
        machineRef.current.style.transform = `translate(${mx}px, ${lerp(56, 0, mIn) + my - mOut * 54}px) scale(${lerp(0.85, 1, mIn) - mOut * 0.07})`
      }
      if (paperRef.current) paperRef.current.style.transform = `translateY(${lerp(-93, 0, seg(p, 0.22, 0.44))}%)`
      if (phoneRef.current) {
        phoneRef.current.style.opacity = String(seg(p, 0.34, 0.44))
        phoneRef.current.style.transform = `translateX(${lerp(110, 0, seg(p, 0.34, 0.48))}px)`
      }
      if (wireRef.current) wireRef.current.style.transform = `scaleX(${seg(p, 0.44, 0.54)})`
      const pk = seg(p, 0.48, 0.6)
      if (packetRef.current) {
        packetRef.current.style.opacity = String(seg(p, 0.46, 0.5) * (1 - seg(p, 0.58, 0.62)))
        packetRef.current.style.transform = `translate(${lerp(-10, 128, pk)}px, -50%) rotate(${lerp(-5, 4, pk)}deg)`
      }
      bubRefs.current.forEach((b, i) => {
        if (!b) return
        const s = seg(p, 0.6 + i * 0.09, 0.66 + i * 0.09)
        b.style.opacity = String(s)
        b.style.transform = `translateY(${lerp(16, 0, s)}px) scale(${lerp(0.92, 1, s)})`
      })
      if (tickRef.current) {
        const on = p > 0.7
        tickRef.current.textContent = on ? '✓✓ READ 18:33' : '✓ SENT 18:32'
        tickRef.current.style.color = on ? '#146C3C' : '#6E6753'
      }
      const st = seg(p, 0.78, 0.84)
      if (stampRef.current) {
        stampRef.current.style.opacity = String(st)
        stampRef.current.style.transform = `rotate(-6deg) scale(${lerp(2.4, 1, st)})`
      }
      bLineRefs.current.forEach((l, i) => {
        if (!l) return
        l.style.transform = `translateY(${lerp(i === 0 ? 130 : 112, 0, seg(p, 0.86 + i * 0.025, 0.94 + i * 0.025))}%)`
      })
      const cb = seg(p, 0.92, 0.99)
      if (bCtaRef.current) {
        bCtaRef.current.style.opacity = String(cb)
        bCtaRef.current.style.transform = `translateY(${lerp(18, 0, cb)}px)`
      }
      if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${p})`
      nodeRefs.current.forEach((n, i) => {
        if (!n) return
        const on = p >= RAIL_THRESHOLDS[i]
        n.style.opacity = on ? '1' : '.38'
        const dot = n.firstElementChild
        if (dot) dot.style.background = on ? '#146C3C' : 'transparent'
      })
    },
  })

  const addA = (el) => { if (el && !aLineRefs.current.includes(el)) aLineRefs.current.push(el) }
  const addB = (el) => { if (el && !bLineRefs.current.includes(el)) bLineRefs.current.push(el) }
  const addBub = (el) => { if (el && !bubRefs.current.includes(el)) bubRefs.current.push(el) }
  const addNode = (el) => { if (el && !nodeRefs.current.includes(el)) nodeRefs.current.push(el) }

  return (
    <header id="top" className="border-b border-ink">
      <div ref={trackRef} className="relative h-[150vh] sm:h-[400vh]">
        <div
          ref={stageRef}
          className="sticky top-16 h-[calc(100vh-64px)] overflow-clip bg-paper"
        >
          {/* meta row */}
          <div className="absolute inset-x-4 top-[22px] z-[7] flex justify-between font-mono text-[11px] tracking-[0.14em] text-mutedink sm:inset-x-8">
            <span>№ 1 BILLING APP FOR LOCAL BUSINESSES</span>
            <span ref={clockRef} className="hidden sm:inline">08:59 — OPENING THE SHUTTER</span>
          </div>

          {/* timeline rail */}
          <div className="absolute left-4 top-1/2 z-[7] hidden h-56 -translate-y-1/2 gap-4 lg:flex sm:left-8">
            <div className="relative w-[2px] bg-ink/[.16]">
              <span
                ref={railFillRef}
                className="absolute inset-0 origin-top bg-green"
                style={{ transform: 'scaleY(0)', willChange: 'transform' }}
              />
            </div>
            <div className="grid content-between">
              {RAIL_NODES.map((label) => (
                <div key={label} ref={addNode} className="flex items-center gap-2.5 opacity-[.38] transition-opacity duration-300">
                  <span className="h-[9px] w-[9px] border border-ink transition-colors duration-300" />
                  <span className="font-mono text-[10px] tracking-[0.14em]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACT A — the problem */}
          <div ref={aLayerRef} className="pointer-events-none absolute inset-0 z-[5] grid place-content-center text-center">
            <h1 className="m-0 font-display text-[clamp(44px,5.6vw,92px)] font-extrabold uppercase leading-[.92] tracking-[-0.018em] [font-stretch:68%]">
              <span className="block overflow-hidden py-[.05em] leading-none">
                <span ref={addA} className="block leading-none" style={{ willChange: 'transform' }}>
                  Local businesses
                </span>
              </span>
              <span className="block overflow-hidden py-[.05em] leading-none">
                <span ref={addA} className="block leading-none" style={{ willChange: 'transform' }}>
                  lose <span className="text-rust">20–40%</span> of
                </span>
              </span>
              <span className="block overflow-hidden py-[.05em] leading-none">
                <span ref={addA} className="block leading-none" style={{ willChange: 'transform' }}>
                  customers a year.
                </span>
              </span>
            </h1>
            <p className="mt-[34px] font-mono text-[13px] tracking-[0.18em] text-mutedink">
              THEY DON&apos;T LEAVE. THEY FORGET. KEEP SCROLLING ↓
            </p>
          </div>

          {/* ACT B — the machine assembling */}
          <div
            ref={machineRef}
            className="absolute inset-0 z-[4] grid place-items-center opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative flex origin-center scale-[.7] flex-col items-center gap-5 min-[420px]:scale-[.85] sm:scale-100 sm:flex-row sm:items-center sm:gap-0">
              <div className="w-[292px]">
                <div className="relative z-[3] flex items-center justify-between bg-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-paper">
                  <span>EASIBILL PRINTER</span>
                  <span className="animate-eb-blink text-green-bright motion-reduce:animate-none">● LIVE</span>
                </div>
                <div className="relative h-[396px] overflow-hidden">
                  <div
                    ref={paperRef}
                    className="mx-auto w-[272px] bg-paper-white px-[22px] pb-6 pt-5 font-mono text-xs text-ink shadow-[0_18px_40px_rgba(23,21,15,.18)]"
                    style={{
                      transform: 'translateY(-93%)',
                      willChange: 'transform',
                      clipPath:
                        'polygon(0 0, 100% 0, 100% calc(100% - 8px), 96% 100%, 92% calc(100% - 8px), 88% 100%, 84% calc(100% - 8px), 80% 100%, 76% calc(100% - 8px), 72% 100%, 68% calc(100% - 8px), 64% 100%, 60% calc(100% - 8px), 56% 100%, 52% calc(100% - 8px), 48% 100%, 44% calc(100% - 8px), 40% 100%, 36% calc(100% - 8px), 32% 100%, 28% calc(100% - 8px), 24% 100%, 20% calc(100% - 8px), 16% 100%, 12% calc(100% - 8px), 8% 100%, 4% calc(100% - 8px), 0 100%)',
                    }}
                  >
                    <div className="text-center text-[13px] font-semibold tracking-[0.2em]">VERMA MEDICAL</div>
                    <div className="mt-1 text-center text-mutedink">INVOICE #2406-0047</div>
                    <div className="my-3 border-t border-dashed border-ink opacity-40" />
                    <div className="flex justify-between"><span>REORDER PACK ×1</span><span>₹450</span></div>
                    <div className="mt-1.5 flex justify-between"><span>WELLNESS BUNDLE ×1</span><span>₹640</span></div>
                    <div className="my-3 border-t border-dashed border-ink opacity-40" />
                    <div className="flex justify-between text-sm font-semibold"><span>TOTAL</span><span>₹1,090</span></div>
                    <div className="mt-1 text-mutedink">INCL. TAX · GST-READY ✓</div>
                    <div
                      className="my-3.5 h-8"
                      style={{
                        background: 'repeating-linear-gradient(90deg, #17150F 0 2px, transparent 2px 5px, #17150F 5px 6px, transparent 6px 10px)',
                      }}
                    />
                    <div className="text-center font-semibold tracking-[0.14em] text-green">LOGGED 18:32 ✓</div>
                  </div>
                </div>
              </div>

              <div className="relative hidden w-[168px] sm:block">
                <div ref={wireRef} className="origin-left border-t-2 border-dashed border-ink" style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
                <div
                  ref={packetRef}
                  className="absolute left-0 top-1/2 whitespace-nowrap border border-ink bg-paper-white px-2.5 py-1.5 font-mono text-[10px] tracking-[0.1em] shadow-[3px_3px_0_#17150F]"
                  style={{ transform: 'translate(-10px, -50%)', opacity: 0, willChange: 'transform, opacity' }}
                >
                  ▤ ₹1,090 · PDF
                </div>
              </div>

              <div
                ref={phoneRef}
                className="w-[286px] border border-ink bg-paper-warm opacity-0 shadow-[8px_8px_0_#17150F]"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="flex items-center gap-2.5 bg-green px-3.5 py-2.5 text-paper">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-paper text-xs font-extrabold text-green">RK</span>
                  <div>
                    <div className="text-[13px] font-semibold">Ramesh Kumar</div>
                    <div className="font-mono text-[9px] tracking-[0.1em] opacity-75">VIA YOUR WHATSAPP № — AUTOMATED</div>
                  </div>
                </div>
                <div
                  className="flex min-h-[300px] flex-col gap-2.5 px-3.5 pb-[18px] pt-4"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 26px, rgba(23,21,15,.035) 26px 27px)' }}
                >
                  <div
                    ref={addBub}
                    className="self-end max-w-[88%] border border-green/35 bg-green-pale px-3 py-2.5 text-[13px]"
                    style={{ opacity: 0, willChange: 'transform, opacity' }}
                  >
                    <div className="flex items-center gap-2.5 border border-ink/15 bg-paper-white px-2.5 py-2">
                      <span className="font-mono text-base">▤</span>
                      <div>
                        <div className="text-[12.5px] font-semibold">Invoice #2406-0047.pdf</div>
                        <div className="font-mono text-[10px] text-mutedink">₹1,090 · TAX INCLUDED</div>
                      </div>
                    </div>
                    <div ref={tickRef} className="mt-1.5 text-right font-mono text-[10px] text-mutedink">✓ SENT 18:32</div>
                  </div>
                  <div
                    ref={addBub}
                    className="self-start max-w-[78%] border border-ink/20 bg-paper-white px-3 py-2.5 text-[13px] leading-[1.45]"
                    style={{ opacity: 0, willChange: 'transform, opacity' }}
                  >
                    Mil gaya 🙏 See you next month
                    <div className="mt-1 text-right font-mono text-[10px] text-mutedink">18:33</div>
                  </div>
                </div>
              </div>

              <div
                ref={stampRef}
                className="absolute -bottom-[22px] -right-[26px] z-[5] border-2 border-rust bg-paper/[.92] px-[13px] py-[9px] font-mono text-xs tracking-[0.16em] text-rust"
                style={{ transform: 'rotate(-6deg) scale(2.4)', opacity: 0, willChange: 'transform, opacity' }}
              >
                NEXT REMINDER: 17 AUG — AUTO ✓
              </div>
            </div>
          </div>

          {/* ACT C — the fix */}
          <div className="pointer-events-none absolute inset-0 z-[6] grid place-content-center text-center">
            <div className="overflow-hidden py-0.5 leading-none">
              <span
                ref={addB}
                className="inline-block font-mono text-xs tracking-[0.2em] text-rust"
                style={{ transform: 'translateY(130%)', willChange: 'transform' }}
              >
                THE LOOP RUNS ITSELF — EVERY CUSTOMER, EVERY DAY
              </span>
            </div>
            <h2 className="m-0 mt-[18px] font-display text-[clamp(44px,5.6vw,92px)] font-extrabold uppercase leading-[.92] tracking-[-0.018em] [font-stretch:68%]">
              <span className="block overflow-hidden leading-none">
                <span ref={addB} className="block leading-none" style={{ transform: 'translateY(112%)', willChange: 'transform' }}>
                  EasiBill
                </span>
              </span>
              <span className="block overflow-hidden leading-none">
                <span
                  ref={addB}
                  className="block font-serif text-[.86em] italic font-medium normal-case tracking-normal leading-none text-green"
                  style={{ transform: 'translateY(112%)', willChange: 'transform' }}
                >
                  stops that.
                </span>
              </span>
            </h2>
            <div
              ref={bCtaRef}
              className="pointer-events-auto mt-[42px] flex flex-wrap justify-center gap-3"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <a
                href="https://dashboard.easibill.com/"
                onClick={() => posthog?.capture('hero_cta_clicked', { cta: 'start_free', location: 'hero' })}
                className="inline-block bg-green px-[30px] py-[18px] font-mono text-[13px] tracking-[0.1em] text-paper transition-transform hover:-translate-y-0.5 hover:bg-ink"
              >
                START FREE — NO CARD
              </a>
              <a
                href="#day"
                onClick={() => posthog?.capture('hero_cta_clicked', { cta: 'see_a_day', location: 'hero' })}
                className="inline-block border border-ink px-6 py-[18px] font-mono text-[13px] tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                SEE THE FULL DAY ↓
              </a>
            </div>
          </div>

          {/* bottom hint / progress readout */}
          <div ref={hintRef} className="absolute inset-x-0 bottom-[22px] z-[7] flex justify-center gap-5 font-mono text-[11px] tracking-[0.16em] text-mutedink">
            <span>SCROLL — THE DAY PLAYS OUT ↓</span>
            <span ref={progRef} className="text-green">00%</span>
          </div>
        </div>
      </div>

      <Ticker />
    </header>
  )
}
