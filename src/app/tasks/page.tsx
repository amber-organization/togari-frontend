"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Phone,
  Mail,
  Send,
  Search,
  Filter,
  Clock,
  ListChecks,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TIER_COLORS, relativeTime } from "@/lib/utils";

const TYPE_FILTERS = [
  { value: null, label: "All" },
  { value: "dialer_call", label: "Dialer" },
  { value: "personal_call", label: "Personal" },
  { value: "email", label: "Email" },
  { value: "linkedin_dm", label: "LinkedIn" },
] as const;

export default function TasksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: apiClient.todayTasks,
  });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(({ task, company, contact }) => {
      if (typeFilter && task.task_type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (company?.company_name?.toLowerCase() ?? "").includes(q) ||
          (contact?.full_name?.toLowerCase() ?? "").includes(q)
        );
      }
      return true;
    });
  }, [data, search, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Today&apos;s tasks
          </h1>
          <p className="mt-2 text-zinc-400">
            Auto-generated each morning by the orchestrator. Tier 1 first, then
            Tier 2, then nurture.
          </p>
        </div>
        <Badge variant="emerald">
          <ListChecks className="w-3 h-3" />
          {data?.length ?? 0} pending
        </Badge>
      </div>

      <Card className="mb-6 p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or contact"
            className="bg-transparent flex-1 outline-none text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.label}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
                typeFilter === t.value
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ task, company, contact }) => {
            const Icon =
              task.task_type === "email"
                ? Mail
                : task.task_type === "linkedin_dm"
                  ? Send
                  : Phone;
            const tier = task.priority ?? 3;
            const tc = TIER_COLORS[tier] || TIER_COLORS[3];
            return (
              <Link
                key={task.task_id}
                href={`/theses/${task.thesis_id}/companies/${task.company_id}`}
                className="block group"
              >
                <Card className="p-4 flex items-center gap-4 hover:border-zinc-700 transition-all duration-200">
                  <span
                    className={`grid place-items-center w-10 h-10 rounded-xl ${tc.bg} ${tc.text} border ${tc.border} flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100 truncate">
                        {company?.company_name ?? "Unknown"}
                      </span>
                      <Badge variant={tier === 1 ? "emerald" : "zinc"}>
                        Tier {tier}
                      </Badge>
                      <Badge variant="violet">
                        {task.task_type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 truncate">
                      {contact?.full_name ?? "—"} · {contact?.title ?? "—"} ·{" "}
                      {task.channel ?? "manual"}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 justify-end">
                      <Clock className="w-3 h-3" />
                      {relativeTime(task.scheduled_for)}
                    </div>
                    <Badge
                      variant={task.status === "completed" ? "emerald" : "zinc"}
                      className="mt-1"
                    >
                      {task.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <Card className="p-10 text-center text-sm text-zinc-500">
              No tasks match the current filters.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
