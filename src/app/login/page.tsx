import Link from "next/link";
import { ArrowRight, Sparkles, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative max-w-md mx-auto pt-32 px-6">
        <div className="flex items-center gap-2 mb-10">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <span className="text-zinc-50 text-xl font-semibold tracking-tight">
            Togari
            <span className="text-zinc-500 font-normal pl-2">/ 48 North</span>
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Sourcing, compressed.
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Engagements, theses, enrichment, dialer, and digests. One platform.
          Sign in to continue to the 48 North workspace.
        </p>

        <div className="mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-4">
            <Shield className="w-3.5 h-3.5" />
            Secured by Auth0 · 48n tenant
          </div>
          <Link
            href="/api/auth/login?returnTo=/"
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            Continue with Auth0
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-zinc-500 text-center">
            By continuing you agree to 48 North&apos;s engagement terms and the
            Togari workspace policies.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { k: "12hrs", v: "calling cadence" },
            { k: "$1.27", v: "cost per company" },
            { k: "<3min", v: "thesis enrichment" },
          ].map((s) => (
            <div
              key={s.v}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4"
            >
              <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {s.k}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
