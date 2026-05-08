"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Mail,
  Send,
  Sparkles,
  Building2,
  Target,
  TrendingUp,
  Calendar,
  Briefcase,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber, TIER_COLORS } from "@/lib/utils";

export default function DashboardPage() {
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: apiClient.dashboardStats,
  });
  const engagements = useQuery({
    queryKey: ["engagements"],
    queryFn: apiClient.listEngagements,
  });
  const tasks = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: apiClient.todayTasks,
  });

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-mesh opacity-95" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
              <Sparkles className="w-3 h-3" />
              48 North workspace · live
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Sourcing, compressed.
            </h1>
            <p className="mt-3 max-w-xl text-zinc-400 leading-relaxed">
              Engagements, theses, enrichment, dialer, and digests. One
              platform, owned end-to-end. Today&apos;s queue is below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dialer">
              <Button leftIcon={<Phone className="w-4 h-4" />} size="lg">
                Start calling Tier 1
              </Button>
            </Link>
            <Link href="/engagements">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Engagements
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Engagements",
              value: stats.data?.engagements,
              icon: Briefcase,
            },
            {
              label: "Active theses",
              value: stats.data?.active_theses,
              icon: Target,
            },
            {
              label: "Companies",
              value: stats.data?.companies_in_pipeline,
              icon: Building2,
            },
            {
              label: "Tasks today",
              value: stats.data?.tasks_today,
              icon: Calendar,
            },
            {
              label: "Calls today",
              value: stats.data?.calls_made_today,
              icon: Phone,
            },
            {
              label: "Meetings booked",
              value: stats.data?.meetings_booked_week,
              icon: TrendingUp,
            },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  {s.label}
                </span>
                <s.icon className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight">
                {stats.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  formatNumber(s.value ?? 0)
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Engagements + Today's Queue */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Active engagements
              </h2>
              <Link
                href="/engagements"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-all duration-200 cursor-pointer inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {engagements.isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))
                : engagements.data?.map((e) => (
                    <Link
                      key={e.engagement_id}
                      href={`/engagements/${e.engagement_id}`}
                      className="block group"
                    >
                      <Card className="p-6 hover:border-zinc-700 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
                              <Briefcase className="w-3.5 h-3.5" />
                              {e.client_firm_name}
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight text-zinc-50 group-hover:text-white">
                              {e.engagement_name}
                            </h3>
                            <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2">
                              {e.description}
                            </p>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div className="mt-5 grid grid-cols-4 gap-3 text-center">
                          <Stat label="Theses" value={e.metrics.theses_count} />
                          <Stat
                            label="Companies"
                            value={e.metrics.companies_count}
                          />
                          <Stat
                            label="Meetings"
                            value={e.metrics.meetings_booked}
                          />
                          <Stat label="LOI" value={e.metrics.in_loi} />
                        </div>
                      </Card>
                    </Link>
                  ))}
            </div>
          </div>

          {/* Today's queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Today&apos;s queue
              </h2>
              <Link
                href="/tasks"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-all duration-200 cursor-pointer inline-flex items-center gap-1"
              >
                All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Card className="p-2">
              {tasks.isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-zinc-800/80">
                  {tasks.data?.slice(0, 6).map(({ task, company, contact }) => {
                    const Icon =
                      task.task_type === "email"
                        ? Mail
                        : task.task_type === "linkedin_dm"
                          ? Send
                          : Phone;
                    const tierColor =
                      task.priority && TIER_COLORS[task.priority]
                        ? TIER_COLORS[task.priority]
                        : TIER_COLORS[3];
                    return (
                      <li key={task.task_id}>
                        <Link
                          href={`/theses/${task.thesis_id}/companies/${task.company_id}`}
                          className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <span
                            className={`grid place-items-center w-9 h-9 rounded-xl ${tierColor.bg} ${tierColor.text} border ${tierColor.border}`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-100 truncate">
                              {company?.company_name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {contact?.full_name ?? "—"} ·{" "}
                              {contact?.title ?? "—"}
                            </p>
                          </div>
                          <Badge
                            variant={task.priority === 1 ? "emerald" : "zinc"}
                          >
                            T{task.priority ?? "—"}
                          </Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>
        </div>

        {/* Recent enrichment */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Last enrichment run
            </h2>
            <Badge variant="emerald">completed</Badge>
          </div>
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Stat label="Companies added" value={41} />
              <Stat label="Contacts added" value={123} />
              <Stat label="Perplexity calls" value={41} />
              <Stat label="Clay calls" value={41} />
              <Stat label="Cost" value={formatCurrency(52.07)} small />
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Average cost per company $1.27 · target $1.50
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-bold tracking-tight ${small ? "text-xl" : "text-2xl"}`}
      >
        {value}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
