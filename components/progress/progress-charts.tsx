"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
}

export function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface WeeklyChartProps {
  data: number[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = DAYS.map((day, i) => ({
    day,
    activity: data[i] ?? 0,
  }));

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: "#5b7a9a", fontSize: 12 }} />
          <YAxis tick={{ fill: "#5b7a9a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#10101e",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#007dfa"
            strokeWidth={2}
            dot={{ fill: "#007dfa", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface RadarChartProps {
  categories: { label: string; value: number }[];
}

export function TopicRadarChart({ categories }: RadarChartProps) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">Topic Coverage</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={categories}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "#5b7a9a", fontSize: 11 }}
          />
          <Radar
            dataKey="value"
            stroke="#007dfa"
            fill="#007dfa"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={`p-5 ${badge.unlocked ? "" : "opacity-40"}`}
        >
          <span className="mb-3 block text-2xl">{badge.icon}</span>
          <h4 className="font-medium">{badge.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {badge.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
