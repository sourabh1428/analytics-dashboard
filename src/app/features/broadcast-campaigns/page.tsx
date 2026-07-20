import type { Metadata } from "next";
import Link from "next/link";
import { Radio, ArrowRight, Users, Target, MessageSquare, TrendingUp, Calendar, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Broadcast Campaigns & Loyalty Messages | Ferbz",
  description: "Send targeted WhatsApp campaigns to customer groups. Promote seasonal sales, loyalty offers, and event messages from your business.",
  alternates: { canonical: "https://ferbz.com/features/broadcast-campaigns" },
};

export default function BroadcastCampaignsPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 border border-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-green">
                <Radio className="h-3 w-3" /> Broadcast Campaigns
              </span>
              <h1 className="mb-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[-0.018em] text-ink md:text-5xl">
                Reach the right customers{" "}
                <span className="text-green">with one click</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-mutedink">
                Send targeted WhatsApp messages to specific customer groups — high-value customers, loyalty members, or everyone — for seasonal sales, loyalty offers, and more.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 bg-green px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-ink">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: campaign builder mockup */}
            <div className="border border-ink bg-paper-white shadow-[8px_8px_0_#17150F]">
              <div className="bg-green px-5 py-4">
                <p className="font-semibold text-paper">New Campaign</p>
                <p className="mt-0.5 font-mono text-xs text-paper/80">Estimated reach: 347 customers</p>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.06em] text-mutedink">Target audience</p>
                  <div className="flex flex-wrap gap-2">
                    {["High-value customers", "Loyalty members", "Active (90d)"].map((tag) => (
                      <span key={tag} className="border border-green/40 bg-green-pale px-2.5 py-1 font-mono text-xs font-medium text-green">
                        {tag} ✓
                      </span>
                    ))}
                    <span className="border border-dashed border-ink/30 px-2.5 py-1 font-mono text-xs text-faint">
                      + Add filter
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.06em] text-mutedink">Message preview</p>
                  <div className="relative border border-ink/20 bg-paper-alt p-4">
                    <div className="flex items-start gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green">
                        <MessageSquare className="h-3.5 w-3.5 text-paper" />
                      </div>
                      <div className="max-w-[80%] border border-ink/15 bg-paper-white px-3 py-2.5 text-xs">
                        <p className="mb-0.5 font-semibold text-ink">Verma Retail Store</p>
                        <p className="text-mutedink">Hi {"{name}"}, we're hosting a <strong>Weekend Loyalty Sale</strong> on 5th July at our store. Come between 9am–1pm and get exclusive member pricing. 🎉</p>
                        <p className="mt-1.5 text-faint">Reply STOP to opt out</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.06em] text-mutedink">Schedule</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 border border-ink/20 bg-paper-alt px-3 py-2">
                      <Calendar className="h-4 w-4 text-mutedink" />
                      <span className="font-mono text-xs text-ink-soft">Jul 3, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 border border-ink/20 bg-paper-alt px-3 py-2">
                      <Send className="h-4 w-4 text-mutedink" />
                      <span className="font-mono text-xs text-ink-soft">10:00 AM</span>
                    </div>
                  </div>
                </div>

                <button className="flex w-full items-center justify-center gap-2 bg-green py-3 font-mono text-sm uppercase tracking-[0.06em] text-paper transition-colors hover:bg-ink">
                  <Send className="h-4 w-4" /> Send to 347 customers
                </button>

                <div className="grid grid-cols-3 gap-2 border-t border-ink/15 pt-2">
                  {[{ label: "Sent", val: "347" }, { label: "Opened", val: "289" }, { label: "Responded", val: "74" }].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-sm font-bold text-ink">{s.val}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink bg-ink px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          {[
            { value: "4×", label: "more event turnout vs printed notices" },
            { value: "83%", label: "WhatsApp open rate on broadcast messages" },
            { value: "< 2 min", label: "to create and schedule a campaign" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-extrabold text-paper">{s.value}</p>
              <p className="mt-2 font-mono text-sm uppercase tracking-[0.06em] text-green-bright">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">What local businesses use campaigns for</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Special events & drives", body: "Invite regular customers to in-store events or drives. Target by segment — send invitations only to the customers they're relevant to.", accent: "green" },
              { title: "Seasonal sale announcements", body: "Monsoon clearance sales, festive season offers, end-of-summer stock alerts — timely messages that make your business feel like a trusted partner.", accent: "ink" },
              { title: "Loyalty & thank-you messages", body: "Reward your top customers. Send exclusive offers to customers who've come back 6+ times. Loyalty campaigns cost nothing and bring customers back.", accent: "rust" },
              { title: "New product announcements", body: "Launched a new product or tie-up? Notify customers who buy related items. Far more effective than a window poster.", accent: "green" },
            ].map((u) => (
              <div key={u.title} className={`border p-6 ${
                u.accent === "green" ? "border-green/40 bg-green-pale" :
                u.accent === "rust" ? "border-rust/40 bg-rust/10" :
                "border-ink/30 bg-paper-alt"
              }`}>
                <h3 className="mb-2 font-semibold text-ink">{u.title}</h3>
                <p className="text-sm text-mutedink">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-ink bg-paper-alt px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">Campaign features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Target, title: "Customer segmentation", body: "Filter by category, item, purchase frequency, or inactivity period." },
              { icon: MessageSquare, title: "Message templates", body: "Pre-built templates for sales, offers, and seasonal events." },
              { icon: Calendar, title: "Scheduled delivery", body: "Set a date and time — messages go out automatically." },
              { icon: Users, title: "Opt-out management", body: "Customers who reply STOP are never messaged again." },
              { icon: TrendingUp, title: "Open & response tracking", body: "See how many customers opened, replied, or came in after your campaign." },
              { icon: Send, title: "Personalisation", body: "Customer name and item inserted automatically into every message." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-ink bg-paper-white p-6 shadow-[6px_6px_0_#17150F]">
                <Icon className="mb-4 h-6 w-6 text-green" />
                <h3 className="mb-2 font-semibold text-ink">{title}</h3>
                <p className="text-sm text-mutedink">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-6 py-20 text-center">
        <h2 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-paper">Run your first campaign today</h2>
        <p className="mx-auto mb-8 max-w-md text-paper/60">Pick a template, choose your audience, and hit send. Done in under 2 minutes.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 bg-green px-8 py-4 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
