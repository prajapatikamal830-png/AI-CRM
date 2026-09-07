import { Sparkles, TrendingUp, Bot, ShieldCheck } from "lucide-react";

export function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#fafafa] text-zinc-900">
      {/* Brand / marketing panel */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-zinc-200 bg-zinc-900 p-12 text-white lg:flex">
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold text-white">Kamal Development CRM</span>
        </div>

        <div className="relative z-10 my-auto py-12">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white">
            Close more deals with an AI co-pilot in your pipeline.
          </h2>
          <p className="mt-5 max-w-md text-zinc-400 leading-relaxed">
            AI CRM unifies your leads, contacts and follow-ups — then layers
            Gemini-powered summaries, email drafts and sales insights on top.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: TrendingUp, text: "Visual pipeline with drag-and-drop stages" },
              { icon: Bot, text: "AI lead scoring & instant email drafting" },
              { icon: ShieldCheck, text: "Secure JWT auth, your data stays yours" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-800/50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-700 text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm font-medium text-zinc-200">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-zinc-500">
          © {new Date().getFullYear()} Kamal Development. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
