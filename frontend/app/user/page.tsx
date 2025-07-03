import { Suspense } from "react";
import { getDetails } from "../serverActions/user/details";
import DashboardWrapper from "../components/dashboard/dashboard-wrapper";

export default function DashboardPage() {
  const fetchDetailsPromise: Promise<any> = getDetails();

  return (
    <Suspense
      fallback={
        <div className="p-4 text-center" aria-label="Loading dashboard data">
          Loading...
        </div>
      }
    >
      <DashboardWrapper fetchDetailsPromise={fetchDetailsPromise} />
    </Suspense>
  );
}
