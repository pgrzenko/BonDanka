import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyData } from "../lib/bondTypes.ts";

interface BondChartProps {
  coiYearly: YearlyData[];
  edoYearly: YearlyData[];
  horizonYears: number;
}

export function BondChart({ coiYearly, edoYearly }: BondChartProps) {
  const data = coiYearly.map((c, i) => ({
    name: `Rok ${c.year}`,
    COI: c.value,
    EDO: edoYearly[i].value,
  }));

  return (
    <div className="my-4 h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k zł`}
          />
          <Tooltip
            formatter={(value) => [
              `${Number(value ?? 0).toLocaleString("pl-PL")} zł`,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={12}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="COI"
            stroke="#185FA5"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="EDO"
            stroke="#0F6E56"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
