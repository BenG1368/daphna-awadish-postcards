"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitWholesaleInquiry } from "@/app/actions/wholesale-inquiry";
import { useInquiry } from "@/components/inquiry/inquiry-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { wholesaleContactSchema, type WholesaleContactInput } from "@/lib/validators";

export function WholesaleInquiryForm() {
  const { items, clear, setOpen } = useInquiry();
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WholesaleContactInput>({
    resolver: zodResolver(wholesaleContactSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  async function onSubmit(values: WholesaleContactInput) {
    setPending(true);
    const result = await submitWholesaleInquiry({
      ...values,
      items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
    });
    setPending(false);

    if (result.ok) {
      toast("Inquiry sent");
      clear();
      setOpen(false);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages?.[0];
        if (!message) continue;
        if (field in values) {
          setError(field as keyof WholesaleContactInput, { message });
        }
      }
    }
    toast(result.message ?? "Message could not be sent.");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Business name" error={errors.businessName?.message}>
        <Input {...register("businessName")} autoComplete="organization" />
      </Field>
      <Field label="Contact name" error={errors.contactName?.message}>
        <Input {...register("contactName")} autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input {...register("email")} type="email" autoComplete="email" />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} type="tel" autoComplete="tel" />
      </Field>
      <Field label="Notes" error={errors.notes?.message}>
        <Textarea {...register("notes")} className="min-h-24" />
      </Field>
      <Button type="submit" disabled={pending || items.length === 0}>
        {pending ? "Sending" : "Send inquiry"}
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
