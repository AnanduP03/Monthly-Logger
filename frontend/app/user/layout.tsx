import TopBar from "../components/topbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col space-y-3">
      <TopBar />
      <main className="flex-1 px-4 md:px-6" aria-label="Main content area">
        {children}
      </main>
    </div>
  );
}
