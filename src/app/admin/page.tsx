"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Users as UsersIcon, Server, Shield } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const users = useQuery({
    queryKey: ["users"],
    queryFn: apiClient.listUsers,
  });
  const health = useQuery({
    queryKey: ["integrations-health"],
    queryFn: apiClient.integrationHealth,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Admin
        </h1>
        <p className="mt-2 text-zinc-400">
          Tenant settings, user management, and integration health.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              Tenant
            </h2>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Tenant ID" value="48n" mono />
            <Row label="Display name" value="48 North" />
            <Row
              label="Auth0 connection"
              value="bluemodern.us.auth0.com"
              mono
            />
            <Row label="BigQuery dataset" value="togari_sourcing" mono />
            <Row label="Region" value="us-central1" />
            <Row label="Status" value={<Badge variant="emerald">live</Badge>} />
          </dl>
        </Card>

        <Card className="p-5 lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              Integration health
            </h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {health.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))
              : health.data?.map((h) => (
                  <li
                    key={h.name}
                    className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          h.status === "healthy"
                            ? "bg-emerald-400"
                            : h.status === "degraded"
                              ? "bg-amber-400"
                              : "bg-rose-500"
                        }`}
                      />
                      <span className="text-sm text-zinc-100 font-medium">
                        {h.name}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 tabular-nums">
                      {h.latency_ms}ms · {h.status}
                    </div>
                  </li>
                ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Users
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-zinc-900/40 border-b border-zinc-800">
            <tr className="text-left text-xs text-zinc-500 uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {users.isLoading ? (
              <tr>
                <td colSpan={4} className="p-4">
                  <Skeleton className="h-12 w-full" />
                </td>
              </tr>
            ) : (
              users.data?.map((u) => (
                <tr key={u.user_id}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs text-white font-semibold">
                        {u.avatar_initial}
                      </span>
                      <span className="text-sm font-medium text-zinc-100">
                        {u.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-300 font-mono">
                    {u.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-300">{u.role}</td>
                  <td className="px-6 py-3">
                    <Badge variant="indigo">
                      <Shield className="w-3 h-3" />
                      sourcing:full
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd
        className={mono ? "text-zinc-200 font-mono text-xs" : "text-zinc-200"}
      >
        {value}
      </dd>
    </div>
  );
}
