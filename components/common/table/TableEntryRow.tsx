"use client";

import React, { useRef } from "react";
import { useReactToPrint, UseReactToPrintOptions } from "react-to-print";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2, Printer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EntryDetailCard } from "./EntryDetailCard";
import { Bill } from "@/types/energyCalculations";
import { format } from "date-fns";
import { deleteEntry } from "@/app/actions/billActions";
import { toast } from "sonner";
import { PrintableEntry } from "./PrintableEntry";

type EnergyTableRowProps = {
  bill: Bill;
  consumerNumber: string | null;
  isExpanded: boolean;
  onToggle: () => void;
};

export function TableEntryRow({
  bill,
  consumerNumber,
  isExpanded,
  onToggle,
}: EnergyTableRowProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Energify-Entry-${format(
      new Date(bill.reading_date),
      "yyyy-MM-dd"
    )}`,
    onAfterPrint: () => toast.success("PDF export ready!"),
  });

  const handleDelete = async () => {
    const result = await deleteEntry(bill.id);
    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <React.Fragment>
      {/* Summary Row */}
      <TableRow>
        <TableCell className="font-medium">
          {format(new Date(bill.reading_date), "PPP")}
        </TableCell>
        <TableCell>{bill.import_total_kwh}</TableCell>
        <TableCell>{bill.export_total_kwh}</TableCell>
        <TableCell>{bill.solar_total_kwh}</TableCell>
        <TableCell>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Detail Row */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5}>
            <div style={{ display: "none" }}>
              <PrintableEntry
                ref={componentRef}
                consumerNumber={consumerNumber}
                bill={bill}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <EntryDetailCard
                  variant="blue"
                  title="Import"
                  data={[
                    { label: "B", value: bill.import_b_kwh ?? null },
                    { label: "B2", value: bill.import_b2_kwh ?? null },
                    { label: "B3", value: bill.import_b3_kwh ?? null },
                  ]}
                />
                <EntryDetailCard
                  variant="green"
                  title="Export"
                  data={[
                    { label: "B", value: bill.export_b_kwh ?? null },
                    { label: "B2", value: bill.export_b2_kwh ?? null },
                    { label: "B3", value: bill.export_b3_kwh ?? null },
                  ]}
                />
                <EntryDetailCard
                  variant="yellow"
                  title="Solar"
                  data={[
                    { label: "T1", value: bill.solar_t1_kwh ?? null },
                    { label: "T2", value: bill.solar_t2_kwh ?? null },
                    { label: "T3", value: bill.solar_t3_kwh ?? null },
                  ]}
                />
              </div>
              <div className="flex justify-end items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Entry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the entry for{" "}
                        <strong>
                          {format(new Date(bill.reading_date), "PPP")}
                        </strong>
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
