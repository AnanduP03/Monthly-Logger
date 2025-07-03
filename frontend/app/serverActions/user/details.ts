"use server";

import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export async function getDetails() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Session not available");
  }

  const fetchData = fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/user/details`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    }
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return { status: "failed", message: res.text() };
    }
  });

  return fetchData;
}
