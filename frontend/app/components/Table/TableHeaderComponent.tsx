import { TableHead, TableRow } from "@/components/ui/table";

export default function TableHeaderComponent() {
  return (
    <>
      <TableRow className="[&>*]:p-3">
        <TableHead>
          <div className="flex justify-center">Sl No</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Date</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Year</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Import</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Export</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Solar Meter</div>
        </TableHead>
        <TableHead>
          <div className="flex justify-center">Actions</div>
        </TableHead>
      </TableRow>
    </>
  );
}
