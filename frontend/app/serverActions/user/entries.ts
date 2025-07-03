"use server";

import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export async function getEntries() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Session not available");
  }

  const fetchData = fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/user/entry`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    }
  ).then((res) => res.json());

  return fetchData;
}

export async function addEntry(
  date: string,
  importReading: string,
  exportReading: string,
  solar: string
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Session not available");
  }

  const fetchData = fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/user/entry`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({
        date: date,
        importReading: importReading,
        exportReading: exportReading,
        solar: solar,
      }),
    }
  ).then((res) => res.json());

  return fetchData;
}
