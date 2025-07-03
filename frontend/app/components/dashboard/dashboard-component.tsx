import ChartComponent from "../ChartComponent";
import TableComponent from "../Table/TableComponent";

interface UserDetails {
  consumerNumber: string;
  username: string;
}

interface DashboardComponentProps {
  details: UserDetails;
}

export default function DashboardComponent({
  details,
}: DashboardComponentProps) {
  return (
    <div className="px-4 md:px-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          {/* <div className="bg-card border border-border rounded-lg shadow-lg p-3"> */}
          <ChartComponent />
          {/* </div> */}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-3">
          <MetricBox title="Net Export (kWh)" value="123456" />
          <MetricBox
            title="Consumer Number"
            value={details.consumerNumber || "N/A"}
          />
        </div>
      </div>
      {/* Grid Metrics
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricBox title="Avg Daily Prod." value="18.5 kWh" />
        <MetricBox title="Avg Daily Usage" value="21.3 kWh" />
        <MetricBox title="Peak Prod. (Mo)" value="April" />
        <MetricBox title="Peak Usage (Mo)" value="June" />
        <MetricBox title="Self-Consumption" value="63%" />
        <MetricBox title="Monthly Savings" value="$42.85" />
      </div> */}
      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <TableComponent />
      </div>
    </div>
  );
}

function MetricBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-md p-3 text-center">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-base font-semibold font-mono text-foreground">
        {value}
      </p>
    </div>
  );
}
