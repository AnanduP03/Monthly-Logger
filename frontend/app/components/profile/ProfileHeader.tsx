"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Not logged in.
        </CardContent>
      </Card>
    );
  }

  // Replace with actual session values once integrated
  const username = "asdsda";
  const consumerNumber = "1221212";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1 text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">Username:</span>{" "}
          {username}
        </div>
        <div>
          <span className="font-medium text-foreground">Consumer Number:</span>{" "}
          {consumerNumber}
        </div>
      </CardContent>
    </Card>
  );
}
