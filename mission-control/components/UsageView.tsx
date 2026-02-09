"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { MODEL_PRICING, getModelPricing } from "@/convex/pricing";

type TimePeriod = "7d" | "30d" | "all";

const periodLabels: Record<TimePeriod, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "all": "All Time",
};

function getStartTime(period: TimePeriod): number {
  if (period === "all") return 0;
  const now = Date.now();
  const days = period === "7d" ? 7 : 30;
  return now - days * 24 * 60 * 60 * 1000;
}

function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return tokens.toString();
}

export default function UsageView() {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  
  const startTime = useMemo(() => getStartTime(period), [period]);
  
  const stats = useQuery(api.usage.getStats, { 
    startTime,
    endTime: Date.now() 
  });
  
  const monthStats = useQuery(api.usage.getCurrentMonthStats);
  const totalCost = useQuery(api.usage.getTotalCost);

  // Debug logging
  console.log("UsageView render:", { stats, monthStats, totalCost });

  if (stats === undefined || monthStats === undefined || totalCost === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">
          <div>Loading usage data...</div>
          <div className="text-xs mt-2">
            stats: {stats === undefined ? "loading" : "loaded"} | 
            monthStats: {monthStats === undefined ? "loading" : "loaded"} | 
            totalCost: {totalCost === undefined ? "loading" : "loaded"}
          </div>
        </div>
      </div>
    );
  }

  // If we got here with null/empty data, show empty state
  if (!stats || !monthStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">No usage data available</div>
      </div>
    );
  }

  const modelData = Object.entries(stats.byModel)
    .map(([name, data]) => ({
      name,
      ...data,
      pricing: getModelPricing(name),
    }))
    .sort((a, b) => b.cost - a.cost);

  const activityData = Object.entries(stats.byActivityType)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-200">Usage Dashboard</h2>
        <div className="flex gap-2">
          {(Object.keys(periodLabels) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                period === p
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent"
          value={formatCost(totalCost)}
          subtitle="All time"
          icon="💰"
          color="emerald"
        />
        <StatCard
          title="Current Month"
          value={formatCost(monthStats.currentMonthCost)}
          subtitle={`Day ${monthStats.daysElapsed} of ${monthStats.daysInMonth}`}
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Monthly Burn Rate"
          value={formatCost(monthStats.projectedMonthly)}
          subtitle={`${formatCost(monthStats.dailyBurnRate)}/day projected`}
          icon="🔥"
          color="orange"
        />
        <StatCard
          title="API Calls"
          value={stats.eventCount.toLocaleString()}
          subtitle={periodLabels[period]}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Token Usage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">
            Token Usage ({periodLabels[period]})
          </h3>
          <div className="space-y-4">
            <TokenBar
              label="Input Tokens"
              value={stats.totalTokensIn}
              total={stats.totalTokensIn + stats.totalTokensOut}
              color="bg-emerald-500"
            />
            <TokenBar
              label="Output Tokens"
              value={stats.totalTokensOut}
              total={stats.totalTokensIn + stats.totalTokensOut}
              color="bg-cyan-500"
            />
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Tokens</span>
                <span className="text-white font-medium">
                  {formatTokens(stats.totalTokensIn + stats.totalTokensOut)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-zinc-400">Total Cost</span>
                <span className="text-emerald-400 font-medium">
                  {formatCost(stats.totalCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost by Model */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">
            Cost by Model ({periodLabels[period]})
          </h3>
          {modelData.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No usage data for this period
            </div>
          ) : (
            <div className="space-y-3">
              {modelData.map((model) => (
                <ModelBar
                  key={model.name}
                  name={model.name}
                  cost={model.cost}
                  maxCost={modelData[0]?.cost || 1}
                  count={model.count}
                  color={model.pricing?.color || "#6b7280"}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Usage Trend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-4">
          Daily Usage Trend ({periodLabels[period]})
        </h3>
        {stats.dailyData.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <div className="text-4xl mb-2">📭</div>
            No usage data for this period
          </div>
        ) : (
          <DailyChart data={stats.dailyData} />
        )}
      </div>

      {/* Cost by Activity Type */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-4">
          Cost by Activity Type ({periodLabels[period]})
        </h3>
        {activityData.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No activity type data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activityData.map((activity) => (
              <ActivityCard
                key={activity.name}
                name={activity.name}
                cost={activity.cost}
                count={activity.count}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pricing Reference */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-4">
          💡 Pricing Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.values(MODEL_PRICING)
            .filter(m => m.name !== "unknown")
            .map((model) => (
              <div
                key={model.name}
                className="bg-zinc-800/50 rounded-lg p-3 text-sm"
              >
                <div
                  className="font-medium mb-1"
                  style={{ color: model.color }}
                >
                  {model.displayName}
                </div>
                <div className="text-zinc-400 text-xs">
                  In: ${model.inputPricePerMTok}/MTok
                </div>
                <div className="text-zinc-400 text-xs">
                  Out: ${model.outputPricePerMTok}/MTok
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="text-sm text-zinc-300">{title}</div>
      <div className="text-xs text-zinc-500 mt-1">{subtitle}</div>
    </div>
  );
}

function TokenBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white">{formatTokens(value)}</span>
      </div>
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-zinc-500 mt-1">
        {percentage.toFixed(1)}% of total
      </div>
    </div>
  );
}

function ModelBar({
  name,
  cost,
  maxCost,
  count,
  color,
}: {
  name: string;
  cost: number;
  maxCost: number;
  count: number;
  color: string;
}) {
  const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-300" style={{ color }}>
          {name}
        </span>
        <span className="text-white font-medium">{formatCost(cost)}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-xs text-zinc-500 mt-1">
        {count.toLocaleString()} API calls
      </div>
    </div>
  );
}

function DailyChart({ data }: { data: Array<{ date: string; cost: number; tokensIn: number; tokensOut: number; count: number }> }) {
  const maxCost = Math.max(...data.map(d => d.cost), 0.01);
  
  // Limit to last 30 days for display
  const displayData = data.slice(-30);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-1 h-40">
        {displayData.map((day, i) => {
          const height = (day.cost / maxCost) * 100;
          const date = new Date(day.date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end group relative"
            >
              <div
                className={`w-full rounded-t transition-all duration-200 group-hover:opacity-80 ${
                  isWeekend ? "bg-emerald-600" : "bg-emerald-500"
                }`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-medium text-white">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="text-emerald-400">{formatCost(day.cost)}</div>
                  <div className="text-zinc-400">{day.count} calls</div>
                  <div className="text-zinc-400">{formatTokens(day.tokensIn + day.tokensOut)} tokens</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-zinc-500">
        {displayData.length > 0 && (
          <>
            <span>
              {new Date(displayData[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span>
              {new Date(displayData[displayData.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded" />
          <span>Weekday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-600 rounded" />
          <span>Weekend</span>
        </div>
        <div className="ml-auto">
          Max: {formatCost(maxCost)}/day
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  name,
  cost,
  count,
}: {
  name: string;
  cost: number;
  count: number;
}) {
  const activityIcons: Record<string, string> = {
    chat: "💬",
    code: "💻",
    research: "🔍",
    analysis: "📊",
    development: "🛠️",
    communication: "📧",
    unknown: "❓",
  };

  const icon = activityIcons[name.toLowerCase()] || "📌";

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-zinc-300 font-medium capitalize">{name}</span>
      </div>
      <div className="text-xl font-bold text-emerald-400">{formatCost(cost)}</div>
      <div className="text-xs text-zinc-500">{count.toLocaleString()} API calls</div>
    </div>
  );
}
