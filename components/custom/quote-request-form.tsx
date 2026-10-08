"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitCustomQuote } from "@/app/actions/custom-quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";
import { customQuoteSchema, type CustomQuoteInput } from "@/lib/validators";

export function QuoteRequestForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomQuoteInput>({
    resolver: zodResolver(customQuoteSchema),
    defaultValues: {
      businessName: "",
      email: "",
      projectType: undefined,
      budget: undefined,
      timeline: undefined,
      brief: "",
    },
  });

  async function onSubmit(values: CustomQuoteInput) {
    setPending(true);
    const result = await submitCustomQuote(values);
    setPending(false);
    if (result.ok) {
      setSent(true);
      return;
    }
    toast(result.message ?? "Message could not be sent.");
  }

  if (sent) {
    return (
      <div className="border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Request sent</h2>
        <p className="mt-3 text-muted">
          Daphna will reply by email. The form has been cleared from this page.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Business name" error={errors.businessName?.message}>
        <Input {...register("businessName")} autoComplete="organization" />
      </Field>
      <Field label="Contact email" error={errors.email?.message}>
        <Input {...register("email")} type="email" autoComplete="email" />
      </Field>
      <Choice
        label="Project type"
        error={errors.projectType?.message}
        control={control}
        name="projectType"
        options={site.projectTypes}
      />
      <Choice
        label="Estimated budget"
        error={errors.budget?.message}
        control={control}
        name="budget"
        options={site.budgetRanges}
      />
      <Choice
        label="Timeline"
        error={errors.timeline?.message}
        control={control}
        name="timeline"
        options={site.timelines}
      />
      <Field label="Description / brief" error={errors.brief?.message}>
        <Textarea {...register("brief")} />
      </Field>
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Sending" : "Request a quote"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <span className="text-sm text-[#8A3B32]">{error}</span> : null}
    </div>
  );
}

function Choice({
  label,
  name,
  options,
  error,
  control,
}: {
  label: string;
  name: "projectType" | "budget" | "timeline";
  options: readonly string[];
  error?: string;
  control: ReturnType<typeof useForm<CustomQuoteInput>>["control"];
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label={label}>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error ? <span className="text-sm text-[#8A3B32]">{error}</span> : null}
    </div>
  );
}
