import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("text-xs px-2 py-0.5 rounded-full", {
  variants: {
    variant: {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      green:
        "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
      yellow:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

type DetailCardProps = VariantProps<typeof badgeVariants> & {
  title: string;
  data: { label: string; value: number | null | undefined }[];
};

export function EntryDetailCard({ title, variant, data }: DetailCardProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-lg">{title}</p>
        <span className={badgeVariants({ variant })}>kWh</span>
      </div>
      <div className="space-y-2 text-sm">
        {data.map((item) => (
          <div className="flex justify-between" key={item.label}>
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">
              {item.value?.toLocaleString() ?? "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
