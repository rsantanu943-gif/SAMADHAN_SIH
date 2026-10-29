"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { SIX_MONTH_TREND_DATA, calculateTrendSummary } from "@/lib/compliance";
import { TrendingUp, ShieldCheck, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const emptySubscribe = () => () => {};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: (typeof SIX_MONTH_TREND_DATA)[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isAboveTarget = data.score >= data.targetBenchmark;

    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-3.5 rounded-lg shadow-lg text-xs min-w-[210px]">
        <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2 mb-2">
          <span className="font-bold text-on-surface text-sm">{label}</span>
          <Badge variant={isAboveTarget ? "success" : "warning"}>
            {isAboveTarget ? "Meets Standard" : "Remediation Required"}
          </Badge>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Avg. Score:</span>
            <span className="font-bold text-primary text-sm tabular-nums">
              {data.score}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Statutory Benchmark:</span>
            <span className="font-medium text-on-surface tabular-nums">
              {data.targetBenchmark}%
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-outline-variant/20 text-[11px]">
            <span className="text-on-surface-variant">Active Audits:</span>
            <span className="font-semibold text-on-surface">{data.auditsCount} agencies</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-on-surface-variant">Resolved Findings:</span>
            <span className="font-semibold text-secondary">{data.remediatedCount}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ComplianceTrendChart() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeView, setActiveView] = useState<"score" | "volume">("score");

  const summary = calculateTrendSummary(SIX_MONTH_TREND_DATA);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200/60">
              <TrendingUp className="w-4 h-4 text-amber-700" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Avg. Institutional Compliance Score Trend (6 Months)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical governance trajectory & statutory benchmark tracking across institutional audits (May – Oct 2026).
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg self-start sm:self-auto border border-slate-200/60">
          <Button
            variant={activeView === "score" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveView("score")}
            className={cn(
              "text-xs h-7 px-3 font-semibold transition-all",
              activeView === "score" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Score Trajectory (%)
          </Button>
          <Button
            variant={activeView === "volume" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveView("volume")}
            className={cn(
              "text-xs h-7 px-3 font-semibold transition-all",
              activeView === "volume" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Audit Volume
          </Button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Current Score
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.current}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded flex items-center">
              +{summary.delta}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            6-Month Peak
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.high}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              (Sep 2026)
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Statutory Target
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-amber-700 tabular-nums">
              85.0%
            </span>
            <Badge variant="success" className="text-[10px] py-0 px-1.5">
              Passing
            </Badge>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Net Trend Status
          </span>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sustained Compliance</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 min-h-[288px]">
        {!isMounted ? (
          <div className="w-full h-full bg-surface-container-low rounded-lg animate-pulse flex items-center justify-center text-xs text-on-surface-variant">
            Loading compliance telemetry graph...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={SIX_MONTH_TREND_DATA}
              margin={{ top: 15, right: 25, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006a61" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#006a61" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e3e5"
                vertical={false}
              />
              <XAxis
                dataKey="shortMonth"
                tick={{ fill: "#3f4850", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#bfc7d2" }}
              />
              <YAxis
                domain={activeView === "score" ? [75, 95] : [20, 50]}
                tick={{ fill: "#3f4850", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (activeView === "score" ? `${val}%` : `${val}`)}
              />
              <Tooltip content={<CustomTooltip />} />

              {activeView === "score" && (
                <ReferenceLine
                  y={85}
                  stroke="#006a61"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Statutory Benchmark (85%)",
                    fill: "#006a61",
                    fontSize: 11,
                    fontWeight: 600,
                    position: "insideTopRight",
                    offset: 10,
                  }}
                />
              )}

              {activeView === "score" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    activeDot={{ r: 6, fill: "#0284C7", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#0284C7", strokeWidth: 1.5, stroke: "#ffffff" }}
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="auditsCount"
                    stroke="#006a61"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volumeGradient)"
                    activeDot={{ r: 6, fill: "#006a61", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="auditsCount"
                    stroke="#006a61"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#006a61", strokeWidth: 1.5, stroke: "#ffffff" }}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Notes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-on-surface-variant pt-3 border-t border-outline-variant/30 gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span>Continuous compliance verification certified under Protocol 42-B.</span>
        </div>
        <span className="text-[11px] font-mono text-outline">Telemetry sync: Oct 28, 2026</span>
      </div>
    </div>
  );
}
