"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEntryRow } from "./TableEntryRow";
import { Bill } from "@/types/energyCalculations";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type EntryTableProps = {
  bills: Bill[];
  consumerNumber: string | null;
  query: string;
};

export default function EntryTable({
  bills,
  consumerNumber,
  query,
}: EntryTableProps) {
  const [expandedRow, setExpandedRow] = useState<number>(0);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? 0 : id);
  };

  const filteredItems = useMemo(() => {
    return bills.filter((bill) =>
      format(new Date(bill.reading_date), "PPP")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [bills, query]);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Import (kWh)</TableHead>
            <TableHead>Export (kWh)</TableHead>
            <TableHead>Solar (kWh)</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="h-8 w-8" />
                  No entries found.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((bill) => (
              <TableEntryRow
                key={bill.id}
                bill={bill}
                consumerNumber={consumerNumber}
                isExpanded={expandedRow === bill.id}
                onToggle={() => toggleExpand(bill.id)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
