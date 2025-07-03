"use server";

export async function SignUp(
  username: string,
  password: string,
  consumerNumber: string
) {
  const fetchData = fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        username: username,
        consumerNumber: consumerNumber,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    if (res.ok) {
      return { status: "success" };
    } else {
      return res.json();
    }
  });

  return fetchData;
}
