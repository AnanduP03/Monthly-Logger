"use client";

import { use } from "react";
import DashboardComponent from "./dashboard-component";

// Define a proper type instead of `any` if possible
interface DashboardWrapperProps {
  fetchDetailsPromise: Promise<any>; // Replace `any` with your actual return type if known
}

export default function DashboardWrapper({
  fetchDetailsPromise,
}: DashboardWrapperProps) {
  const details = use(fetchDetailsPromise);

  if (process.env.NODE_ENV === "development") {
    console.log("User Details:", details);
  }

  // You can consider adding error boundaries here for production safety
  return <DashboardComponent details={details} />;
}
