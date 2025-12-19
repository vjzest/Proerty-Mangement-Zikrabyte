"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LegendProps,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F"];

type Props = {
  data: ChartData[];
};

export function PropertyTypeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          paddingAngle={5}
          dataKey="value"
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Legend
          iconType="circle"
          formatter={(value: string, entry: any) => (
            <span className="text-muted-foreground">
              {value} ({entry?.payload?.value})
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
