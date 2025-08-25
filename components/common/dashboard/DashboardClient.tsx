"use client";

import ChartComponent from "@/components/common/dashboard/ChartComponent";
import MetricBox from "@/components/common/dashboard/MetricBox";
import BottomArea from "@/components/common/dashboard/BottomArea";
import { EnergyMetrics, Bill } from "@/types/energyCalculations";
import {
  LineChart,
  ArrowDownUp,
  Hash,
  TrendingUp,
  TrendingDown,
  Zap,
  Home,
  Sun,
  Banknote,
  CalendarClock,
} from "lucide-react";

/**
 * A reusable component to display when there is no data.
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-card border border-border shadow-lg rounded-lg p-4 w-full h-[20rem] flex flex-col items-center justify-center text-center">
      <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}

type DashboardClientProps = {
  metrics: EnergyMetrics;
  bills: Bill[];
  consumerNumber: string | null;
};

export default function DashboardClient({
  metrics,
  bills,
  consumerNumber,
}: DashboardClientProps) {
  const primaryMetrics = [
    {
      title: "Net Export (Fin. Year)",
      value: metrics.hasSufficientData
        ? (metrics.financialYearReserve || 0).toFixed(0)
        : "N/A",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: "Peak Prod. (Mo)",
      value: metrics.peakProdMonth,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Peak Usage (Mo)",
      value: metrics.peakUsageMonth,
      icon: <TrendingDown className="h-5 w-5" />,
    },
  ];

  const secondaryMetrics = [
    {
      title: "Avg Daily Prod.",
      value: metrics.hasSufficientData
        ? `${(metrics.avgDailyProd || 0).toFixed(1)} kWh`
        : "N/A",
      icon: <Sun className="h-5 w-5" />,
    },
    {
      title: "Avg Daily Usage",
      value: metrics.hasSufficientData
        ? `${(metrics.avgDailyUsage || 0).toFixed(1)} kWh`
        : "N/A",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      title: "Self-Consumption",
      value: metrics.hasSufficientData
        ? `${(metrics.selfConsumption || 0).toFixed(0)}%`
        : "N/A",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Monthly Savings",
      value: metrics.hasSufficientData
        ? `$${(metrics.avgMonthlySavings || 0).toFixed(2)}`
        : "N/A",
      icon: <Banknote className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          {metrics.hasSufficientData ? (
            <ChartComponent
              labels={metrics.chartData.labels}
              productionData={metrics.chartData.productionData}
              usageData={metrics.chartData.usageData}
            />
          ) : (
            <EmptyState message="Not enough data to display graph. Add at least two bill entries to get started." />
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {/* Your Consumer Number - given a more prominent spot */}
          <MetricBox
            title="Consumer Number"
            value={consumerNumber || "N/A"}
            icon={<Hash className="h-5 w-5" />}
          />
          {primaryMetrics.map((metric) => (
            <MetricBox
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>
      </div>
      {/* ✅ FIX: Re-enabled the secondary metrics grid
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {secondaryMetrics.map((metric) => (
          <MetricBox
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div> */}
      <BottomArea bills={bills} consumerNumber={consumerNumber} />
    </div>
  );
}
