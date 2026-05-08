"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Target,
  Globe,
  TrendingUp,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function EngagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const engagement = useQuery({
    queryKey: ["engagement", id],
    queryFn: () => apiClient.getEngagement(id),
  });
  const theses = useQuery({
    queryKey: ["engagement-theses", id],
    queryFn: () => apiClient.listTheses(id),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <Link
        href="/engagements"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to engagements
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">
            {engagement.data?.client_firm_name ?? "—"}
          </div>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">
            {engagement.isLoading ? (
              <Skeleton className="h-9 w-72" />
            ) : (
              engagement.data?.engagement_name
            )}
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400 leading-relaxed">
            {engagement.data?.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">{engagement.data?.status ?? "active"}</Badge>
          <Button leftIcon={<Plus className="w-4 h-4" />}>New thesis</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Theses",
            value: engagement.data?.metrics.theses_count ?? "—",
            icon: Target,
          },
          {
            label: "Companies",
            value: engagement.data?.metrics.companies_count ?? "—",
            icon: Globe,
          },
          {
            label: "Meetings",
            value: engagement.data?.metrics.meetings_booked ?? "—",
            icon: TrendingUp,
          },
          {
            label: "Cost so far",
            value: formatCurrency(52),
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
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Theses table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Theses</h2>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/40">
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Thesis</th>
                <th className="px-6 py-3 font-medium">Geo</th>
                <th className="px-6 py-3 font-medium">Revenue band</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {theses.isLoading
                ? Array.from({ length: 1 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="p-4">
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                : theses.data?.map((t) => (
                    <tr
                      key={t.thesis_id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/theses/${t.thesis_id}`}
                          className="group flex items-center gap-2"
                        >
                          <div>
                            <div className="font-medium text-zinc-100 group-hover:text-white">
                              {t.thesis_name}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-md">
                              {t.description}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {t.geo_constraints?.join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {formatCurrency(t.revenue_range?.min, {
                          compact: true,
                        })}{" "}
                        ·{" "}
                        {formatCurrency(t.revenue_range?.max, {
                          compact: true,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={t.status === "active" ? "emerald" : "zinc"}
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/theses/${t.thesis_id}`}
                          className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          Open
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
