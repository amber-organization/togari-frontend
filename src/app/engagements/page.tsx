"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EngagementsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["engagements"],
    queryFn: apiClient.listEngagements,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Engagements
          </h1>
          <p className="mt-2 text-zinc-400">
            Each engagement is one PE-client mandate. Theses live underneath.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>New engagement</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))
          : data?.map((e) => (
              <Link
                key={e.engagement_id}
                href={`/engagements/${e.engagement_id}`}
                className="block group"
              >
                <Card className="p-6 h-full hover:border-zinc-700 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Briefcase className="w-3.5 h-3.5" />
                      {e.client_firm_name}
                    </div>
                    <Badge variant={e.status === "active" ? "emerald" : "zinc"}>
                      {e.status}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50 group-hover:text-white">
                    {e.engagement_name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                    {e.description}
                  </p>
                  <div className="mt-5 flex items-end justify-between">
                    <div className="grid grid-cols-3 gap-6">
                      <Mini label="Theses" value={e.metrics.theses_count} />
                      <Mini
                        label="Companies"
                        value={e.metrics.companies_count}
                      />
                      <Mini
                        label="Meetings"
                        value={e.metrics.meetings_booked}
                      />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-lg font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}
