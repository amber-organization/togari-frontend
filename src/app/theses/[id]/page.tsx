"use client";

import { use, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Sparkles,
  ListFilter,
  Map,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatNumber,
  milestoneLabel,
  TIER_COLORS,
} from "@/lib/utils";
import type { ThesisDetailResponse } from "@/types/sourcing";

const KANBAN_COLUMNS = [
  "not_yet_approached",
  "researching",
  "actively_approaching",
  "initial_contact_made",
  "discovery_call_scheduled",
  "mutual_interest",
];

export default function ThesisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [coverageFilter, setCoverageFilter] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["thesis", id],
    queryFn: () => apiClient.getThesis(id),
  });
  const users = useQuery({
    queryKey: ["users"],
    queryFn: apiClient.listUsers,
  });

  const filtered = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      companies: data.companies.filter((c) => {
        if (tierFilter !== null && c.thesis_company.tier !== tierFilter)
          return false;
        if (
          coverageFilter !== null &&
          c.thesis_company.coverage_user_id !== coverageFilter
        )
          return false;
        return true;
      }),
    };
  }, [data, tierFilter, coverageFilter]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <Link
        href={data ? `/engagements/${data.engagement_id}` : "/engagements"}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-3xl">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">
            Investment thesis
          </div>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-72" /> : data?.thesis_name}
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            {data?.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data?.geo_constraints?.map((g) => (
              <Badge key={g} variant="violet">
                <Map className="w-3 h-3" />
                {g}
              </Badge>
            ))}
            {data?.revenue_range && (
              <Badge variant="indigo">
                {formatCurrency(data.revenue_range.min, { compact: true })} ·{" "}
                {formatCurrency(data.revenue_range.max, { compact: true })}
              </Badge>
            )}
            {data?.headcount_range && (
              <Badge variant="indigo">
                {formatNumber(data.headcount_range.min)}–
                {formatNumber(data.headcount_range.max)} HC
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Re-enrich
          </Button>
          <Link href="/dialer">
            <Button leftIcon={<Phone className="w-4 h-4" />} size="lg">
              Start calling Tier 1
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="mt-8 p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wide">
          <ListFilter className="w-3.5 h-3.5" /> Filters
        </div>
        <div className="flex items-center gap-1">
          {[null, 1, 2, 3].map((t) => (
            <button
              key={String(t)}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
                tierFilter === t
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {t === null ? "All tiers" : `Tier ${t}`}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setCoverageFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
              coverageFilter === null
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            All coverage
          </button>
          {users.data?.map((u) => (
            <button
              key={u.user_id}
              onClick={() => setCoverageFilter(u.user_id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
                coverageFilter === u.user_id
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {u.full_name}
            </button>
          ))}
        </div>
      </Card>

      {/* Tier rail */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((tier) => {
          const count =
            data?.companies.filter((c) => c.thesis_company.tier === tier)
              .length ?? 0;
          const tc = TIER_COLORS[tier];
          return (
            <Card key={tier} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${tc.dot}`} />
                  <span className="text-sm font-medium text-zinc-200">
                    Tier {tier}
                  </span>
                </div>
                <Badge
                  variant={
                    tier === 1 ? "emerald" : tier === 2 ? "amber" : "zinc"
                  }
                >
                  {count}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                {tier === 1
                  ? "Highest fit, prioritized for the dialer."
                  : tier === 2
                    ? "Adjacent fit, second-pass outreach."
                    : "Long-tail, nurture cadence."}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Pipeline by milestone
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {KANBAN_COLUMNS.map((col) => (
              <KanbanColumn
                key={col}
                milestone={col}
                thesis={filtered ?? data!}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  milestone,
  thesis,
}: {
  milestone: string;
  thesis: ThesisDetailResponse;
}) {
  const items = thesis.companies.filter(
    (c) => c.thesis_company.milestone === milestone,
  );

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3 min-h-[360px]">
      <div className="flex items-center justify-between px-1 py-2">
        <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
          {milestoneLabel(milestone)}
        </div>
        <span className="text-xs text-zinc-500 font-medium tabular-nums">
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-xs text-zinc-600 px-2 py-6 text-center">
            No companies
          </div>
        )}
        {items.map((c) => {
          const tier = c.thesis_company.tier;
          const tc =
            tier && TIER_COLORS[tier] ? TIER_COLORS[tier] : TIER_COLORS[3];
          return (
            <Link
              key={c.thesis_company.thesis_company_id}
              href={`/theses/${thesis.thesis_id}/companies/${c.company.company_id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-600 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${tc.bg} ${tc.text}`}
                >
                  T{tier ?? "?"}
                </span>
                {c.company.fit_score && (
                  <span className="text-[10px] text-zinc-500 tabular-nums">
                    fit {c.company.fit_score}
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-zinc-100 line-clamp-1 group-hover:text-white">
                {c.company.company_name}
              </div>
              <div className="mt-0.5 text-xs text-zinc-500 truncate">
                {c.company.city
                  ? `${c.company.city}, ${c.company.state ?? ""}`
                  : c.company.domain || "—"}
              </div>
              {c.primary_contact && (
                <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 truncate">
                    {c.primary_contact.full_name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
