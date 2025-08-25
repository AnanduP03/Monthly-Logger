"use client";

import { UseFormReturn, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FormValues } from "./NewEntryDialog";

interface InputProps {
  form: UseFormReturn<FormValues>;
  name: any;
  label: string;
}

export default function AddEntryInputField({ form, name, label }: InputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">{label}</FormLabel>
          <FormControl>
            {/* 2. Simplified Input using the spread operator and letting Zod handle coercion */}
            <Input
              {...field}
              type="number"
              inputMode="decimal"
              placeholder="0"
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
