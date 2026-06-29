import type { Metadata } from "next";
import Link from "next/link";
import { Radio, ArrowRight, Users, Target, MessageSquare, TrendingUp, Calendar, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Broadcast Campaigns – Health Camp & Loyalty Messages | EasiBill",
  description: "Send targeted WhatsApp campaigns to patient groups. Promote health camps, loyalty offers, and seasonal messages from your pharmacy.",
  alternates: { canonical: "https://easibill.com/features/broadcast-campaigns" },
};

export default function BroadcastCampaignsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 mb-6">
                <Radio className="h-3 w-3" /> Broadcast Campaigns
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Reach the right patients{" "}
                <span className="text-green-600">with one click</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Send targeted WhatsApp messages to specific patient groups — diabetic patients, loyalty members, or everyone — for health camps, seasonal offers, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: campaign builder mockup */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
              <div className="bg-green-600 px-5 py-4">
                <p className="text-white font-semibold">New Campaign</p>
                <p className="text-green-100 text-xs mt-0.5">Estimated reach: 347 patients</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Target audience</p>
                  <div className="flex flex-wrap gap-2">
                    {["Diabetic patients", "High BP", "Active (90d)"].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full font-medium">
                        {tag} ✓
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-xs rounded-full">
                      + Add filter
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Message preview</p>
                  <div className="bg-gray-50 rounded-2xl p-4 relative">
                    <div className="flex items-start gap-2">
                      <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm border border-gray-100 text-xs max-w-[80%]">
                        <p className="font-semibold text-slate-900 mb-0.5">Verma Medical Store</p>
                        <p className="text-gray-600">Hi {"{name}"}, we're hosting a <strong>Free Diabetes Check-up Camp</strong> on 5th July at our store. Come between 9am–1pm. Bring your recent reports. 🩺</p>
                        <p className="text-gray-400 mt-1.5">Reply STOP to opt out</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Schedule</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-slate-700">Jul 3, 2026</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <Send className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-slate-700">10:00 AM</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> Send to 347 patients
                </button>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  {[{ label: "Sent", val: "347" }, { label: "Opened", val: "289" }, { label: "Responded", val: "74" }].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-sm font-bold text-slate-900">{s.val}</p>
                      <p className="text-[10px] text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-green-600">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "4×", label: "more health camp attendance vs printed notices" },
            { value: "83%", label: "WhatsApp open rate on broadcast messages" },
            { value: "< 2 min", label: "to create and schedule a campaign" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-white">{s.value}</p>
              <p className="text-green-200 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">What pharmacies use campaigns for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Health camps & check-up drives", body: "Invite chronic-care patients to free check-up camps. Target by condition — send diabetes check-up invitations only to your diabetic patients.", accent: "green" },
              { title: "Seasonal health awareness", body: "Monsoon hygiene reminders, winter vitamin D tips, summer ORS stock alerts — timely messages that make your pharmacy feel like a healthcare partner.", accent: "blue" },
              { title: "Loyalty & thank-you messages", body: "Reward your top patients. Send exclusive offers to patients who've refilled 6+ times. Loyalty campaigns cost nothing and bring patients back.", accent: "purple" },
              { title: "New product announcements", body: "Launched a new product or tie-up? Notify patients who buy related medicines. Far more effective than a window poster.", accent: "amber" },
            ].map((u) => (
              <div key={u.title} className={`rounded-2xl p-6 border ${
                u.accent === "green" ? "border-green-100 bg-green-50" :
                u.accent === "blue" ? "border-blue-100 bg-blue-50" :
                u.accent === "purple" ? "border-purple-100 bg-purple-50" :
                "border-amber-100 bg-amber-50"
              }`}>
                <h3 className="font-semibold text-slate-900 mb-2">{u.title}</h3>
                <p className="text-sm text-gray-600">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Campaign features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Patient segmentation", body: "Filter by condition, medicine, refill frequency, or inactivity period." },
              { icon: MessageSquare, title: "Message templates", body: "Pre-built templates for health camps, offers, and seasonal events." },
              { icon: Calendar, title: "Scheduled delivery", body: "Set a date and time — messages go out automatically." },
              { icon: Users, title: "Opt-out management", body: "Patients who reply STOP are never messaged again." },
              { icon: TrendingUp, title: "Open & response tracking", body: "See how many patients opened, replied, or came in after your campaign." },
              { icon: Send, title: "Personalisation", body: "Patient name and medicine inserted automatically into every message." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <Icon className="h-6 w-6 text-green-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Run your first campaign today</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Pick a template, choose your audience, and hit send. Done in under 2 minutes.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-colors">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
