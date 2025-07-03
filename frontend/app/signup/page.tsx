"use client";

import { SignUp } from "@/app/serverActions/auth/signup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  consumerNumber: z.string().min(1, "Consumer Number is required"),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      consumerNumber: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await SignUp(
      values.username,
      values.password,
      values.consumerNumber
    );

    if (res.status === "success") {
      toast.success("User added successfully");
      router.push("/");
    } else {
      toast.error("Couldn't sign up");
      toast.error(res.message);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-center text-foreground mb-6">
          Create Account
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="bg-muted text-foreground shadow-md focus-visible:ring-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consumerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Consumer Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your consumer number"
                      {...field}
                      className="bg-muted text-foreground shadow-md focus-visible:ring-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a secure password"
                      {...field}
                      className="bg-muted text-foreground shadow-md focus-visible:ring-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full shadow-md hover:shadow-inner transition-all"
              variant="outline"
            >
              Sign Up
            </Button>

            <div className="text-right text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-primary underline underline-offset-4 transition-colors"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
