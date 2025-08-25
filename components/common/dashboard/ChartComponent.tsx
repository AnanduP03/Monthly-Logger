"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "../../ui/chart";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { toast } from "sonner";

type ChartComponentProps = {
  labels: string[];
  productionData: number[];
  usageData: number[];
};

type ChartDataPoint = {
  month: string;
  production: number;
  usage: number;
};

const chartConfig = {
  production: {
    label: "Production",
    color: "#3b82f6",
  },
  usage: {
    label: "Usage",
    color: "#ef4444",
  },
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload?.length) {
    const productionValue =
      (payload.find((p) => p.dataKey === "production")?.value as number) || 0;
    const usageValue =
      (payload.find((p) => p.dataKey === "usage")?.value as number) || 0;
    const netValue = productionValue - usageValue;

    return (
      <div className="rounded-lg border w-[15rem] bg-background p-2.5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <div className="mb-1.5 border-b pb-1.5">
            <p className="text-center font-semibold text-foreground">{label}</p>
          </div>
          <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1.5">
            {payload.map((p) => (
              <React.Fragment key={p.dataKey}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <p className="text-sm text-muted-foreground">{p.name}</p>
                  </div>
                  <p className="text-right font-mono font-medium text-foreground">
                    {p.value?.toLocaleString()} kWh
                  </p>
                </div>
              </React.Fragment>
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    netValue >= 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p className="text-sm text-muted-foreground">Net</p>
              </div>
              <p
                className={`text-right font-mono font-medium ${
                  netValue >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {netValue.toLocaleString()} kWh
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartComponent({
  labels,
  productionData,
  usageData,
}: ChartComponentProps) {
  const chartData: ChartDataPoint[] = labels.map((label, index) => ({
    month: label,
    production: productionData[index] || 0,
    usage: usageData[index] || 0,
  }));

  return (
    <div className="bg-card border border-border shadow-lg rounded-lg p-4 w-full h-[20rem]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            aria-label="A line chart showing monthly energy production and usage."
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, "dataMax + 100"]}
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke={chartConfig.production.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke={chartConfig.usage.color}
              strokeWidth={2}
              dot={false}
            />
            <ChartTooltip cursor={true} content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
