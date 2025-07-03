"use client";

import { ProfileHeader } from "../components/profile/ProfileHeader";
import EditProfileForm from "../components/profile/EditProfileForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import ExportDataButton from "../components/profile/DataExportButton";
import { ModeToggle } from "../components/ModeToggle";
import TopBar from "../components/topbar";
// import TopBar from "../components/TopBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <main className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <section className="space-y-4">
          <ProfileHeader />
        </section>

        <section className="space-y-4">
          {/* <h2 className="text-lg font-semibold text-foreground">
            Edit Profile
          </h2> */}
          <EditProfileForm />
        </section>

        <section className="space-y-4">
          {/* <h2 className="text-lg font-semibold text-foreground">
            Change Password
          </h2> */}
          <ChangePasswordForm />
        </section>

        <section className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-border">
          <ExportDataButton />
        </section>
      </main>
    </div>
  );
}
