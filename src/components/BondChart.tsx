import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { YearlyData } from "../lib/bondTypes.ts";

interface BondChartProps {
  coiYearly: YearlyData[];
  edoYearly: YearlyData[];
  horizonYears: number;
}

export function BondChart({
  coiYearly,
  edoYearly,
  horizonYears,
}: BondChartProps) {
  const maxLen = Math.max(coiYearly.length, edoYearly.length);
  const data = Array.from({ length: maxLen }, (_, i) => ({
    name: `${i + 1}`,
    COI: coiYearly[i]?.value,
    EDO: edoYearly[i]?.value,
  }));

  const horizonLabel = `Rok ${horizonYears}`;

  return (
    <div className="my-4 h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            label={{
              value: "Rok",
              position: "insideBottomRight",
              offset: -2,
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value ?? 0).toLocaleString("pl-PL")} zł`,
              String(name),
            ]}
            labelFormatter={(label) => `Rok ${label}`}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={12}
            wrapperStyle={{ fontSize: 12 }}
          />
          <ReferenceLine
            x={String(horizonYears)}
            stroke="#9CA3AF"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: horizonLabel,
              position: "top",
              fontSize: 11,
              fill: "#6B7280",
            }}
          />
          <Line
            type="monotone"
            dataKey="COI"
            stroke="#1E40AF"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="EDO"
            stroke="#15803D"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
