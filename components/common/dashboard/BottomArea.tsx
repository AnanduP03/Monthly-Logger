"use client";

import { Download, Search } from "lucide-react";
import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import NewEntryDialog from "../NewEntryDialog";
import { toast } from "sonner";
import EntryTable from "../table/EntryTable";
import { Bill } from "@/types/energyCalculations";

type BottomAreaProps = {
  bills: Bill[];
  consumerNumber: string | null;
};

export default function BottomArea({ bills, consumerNumber }: BottomAreaProps) {
  const [query, setQuery] = useState("");

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  function handleExportCSV() {
    toast.info("CSV export functionality coming soon!");
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-wrap justify-between items-center p-4 gap-3 border-b">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 max-w-xs"
          />
        </div>

        <div className="flex gap-3">
          <Button variant={"outline"} onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <NewEntryDialog />
        </div>
      </div>

      <EntryTable
        bills={bills}
        consumerNumber={consumerNumber}
        query={debouncedQuery}
      />
    </div>
  );
}
