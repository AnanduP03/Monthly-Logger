import React from "react";
import { Bill } from "@/types/energyCalculations";
import { format } from "date-fns";

type PrintableEntryProps = {
  bill: Bill;
  consumerNumber: string | null;
};

type DataRowProps = {
  label: string;
  value: string | number;
  isSubtle?: boolean;
};

const DataRow = ({ label, value, isSubtle = false }: DataRowProps) => (
  <div
    className={`flex justify-between items-center py-1 ${
      isSubtle ? "text-sm text-gray-600" : "text-base"
    }`}
  >
    <span>{label}</span>
    <span className={isSubtle ? "" : "font-medium"}>{value}</span>
  </div>
);

type SectionProps = {
  title: string;
  totalLabel: string;
  totalValue: number;
  breakdown: { label: string; value?: number }[];
};

const Section = ({
  title,
  totalLabel,
  totalValue,
  breakdown,
}: SectionProps) => (
  <div className="p-3 border border-gray-200 rounded">
    <h3 className="text-base font-semibold mb-2">{title}</h3>
    <DataRow label={totalLabel} value={totalValue.toLocaleString()} />
    <hr className="my-1 border-gray-200" />
    {breakdown.map(({ label, value }) => (
      <DataRow
        key={label}
        label={label}
        value={value?.toLocaleString() ?? "0"}
        isSubtle
      />
    ))}
  </div>
);

export const PrintableEntry = React.forwardRef<
  HTMLDivElement,
  PrintableEntryProps
>(({ bill, consumerNumber }, ref) => (
  <div ref={ref} className="p-6 font-sans text-black bg-white rounded-lg">
    <div className="p-5 border border-gray-200 rounded-lg min-h-[95vh]">
      <div className="text-center my-6">
        <h2 className="text-xl font-bold tracking-wide text-gray-800 flex gap-2 items-center justify-self-center">
          <span className="text-base font-normal text-gray-500 mt-0.5">
            Consumer No:
          </span>
          <span>{consumerNumber}</span>
        </h2>
        <span className="text-sm text-gray-500 mt-0.5 flex justify-self-center gap-2 items-center">
          <span>Date:</span>
          <span className="text-black font-semibold">
            {format(new Date(bill.reading_date), "PPP")}
          </span>
        </span>
      </div>

      <div className="space-y-4">
        <Section
          title="Import (+) (kWh)"
          totalLabel="Total Import"
          totalValue={bill.import_total_kwh}
          breakdown={[
            { label: "B", value: bill.import_b_kwh },
            { label: "B2", value: bill.import_b2_kwh },
            { label: "B3", value: bill.import_b3_kwh },
          ]}
        />

        <Section
          title="Export (-) (kWh)"
          totalLabel="Total Export"
          totalValue={bill.export_total_kwh}
          breakdown={[
            { label: "B", value: bill.export_b_kwh },
            { label: "B2", value: bill.export_b2_kwh },
            { label: "B3", value: bill.export_b3_kwh },
          ]}
        />

        <Section
          title="Solar Meter (kWh)"
          totalLabel="Total Solar"
          totalValue={bill.solar_total_kwh}
          breakdown={[
            { label: "T1", value: bill.solar_t1_kwh },
            { label: "T2", value: bill.solar_t2_kwh },
            { label: "T3", value: bill.solar_t3_kwh },
          ]}
        />
      </div>
    </div>
  </div>
));

PrintableEntry.displayName = "PrintableEntry";
