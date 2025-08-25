"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignupComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          consumer_number: consumerNumber,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Success! Please check your email to confirm your account.");
      setName("");
      setEmail("");
      setPassword("");
      setConsumerNumber("");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="test@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="*********"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="consumerNumber">Consumer Number</Label>
        <Input
          id="consumerNumber"
          type="text"
          placeholder="123456789"
          required
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-green-500">{message}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}
