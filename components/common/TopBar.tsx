"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import {
  getUser,
  signOut,
  updateProfile,
  UserProfile,
} from "@/app/actions/billActions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useActionState, useCallback, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4 w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function TopBar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const initialState = { message: "", status: "" };
  const [state, formAction] = useActionState(updateProfile, initialState);

  const fetchUser = useCallback(async () => {
    const profileData = await getUser();
    if (!profileData?.profile) {
      router.push("/");
    } else {
      setUserProfile(profileData);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      fetchUser();
      setIsSettingsOpen(false);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state, fetchUser]);

  const handleSignout = async () => {
    await signOut();
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="bg-background text-foreground shadow-lg border-b border-border py-3 px-4 flex justify-between items-center">
          <div className="text-xl select-none">
            <Link href={"/dashboard"}>Energify</Link>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-background border border-border cursor-pointer text-foreground hover:text-muted-foreground transition-all shadow-lg hover:shadow-inner p-2 rounded-xl outline-none">
                <CircleUserRound />
                <span className="sr-only">Open user menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 shadow-lg border-border bg-popover text-popover-foreground">
                <DropdownMenuLabel>
                  {userProfile?.profile?.name ?? "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setIsSettingsOpen(true)}
                  className="px-3 py-2 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-3 py-2 cursor-pointer"
                  onClick={handleSignout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Manage your details</SheetDescription>
          </SheetHeader>
          <form action={formAction} className="p-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={userProfile?.profile?.name || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="consumerNumber">Consumer no</Label>
              <Input
                id="consumerNumber"
                name="consumerNumber"
                type="text"
                defaultValue={userProfile?.profile?.consumer_number || ""}
              />
            </div>
            <SubmitButton />
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
