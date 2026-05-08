"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Globe,
  Users,
  TrendingUp,
  MapPin,
  Hash,
  Phone,
  History,
  ArrowUpRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrimaryContactOverride } from "@/components/sourcing/primary-contact-override";
import {
  formatCurrency,
  formatNumber,
  milestoneLabel,
  TIER_COLORS,
  relativeTime,
} from "@/lib/utils";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string; cid: string }>;
}) {
  const { id, cid } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["company", cid],
    queryFn: () => apiClient.getCompany(cid),
  });

  if (isLoading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const { company, contacts, thesis_company, recent_calls } = data;
  const tier = thesis_company?.tier;
  const tc = tier && TIER_COLORS[tier] ? TIER_COLORS[tier] : TIER_COLORS[3];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <Link
        href={`/theses/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to thesis
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-start gap-4">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-300">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {company.company_name}
            </h1>
            <div className="mt-2 flex items-center flex-wrap gap-2">
              <Badge
                variant={tier === 1 ? "emerald" : tier === 2 ? "amber" : "zinc"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                Tier {tier ?? "—"}
              </Badge>
              {thesis_company && (
                <Badge variant="violet">
                  {milestoneLabel(thesis_company.milestone)}
                </Badge>
              )}
              {company.fit_score && (
                <Badge variant="indigo">fit score {company.fit_score}</Badge>
              )}
            </div>
            {company.description && (
              <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">
                {company.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dialer">
            <Button leftIcon={<Phone className="w-4 h-4" />}>Call now</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PrimaryContactOverride companyId={cid} contacts={contacts} />

          <Card>
            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                All contacts
              </h3>
              <span className="text-xs text-zinc-500">
                {contacts.length} on file
              </span>
            </div>
            <ul className="divide-y divide-zinc-800/80">
              {contacts.map((c) => (
                <li
                  key={c.contact_id}
                  className="px-6 py-3 flex items-center gap-4"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      c.is_primary ? "bg-indigo-400" : "bg-zinc-700"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100 truncate">
                        {c.full_name}
                      </span>
                      {c.is_primary && <Badge variant="indigo">primary</Badge>}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {c.title || "—"} ·{" "}
                      {c.primary_reason || "no rationale recorded"}
                    </div>
                  </div>
                  <span className="text-xs tabular-nums text-zinc-500">
                    {c.primary_score ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {recent_calls.length > 0 && (
            <Card>
              <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                <h3 className="text-base font-semibold tracking-tight">
                  Recent calls
                </h3>
              </div>
              <ul className="divide-y divide-zinc-800/80">
                {recent_calls.slice(0, 5).map((cl) => (
                  <li
                    key={cl.call_id}
                    className="px-6 py-3 flex items-start gap-3"
                  >
                    <span
                      className={`mt-1 w-2 h-2 rounded-full ${
                        cl.outcome === "meeting_booked"
                          ? "bg-emerald-400"
                          : cl.answered
                            ? "bg-amber-400"
                            : "bg-zinc-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-100">
                        {cl.transcript_summary ?? "No summary recorded."}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {cl.outcome.replace(/_/g, " ")} ·{" "}
                        {Math.round(cl.duration_seconds / 60)} min ·{" "}
                        {relativeTime(cl.created_at)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-4">
              Firmographics
            </div>
            <dl className="space-y-3 text-sm">
              <Row
                icon={Globe}
                label="Domain"
                value={
                  company.domain ? (
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                    >
                      {company.domain}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Row
                icon={MapPin}
                label="Location"
                value={
                  company.city ? `${company.city}, ${company.state ?? ""}` : "—"
                }
              />
              <Row
                icon={Hash}
                label="NAICS"
                value={company.naics_code ?? "—"}
              />
              <Row
                icon={TrendingUp}
                label="Est. revenue"
                value={formatCurrency(company.estimated_revenue, {
                  compact: true,
                })}
              />
              <Row
                icon={Users}
                label="Headcount"
                value={formatNumber(company.estimated_headcount ?? 0)}
              />
              <Row
                icon={History}
                label="Founded"
                value={company.founded_year?.toString() ?? "—"}
              />
            </dl>
          </Card>

          {thesis_company?.tier_reason && (
            <Card className="p-5">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                Tiering rationale
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {thesis_company.tier_reason}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-zinc-200 truncate text-right">{value}</div>
    </div>
  );
}
