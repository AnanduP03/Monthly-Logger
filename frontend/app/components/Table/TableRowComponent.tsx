import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface InputProps {
  slno: number;
  date: string;
  year: string;
  importReading: string;
  exportReading: string;
  solar: string;
}

export default function TableRowComponent({
  slno,
  date,
  year,
  importReading,
  exportReading,
  solar,
}: InputProps) {
  return (
    <TableRow className="[&>*]:px-2 [&>*]:py-1 text-center align-middle">
      <TableCell>{slno}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{year}</TableCell>
      <TableCell>{importReading}</TableCell>
      <TableCell>{exportReading}</TableCell>
      <TableCell>{solar}</TableCell>
      <TableCell className="p-0">
        <div className="flex justify-center gap-2 py-1">
          <Button
            variant="outline"
            className="px-5 py-2 text-sm md:text-base h-auto leading-tight shadow-md"
            aria-label="Print entry"
          >
            Print
          </Button>
          <Button
            variant="destructive"
            className="px-5 py-2 text-sm md:text-base h-auto leading-tight shadow-md"
            aria-label="Delete entry"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
