import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { calculateEnergyMetrics, Bill } from "@/types/energyCalculations";
import DashboardClient from "@/components/common/dashboard/DashboardClient";
import DashboardSkeleton from "@/components/common/dashboard/DashboardSkeleton";

async function getDashboardData(userId: string) {
  const supabase = createClient();

  const now = new Date();
  const currentMonth = now.getMonth();
  let financialYearStartYear = now.getFullYear();
  if (currentMonth < 3) {
    financialYearStartYear -= 1;
  }
  const fetchFromDate = new Date(financialYearStartYear - 1, 3, 1);

  const [profileResponse, billsResponse] = await Promise.all([
    (await supabase)
      .from("profiles")
      .select("consumer_number")
      .eq("id", userId)
      .single(),
    (await supabase)
      .from("bills")
      .select("*")
      .eq("user_id", userId)
      .gte("reading_date", fetchFromDate.toISOString().split("T")[0])
      .order("reading_date", { ascending: false }),
  ]);

  return {
    consumerNumber: profileResponse.data?.consumer_number || null,
    bills: (billsResponse.data as Bill[]) || [],
  };
}

async function DashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { consumerNumber, bills } = await getDashboardData(user!.id);
  const metrics = calculateEnergyMetrics(bills);

  return (
    <DashboardClient
      consumerNumber={consumerNumber}
      bills={bills}
      metrics={metrics}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
