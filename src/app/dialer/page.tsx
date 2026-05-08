"use client";

import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DialerSession } from "@/components/sourcing/dialer-session";
import { Skeleton } from "@/components/ui/skeleton";

export default function DialerPage() {
  // Use the seeded session for the demo (`ds_kevin_2026_05_11_am`).
  // In prod we'd POST /api/v1/dialer/sessions to start a fresh one.
  const { data, isLoading } = useQuery({
    queryKey: ["dialer-default"],
    queryFn: async () => {
      const id = "ds_kevin_2026_05_11_am";
      try {
        await apiClient.getSession(id);
        return id;
      } catch {
        const fresh = await apiClient.startSession({
          user_id: "u_kevin",
          thesis_id: "thesis_landscaping_se",
          task_filter: { tier: 1, milestone: "not_yet_approached" },
        });
        return fresh.session_id;
      }
    },
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Phone className="w-3 h-3" />
            Active session · Springdale Capital · Spring Break
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Dialer
          </h1>
          <p className="mt-2 text-zinc-400 max-w-2xl">
            Tier 1 commercial-landscaping queue. Every call is transcribed live,
            outcome-tagged, and written back to the deal row.
          </p>
        </div>
      </div>

      {isLoading || !data ? (
        <Skeleton className="h-[640px] rounded-2xl" />
      ) : (
        <DialerSession sessionId={data} />
      )}
    </div>
  );
}
