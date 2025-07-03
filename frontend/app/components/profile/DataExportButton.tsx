"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportDataButton() {
  const { data: session } = useSession();

  async function handleExport() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/user/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "my_data_export.json"; // This can be changed via server header
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Your data download has started");
    } catch (err) {
      toast.error("Could not export your data. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <Button
        onClick={handleExport}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export My Data
      </Button>
    </div>
  );
}
