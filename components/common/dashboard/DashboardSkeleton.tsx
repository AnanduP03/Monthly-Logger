export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-muted/50 rounded-lg h-[22.2rem] w-full"></div>

        <div className="flex flex-col gap-3">
          <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
          <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
          <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
          <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
        <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
        <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
        <div className="bg-muted/50 rounded-lg h-20 w-full"></div>
      </div> */}

      <div className="bg-muted/50 border border-border/50 rounded-lg p-3">
        <div className="h-10 flex items-center px-4">
          <div className="h-8 bg-muted-foreground/20 rounded-lg w-1/4"></div>
          <div className="h-8 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
          <div className="h-8 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
          <div className="h-8 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
        </div>
        <div className="space-y-2 mt-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 flex items-center">
              <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/4"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/4 ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
