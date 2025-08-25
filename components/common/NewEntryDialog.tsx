"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldPath, Resolver } from "react-hook-form";
import { toast } from "sonner";
import { addDetailedEntry } from "@/app/actions/billActions";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AddEntryInputField from "./AddEntryInputField";

export const formSchema = z.object({
  date: z.date({ error: "A date is required." }),
  import: z.object({
    total: z.coerce.number().min(0, "Total must be positive."),
    b: z.coerce.number().optional(),
    b2: z.coerce.number().optional(),
    b3: z.coerce.number().optional(),
  }),
  export: z.object({
    total: z.coerce.number().min(0, "Total must be positive."),
    b: z.coerce.number().optional(),
    b2: z.coerce.number().optional(),
    b3: z.coerce.number().optional(),
  }),
  solar: z.object({
    total: z.coerce.number().min(0, "Total must be positive."),
    t1: z.coerce.number().optional(),
    t2: z.coerce.number().optional(),
    t3: z.coerce.number().optional(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const TABS_CONFIG = [
  {
    value: "import",
    label: "Import",
    fields: [
      { name: "import.total", label: "Total Import (kWh)" },
      { name: "import.b", label: "B" },
      { name: "import.b2", label: "B2" },
      { name: "import.b3", label: "B3" },
    ],
  },
  {
    value: "export",
    label: "Export",
    fields: [
      { name: "export.total", label: "Total Export (kWh)" },
      { name: "export.b", label: "B" },
      { name: "export.b2", label: "B2" },
      { name: "export.b3", label: "B3" },
    ],
  },
  {
    value: "solar",
    label: "Solar",
    fields: [
      { name: "solar.total", label: "Total Solar (kWh)" },
      { name: "solar.t1", label: "T1" },
      { name: "solar.t2", label: "T2" },
      { name: "solar.t3", label: "T3" },
    ],
  },
];

export default function NewEntryDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      date: new Date(),
      import: { total: undefined, b: undefined, b2: undefined, b3: undefined },
      export: { total: undefined, b: undefined, b2: undefined, b3: undefined },
      solar: { total: undefined, t1: undefined, t2: undefined, t3: undefined },
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const payload = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
    };

    const result = await addDetailedEntry(payload);

    if (result.status === "success") {
      toast.success(result.message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogDescription>
            Date and Total values are required. Add detailed readings in each
            tab.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="import">
              <TabsList className="grid w-full grid-cols-3">
                {TABS_CONFIG.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TABS_CONFIG.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-3 pt-2"
                >
                  {tab.fields.map((field) => (
                    <AddEntryInputField
                      key={field.name}
                      form={form}
                      name={field.name as FieldPath<FormValues>}
                      label={field.label}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
