"use client";

import { Special_Elite } from "next/font/google";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { logout } from "../serverActions/user/logout";
import { toast } from "sonner";
import { ModeToggle } from "./ModeToggle";

const specialElite = Special_Elite({ subsets: ["latin"], weight: "400" });

export default function TopBar() {
  const { data } = useSession();

  async function handleSignout() {
    if (!data) return;
    const serverSignout = await logout();
    if (serverSignout.status === "success") {
      toast.success("Successful logout");
      await signOut();
    } else {
      toast.error("Couldn't sign you out. Try again");
    }
  }

  return (
    <div
      className="bg-background text-foreground shadow-lg border-b border-border py-3 px-4 flex justify-between items-center"
      aria-label="Top navigation bar"
    >
      <div className={`${specialElite.className} text-xl select-none`}>
        <Link href="/user">TRACKER</Link>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="bg-background border border-border cursor-pointer text-foreground hover:text-muted-foreground transition-all shadow-lg hover:shadow-inner p-2 rounded-xl outline-none">
            <CircleUserRound />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4 shadow-lg border-border bg-popover text-popover-foreground">
            <DropdownMenuItem asChild>
              <Link href={"/profile"} className="px-3 py-2 cursor-pointer">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer"
              onClick={handleSignout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
