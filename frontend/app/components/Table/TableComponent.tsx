"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Kalam } from "next/font/google";
import { CalendarIcon, Download, Plus, Search } from "lucide-react";
import TableRowComponent from "./TableRowComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addEntry, getEntries } from "@/app/serverActions/user/entries";
import { toast } from "sonner";

const kalam = Kalam({ subsets: ["latin"], weight: ["400"] });

const formSchema = z.object({
  date: z.coerce.date(),
  import: z.coerce.number(),
  export: z.coerce.number(),
  solar: z.coerce.number(),
});

type ReadingEntry = {
  id: number;
  date: string;
  import: number;
  export: number;
  solar: number;
};

export default function TableComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      import: 0,
      export: 0,
      solar: 0,
    },
  });

  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof ReadingEntry | "">("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      const data = await getEntries();
      if (!data || data.length === 0) {
        setEntries([
          { id: 1, date: "10/06/2025", import: 1120, export: 845, solar: 310 },
          { id: 2, date: "09/06/2025", import: 1050, export: 820, solar: 295 },
          { id: 3, date: "08/06/2025", import: 980, export: 760, solar: 275 },
        ]);
      } else {
        setEntries(data);
      }
    }

    fetchData();
  }, [refresh]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await addEntry(
      values.date.toLocaleDateString(),
      values.import.toString(),
      values.export.toString(),
      values.solar.toString()
    );

    if (res.status === "success") {
      toast.success(res.message);
      setRefresh((r) => !r);
    } else {
      toast.error(res.message.toString());
    }
  }

  function handleSort(key: keyof ReadingEntry) {
    setSortAsc(sortKey === key ? !sortAsc : true);
    setSortKey(key);
  }

  function handleExportCSV() {
    const csvContent = [
      ["Date", "Import", "Export", "Solar"],
      ...entries.map((e) => [e.date, e.import, e.export, e.solar]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "entries.csv";
    link.click();
  }

  const filteredEntries = useMemo(() => {
    return (
      entries
        // .filter((e) => e.date.toLowerCase().includes(query.toLowerCase()))
        .filter(
          (e) =>
            query === "" ||
            e.date.toLowerCase().includes(query.toLowerCase()) ||
            e.import.toString().includes(query) ||
            e.export.toString().includes(query) ||
            e.solar.toString().includes(query)
        )

        .sort((a, b) => {
          if (!sortKey) return 0;

          if (sortKey === "date") {
            return sortAsc
              ? new Date(a.date).getTime() - new Date(b.date).getTime()
              : new Date(b.date).getTime() - new Date(a.date).getTime();
          }

          const valA = a[sortKey];
          const valB = b[sortKey];
          return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
        })
    );
  }, [entries, query, sortKey, sortAsc]);

  const paginated = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden space-y-4">
      {/* Top Actions */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by date..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-in fade-in-90 slide-in-from-top-10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Add New Entry
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Fill in the reading values for the selected date.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl bg-muted/30 p-6 shadow-inner">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Date Picker */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center gap-1 text-sm font-semibold">
                            <CalendarIcon className="w-4 h-4" /> Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Number Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {["import", "export", "solar"].map((key) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={key as keyof z.infer<typeof formSchema>}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold capitalize">
                                {key} Reading
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`Enter ${key}`}
                                  className="rounded-lg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        className="px-6 py-2 rounded-xl"
                        disabled={
                          !form.formState.isValid || form.formState.isSubmitting
                        }
                      >
                        {form.formState.isSubmitting
                          ? "Submitting..."
                          : "Submit"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="[&>*]:cursor-pointer">
              <TableHead
                className="text-center"
                onClick={() => handleSort("id")}
              >
                # {sortKey === "id" && (sortAsc ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="text-center"
                onClick={() => handleSort("date")}
              >
                Date {sortKey === "date" && (sortAsc ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-center">Year</TableHead>
              <TableHead
                className="text-center"
                onClick={() => handleSort("import")}
              >
                Import {sortKey === "import" && (sortAsc ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="text-center"
                onClick={() => handleSort("export")}
              >
                Export {sortKey === "export" && (sortAsc ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="text-center"
                onClick={() => handleSort("solar")}
              >
                Solar {sortKey === "solar" && (sortAsc ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className={kalam.className}>
            {paginated.map((entry, idx) => (
              <TableRowComponent
                key={entry.id}
                slno={(currentPage - 1) * entriesPerPage + idx + 1}
                date={entry.date}
                year={entry.date.split("/")[2] ?? "—"}
                importReading={entry.import.toString()}
                exportReading={entry.export.toString()}
                solar={entry.solar.toString()}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 p-4">
        <Button
          variant="ghost"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage}
        </span>
        <Button
          variant="ghost"
          disabled={currentPage * entriesPerPage >= filteredEntries.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
