"use server";

import { Profile } from "@/types/energyCalculations";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type NewEntryPayload = {
  date: string;
  importReading: number;
  exportReading: number;
  solarReading: number;
};

export type Entry = {
  id: number;
  date: string;
  import: number;
  export: number;
  solar: number;
};

type ServerActionResponse = {
  status: "success" | "error";
  message: string;
};

export type UserProfile = {
  profile: Profile | null;
};

async function createAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  return { supabase, user };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getEntries(): Promise<Entry[]> {
  try {
    const { supabase, user } = await createAuthedClient();
    const { data, error } = await supabase
      .from("bills")
      .select(
        "id, reading_date, import_total_kwh, export_total_kwh, solar_total_kwh"
      )
      .eq("user_id", user.id)
      .order("reading_date", { ascending: false });

    if (error) throw error;

    return data.map((bill) => ({
      id: bill.id,
      date: bill.reading_date,
      import: bill.import_total_kwh,
      export: bill.export_total_kwh,
      solar: bill.solar_total_kwh,
    }));
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
}

export async function addEntry(
  payload: NewEntryPayload
): Promise<ServerActionResponse> {
  try {
    const { supabase, user } = await createAuthedClient();
    const { error } = await supabase.from("bills").insert({
      user_id: user.id,
      reading_date: payload.date,
      import_total_kwh: payload.importReading,
      export_total_kwh: payload.exportReading,
      solar_total_kwh: payload.solarReading,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    return { status: "success", message: "Entry added successfully!" };
  } catch (error) {
    return {
      status: "error",
      message: `Failed to add entry: ${getErrorMessage(error)}`,
    };
  }
}

export async function deleteEntry(id: number): Promise<ServerActionResponse> {
  try {
    const { supabase, user } = await createAuthedClient();
    const { error } = await supabase
      .from("bills")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { status: "success", message: "Entry deleted successfully." };
  } catch (error) {
    return {
      status: "error",
      message: `Failed to delete entry: ${getErrorMessage(error)}`,
    };
  }
}

const detailedEntrySchema = z.object({
  date: z.string().date("Date must be in YYYY-MM-DD format."),
  import: z.object({
    total: z.number(),
    b: z.number().optional(),
    b2: z.number().optional(),
    b3: z.number().optional(),
  }),
  export: z.object({
    total: z.number(),
    b: z.number().optional(),
    b2: z.number().optional(),
    b3: z.number().optional(),
  }),
  solar: z.object({
    total: z.number(),
    t1: z.number().optional(),
    t2: z.number().optional(),
    t3: z.number().optional(),
  }),
});

export async function addDetailedEntry(
  payload: z.infer<typeof detailedEntrySchema>
): Promise<ServerActionResponse> {
  try {
    const { supabase, user } = await createAuthedClient();
    const validatedPayload = detailedEntrySchema.parse(payload);

    const { error } = await supabase.from("bills").insert({
      user_id: user.id,
      reading_date: validatedPayload.date,
      import_total_kwh: validatedPayload.import.total,
      import_b_kwh: validatedPayload.import.b,
      import_b2_kwh: validatedPayload.import.b2,
      import_b3_kwh: validatedPayload.import.b3,
      export_total_kwh: validatedPayload.export.total,
      export_b_kwh: validatedPayload.export.b,
      export_b2_kwh: validatedPayload.export.b2,
      export_b3_kwh: validatedPayload.export.b3,
      solar_total_kwh: validatedPayload.solar.total,
      solar_t1_kwh: validatedPayload.solar.t1,
      solar_t2_kwh: validatedPayload.solar.t2,
      solar_t3_kwh: validatedPayload.solar.t3,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    return { status: "success", message: "Entry added successfully!" };
  } catch (error) {
    return {
      status: "error",
      message: `Failed to add entry: ${getErrorMessage(error)}`,
    };
  }
}

export async function getUser(): Promise<UserProfile> {
  try {
    const { supabase, user } = await createAuthedClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.warn("Profile not found for user:", user.id);
        return { profile: null };
      }
      throw error;
    }

    return { profile: data };
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return { profile: null };
  }
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  consumerNumber: z
    .string()
    .min(10, { message: "Consumer number must be at least 10 characters." }),
});

export async function updateProfile(
  prevState: any,
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    const { supabase, user } = await createAuthedClient();

    const validatedFields = profileSchema.safeParse({
      name: formData.get("name"),
      consumerNumber: formData.get("consumerNumber"),
    });

    if (!validatedFields.success) {
      return {
        status: "error",
        message: validatedFields.error.issues[0].message,
      };
    }

    const { name, consumerNumber } = validatedFields.data;
    const { error } = await supabase
      .from("profiles")
      .update({ name, consumer_number: consumerNumber })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { status: "success", message: "Profile updated successfully!" };
  } catch (error) {
    return {
      status: "error",
      message: `Failed to update profile: ${getErrorMessage(error)}`,
    };
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred.";
}
