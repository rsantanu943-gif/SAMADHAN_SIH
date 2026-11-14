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
      <div className="bg-[#FAF8F1] border border-[#D5DDCB] p-3.5 rounded-xl shadow-lg text-xs min-w-[210px]">
        <div className="flex justify-between items-center border-b border-[#D5DDCB] pb-2 mb-2">
          <span className="font-bold text-[#263B32] text-sm">{label}</span>
          <Badge variant={isAboveTarget ? "success" : "warning"}>
            {isAboveTarget ? "Meets Standard" : "Remediation Required"}
          </Badge>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[#68776A] font-medium">Avg. Score:</span>
            <span className="font-bold text-[#263B32] text-sm tabular-nums">
              {data.score}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#68776A]">Statutory Benchmark:</span>
            <span className="font-medium text-[#263B32] tabular-nums">
              {data.targetBenchmark}%
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-[#D5DDCB]/60 text-[11px]">
            <span className="text-[#68776A]">Active Audits:</span>
            <span className="font-semibold text-[#263B32]">{data.auditsCount} agencies</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#68776A]">Resolved Findings:</span>
            <span className="font-semibold text-[#2A6557]">{data.remediatedCount}</span>
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
    <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(38,59,50,0.06)] flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5DDCB] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#8FCDBB]/30 rounded-lg border border-[#8FCDBB]">
              <TrendingUp className="w-4 h-4 text-[#263B32]" />
            </div>
            <h2 className="font-display text-base font-bold text-[#263B32] tracking-tight">
              Avg. Institutional Compliance Score Trend (6 Months)
            </h2>
          </div>
          <p className="text-xs text-[#68776A] mt-0.5">
            Historical governance trajectory &amp; statutory benchmark tracking across institutional audits (May – Oct 2026).
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#EAE2D2] p-1 rounded-lg self-start sm:self-auto border border-[#D5DDCB]">
          <Button
            variant={activeView === "score" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveView("score")}
            className={cn(
              "text-xs h-7 px-3 font-semibold transition-all",
              activeView === "score"
                ? "bg-[#263B32] text-[#FAF8F1] shadow-xs"
                : "text-[#68776A] hover:text-[#263B32] hover:bg-[#FAF8F1]/60"
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
              activeView === "volume"
                ? "bg-[#263B32] text-[#FAF8F1] shadow-xs"
                : "text-[#68776A] hover:text-[#263B32] hover:bg-[#FAF8F1]/60"
            )}
          >
            Audit Volume
          </Button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F3EBDD] rounded-xl border border-[#D5DDCB]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68776A] block">
            Current Score
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-[#263B32] tabular-nums">
              {summary.current}%
            </span>
            <span className="text-xs font-semibold text-[#263B32] bg-[#8FCDBB]/45 border border-[#8FCDBB] px-1.5 py-0.5 rounded flex items-center">
              +{summary.delta}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68776A] block">
            6-Month Peak
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-[#263B32] tabular-nums">
              {summary.high}%
            </span>
            <span className="text-[10px] text-[#68776A] font-medium">
              (Sep 2026)
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68776A] block">
            Statutory Target
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-[#2A6557] tabular-nums">
              85.0%
            </span>
            <Badge variant="success" className="text-[10px] py-0 px-1.5">
              Passing
            </Badge>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68776A] block">
            Net Trend Status
          </span>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-[#263B32]">
            <ShieldCheck className="w-4 h-4 text-[#2A6557] shrink-0" />
            <span>Sustained Compliance</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 min-h-[288px]">
        {!isMounted ? (
          <div className="w-full h-full bg-[#EAE2D2]/50 rounded-lg flex items-center justify-center text-xs text-[#68776A]">
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
                  <stop offset="5%" stopColor="#8FCDBB" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#B7C9A8" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B7C9A8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8FCDBB" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#D5DDCB"
                vertical={false}
              />
              <XAxis
                dataKey="shortMonth"
                tick={{ fill: "#68776A", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#D5DDCB" }}
              />
              <YAxis
                domain={activeView === "score" ? [75, 95] : [20, 50]}
                tick={{ fill: "#68776A", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (activeView === "score" ? `${val}%` : `${val}`)}
              />
              <Tooltip content={<CustomTooltip />} />

              {activeView === "score" && (
                <ReferenceLine
                  y={85}
                  stroke="#2A6557"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Statutory Benchmark (85%)",
                    fill: "#263B32",
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
                    stroke="#263B32"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    activeDot={{ r: 6, fill: "#8FCDBB", stroke: "#263B32", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#263B32"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#8FCDBB", strokeWidth: 1.5, stroke: "#263B32" }}
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="auditsCount"
                    stroke="#2A6557"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volumeGradient)"
                    activeDot={{ r: 6, fill: "#B7C9A8", stroke: "#263B32", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="auditsCount"
                    stroke="#2A6557"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#B7C9A8", strokeWidth: 1.5, stroke: "#263B32" }}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Notes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#68776A] pt-3 border-t border-[#D5DDCB] gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#2A6557]" />
          <span>Continuous compliance verification certified under Protocol 42-B.</span>
        </div>
        <span className="text-[11px] font-mono text-[#68776A]">Telemetry sync: Oct 28, 2026</span>
      </div>
    </div>
  );
}
