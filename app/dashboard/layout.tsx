import TopBar from "@/components/common/TopBar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?error=unauthenticated");
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col">
      <TopBar />
      <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
    </div>
  );
}
