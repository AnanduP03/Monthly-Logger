import { Suspense } from "react";
import { Zap, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import LoginComponent from "@/components/common/LoginComponent";
import SignupComponent from "@/components/common/SignupComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

function AuthUI() {
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Energify</h1>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginComponent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Join to start tracking your energy production and usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupComponent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function AuthGate() {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Auth check failed:", error);
  }

  if (user) {
    redirect("/dashboard");
  }

  return <AuthUI />;
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="h-screen flex justify-center items-center bg-background p-4">
      <Suspense fallback={<LoadingState />}>
        <AuthGate />
      </Suspense>
    </main>
  );
}
