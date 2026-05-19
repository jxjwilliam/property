"use client";

import { useState, FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormFields {
  name: string;
  email: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: string;
  message: string;
}

const initialForm: FormFields = {
  name: "",
  email: "",
  checkInDate: undefined,
  checkOutDate: undefined,
  guests: "1",
  message: "",
};

export function InquiryForm() {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const update = (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        checkInDate: form.checkInDate ? format(form.checkInDate, "yyyy-MM-dd") : "",
        checkOutDate: form.checkOutDate ? format(form.checkOutDate, "yyyy-MM-dd") : "",
        guests: form.guests,
        message: form.message,
      };
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--line)] bg-[rgba(9,11,15,0.72)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors duration-180";

  const labelClass = "block text-sm text-[var(--muted-foreground)] mb-1.5";

  const dateTriggerClass =
    "w-full flex items-center justify-between rounded-xl border border-[var(--line)] bg-[rgba(9,11,15,0.72)] px-4 py-2.5 text-sm text-[var(--foreground)] hover:border-[var(--primary)] transition-colors duration-180";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name</label>
          <input type="text" required value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" required value={form.email} onChange={update("email")} placeholder="your@email.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Check-in date</label>
          <Popover>
            <PopoverTrigger className={dateTriggerClass}>
              {form.checkInDate ? format(form.checkInDate, "MMM d, yyyy") : "Select date"}
              <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-60" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.checkInDate}
                onSelect={(date) => setForm((prev) => ({ ...prev, checkInDate: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className={labelClass}>Check-out date</label>
          <Popover>
            <PopoverTrigger className={dateTriggerClass}>
              {form.checkOutDate ? format(form.checkOutDate, "MMM d, yyyy") : "Select date"}
              <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-60" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.checkOutDate}
                onSelect={(date) => setForm((prev) => ({ ...prev, checkOutDate: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className={labelClass}>Number of guests</label>
          <input type="number" min={1} required value={form.guests} onChange={update("guests")} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Message (optional)</label>
        <textarea rows={3} value={form.message} onChange={update("message")} placeholder="Any questions or special requests..." className={inputClass + " resize-none"} />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 cursor-pointer"
        >
          {status === "submitting" ? "Sending..." : "Send inquiry"}
        </Button>
        {status === "success" && (
          <span className="text-sm text-green-400">Inquiry sent! We&apos;ll get back to you shortly.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-400">Failed to send. Please try again.</span>
        )}
      </div>
    </form>
  );
}
