import React from "react";

type MetricBoxProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export default function MetricBox({ title, value, icon }: MetricBoxProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-md p-3 flex items-center gap-3 md:gap-4">
      {icon && (
        <div className="text-primary bg-primary/10 p-2 rounded-md">{icon}</div>
      )}
      {/* 1. Added min-w-0 to allow this container to shrink */}
      <div className="text-left min-w-0">
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
        {/* 2. Added break-all to force the long number to wrap */}
        <p className="text-lg md:text-xl font-semibold font-mono text-foreground break-all">
          {value}
        </p>
      </div>
    </div>
  );
}
