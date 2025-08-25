export type Bill = {
  id: number;
  reading_date: string;
  import_total_kwh: number;
  import_b_kwh: number;
  import_b2_kwh: number;
  import_b3_kwh: number;
  export_total_kwh: number;
  export_b_kwh: number;
  export_b2_kwh: number;
  export_b3_kwh: number;
  solar_total_kwh: number;
  solar_t1_kwh: number;
  solar_t2_kwh: number;
  solar_t3_kwh: number;
};

export type Profile = {
  id: string;
  name: string | null;
  consumer_number: string | null;
  user_type: string | null;
  created_at: string | null;
};

export type EnergyMetrics = {
  hasSufficientData: boolean;
  financialYearReserve: number;
  avgDailyProd: number;
  avgDailyUsage: number;
  peakProdMonth: string;
  peakUsageMonth: string;
  selfConsumption: number;
  avgMonthlySavings: number;
  chartData: {
    labels: string[];
    productionData: number[];
    usageData: number[];
  };
};

const defaultMetrics: EnergyMetrics = {
  hasSufficientData: false,
  financialYearReserve: 0,
  avgDailyProd: 0,
  avgDailyUsage: 0,
  peakProdMonth: "N/A",
  peakUsageMonth: "N/A",
  selfConsumption: 0,
  avgMonthlySavings: 0,
  chartData: { labels: [], productionData: [], usageData: [] },
};

export function calculateEnergyMetrics(bills: Bill[] | null): EnergyMetrics {
  if (!bills || bills.length < 1) {
    return defaultMetrics;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  let financialYearStartYear = now.getFullYear();
  if (currentMonth < 3) {
    financialYearStartYear -= 1;
  }
  const financialYearStartDate = new Date(financialYearStartYear, 3, 1);

  const sortedBills = [...bills].sort(
    (a, b) =>
      new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
  );

  const baselineBill = sortedBills
    .filter((bill) => new Date(bill.reading_date) < financialYearStartDate)
    .pop();

  const billsInFinancialYear = sortedBills.filter(
    (bill) => new Date(bill.reading_date) >= financialYearStartDate
  );

  if (billsInFinancialYear.length === 0) {
    return { ...defaultMetrics, hasSufficientData: false };
  }

  const startReadings = baselineBill || {
    import_total_kwh: 0,
    export_total_kwh: 0,
  };

  const endReadings = billsInFinancialYear[billsInFinancialYear.length - 1];

  const totalImportInYear =
    endReadings.import_total_kwh - startReadings.import_total_kwh;
  const totalExportInYear =
    endReadings.export_total_kwh - startReadings.export_total_kwh;
  const financialYearReserve = totalExportInYear - totalImportInYear;

  const calculationStartBill = baselineBill || sortedBills[0];
  const billsForMonthlyCalcs = [calculationStartBill, ...billsInFinancialYear];

  const monthlyData = [];
  if (billsForMonthlyCalcs.length > 1) {
    for (let i = 1; i < billsForMonthlyCalcs.length; i++) {
      const current = billsForMonthlyCalcs[i];
      const previous = billsForMonthlyCalcs[i - 1];

      const production = Math.max(
        0,
        current.solar_total_kwh - previous.solar_total_kwh
      );
      const imported = Math.max(
        0,
        current.import_total_kwh - previous.import_total_kwh
      );
      const exported = Math.max(
        0,
        current.export_total_kwh - previous.export_total_kwh
      );

      monthlyData.push({
        date: new Date(current.reading_date),
        production,
        usage: production - exported + imported,
        exported,
      });
    }
  }

  if (monthlyData.length === 0) {
    return {
      ...defaultMetrics,
      financialYearReserve,
      hasSufficientData: false,
    };
  }

  const chartLabels = monthlyData.map((d) =>
    d.date.toLocaleString("default", { month: "short", year: "2-digit" })
  );
  const productionData = monthlyData.map((d) => d.production);
  const usageData = monthlyData.map((d) => d.usage);

  const totalProduction = productionData.reduce((a, b) => a + b, 0);
  const totalUsage = usageData.reduce((a, b) => a + b, 0);
  const totalExported = monthlyData.reduce((acc, d) => acc + d.exported, 0);

  const avgDailyProd = totalProduction / monthlyData.length / 30;
  const avgDailyUsage = totalUsage / monthlyData.length / 30;

  const peakProdMonth =
    chartLabels[productionData.indexOf(Math.max(...productionData))] || "N/A";
  const peakUsageMonth =
    chartLabels[usageData.indexOf(Math.max(...usageData))] || "N/A";

  const selfConsumption =
    totalProduction > 0
      ? ((totalProduction - totalExported) / totalProduction) * 100
      : 0;

  const SAVINGS_RATE = 0.15;
  const avgMonthlySavings = (totalUsage / monthlyData.length) * SAVINGS_RATE;

  return {
    hasSufficientData: true,
    financialYearReserve,
    avgDailyProd,
    avgDailyUsage,
    peakProdMonth,
    peakUsageMonth,
    selfConsumption,
    avgMonthlySavings,
    chartData: {
      labels: chartLabels,
      productionData: productionData,
      usageData: usageData,
    },
  };
}
