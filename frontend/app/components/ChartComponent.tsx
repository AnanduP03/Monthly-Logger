"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ChartDataPoint = {
  month: string;
  production: number;
  usage: number;
};

const chartData: ChartDataPoint[] = [
  { month: "January", production: 674, usage: 605 },
  { month: "February", production: 985, usage: 946 },
  { month: "March", production: 785, usage: 847 },
  { month: "April", production: 950, usage: 159 },
  { month: "May", production: 446, usage: 987 },
  { month: "June", production: 449, usage: 472 },
  { month: "July", production: 203, usage: 838 },
  { month: "August", production: 213, usage: 497 },
  { month: "September", production: 505, usage: 167 },
  { month: "October", production: 813, usage: 916 },
  { month: "November", production: 722, usage: 419 },
  { month: "December", production: 876, usage: 243 },
];

const chartConfig = {
  production: {
    label: "Production",
    color: "#3b82f6", // Tailwind blue-500
  },
  usage: {
    label: "Usage",
    color: "#60a5fa", // Tailwind blue-400
  },
} satisfies ChartConfig;

export default function ChartComponent() {
  return (
    <div className="bg-card border border-border shadow-lg rounded-lg p-4 w-full h-[20rem]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Line
            type="monotone"
            dataKey="production"
            stroke={chartConfig.production.color}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="usage"
            stroke={chartConfig.usage.color}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
